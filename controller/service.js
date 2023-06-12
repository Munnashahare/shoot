var Service = require('../models/service');
var Portfolio = require('../models/portfolio');

// for aggregation
const config = require('../config/db');
var mongoose = require('mongoose');
mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;

//Add Service
module.exports.addService = function (req, res) {
	var service_category_id = req.body.service_category_id;
	var service_subcategory_id = req.body.service_subcategory_id;
	var service_primecategory_id = req.body.service_primecategory_id;
	var merchant_id = req.body.merchant_id;
	var service_type = req.body.service_type;
	var number_of_photo = req.body.number_of_photo;
	var duration = req.body.duration;
	var hours = req.body.hours;
	var softcopy = req.body.softcopy;
	var rate = req.body.rate;
	var discount = req.body.discount;
	var color_code = req.body.color_code;
	var city = req.body.city;

	//validation
	req.checkBody('service_category_id', 'Service Category id is required').notEmpty();
	req.checkBody('service_subcategory_id', 'Service Subategory id is required').notEmpty();
	req.checkBody('merchant_id', 'Merchant Id is required').notEmpty();
	req.checkBody('service_type', 'Service Type is required').notEmpty();
	//req.checkBody('duration', 'duration is required').notEmpty();
	req.checkBody('hours', ' Hours is required').notEmpty();
	req.checkBody('rate', 'Rate is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) res.json({ status: false, message: "Fields are missing.", error: errors });
	else {
		var newService = new Service({
			service_category_id: service_category_id,
			service_subcategory_id: service_subcategory_id,
			service_primecategory_id: service_primecategory_id,
			merchant_id: merchant_id,
			service_type: service_type,
			number_of_photo: number_of_photo,
			duration: duration,
			hours: hours,
			softcopy: softcopy,
			rate: rate,
			discount: discount,
			favourite_service: false,
			status: false,
			created_at: Date(),
			city: city
		});

		Service.createService(newService, function (err, service) {
			if (err) {
				return res.json({ status: false, error: err });
			} else {
				var newPortfolio = {
					merchant_id: merchant_id,
					service_id: service_subcategory_id,
					color_code: color_code,
					created_at: Date()
				};

				Portfolio.createPortfolio({ merchant_id: merchant_id, service_id: service_subcategory_id }, newPortfolio, function (err, portfolio) {
					if (err) {
						return res.json({ status: false, error: err });
					} else {
						return res.json({ status: true, message: "Service Added Successfuly!", response: service });
					}
				});
			}
		});
	}
}

// Update Service
module.exports.updateService = function (req, res) {
	var service_id = req.body.service_id;
	var service_category_id = req.body.service_category_id;
	var service_subcategory_id = req.body.service_subcategory_id;
	var service_primecategory_id = req.body.service_primecategory_id;
	var service_type = req.body.service_type;
	var number_of_photo = req.body.number_of_photo;
	var duration = req.body.duration;
	var hours = req.body.hours;
	var softcopy = req.body.softcopy;
	var rate = req.body.rate;
	var discount = req.body.discount;
	// var city=req.body.city;

	//validation
	req.checkBody('service_id', 'Service prime category id is required').notEmpty();
	req.checkBody('service_category_id', 'Service Category id is required').notEmpty();
	req.checkBody('service_category_id', 'Service Subcategory id is required').notEmpty();
	req.checkBody('primecategory_name', 'Primecategory Name is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		return res.json({ status: false, error: errors });
	} else {
		var update = {
			service_category_id: service_category_id,
			service_subcategory_id: service_subcategory_id,
			service_primecategory_id: service_primecategory_id,
			service_type: service_type,
			number_of_photo: number_of_photo,
			duration: duration,
			hours: hours,
			softcopy: softcopy,
			rate: rate,
			discount: discount,
			updated_at: Date(),
			// city:city
		}

		Service.updateService({ _id: service_id }, update, function (err, service) {
			if (err) {
				return res.json({ status: false, error: err })
			} else {
				return res.json({ status: true, message: 'Sevice Updated Successfully!' });
			}
		});
	}
};


// Get All Service
module.exports.getService = function (req, res) {
	var query = req.body.query;
	Service.getService(query, function (err, service) {
		if (err) {
			return res.json({ status: false, error: err })
		} else {
			return res.json({ status: true, response: service })
		}
	})
}

// Get Service By Id
module.exports.getServiceById = function (req, res) {
	var service_id = req.body.service_id;

	//validation
	req.checkBody('service_id', 'Service Id is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		return res.json({ status: false, error: errors });
	} else {
		Service.getServiceById(service_id, function (err, service) {
			if (err)
				return res.json({ status: false, error: err });
			if (service) {
				return res.json({ status: true, response: service });
			} else {
				return res.json({ status: false, message: "Invalid ID" });
			}
		});
	}
}

//Remove Service
module.exports.remove = function (req, res, next) {
	var service_id = req.body.service_id;
	//validation
	req.checkBody('service_id', 'Service Id is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		return res.json({ status: false, error: errors });
	} else {
		Service.removeService(service_id, function (err, service) {
			if (err)
				return res.json({ status: false, error: err });
			if (service) {
				return res.json({ status: true, message: "Service Removed Succefully!" });
			} else {
				return res.json({ status: false, message: "Invalid Id" });
			}
		});
	}
}

// Update Status
module.exports.updateStatus = function (req, res) {
	var service_id = req.body.service_id;
	var status = req.body.status;

	//validation
	req.checkBody('service_id', 'Service Id is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		return res.json({ status: false, error: errors });
	} else {
		var update = {
			status: status,
			updated_at: Date()
		}
		Service.updateService({ _id: service_id }, update, function (err, service) {
			if (err) {
				return res.json({ status: false, error: err })
			} else {
				if (service) {
					return res.json({ status: true, message: 'Status Updated Successfully!' });
				} else {
					return res.json({ status: false, message: 'Invlid Id!' });

				}
			}
		});
	}
};


// Get Service Details
module.exports.getAllService_details = function (req, res) {

	var errors = req.validationErrors();

	if (errors) {
		res.json({ status: false, message: "fields are required", error: errors });
	} else {
		db.collection('services').aggregate([

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
			},
			{
				$lookup:
				{
					from: "service_primecategories",
					localField: "service_primecategory_id",
					foreignField: "_id",
					as: "service_primecategory"
				}
			}

		]).toArray(function (err, data) {
			if (err) return res.json({ status: false, error: err });
			return res.json({ status: true, response: data });
		});
	}
};

