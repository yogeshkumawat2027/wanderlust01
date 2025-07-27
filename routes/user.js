const express = require("express");
const router = express.Router({ mergeParams: true }); 
const User = require("../models/user.js");

const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../contrrollers/users.js");

router
    .route("/signup")
       .get(userController.renderSignupForm)
       .post(userController.signup);

router
       .route("/login")
       .get(userController.renderloginForm)
       .post(saveRedirectUrl, passport.authenticate("local",{failureRedirect : "/login" , failureFlash : true}),
          userController.login
         );

router.get("/logout",userController.logout);

module.exports = router;