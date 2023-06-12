var Booking_details = require('../models/booking_details');

// Add Booking Details
module.exports.addBooking_details = function(req, res){
	var booking_number = req.body.booking_number;
	var service_id = req.body.service_id;
	var address = req.body.address;
	
	//validation	
	req.checkBody('booking_number', 'Booking_number is required').notEmpty();
	req.checkBody('service_id', 'Service Id is required').notEmpty();
    
	var errors = req.validationErrors();

	if (errors)
	 {
	 	res.json({status: false, response: errors});
	 } else {
		var newBooking_details = new Booking_details({
			booking_number: booking_number,
			service_id: service_id,
			address: address,
			status: false,
			createdAt: Date(),
		});

		Booking_details.createBooking_details(newBooking_details, function(err, booking_detail){
			if(err){
				return res.json({status: false, error: err });
			} else {	
                return res.json({status : true, message : 'Booking Details Added Successfully!'})
			}
		});
	 }
};

// Get all Booking Details
module.exports.getBooking_details = function(req, res){
    var query = req.body.query;
	Booking_details.getBooking_details(query, function(err, booking_detial){
		if(err){
			return res.json({status: false, error: err });
		} else {
			return res.json({status: true, response: booking_detial});
		}
	});
};

// Get Booking Details By Id
module.exports.booking_detailsById = function(req,res) {
	var booking_details_id = req.body.booking_details_id;

	//validation
	req.checkBody('booking_details_id', 'Booking_details id is required').notEmpty();

	var errors = req.validationErrors();

	if (errors)
	{
	return res.json({status: false, error: errors});
	} else {
		Booking_details.getBooking_detailsById(booking_details_id, function(err, booking_detail){
			if(err) 
			return res.json({status: false, error: err});
			if(booking_detail)
			{
				return res.json({status: true, response: booking_detail});
			} else {
				return res.json({status: false, message: "Invalid Booking ID"});
			}
		});
	}
};

// Update Status
module.exports.updateStatus = function(req, res){

	var booking_details_id = req.body.booking_details_id;
	var status = req.body.status;

	//validation
	req.checkBody('booking_details_id', 'Booking_details Id is required').notEmpty();
	req.checkBody('status', 'Status is required').notEmpty();

	var errors = req.validationErrors();

	if (errors)
	 {
	 	res.json({ status: false, error: errors });
	 } else {
		Booking_details.updateBookingDetails({ _id: booking_details_id }, { status: status, updated_at: Date()}, function(err, booking_detail){
			if(err){
				return res.json({status: false, error: err });
			} if(booking_detail){
				return res.json({status: true, message: 'Status updated successfully.'});
            } else {
				return res.json({status: false, message: "Invalid Id" });
            }
		});
	 }
};