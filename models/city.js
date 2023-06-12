var mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// City Schema
var CitySchema = mongoose.Schema({
    name: {
        type: String
    },
    type: {
        type: Number
    },
    ammount: {
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

CitySchema.plugin(uniqueValidator);

var City = module.exports = mongoose.model('City', CitySchema);

//Add City
module.exports.createCity = function (newCity, callback) {
    newCity.save(callback);
}

//Get City List
module.exports.getCity = function (query, callback, limit) {
    City.find(query, callback).sort({ _id: -1 });
}

//get City By Id
module.exports.getCityById = function (id, callback) {
    City.findById({ _id: id }, callback);
}

// Update City
module.exports.updateCity = function (query, update, options, callback) {
    City.findOneAndUpdate(query, update, options, callback);
}

// Remove City
module.exports.removeCity = function (id, callback) {
    var query = { _id: id };
    City.remove(query, callback);
}