var mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Service_primecategory Schema
var Service_primecategorySchema = mongoose.Schema({
    service_category_id: {
        type: mongoose.Schema.ObjectId
    },
    service_subcategory_id: {
        type: mongoose.Schema.ObjectId
    },
    primecategory_name: {
        type: String
    },
    service_type: {
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
    }
});

Service_primecategorySchema.plugin(uniqueValidator);

var Service_primecategory = module.exports = mongoose.model('Service_primecategory', Service_primecategorySchema);

//Add Service_primecategory
module.exports.createService_primecategory = function (newService_primecategory, callback) {
    newService_primecategory.save(callback);
}

//Get Service_primecategory List
module.exports.getService_primecategory = function (query, callback, limit) {
    Service_primecategory.find(query, callback).sort({ _id: -1 });
}

//get Service_primecategory By Id
module.exports.getService_primecategoryById = function (id, callback) {
    Service_primecategory.findById({ _id: id }, callback);
}

// Update Service_primecategory
module.exports.updateService_primecategory = function (query, update, options, callback) {
    Service_primecategory.findOneAndUpdate(query, update, options, callback);
}

// Remove Service_primecategory
module.exports.removeService_primecategory = function (id, callback) {
    var query = { _id: id };
    Service_primecategory.remove(query, callback);
}