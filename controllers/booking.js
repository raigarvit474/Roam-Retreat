const Booking = require('../models/booking');
const Listing = require('../models/listing');

module.exports.createBooking = async (req, res) => {
    const { listingId, startDate, endDate, totalPrice } = req.body;
    const listing = await Listing.findById(listingId);
    if (!listing) {
        req.flash('error', 'Listing not found.');
        return res.redirect('/listings');
    }
    const booking = new Booking({
        user: req.user._id,
        listing: listingId,
        price: totalPrice,
        startDate,
        endDate,
        currentStatus: 'Booked',
    });
    await booking.save();
    req.flash('success', 'Successfully booked the listing!');
    res.redirect(`/listings/${listingId}`);
};
module.exports.showBooking = async (req, res) => {
    let { id } = req.params;
    const booking = await Booking.findById(id).populate('listing').populate('user');

    if (!booking) {
        req.flash("error", "Booking you requested for does not exist!");
        return res.redirect("/listings");
    }

    console.log(booking);
    res.render("bookings/showBooking.ejs", { booking });
};

module.exports.cancelBooking = async (req, res) => {
    let { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
        req.flash("error", "Booking you requested for does not exist!");
        return res.redirect("/listings");
    }

    booking.currentStatus = 'Cancelled';
    await booking.save();

    req.flash("success", "Booking cancelled successfully!");
    res.redirect(`/listing/bookings/${id}`);
};
