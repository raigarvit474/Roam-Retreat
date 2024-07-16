const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.js');
const { isLoggedIn } = require('../middleware');

router.get('/:id', isLoggedIn, bookingController.showBooking);
router.post('/:id/cancel',isLoggedIn, bookingController.cancelBooking);

router.post('/', isLoggedIn, bookingController.createBooking);


module.exports = router;
