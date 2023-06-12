var mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Service_subcategory Schema
var Service_subcategorySchema = mongoose.Schema({
    service_category_id: {
        type: mongoose.Schema.ObjectId
    },
    subcategory_name: {
        type: String,
        required: true,
    },
    image: {
        type: String
    },
    status: {
        type: Boolean
    },
    tagline:{
        type: String
    },
    category_type: {
        type: Number // 0 for services and 1 for product
    },
    color_code: {
        type: String
    },
    created_at: {
        type: Date
    },
    updated_at: {
        type: Date
    }
});

Service_subcategorySchema.plugin(uniqueValidator);

var Service_subcategory = module.exports = mongoose.model('Service_subcategory', Service_subcategorySchema);

//Add Service_subcategory
module.exports.createService_subcategory = function (newService_subcategory, callback) {
    newService_subcategory.save(callback);
}

//Get Service_subcategory List
module.exports.getService_subcategory = function (query, callback, limit) {
    Service_subcategory.find(query, callback).sort({ _id: -1 });
}

//get Service_subcategory By Id
module.exports.getService_subcategoryById = function (id, callback) {
    Service_subcategory.findById({ _id: id }, callback);
}

// Update Service_subcategory
module.exports.updateService_subcategory = function (query, update, options, callback) {
    Service_subcategory.findOneAndUpdate(query, update, options, callback);
}

// Remove Service_subcategory
module.exports.removeService_subcategory = function (id, callback) {
    var query = { _id: id };
    Service_subcategory.remove(query, callback);
}