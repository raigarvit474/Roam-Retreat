module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        //redirectUrl will be saved here 
        req.session.redirectUrl=req.originalUrl;//store karali URL jispe jaane ki vajah se login karna pad rha hai 
        req.flash("error","You must be logged in to create a listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

//res.locals mein save karvana pada because passport login ke time req.session ko reset kar deta hai therefore url access nhi kar paate but locals pe passport ka access nhi  hota hai issiliye locals mein store karva diya