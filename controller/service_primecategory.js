var Service_primecategory = require('../models/service_primecategory');

// for aggregation
const config = require('../config/db');
var mongoose = require('mongoose');
mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;

//Add Service Primecategory
module.exports.addServicePrimecategory = function (req, res) {
    var service_category_id = req.body.service_category_id;
    var service_subcategory_id = req.body.service_subcategory_id;
    var primecategory_name = req.body.primecategory_name;
    var service_type = req.body.service_type;

	//validation
	req.checkBody('service_category_id', 'Service Category id is required').notEmpty();
	req.checkBody('service_subcategory_id', 'Service Subategory id is required').notEmpty();
	req.checkBody('primecategory_name', 'Prime Category Name is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) res.json({ status: false, message: "Fields are missing.", error: errors });
	else {
				var newPrimecategory = new Service_primecategory({
                    service_category_id: service_category_id,
                    service_subcategory_id: service_subcategory_id,
                    primecategory_name: primecategory_name,
                    service_type: service_type,
					status: false,
					created_at: Date()
				});

				Service_primecategory.createService_primecategory(newPrimecategory, function (err, subcategory) {
					if (err) {
						return res.json({ status: false, error: err });
					} else {
						return res.json({ status: true, message: "Service Subcategory Added Successfuly!", response: subcategory });
					}
				});
			}
		}

// Update Service Prime Category
module.exports.updateServicePrimecategory = function (req, res) {
	var service_primecategory_id = req.body.service_primecategory_id;
    var service_category_id = req.body.service_category_id;
    var service_subcategory_id = req.body.service_subcategory_id;
    var primecategory_name = req.body.primecategory_name;
    var service_type = req.body.service_type;

	//validation
	req.checkBody('service_primecategory_id', 'Service prime category id is required').notEmpty();
	req.checkBody('service_category_id', 'Service Category id is required').notEmpty();
	req.checkBody('service_category_id', 'Service Subcategory id is required').notEmpty();
    req.checkBody('primecategory_name', 'Primecategory Name is required').notEmpty();
    
	var errors = req.validationErrors();

    if (errors) { return res.json({ status: false, error: errors });
    } else {
		var update = {
			service_category_id: service_category_id,
            service_subcategory_id: service_subcategory_id,
            primecategory_name: primecategory_name,
            service_type: service_type,
			updated_at: Date()
		}

		Service_primecategory.updateService_primecategory({_id: service_primecategory_id}, update, function (err, primecategory) {
			if (err) {
				return res.json({ status: false, error: err })
			} else {
                return res.json({ status: true, message: 'Sevice Prime Category Updated Successfully!' });
			}
		});
	}
};


// Get All Service Primecategory
module.exports.getServicePrimeCategory = function (req, res) {
    var query = req.body.query;
	Service_primecategory.getService_primecategory(query, function (err, primecategory) {
		if (err) {
			return res.json({ status: false, error: err })
		} else {
            return res.json({ status: true, response: primecategory })
        }
	})
}

// Get Service Prime Category By Id
module.exports.getServicePrimeCategoryById = function (req, res) {
	var service_primecategory_id = req.body.service_primecategory_id;

	//validation
	req.checkBody('service_primecategory_id', 'Service Primecategory Id is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		return res.json({ status: false, error: errors });
	} else {
		Service_primecategory.getService_primecategoryById(service_primecategory_id, function (err, primecategory) {
			if (err)
				return res.json({ status: false, error: err });
			if (primecategory) {
				return res.json({ status: true, response: primecategory });
			} else {
				return res.json({ status: false, message: "Invalid ID" });
			}
		});
	}
}

//Remove Service Prime Category
module.exports.remove = function (req, res, next) {
	var service_primecategory_id = req.body.service_primecategory_id;
	//validation
	req.checkBody('service_primecategory_id', 'Service Primecategory Id is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		return res.json({ status: false, error: errors });
	} else {
		Service_primecategory.removeService_primecategory(service_primecategory_id, function (err, primecategory) {
			if (err)
				return res.json({ status: false, error: err });
			if (primecategory) {
				return res.json({ status: true, message: "Service Primecategory Removed Succefully!" });
			} else {
				return res.json({ status: false, message: "Invalid Id" });
			}
		});
	}
}

// Update Status
module.exports.updateStatus = function (req, res) {
	var service_primecategory_id = req.body.service_primecategory_id;
	var status = req.body.status;

	//validation
	req.checkBody('service_primecategory_id', 'Service Primecategory Id is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		return res.json({ status: false, error: errors });
	} else {
		var update = {
			status: status,
			updated_at: Date()
		}
		Service_primecategory.updateService_primecategory({_id: service_primecategory_id }, update, function (err, primecategory) {
			if (err) {
				return res.json({ status: false, error: err })
			} else {
				if(primecategory){
					return res.json({ status: true, message: 'Status Updated Successfully!' });
				} else {
					return res.json({ status: false, message: 'Invlid Id!' });

				}
			}
		});
	}
};

// Get Prime Category Details
module.exports.getAllPrimeCategory_details = function (req, res) {

    var errors = req.validationErrors();

    if (errors) {
        res.json({ status: false, message: "fields are required", error: errors });
    } else {
		db.collection('service_primecategories').aggregate([
		
			{
				$lookup:
				{
					from: "service_categories",
					localField: "service_category_id",
					foreignField: "_id",
                        as: "service_category"
                    }
				},
                {
                    $lookup:
                    {
                        from: "service_subcategories",
                        localField: "service_subcategory_id",
                        foreignField: "_id",
                        as: "service_subcategory"
                    }
				}				
            ]).toArray(function (err, data) {
                if (err) return res.json({ status: false, error: err });
                return res.json({ status: true, response: data });
            });
        }
};