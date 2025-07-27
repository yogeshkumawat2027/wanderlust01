const express = require("express");
const router = express.Router({ mergeParams: true });

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");


const listingController = require("../contrrollers/listings.js");

const {storage} = require("../cloudConfig.js");
const multer  = require('multer')
const upload = multer({ storage });

router
    .route("/")
   .get( wrapAsync(listingController.index))
   .post(
      isLoggedIn,
      upload.single('listing[image]'),
      validateListing,
       wrapAsync(listingController.createListing));
   

   //New route
router.get("/new", isLoggedIn,listingController.renderNewForm );

router
     .route("/:id")
     .get(wrapAsync(listingController.showListing))
     .put( isLoggedIn, isOwner,upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
     .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroylisting));

        
  //edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;

// Index route
// router.get("/", wrapAsync(listingController.index)); 



//Create Route
// router.post("/", validateListing, wrapAsync(listingController.createListing));

//show route
// router.get("/:id", wrapAsync(listingController.showListing));

//Update route
// router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));



//delete route
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroylisting));

