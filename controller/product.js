var product = require('../models/product');

const http = require('http');
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var Filename = "";

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/shootapp');
var db = mongoose.connection;


//upload image and send image_url
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads/product');
    },
    filename: function (req, file, callback) {
        Filename = file.fieldname + '_' + Date.now() + path.extname(file.originalname);
        callback(null, Filename);
    }
});

var upload = multer({ storage: storage }).single('avatar');

// delete image file
function delimg(imglink) {
    fs.stat('uploads/product/' + imglink, function (err, stats) {
        //here we got all information of file in stats variable
        console.log(stats);

        if (err) {
            return console.error(err);
        }
        fs.unlink('uploads/product/' + imglink, function (err) {
            if (err) {
                console.error(err);
            }
            // if no error, file has been deleted successfully
            console.log('File deleted!');
        });
    });
}

//Add product
module.exports.addproduct = function (req, res) {
    var merchant_id = req.body.merchant_id;
    var category_id = req.body.category_id;
    var subcategory_id = req.body.subcategory_id;
    var product_id = req.body.product_id;
    var name = req.body.name;
    var prints = req.body.prints;
    var image = req.body.image;
    var price = req.body.price;
    var delivery_charge = req.body.delivery_charge;
    var discount = req.body.discount;
    var print_type = req.body.print_type;
    var description = req.body.description;
    var delivery_day = req.body.delivery_day;
    var embossing = req.body.embossing;
    var city = req.body.city;
    var isProduct = req.body.isProduct;


    //validation
    req.checkBody('merchant_id', 'merchant_id is required').notEmpty();
    req.checkBody('category_id', 'category_id is required').notEmpty();
    req.checkBody('product_id', 'product_id is required').notEmpty();

    req.checkBody('subcategory_id', 'subcategory_id is required').notEmpty();
    req.checkBody('name', 'name is required').notEmpty();
    req.checkBody('prints', 'prints is required').notEmpty();
    // req.checkBody('image', 'image is required').notEmpty();
    req.checkBody('price', 'price is required').notEmpty();
    req.checkBody('delivery_charge', 'delivery_charge is required').notEmpty();
    req.checkBody('discount', 'discount is required').notEmpty();
    req.checkBody('print_type', 'print_type is required').notEmpty();
    req.checkBody('description', 'description is required').notEmpty();
    req.checkBody('delivery_day', 'delivery_day is required').notEmpty();
    req.checkBody('embossing', 'embossing is required').notEmpty();


    var errors = req.validationErrors();

    if (errors) res.json({ status: false, message: "Fields are missing.", error: errors });
    else {
        var newproduct = new product({
            merchant_id: merchant_id,
            category_id: category_id,
            subcategory_id: subcategory_id,
            name: name,
            prints: prints,
            image: image,
            price: price,
            delivery_charge: delivery_charge,
            discount: discount,
            print_type: print_type,
            description: description,
            delivery_day: delivery_day,
            embossing: embossing,
            product_id: product_id,
            status: false,
            city: city,
            created_at: Date(),
            isProduct: false
        });

        product.createproduct(newproduct, function (err, product) {
            if (err) {
                return res.json({ status: false, error: err });
            } else {
                return res.json({ status: true, message: "Product added successfuly and admin will approve the product images!", response: product });
            }
        });
    }
}

// Update product
module.exports.updateproduct = function (req, res) {
    var product_id = req.body.product_id;
    var merchant_id = req.body.merchant_id;
    var category_id = req.body.category_id;
    var product_id = req.body.product_id;
    var subcategory_id = req.body.subcategory_id;
    var name = req.body.name;
    var prints = req.body.prints;
    var image = req.body.image;
    var price = req.body.price;
    var delivery_charge = req.body.delivery_charge;
    var discount = req.body.discount;
    var print_type = req.body.print_type;
    var description = req.body.description;
    var delivery_day = req.body.delivery_day;
    var embossing = req.body.embossing;
    var city = req.body.city;
    var isProduct = req.body.isProduct;

    //validation
    req.checkBody('merchant_id', 'merchant_id is required').notEmpty();
    req.checkBody('product_id', 'product_id is required').notEmpty();

    req.checkBody('category_id', 'category_id is required').notEmpty();
    req.checkBody('subcategory_id', 'subcategory_id is required').notEmpty();
    req.checkBody('name', 'name is required').notEmpty();
    req.checkBody('prints', 'prints is required').notEmpty();
    // req.checkBody('image', 'image is required').notEmpty();
    req.checkBody('price', 'price is required').notEmpty();
    req.checkBody('delivery_charge', 'delivery_charge is required').notEmpty();
    req.checkBody('discount', 'discount is required').notEmpty();
    req.checkBody('print_type', 'print_type is required').notEmpty();
    req.checkBody('description', 'description is required').notEmpty();
    req.checkBody('delivery_day', 'delivery_day is required').notEmpty();
    req.checkBody('embossing', 'embossing is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.json({ status: false, error: errors });
    } else {
        var update = {
            merchant_id: merchant_id,
            category_id: category_id,
            subcategory_id: subcategory_id,
            product_id: product_id,
            name: name,
            prints: prints,
            image: image,
            price: price,
            delivery_charge: delivery_charge,
            discount: discount,
            print_type: print_type,
            description: description,
            delivery_day: delivery_day,
            embossing: embossing,
            city: city,
            updated_at: Date(),
            isProduct: false
        }

        product.updateproduct({ _id: product_id }, update, function (err, product) {
            if (err) {
                return res.json({ status: false, error: err })
            } else {
                return res.json({ status: true, message: 'Product Updated Successfully and admin will approve the product images!' });
            }
        });
    }
};


