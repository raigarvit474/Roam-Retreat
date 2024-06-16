const express=require("express");
const router=express.Router({mergeParams:true});//mergeParams is set to true kyonki hamara review route id extract nhi kar paa rha tha listing ki because vo id app.js mein hi ruk jaa rhi thi kyonki common path hamne /listings/:id/reviews rakha tha jo ki app.js mein hi reh jaa rha tha therefore usse yaha laane ke liye mergeParams karna pada
const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {validateReview, isLoggedIn,isReviewAuthor}=require("../middleware.js");

//Reviews

//POST Review Route
router.post("/",isLoggedIn,validateReview,wrapAsync(async(req,res)=>{
    console.log(req.params.id);
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    req.flash("success","New Review Created!");
    res.redirect(`/listings/${listing._id}`);
}));//wrap async is used for basic error handling

// Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(async(req,res)=>{
    
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})//pull means remove
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
}));

module.exports=router;
