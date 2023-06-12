var mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Support Schema
var SupportSchema = mongoose.Schema({
    type: {                     //0 for merchant 1 for user
        type: Number
    },
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref:'User'
    },
    merchant_id: {
        type: mongoose.Schema.ObjectId,
        ref:'Merchant'
   },
    description: {
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

SupportSchema.plugin(uniqueValidator);

var Support = module.exports = mongoose.model('Support', SupportSchema);

//Add Support
module.exports.createSupport = function (newSupport, callback) {
    newSupport.save(callback);
}

//Get Support List
module.exports.getSupport = function (query, callback, limit) {
    Support.find(query).populate("user_id ", "first_name last_name").populate("merchant_id","name").exec(callback);
}

//get Support By Id
module.exports.getSupportById = function (id, callback) {
    Support.findById({ _id: id }, callback);
}

// Update Support
module.exports.updateSupport = function (query, update, options, callback) {
    Support.findOneAndUpdate(query, update, options, callback);
}

// Remove Support
module.exports.removeSupport = function (id, callback) {
    var query = { _id: id };
    Support.remove(query, callback);
}