const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup",wrapAsync(async(req,res)=>{
    try{
        let{username,email,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to WanderLust!");
            res.redirect("/listings");
        });//when the login operation completes,registeredUser will be assigned to req.user
        
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    
}))

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})

router.post("/login",saveRedirectUrl,passport.authenticate("local",{
    failureRedirect:'/login',
    failureFlash:true,
}),async(req,res)=>{
    req.flash("success","Welcome back to WanderLust! You are logged in!");
    let redirectUrl=res.locals.redirectUrl || "/listings"; //This is just to check so if redirectUrl is empty then we will go back to /listings because iska matlab hai ki hamne all listings wale page pe hi login kiya tha
    res.redirect(redirectUrl);
});

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","You are now logged out");
        res.redirect("/listings");
    })
})

module.exports=router;