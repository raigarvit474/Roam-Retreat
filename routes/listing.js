const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");


const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);//using joi
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

//Index Route
router.get("/",wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}))

//New Route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs")
})

//Show Route
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
}))

//Create Route
router.post("/",validateListing,wrapAsync(async (req,res,next)=>{
    // let {title, description, price, location, country}=req.body;
        // if(!req.body.listing){
        //     throw new ExpressError(400,"Bad Request. Send valid data for listing");
        // }
        // if(!newListing.title){
        //     throw new ExpressError(400,"Title is missing");
        // }
        // if(!newListing.description){
        //     throw new ExpressError(400,"Description is missing");
        // }
        // if(!newListing.location){
        //     throw new ExpressError(400,"Location is missing");
        // }
        //these if blocks are one way of validation errors responses

        // the second method is using joi
        // let result=listingSchema.validate(req.body);//using joi
        // if(result.error){
        //     throw new ExpressError(400,result.error);
        // }
        const newListing=new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    //to handle error--> validation errors
}
));

//EDIT ROUTE
router.get("/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}))

//Update Route
router.put("/:id",validateListing,wrapAsync(async (req,res)=>{
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Bad Request. Send valid data for listing");
    // }//we can remove this now because ab ham validateListing naam ka middleware use kar rahe hain for handling validation errors
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    res.redirect("/listings");
}))

//Delete Route
router.delete("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);//to ab jaise hi ye findByIdandDelete call hoga kisi bhi listing ke liye to ye listing.js ke vo listingSchema.post wale mongoose middleware ko call karega aur vo iss listing ke corresponding saare ke saare reviews ko delete karega
    console.log(deletedListing);
    res.redirect("/listings"); 
}))


module.exports=router;