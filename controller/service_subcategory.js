var Service_subcategory = require('../models/service_subcategory');

// for aggregation
const config = require('../config/db');
var mongoose = require('mongoose');
mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;

const http = require('http');
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var Filename = "";


//upload image and send image_url
var storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, 'uploads/subcategory');
	},
	filename: function (req, file, callback) {
		Filename = file.fieldname + '_' + Date.now() + path.extname(file.originalname);
		callback(null, Filename);
	}
});

var upload = multer({ storage: storage }).single('avatar');

// delete image file
function delimg(imglink) {
	fs.stat('uploads/subcategory/' + imglink, function (err, stats) {
		//here we got all information of file in stats variable
		console.log(stats);

		if (err) {
			return console.error(err);
		}
		fs.unlink('uploads/subcategory/' + imglink, function (err) {
			if (err) {
				console.error(err);
			}
			// if no error, file has been deleted successfully
			console.log('File deleted!');
		});
	});
}

//Add Service Subcategory
module.exports.addService_subcategory = function (req, res) {
    var service_category_id = req.body.service_category_id;
    var subcategory_name = req.body.subcategory_name;
	var image = req.body.image;
	var tagline = req.body.tagline;
	var category_type = req.body.category_type;
	var color_code = req.body.color_code;

	//validation
	req.checkBody('service_category_id', 'Service Category id is required').notEmpty();
	req.checkBody('subcategory_name', 'Subcategory name is required').notEmpty();
	req.checkBody('tagline', 'Tagline name is required').notEmpty();
	req.checkBody('category_type', 'Category type is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) res.json({ status: false, message: "Fields are missing.", error: errors });
	else {
				var newSubCategory = new Service_subcategory({
                    service_category_id: service_category_id,
					subcategory_name: subcategory_name,
					image: image,
					status: false,
					tagline: tagline,
					color_code: color_code,
					category_type: category_type,
					created_at: Date()
				});

				Service_subcategory.createService_subcategory(newSubCategory, function (err, subcategory) {
					if (err) {
						return res.json({ status: false, error: err });
					} else {
						return res.json({ status: true, message: "Service Subcategory Added Successfuly!", response: subcategory });
					}
				});
			}
		}

// Update Service Category
module.exports.updateServiceSubcategory = function (req, res) {
	var service_subcategory_id = req.body.service_subcategory_id;
	var subcategory_name = req.body.subcategory_name;
	var image = req.body.image;
	var tagline = req.body.tagline;
	var category_type =req.body.category_type;
	var color_code = req.body.color_code;

	//validation
	req.checkBody('service_subcategory_id', 'Service Subcategory id is required').notEmpty();
	req.checkBody('subcategory_name', 'Subcategory Name is required').notEmpty();
	req.checkBody('tagline', 'Tagline Name is required').notEmpty();
	req.checkBody('category_type', 'Category type is required').notEmpty();
    
	var errors = req.validationErrors();

    if (errors) { return res.json({ status: false, error: errors });
    } else {
		var update = {
			subcategory_name: subcategory_name,
			image: image,
			tagline: tagline,
			category_type: category_type,
			color_code: color_code,
			updated_at: Date()
		}

		Service_subcategory.updateService_subcategory({_id: service_subcategory_id}, update, function (err, subcategory) {
			if (err) {
				return res.json({ status: false, error: err })
			} else {
                return res.json({ status: true, message: 'Sevice Subcategory Updated Successfully!' });
			}
		});
	}
};


// Get All Service Subcategory
module.exports.getServiceSubCategory = function (req, res) {
    var query = req.body.query;
	Service_subcategory.getService_subcategory(query, function (err, subcategory) {
		if (err) {
			return res.json({ status: false, error: err })
		} else {
            return res.json({ status: true, response: subcategory })
        }
	})
}

// Get Service Category By Id
module.exports.getServiceSubCategoryById = function (req, res) {
	var service_subcategory_id = req.body.service_subcategory_id;

	//validation
	req.checkBody('service_subcategory_id', 'Service Subcategory Id is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		return res.json({ status: false, error: errors });
	} else {
		Service_subcategory.getService_subcategoryById(service_subcategory_id, function (err, subcategory) {
			if (err)
				return res.json({ status: false, error: err });
			if (subcategory) {
				return res.json({ status: true, response: subcategory });
			} else {
				return res.json({ status: false, message: "Invalid Category ID" });
			}
		});
	}
}

//Remove Service Category
module.exports.remove = function (req, res, next) {
	var service_subcategory_id = req.body.service_subcategory_id;
	//validation
	req.checkBody('service_subcategory_id', 'Service Category Id is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		return res.json({ status: false, error: errors });
	} else {
		Service_subcategory.removeService_subcategory(service_subcategory_id, function (err, subcategory) {
			if (err)
				return res.json({ status: false, error: err });
			if (subcategory) {
				return res.json({ status: true, message: "Service Subategory Removed Succefully!" });
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
	var service_subcategory_id = req.body.service_subcategory_id;
	var status = req.body.status;

	//validation
	req.checkBody('service_subcategory_id', 'Service Subcategory Id is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		return res.json({ status: false, error: errors });
	} else {
		var update = {
			status: status,
			updated_at: Date()
		}
		Service_subcategory.updateService_subcategory({_id: service_subcategory_id }, update, function (err, subcategory) {
			if (err) {
				return res.json({ status: false, error: err })
			} else {
				if(subcategory){
					return res.json({ status: true, message: 'Status Updated Successfully!' });
				} else {
					return res.json({ status: false, message: 'Invlid Id!' });

				}
			}
		});
	}
};

// Get SubCategory Details
module.exports.getAllSubCategory_details = function (req, res) {

    var errors = req.validationErrors();

    if (errors) {
        res.json({ status: false, message: "fields are required", error: errors });
    } else {
		db.collection('service_subcategories').aggregate([
		
			{
				$lookup:
				{
					from: "service_categories",
					localField: "service_category_id",
					foreignField: "_id",
                        as: "service_category"
                    }
				},			
            ]).toArray(function (err, data) {
                if (err) return res.json({ status: false, error: err });
                return res.json({ status: true, response: data });
            });
        }
};