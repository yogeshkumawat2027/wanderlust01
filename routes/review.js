const express = require("express");
const router = express.Router({ mergeParams: true });  

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");


const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewauthor } = require("../middleware.js");

const reviewController = require("../contrrollers/reviews.js");

// review post route
router.post("/", isLoggedIn, validateReview ,wrapAsync(reviewController.createReview));

//review delete route
router.delete("/:reviewId",isLoggedIn,isReviewauthor,wrapAsync(reviewController.destroyReview));

module.exports = router;