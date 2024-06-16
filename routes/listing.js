const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");

const listingController=require("../controllers/listings.js")

//First is Index Route and second is Create Route
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,validateListing,wrapAsync(listingController.createListing));//this create route is written for if we are sending requesting from some external sorce like hoppscotch to create a listing

//New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);//This will be above /:id routes because if not then new hi id ki tarah interpret ho jayega

//get request is for showListing, put is for updateListing, delete is for delete listing
router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


//EDIT ROUTE
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))


module.exports=router;