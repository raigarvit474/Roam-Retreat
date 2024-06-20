const Listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});//to start the geoservice coding 


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
        let response=await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1
          })
            .send()

        let url=req.file.path;
        let filename=req.file.filename;

        const newListing=new Listing(req.body.listing);
        newListing.category='Latest';
        newListing.owner=req.user._id;
        newListing.image={url,filename};
        newListing.geometry=response.body.features[0].geometry;//ye value mapbox se aa rhi hai aur isse ham store kara rahe hain

        let savedListing=await newListing.save();
        console.log(savedListing);
        
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

    let originalImageUrl=listing.image.url;
    originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
}

module.exports.updateListing=async (req,res)=>{
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Bad Request. Send valid data for listing");
    // }//we can remove this now because ab ham validateListing naam ka middleware use kar rahe hain for handling validation errors
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    
    if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        
        listing.image={url,filename};
        await listing.save();
    }

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