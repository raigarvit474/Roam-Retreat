const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.js');
const { isLoggedIn,hasBooked,validateBooking } = require('../middleware');

router.get('/:id', isLoggedIn,hasBooked, bookingController.showBooking);
router.post('/:id/cancel',isLoggedIn,hasBooked,bookingController.cancelBooking);

router.post('/', isLoggedIn,validateBooking, bookingController.createBooking);


module.exports = router;
