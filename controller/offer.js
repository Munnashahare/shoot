var Offer = require('../models/offer');


// Add Offer
module.exports.addOffer = function(req, res){

    var coupon_code = req.body.coupon_code;
    var offer_type = req.body.offer_type;
    var offer_value = req.body.offer_value;
	var start_date = req.body.start_date;
	var end_date = req.body.end_date;
	var description = req.body.description;
	var title = req.body.title

	//validation
	req.checkBody('coupon_code', 'Coupon_code is required').notEmpty();
	req.checkBody('start_date', 'Start_date is required').notEmpty();
	req.checkBody('end_date', 'End_date is required').notEmpty();
	req.checkBody('title', 'Title is required').notEmpty();
	req.checkBody('description', 'Description is required').notEmpty();

	var errors = req.validationErrors();

	if (errors)
	 {
	 	res.json({status: false, response: errors});
	 } else {
		var newOffer = new Offer({
            coupon_code: coupon_code,
            offer_type: offer_type,
            offer_value: offer_value,
			start_date: start_date,
			end_date: end_date,
			title: title,
            description: description,
			status: false,
            created_at: Date()
         });

		Offer.createOffer(newOffer, function(err, offer){
			if(err){
				return res.json({status: false, response: err });
			} else {
				console.log(offer);
				if(offer) res.json({status: true, message: 'Offer Added successfully.', response: offer});	
			}
		});
	 }
};

// Get all Offer
module.exports.allOffer = function(req, res){
	var query = req.body.query;
	Offer.getOffer(query, function(err, offer){
		if(err){
			return res.json({status: false, error: err });
		} 
			if(offer.length > 0) {
			return res.json({status: true, response: offer});
		}
		else {
			return res.json({status: false, message: "No Offer" });
		}
	});
};

// Get Offer By Id
module.exports.getOfferById = function(req,res,next){
	var offer_id = req.body.offer_id;

	//validation
	req.checkBody('offer_id', 'Offer id is required').notEmpty();

	var errors = req.validationErrors();

	if (errors)
	{
	return res.json({status: false, response: errors});
	} else {
		Offer.getOfferById(offer_id, function(err, offer){
			if(err) 
			return res.json({status: false, response: err});
			if(offer)
			{
				return res.json({status: true, response: offer});
			} else {
				return res.json({status: false, message: "Invalid Offer ID"});
			}
		});
	}
}

// Update Offer
module.exports.updateOffer = function(req, res){
    var offer_id     = req.body.offer_id;
    var offer_type  = req.body.offer_type;
    var offer_value = req.body.offer_value;
	var coupon_code = req.body.coupon_code;
	var start_date  = req.body.start_date;
	var end_date    = req.body.end_date;    
	var title 		= req.body.title;
	var description = req.body.description;

	//validation
	req.checkBody('offer_id', 'Offer Id is required').notEmpty();
	req.checkBody('coupon_code', 'Coupon_code is required').notEmpty();
	req.checkBody('start_date', 'Start_date is required').notEmpty();
	req.checkBody('end_date', 'End_date is required').notEmpty();
	req.checkBody('title', 'Title is required').notEmpty();
	req.checkBody('description', 'description is required').notEmpty();

	var errors = req.validationErrors();

	if (errors)
	 {
	 	res.json({status: false, response: errors});
	 }
	 else
	 {
		var update = {
            coupon_code: coupon_code,
            offer_type: offer_type,
            offer_value: offer_value,
			start_date: start_date,
			end_date: end_date,
			title: title,
            description: description,
			status: false,
            updated_at : Date()
		};

		Offer.updateOffer({ _id: offer_id }, update, function(err, offer){
			if(err){
				return res.json({status: false, error: err });
			} 
				if(offer) { res.json({ status: true, message: 'Updated successfully.'});
			} else {
				return res.json({status: false, message: "Not able to Update!" });
			}
		});
	 }
};


// Update Status
module.exports.updateStatus = function(req, res){
	var offer_id = req.body.offer_id;
	var status = req.body.status;

	//validation
	req.checkBody('offer_id', 'Offer Id is required').notEmpty();
	req.checkBody('status', 'Status is required').notEmpty();

	var errors = req.validationErrors();

	if (errors)
	 {
	 	res.json({status: false, response: errors});
	 } else {
		Offer.updateOffer({ _id: offer_id }, {status: status, updated_at: Date()}, function(err, offer){
			if(err){
				return res.json({status: false, response: err });
			} 
				if(offer) { res.json({status: true, message: 'Status updated successfully.'});
			} else {
				return res.json({status: false, message: 'Not able to Update!' });
			}
		});
	 }
};

// Remove Offer
module.exports.removeOffer = function(req, res){
    var offer_id = req.body.offer_id;
    
	Offer.removeOffer(offer_id, function(err, offer){
		if(err){
			return res.json({status: false, response: err });
		} 
			if(offer) { res.json({status: true, message: "Offer removed successfully"});
		} else {
			return res.json({status: false, message: 'Invalid Id!' });
		}
	});
};



// Get Offer By coupon code
module.exports.getOfferByCode = function(req,res){
	coupon_code = req.body.coupon_code;
	//validation
	req.checkBody('coupon_code', 'coupon_code is required').notEmpty();

	var errors = req.validationErrors();

	if (errors)
	{
		return res.json({status: false, message: 'coupon_code is required', response: errors});
	} else {
		Offer.getOfferByCode(coupon_code, function(err, offer){
			if(err) 
				return res.json({status: false, message: 'error while search with coupon', response: err});
			if(offer)
			{
				return res.json({status: true, response: offer});
			} else {
				return res.json({status: false, message: "Invalid coupon code"});
			}
		});
	}
}