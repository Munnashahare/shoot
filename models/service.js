var mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Service Schema
var ServiceSchema = mongoose.Schema({
    service_category_id: {
        type: mongoose.Schema.ObjectId
    },
    service_subcategory_id: {
        type: mongoose.Schema.ObjectId
    },
    service_primecategory_id: {
        type: mongoose.Schema.ObjectId
    },
    merchant_id: {
        type: mongoose.Schema.ObjectId
    },
    service_type: {
        type: Number,                           //0-->photography, 1-->videography
    },
    number_of_photo: {
        type: Number
    },
    duration: {
        type: String
    },
    hours: {
        type: String
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
    favourite_service: {
        type: Boolean
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
    city:{
        type:String
    }
});

ServiceSchema.plugin(uniqueValidator);

var Service = module.exports = mongoose.model('Service', ServiceSchema);

//Add Service
module.exports.createService = function (newService, callback) {
    newService.save(callback);
}

//Get Service List
module.exports.getService = function (query, callback, limit) {
    Service.find(query, callback).sort({ _id: -1 });
}

//get Service By Id
module.exports.getServiceById = function (id, callback) {
    Service.findById({ _id: id }, callback);
}

// Update Service
module.exports.updateService = function (query, update, options, callback) {
    Service.findOneAndUpdate(query, update, options, callback);
}

// Remove Service
module.exports.removeService = function (id, callback) {
    var query = { _id: id };
    Service.remove(query, callback);
}