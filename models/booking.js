const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    listing: {
        type: Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    currentStatus:{
        type: String,
        enum: ['Not Booked','Booked','Cancelled'],
        required: true,
    },
});

bookingSchema.statics.isDateRangeAvailable = async function(listingId, startDate, endDate) {
    const existingBookings = await this.find({
        listing: listingId,
        currentStatus: 'Booked',
        $or: [
            { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
        ]
    });
    return existingBookings.length === 0;
};

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