// Update Favourite Service
module.exports.updateFavouriteService = function (req, res) {
	var service_id = req.body.service_id;
	var merchant_id = req.body.merchant_id;
	var favourite_service = req.body.favourite_service;

	//validation
	req.checkBody('service_id', 'Service Id is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		return res.json({ status: false, error: errors });
	} else {
		var update = {
			favourite_service: favourite_service,
			updated_at: Date()
		}
		Service.updateService({ _id: service_id, merchant_id: merchant_id }, update, function (err, service) {
			if (err) {
				return res.json({ status: false, error: err })
			} else {
				if (service) {
					return res.json({ status: true, message: 'Added to Favourite Successfully!' });
				} else {
					return res.json({ status: false, message: 'Invlid Id!' });

				}
			}
		});
	}
};

//Get service By Merchant Id
module.exports.getServiceByMerchantId = function (req, res) {
	var merchant_id = req.body.merchant_id;

	//validation
	req.checkBody('merchant_id', 'Merchant Id is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		return res.json({ status: false, error: errors });
	} else {
		db.collection('services').aggregate([
			{ $match: { "merchant_id": mongoose.Types.ObjectId(merchant_id), status: true } },
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
			},
			{
				$lookup:
				{
					from: "service_primecategories",
					localField: "service_primecategory_id",
					foreignField: "_id",
					as: "service_primecategory"
				}
			}

		]).toArray(function (err, data) {
			if (err) return res.json({ status: false, error: err });
			return res.json({ status: true, response: data });
		});
	}
}


//Get Merchant By Service Id
module.exports.getMerchantBySubCategory = function (req, res) {
	var service_subcategory_id = req.body.service_subcategory_id;
	var city = req.body.city;

	//validation
	req.checkBody('service_subcategory_id', 'Service Subcategory Id is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		return res.json({ status: false, error: errors });
	} else {
		db.collection('services').aggregate([
			{ $match: { "service_subcategory_id": mongoose.Types.ObjectId(service_subcategory_id), "city": city, status: true } },
			
			{
				$lookup:
				{
					from: "merchants",
					localField: "merchant_id",
					foreignField: "_id",
					as: "merchants"

				},
			},
			{$unwind:'$merchants'},
			{ 
				$group: { 
					"_id": "$merchant_id",
					"name": { $first: "$merchants.name" },
					"city":{$first:"$merchants.city"},
					"brand_name":{$first:"$merchants.brand_name"},
					"banner_image":{$first:"$merchants.banner_image"},
					"rating":{$first:"$merchants.rating"},
					"address":{$first:"$merchants.address"}
				}
			}
		]).toArray(function (err, data) {
			if (err) return res.json({ status: false, error: err });
			return res.json({ status: true, response: data });
		});
	}
}