var mongoose = require('mongoose');

// Offer Schema
var OfferSchema = mongoose.Schema({
    coupon_title: {
        type: String
    },
    description: {
        type: String  
    },
	coupon_code: {
		type: String
    },
    offer_type: {
        type: Number   //0 for flat rates and 1 for percentages
    },
    offer_value: {
        type: String
    },
    start_date: {
        type: Date
    },
	end_date: {
		type: Date
    },
    city: {
        type: String
    },
	status: {
		type: Boolean
	},
    created_at: {
      	type: Date
	},
	updated_at: {
		type: Date
	}
});

var Offer = module.exports = mongoose.model('offer', OfferSchema);

// Add Offer
module.exports.createOffer = function(newOffer, callback){
	newOffer.save(callback);
}

// Get Offer
module.exports.getOffer = function(query, callback, limit) {
    Offer.find(query, callback).sort({_id:-1});
}

// Get Offer
module.exports.getOfferByCode = function(coupon_code, callback) {
    Offer.findOne({coupon_code: coupon_code}, callback);
}

//Get Single Offer
module.exports.getOfferById = function(id, callback){
	Offer.findById(id, callback);
}

// update Offer
module.exports.updateOffer = function(query, update, options, callback) {
	Offer.findOneAndUpdate(query, update, options, callback);
}

// Remove Offer
module.exports.removeOffer = function(id, callback) {
    var query = { _id: id };
    Offer.remove(query, callback);
}