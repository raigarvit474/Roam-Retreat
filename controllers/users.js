const User = require('../models/user');
const Listing = require('../models/listing');
const Booking = require('../models/booking');

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Roam Retreat!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Roam Retreat! You are logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.profile = async (req, res) => {
    try {
        const userListings = await Listing.find({ owner: req.user._id });
        const userBookings = await Booking.find({ user: req.user._id }).populate('listing');
        res.render('users/profile', { userListings, userBookings });
    } catch (e) {
        req.flash('error', 'Cannot find user profile.');
        res.redirect('/');
    }
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            next(err);
        }
        req.flash("success", "You are now logged out");
        res.redirect("/listings");
    })
};
