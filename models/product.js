var mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
var bcrypt = require('bcryptjs');

// product Schema
var productSchema = mongoose.Schema({
    merchant_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Merchant'
    },
    category_id: {
        type: mongoose.Schema.ObjectId
    },
    subcategory_id: {
        type: mongoose.Schema.ObjectId
    },
    product_id: {
        type: mongoose.Schema.ObjectId

    },
    name: {
        type: String,
        required: true,
    },
    prints: {
        type: String
    },
    image: {
        type: Array
    },
    price: {
        type: Array
    },
    delivery_charge: {
        type: Number
    },
    discount: {
        type: Number
    },
    print_type: {
        type: String
    },
    description: {
        type: String
    },
    delivery_day: {
        type: Number
    },
    embossing: {
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
    },
    city:{
        type:String
    },
    isProduct:{
        type:String
    }
});

productSchema.plugin(uniqueValidator);

var product = module.exports = mongoose.model('product', productSchema);

//Add product
module.exports.createproduct = function (newproduct, callback) {
    newproduct.save(callback);
}

//Get product List
module.exports.getproduct = function (query, callback, limit) {
    product.find(query).populate('merchant_id', 'name address city brand_name description').sort({ _id: -1 }).exec(callback);
}

//get product By Id
module.exports.getproductById = function (query, callback) {
    product.findById(query).populate('merchant_id', 'name address city brand_name description').exec(callback);

}

// Update product
module.exports.updateproduct = function (query, update, options, callback) {
    product.findOneAndUpdate(query, update, options, callback);
}

// Remove product
module.exports.removeproduct = function (id, callback) {
    var query = { _id: id };
    product.remove(query, callback);
}