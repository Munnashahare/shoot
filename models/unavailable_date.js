var mongoose = require('mongoose');

// Unavailable_Date Schema
var Unavailable_DateSchema = mongoose.Schema({
	merchant_id: {
         type: mongoose.Schema.ObjectId
	},
	date: {
		type: Date
	},
	created_at: {
		type: Date
	},
	updated_at: {
		type: Date
	},
});

var Unavailable_Date = module.exports = mongoose.model('Unavailable_Date', Unavailable_DateSchema);

// Add Unavailable_Date
module.exports.createDate = function(newTime, callback){
	newTime.save(callback);
}

// Get Unavailable_Date
module.exports.getAll = function(query, callback, limit) {
	Unavailable_Date.find(query, callback).sort({_id:-1});
	//db.booking.find({Unavailable_Date: {$gte: from_Unavailable_Date, $lt: to_Unavailable_Date}});
}

// Get Unavailable_Date By Id
module.exports.getDateById = function(id, callback){
	Unavailable_Date.findById(id, callback);
}

// Update Unavailable_Date
module.exports.updateUnavailable_Date = function(query, update, options, callback) {
    Unavailable_Date.findOneAndUpdate(query, update, options, callback);
}

// Remove Unavailable_Date	
module.exports.removeUnavailable_Date = function(id, callback) {
    var query = { _id: id };
    Unavailable_Date.remove(query, callback);
}
