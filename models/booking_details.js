var mongoose = require('mongoose');

// Booking_details Details Schema
var Booking_detailsSchema = mongoose.Schema({
    booking_number: {
        type: String
    },
    service_id: {
        type: mongoose.Schema.ObjectId
    },
    service_category: {
        type: mongoose.Schema.ObjectId

    },
    service_subcategory: {
        type: String

    },
    service_primecategory: {
        type: String

    },
    primecategory_name: {
        type: String
    },
    service_name: {
        type: Number,                           //photography, videography
    },
    service_type: {
        type: Number,                           //photography, videography
    },
    number_of_photo: {
        type: Number
    },
    hours: {
        type: Number
    },
    softcopy: {
        type: Boolean
    },
    rate: {
        type: Number
    },
    discount: {
        type: Number
    },
    final_amount: {
        type: Number
    },
    status: {
        type: Boolean
    },
	created_at: {
		type: Date
	  },
	update_at: {
		type: Date
	  },
      product_name:{
        type:String
    } ,
    product_description:{
        type:String
    },
    product_delivery_day:{
        type:Number
    },
    product_delivery_charge:{
        type:Number
    },
    product_quantity:{
        type:Number
    },
    user_feedback:{
        type:Boolean
    }
   
});

var Booking_details = module.exports = mongoose.model('Booking_details', Booking_detailsSchema);


// Add Booking_details 
// module.exports.createBulk_Booking_details = function (newBooking_details, callback) {
//     Booking_details.insertMany(data, callback);
// }

// Add Booking_details 
module.exports.createBooking_details = function (newBooking_details, callback) {
    newBooking_details.save(callback);
}
// Get All Booking_details
module.exports.getBooking_details = function(query, callback, limit) {
    Booking_details.find(query, callback).sort({_id:-1});
}

// Get Booking_details By Id
module.exports.getBooking_detailsById = function(id, callback) {
    Booking_details.findById(id, callback);
}

// Update Booking_details
module.exports.updateBookingDetails = function (query, update, options, callback) {
    Booking_details.findOneAndUpdate(query, {$set:update}, options, callback);
}

// Remove Booking_details
module.exports.remove = function (query,callback) {
    Booking_details.remove({ _id: id }, callback)
}       