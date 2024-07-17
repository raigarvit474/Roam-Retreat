const Listing=require("./models/listing");
const Review=require("./models/review");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema,bookingSchema}=require("./schema.js");
const Booking = require("./models/booking");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to access this page");
        return res.redirect("/users/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the Owner of this Property");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
module.exports.hasBooked=async(req,res,next)=>{
    let {id}=req.params;
    let booking=await Booking.findById(id).populate('user');
    if(!booking.user._id.equals(res.locals.currUser._id)){
        req.flash("error","This is not your booking. You cannnot make changes to it.");
        return res.redirect(`/listings`);
    }
    next();
};

module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);//using joi
    if(error){
        console.log(error);
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the Author of this Review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// module.exports.validateBooking = async (req, res, next) => {
//     let { error } = bookingSchema.validate(req.body);
//     if (error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     }

//     next();
// };