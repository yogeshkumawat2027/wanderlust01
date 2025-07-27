const Listing = require("./models/listing");
const Review  = require("./models/review");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req,res,next)=>{
      console.log(req.user);
  if(!req.isAuthenticated()){
    req.flash("error", "you must be logged into create listing");
    req.session.redirectUrl = req.originalUrl;
   return res.redirect("/login");
  }
  next();
}
module.exports.validateReview = (req,res,next)=>{            //validation of schema middleware
  let { error } = reviewSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400,errMsg);
  }else{
    next();
  }
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next) =>{
      let {id} = req.params;
  let listing  = await Listing.findById(id);
  if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error", " You are not owner of this listing");
    return  res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.isReviewauthor = async (req,res,next) =>{
  let {id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error", " You are not author of this listing");
    return  res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.validateListing = (req,res,next)=>{            //validation of schema middleware
  let { error } = listingSchema.validate(req.body);
  console.log(error);
  if(error){
    let errMsg = error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400,errMsg);
  }else{
    next();
  }
}