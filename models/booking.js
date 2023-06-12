var mongoose = require('mongoose');

// Booking Schema
var BookingSchema = mongoose.Schema({
    booking_number: {
        type: String
    },
    merchant_id: {
         type: mongoose.Schema.ObjectId,
         ref:'Merchant'
    },
    user_id: {
        type: mongoose.Schema.ObjectId,
        require: true
    },
    booking_date: {
        type: String
    },
    booking_time: {
        type: String
    },
    location: {
        type: [Number],
        index: '2d'
    },
    address: {
        type: Array
    },  
    total_ammount: {
        type: Number
    },
    booking_status: {
        type: String
    },
    cancel_by: {
        type: String
    },
    otp: {
        type: Number
    },
    rating: {
        type: Number
    },
    feedback: {
        type: String
    },
    cancel_by: {
        type: String
    },
    cancellation_charge: {
        type: Number
    },
    status: {
        type: Boolean
    },
	created_at: {
		type: Date
	  },
	updated_at: {
		type: Date
	  },
    delivery_address:{
          type:String
      },
      isProduct:{
        type:Boolean
    },
    booking_payment_details: {
        type: Object
    },
    booking_payment_status: {
        type:Boolean
    },
   
      
   
   
});


var Booking = module.exports = mongoose.model('Booking', BookingSchema);

// Add Booking Request
module.exports.createBooking = function (newBooking, callback) {
    newBooking.save(callback);
}

// Get All Booking 
module.exports.getBooking = function(query, callback, limit) {
    Booking.find(query, callback).sort({_id:-1});
}

// Get Booking By Id
module.exports.getBookingById = function(id, callback) {
    Booking.findById(id, callback);
}

// Update Booking
module.exports.updateBooking = function (query, update, options, callback) {
    Booking.findOneAndUpdate(query, update, options, callback);
}

// Near by Events
var max_distance = 5/111.12;
module.exports.getLiveEvent= function (user, callback) {
    Booking.find({
        booking_status: 'ongoing',
        location: { $near:user.location, $maxDistance: max_distance }

    },{booking_status:1}).populate('merchant_id', 'brand_name city banner_image address rating').exec(callback);
}


module.exports.updateUserByQuery = function (query, update, options, callback) {
    Booking.findOneAndUpdate(query, update, options, callback);
}

//payment details
module.exports.updateBookingByPaymentStatus = function (query, update, options, callback) {
    Booking.findOneAndUpdate(query, update, options, callback);
}