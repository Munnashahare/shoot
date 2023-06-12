var express = require('express');
var router = express.Router();
const passport = require('passport');

var Booking = require('../controller/booking');
var Booking_details = require('../controller/booking_details');

//Booking
router.post('/getBooking', Booking.getallBooking);
router.post('/getBookingById', Booking.getBookingById);
router.post('/addBooking', Booking.addBooking);
router.post('/updateBookingStatus', Booking.updateStatus);
router.post('/acceptBooking', Booking.acceptBooking);
router.post('/rejectBooking', Booking.rejectBooking);
router.post('/cancelBooking', Booking.cancelBooking);
router.post('/startService', Booking.startService);
router.post('/endService', Booking.endService);
router.post('/feedbackByUser', Booking.feedbackByUser);
router.post('/bookingDetails', Booking.bookingDetails);
router.post('/getAllBookingByMerchantId', Booking.getAllBookingByMerchantId);
router.post('/getAllBookingByUserId', Booking.getAllBookingByUserId);
router.post('/bookingCountByQuery', Booking.bookingCount);
router.post('/totalEarning', Booking.totalEarning);
// router.post('/cmpbooking', Booking.completedbooking);

router.post('/cancellation_amount', Booking.cancellation_amount);
router.post('/createOrder',Booking.createOrder);
router.post('/paymentdetails',Booking.paymentDetails);
router.post('/getLiveEvent',Booking.getLiveEvent)


//Booking Details
router.post('/addBooking_details', Booking_details.addBooking_details);
router.post('/getBooking_details', Booking_details.getBooking_details);
router.post('/booking_detailsById', Booking_details.booking_detailsById);
router.post('/updateBookingDetailStatus', Booking_details.updateStatus);


function isAdmin(req, res, next) {
  if(req.user.userType == 'admin') next();
  else return res.json({status: false, response: "unauthorized"});
}

function isAdmin_Merchant(req, res, next) {
    if(req.user.userType == 'merchant' || req.user.userType == 'admin') next();
    else return res.json({status: false, response: "unauthorized"});
  }

module.exports = router;