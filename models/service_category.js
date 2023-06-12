var mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
var bcrypt = require('bcryptjs');

// Service_category Schema
var Service_categorySchema = mongoose.Schema({
    category_name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
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

Service_categorySchema.plugin(uniqueValidator);

var Service_category = module.exports = mongoose.model('Service_category', Service_categorySchema);

//Add Service_category
module.exports.createService_category = function (newService_category, callback) {
    newService_category.save(callback);
}

//Get Service_category List
module.exports.getService_category = function (query, callback, limit) {
    Service_category.find(query, callback).sort({ _id: -1 });
}

//get Service_category By Id
module.exports.getService_categoryById = function (id, callback) {
    Service_category.findById({ _id: id }, callback);
}

// Update Service_category
module.exports.updateService_category = function (query, update, options, callback) {
    Service_category.findOneAndUpdate(query, update, options, callback);
}

// Remove Service_category
module.exports.removeService_category = function (id, callback) {
    var query = { _id: id };
    Service_category.remove(query, callback);
}