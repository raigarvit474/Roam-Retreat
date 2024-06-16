 const express=require("express");
const app=express();
const mongoose=require("mongoose");
// const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate");
// const wrapAsync=require("./utils/wrapAsync.js")
const ExpressError=require("./utils/ExpressError.js")
// const Joi = require('joi');
// const {listingSchema,reviewSchema}=require("./schema.js");
// const Review=require("./models/review.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js")

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"))
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const sessionOptions={
    secret:"mysuperscecretcode",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        //so this means ki hamari jo cookie hai usko browser 7 din tak save rakhega iska usecase ye hai ki for example agar hamne login kiya to kitni der tak login rehna chahiye uss browser mein hamara account ye cheez cookies define karti hain
        httpOnly:true,//it is by default set to true
    },
};

app.get("/",(req,res)=>{
    res.send("Hi i am root");
})

app.use(session(sessionOptions)); //so now we have included session with this project so cookies are associated with each session
app.use(flash());//always use flash before routes because flash will be used with the help of routes 

//Passport uses sessions , so we will use passport below the sessions code
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;//this is defined because we want to use req.user in ejs but we cannot directly use it so locals ki form mein use karenge
    next();
});

// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     });
//     let registeredUser=await User.register(fakeUser,"helloWorld");//register(user,password) also register method will automatically cheque if the username is unique or not
//     res.send(registeredUser);
// })

// const validateListing=(req,res,next)=>{
//     let {error}=listingSchema.validate(req.body);//using joi
//     if(error){
//         let errMsg=error.details.map((el)=>el.message).join(",");
//         throw new ExpressError(400,errMsg);
//     }else{
//         next();
//     }
// }//This has been transferred to routes/listing.js

// const validateReview=(req,res,next)=>{
//     let {error}=reviewSchema.validate(req.body);//using joi
//     if(error){
//         let errMsg=error.details.map((el)=>el.message).join(",");
//         throw new ExpressError(400,errMsg);
//     }else{
//         next();
//     }
// }//This has been transferred to routes/review.js


// //Index Route
// app.get("/listings",wrapAsync(async (req,res)=>{
//     const allListings=await Listing.find({});
//     res.render("listings/index.ejs",{allListings});
// }))

// //New Route
// app.get("/listings/new",(req,res)=>{
//     res.render("listings/new.ejs")
// })

// //Show Route
// app.get("/listings/:id",wrapAsync(async (req,res)=>{
//     let {id}=req.params;
//     const listing=await Listing.findById(id).populate("reviews");
//     res.render("listings/show.ejs",{listing});
// }))

// //Create Route
// app.post("/listings",validateListing,wrapAsync(async (req,res,next)=>{
//     // let {title, description, price, location, country}=req.body;
//         // if(!req.body.listing){
//         //     throw new ExpressError(400,"Bad Request. Send valid data for listing");
//         // }
//         // if(!newListing.title){
//         //     throw new ExpressError(400,"Title is missing");
//         // }
//         // if(!newListing.description){
//         //     throw new ExpressError(400,"Description is missing");
//         // }
//         // if(!newListing.location){
//         //     throw new ExpressError(400,"Location is missing");
//         // }
//         //these if blocks are one way of validation errors responses

//         // the second method is using joi
//         // let result=listingSchema.validate(req.body);//using joi
//         // if(result.error){
//         //     throw new ExpressError(400,result.error);
//         // }
//         const newListing=new Listing(req.body.listing);
//         await newListing.save();
//         res.redirect("/listings");
//     //to handle error--> validation errors
// }
// ));

// //EDIT ROUTE
// app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
//     let {id}=req.params;
//     const listing=await Listing.findById(id);
//     res.render("listings/edit.ejs",{listing});
// }))

// //Update Route
// app.put("/listings/:id",validateListing,wrapAsync(async (req,res)=>{
//     // if(!req.body.listing){
//     //     throw new ExpressError(400,"Bad Request. Send valid data for listing");
//     // }//we can remove this now because ab ham validateListing naam ka middleware use kar rahe hain for handling validation errors
//     let {id}=req.params;
//     await Listing.findByIdAndUpdate(id,{...req.body.listing})
//     res.redirect("/listings");
// }))

// //Delete Route
// app.delete("/listings/:id",wrapAsync(async (req,res)=>{
//     let {id}=req.params;
//     let deletedListing=await Listing.findByIdAndDelete(id);//to ab jaise hi ye findByIdandDelete call hoga kisi bhi listing ke liye to ye listing.js ke vo listingSchema.post wale mongoose middleware ko call karega aur vo iss listing ke corresponding saare ke saare reviews ko delete karega
//     console.log(deletedListing);
//     res.redirect("/listings"); 
// }))
//This all has been commented because it has been transferred to listing.js file in routes folder so we have shifted our routes to listing .js


app.use("/listings",listingRouter);


// //Reviews
// //POST Review Route
// app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
//     let listing=await Listing.findById(req.params.id);
//     let newReview=new Review(req.body.review);

//     listing.reviews.push(newReview);
//     await newReview.save();
//     await listing.save();

//     console.log("New Review Saved");
//     res.redirect(`/listings/${listing._id}`);
// }));//wrap async is used for basic error handling

// // Delete Review Route
// app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
    
//     let {id,reviewId}=req.params;
//     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})//pull means remove
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/listings/${id}`);
// }))
//This has been commented because we have restructured the review routes like for listings
//All of these routes are transferred to review.js in routes

// app.get("/testListing",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"My New Villa",
//         description:"By the Beach",
//         price:1200,
//         location:"Calangute, Goa",
//         country:"India",
//     })

//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("successfull testing");
// })

app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found"));
})//The * means that if the user enters the url other than the above paths then this should happen;

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went Wrong"}=err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{message});
})

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
})

//joi can be used to validate our schema
//It applies validation on individual fields


// Firstly we will make our create listing form capable of sending files from frontend to backend