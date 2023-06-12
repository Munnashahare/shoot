var Service_category = require('../models/service_category');

const http = require('http');
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var Filename = "";


//upload image and send image_url
var storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, 'uploads/category');
	},
	filename: function (req, file, callback) {
		Filename = file.fieldname + '_' + Date.now() + path.extname(file.originalname);
		callback(null, Filename);
	}
});

var upload = multer({ storage: storage }).single('avatar');

// delete image file
function delimg(imglink) {
	fs.stat('uploads/category/' + imglink, function (err, stats) {
		//here we got all information of file in stats variable
		console.log(stats);

		if (err) {
			return console.error(err);
		}
		fs.unlink('uploads/category/' + imglink, function (err) {
			if (err) {
				console.error(err);
			}
			// if no error, file has been deleted successfully
			console.log('File deleted!');
		});
	});
}

//Add Service Category
module.exports.addService_category = function (req, res) {
    var category_name = req.body.category_name;
    var image = req.body.image;

	//validation
	req.checkBody('category_name', 'category_name is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) res.json({ status: false, message: "Fields are missing.", error: errors });
	else {
				var newCategory = new Service_category({
					category_name: category_name,
					image: image,
					status: false,
					created_at: Date()
				});

				Service_category.createService_category(newCategory, function (err, category) {
					if (err) {
                        if(err.errors.category_name) {
                            return res.json({ status: false, message: "Service category already exits!" });
                        }
						return res.json({ status: false, error: err });
					} else {
						return res.json({ status: true, message: "Service Categry Added Successfuly!", response: category });
					}
				});
			}
		}

// Update Service Category
module.exports.updateServiceCategory = function (req, res) {
	var service_category_id = req.body.service_category_id;
	var category_name = req.body.category_name;
	var image = req.body.image;

	//validation
	req.checkBody('service_category_id', 'Service Category id is required').notEmpty();
    req.checkBody('category_name', 'category_name is required').notEmpty();
    
	var errors = req.validationErrors();

    if (errors) { return res.json({ status: false, error: errors });
    } else {
		var update = {
			category_name: category_name,
			image: image,
			updated_at: Date()
		}

		Service_category.updateService_category({_id: service_category_id}, update, function (err, category) {
			if (err) {
				return res.json({ status: false, error: err })
			} else {
                return res.json({ status: true, message: 'Sevice Category Updated Successfully!' });
			}
		});
	}
};


// Get All Service Category
module.exports.getServiceCategory = function (req, res) {
	var query = req.body.query;
	Service_category.getService_category(query, function (err, category) {
		if (err) {
			return res.json({ status: false, error: err })
		} else {
            return res.json({ status: true, response: category })
        }
	})
}

// Get Service Category By Id
module.exports.getServiceCategoryById = function (req, res) {
	var service_category_id = req.body.service_category_id;

	//validation
	req.checkBody('service_category_id', 'Service Category Id is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		return res.json({ status: false, error: errors });
	} else {
		Service_category.getService_categoryById(service_category_id, function (err, category) {
			if (err)
				return res.json({ status: false, error: err });
			if (category) {
				return res.json({ status: true, response: category });
			} else {
				return res.json({ status: false, message: "Invalid Category ID" });
			}
		});
	}
}

//Remove Service Category
module.exports.remove = function (req, res, next) {
	var service_category_id = req.body.service_category_id;
	//validation
	req.checkBody('service_category_id', 'Service Category Id is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		return res.json({ status: false, error: errors });
	} else {
		Service_category.removeService_category(service_category_id, function (err, category) {
			if (err)
				return res.json({ status: false, error: err });
			if (category) {
				return res.json({ status: true, message: "Service Category Removed Succefully!" });
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
	var service_category_id = req.body.service_category_id;
	var status = req.body.status;

	//validation
	req.checkBody('service_category_id', 'Service Category Id is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		return res.json({ status: false, error: errors });
	} else {
		var update = {
			status: status,
			updated_at: Date()
		}
		Service_category.updateService_category({_id: service_category_id }, update, function (err, category) {
			if (err) {
				return res.json({ status: false, error: err })
			} else {
				if(category){
					return res.json({ status: true, message: 'Status Updated Successfully!' });
				} else {
					return res.json({ status: false, message: 'Invlid Id!' });

				}
			}
		});
	}
};