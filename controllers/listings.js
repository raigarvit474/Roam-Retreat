const Listing=require("../models/listing");

module.exports.index=async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm=(req,res)=>{
    
    res.render("listings/new.ejs");
    
}

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({
        path:"reviews",
        populate:{path:"author"},
        //This is nexted populate taaki har review ke saath uska Author bhi aaye
    }).populate("owner");//i.e jab bhi listing aa rhi hogi to uske saath saare reviews and listing ka owner dono aayenge
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
}

module.exports.createListing=async (req,res,next)=>{
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
        newListing.owner=req.user._id;
        await newListing.save();
        req.flash("success","New Listing Created!");
        res.redirect("/listings");
    //to handle error--> validation errors
}

module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}

module.exports.updateListing=async (req,res)=>{
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Bad Request. Send valid data for listing");
    // }//we can remove this now because ab ham validateListing naam ka middleware use kar rahe hain for handling validation errors
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);//to ab jaise hi ye findByIdandDelete call hoga kisi bhi listing ke liye to ye listing.js ke vo listingSchema.post wale mongoose middleware ko call karega aur vo iss listing ke corresponding saare ke saare reviews ko delete karega
    console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings"); 
}