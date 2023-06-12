var mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// product_size Schema
var product_sizeSchema = mongoose.Schema({
   size: {
       type: String
    },
    created_at: {
        type: Date
    }
});

product_sizeSchema.plugin(uniqueValidator);

var product_size = module.exports = mongoose.model('product_size', product_sizeSchema);

//Add product_size
module.exports.createproduct_size = function (newproduct_size, callback) {
    newproduct_size.save(callback);
}

//Get product_size List
module.exports.getproduct_size = function (query, callback, limit) {
    product_size.find(query, callback).sort({ _id: -1 });
}

//get product_size By Id
module.exports.getproduct_sizeById = function (id, callback) {
    product_size.findById({ _id: id }, callback);
}

// Remove product_size
module.exports.removeproduct_size = function (id, callback) {
    var query = { _id: id };
    product_size.remove(query, callback);
}