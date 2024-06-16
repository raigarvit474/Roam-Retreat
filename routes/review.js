const express=require("express");
const router=express.Router({mergeParams:true});//mergeParams is set to true kyonki hamara review route id extract nhi kar paa rha tha listing ki because vo id app.js mein hi ruk jaa rhi thi kyonki common path hamne /listings/:id/reviews rakha tha jo ki app.js mein hi reh jaa rha tha therefore usse yaha laane ke liye mergeParams karna pada
const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {validateReview, isLoggedIn,isReviewAuthor}=require("../middleware.js");

const reviewController=require("../controllers/reviews.js")

//Reviews

//POST Review Route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));//wrap async is used for basic error handling

// Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;
