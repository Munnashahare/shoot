var product_size = require('../models/product_size');


//Add product_size
module.exports.addproduct_size = function (req, res) {
    var size = req.body.size;

    //validation
    req.checkBody('size', 'size is required').notEmpty();
    

    var errors = req.validationErrors();

    if (errors) res.json({ status: false, message: "Fields are missing.", error: errors });
    else {
        var newproduct_size = new product_size({
            size: size,
            created_at: Date()
        });

        product_size.createproduct_size(newproduct_size, function (err, product_size) {
            if (err) {
                return res.json({ status: false, error: err });
            } else {
                return res.json({ status: true, message: "Product_size Added Successfuly!", response: product_size });
            }
        });
    }
}


// Get All product_size
module.exports.getproduct_size = function (req, res) {
    var query = req.body.query;
    product_size.getproduct_size(query, function (err, product_size) {
        if (err) {
            return res.json({ status: false, error: err })
        } else {
            return res.json({ status: true, response: product_size })
        }
    })
}


//Remove product_size
module.exports.remove = function (req, res, next) {
    var product_size_id = req.body.product_size_id;
    //validation
    req.checkBody('product_size_id', 'product_size Id is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.json({ status: false, error: errors });
    } else {
        product_size.removeproduct_size(product_size_id, function (err, product_size) {
            if (err)
                return res.json({ status: false, error: err });
            if (product_size) {
                return res.json({ status: true, message: "product_size Removed Succefully!" });
            } else {
                return res.json({ status: false, message: "Invalid Id" });
            }
        });
    }
}