// Get All product
module.exports.getproduct = function (req, res) {
    var query = req.body.query;
    product.getproduct(query, function (err, product) {
        if (err) {
            return res.json({ status: false, error: err })
        } else {
            return res.json({ status: true, response: product })
        }
    })
}

// // Get All product with category details
module.exports.getproductwithcategory = function (req, res) {
    var merchant_id = req.body.merchant_id;

    //validation
    req.checkBody('merchant_id', 'merchant Id is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.json({ status: false, message: "fields are required", error: errors });
    }
    else {
        db.collection('products').aggregate([
            { $match: { "merchant_id": mongoose.Types.ObjectId(merchant_id) }, "city": city },
            {
                $lookup:
                {
                    from: 'service_subcategories',
                    localField: 'subcategory_id',
                    foreignField: '_id',
                    as: 'subcategory'
                }
            }
        ]).toArray(function (err, data) {
            if (err) return res.json({ status: false, error: err });
            return res.json({ status: true, response: data });
        });
    }
};




// Get product By Id
module.exports.getproductById = function (req, res) {
    var product_id = req.body.product_id;

    //validation
    req.checkBody('product_id', 'product Id is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.json({ status: false, error: errors });
    } else {
        product.getproductById({ _id: product_id }, function (err, product) {
            if (err)
                return res.json({ status: false, error: err });
            if (product) {
                return res.json({ status: true, response: product });
            } else {
                return res.json({ status: false, message: "Invalid product ID" });
            }
        });
    }
}

//Remove product
module.exports.remove = function (req, res, next) {
    var product_id = req.body.product_id;
    //validation
    req.checkBody('product_id', 'product Id is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.json({ status: false, error: errors });
    } else {
        product.removeproduct(product_id, function (err, product) {
            if (err)
                return res.json({ status: false, error: err });
            if (product) {
                return res.json({ status: true, message: "product Removed Succefully!" });
            } else {
                return res.json({ status: false, message: "Invalid Id" });
            }
        });
    }
}

// Upload Image and Get File Name
module.exports.upload_image = function (req, res) {
    Filename = "";
    upload(req, res, function (err) {
        if (err) {
            return res.json({ status: false, err: err, message: 'Error uploading file.' });
        }
        else {
            return res.json({ status: true, image: Filename });
        }
    });
};

// Delete Image
module.exports.remove_Image = function (req, res) {
    var oldimage = req.body.image;
    delimg(oldimage);
    return res.json({ status: true, message: "File removed!" });
};

// Update Status
module.exports.updateStatus = function (req, res) {
    var product_id = req.body.product_id;
    var status = req.body.status;

    //validation
    req.checkBody('product_id', 'product Id is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.json({ status: false, error: errors });
    } else {
        var update = {
            status: status,
            updated_at: Date()
        }
        product.updateproduct({ _id: product_id }, update, function (err, product) {
            if (err) {
                return res.json({ status: false, error: err })
            } else {
                if (product) {
                    return res.json({ status: true, message: 'Status Updated Successfully!' });
                } else {
                    return res.json({ status: false, message: 'Invlid Id!' });

                }
            }
        });
    }
};

//Approve Product
module.exports.approveproduct = (req, res) => {
    var product_id = req.body.product_id;
    //validation
    req.checkBody('product_id', 'product Id is required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        return res.json({ status: false, error: errors });
    } else {
        var update={
            isProduct:true,
            updated_at: Date()
        }
        product.updateproduct({_id:product_id},update,(err,product)=>{
            if(err) return res.json({status: false, error: err});
            else {
                if (product) {
                    return res.json({ status: true, message: 'Product Approved Successfully!' });
                } else {
                    return res.json({ status: false, message: 'Something went wrong!' });

                }
            }
        })
    }
}