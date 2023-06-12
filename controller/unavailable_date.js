var express = require('express');
var router = express.Router();
var Unavailable_date = require('../models/unavailable_date');


// Add Unavailable Date
module.exports.addDate = function (req, res) {
	var merchant_id = req.body.merchant_id;
	var date = req.body.date;


	//validation
	req.checkBody('merchant_id', 'Merchant Id is required').notEmpty();
	req.checkBody('date', 'date is required').notEmpty();

	var errors = req.validationErrors();
	if (errors) {
		return res.json({ status: false, response: errors });
	} else {
		var newUnavailable_date = new Unavailable_date({
			merchant_id: merchant_id,
			date: date,

			created_at: Date()
		});

		Unavailable_date.createDate(newUnavailable_date, function (err, unavailable_date) {
			if (err) {
				return res.json({ status: false, error: err });
			} else {
				return res.json({ status: true, message: 'Added successfully.', response: unavailable_date });
			}
		});
	}
};

// Get all Unavailable_date
module.exports.getAll = function (req, res) {
	var query = req.body.query;
	var final_query = {};
	if (Object.keys(query).length == 0) {
		final_query = {};
	}
	else {
		if (query.merchant_id) {
			final_query.merchant_id = query.merchant_id;
		}
		if (query.from_date) {
			final_query.created_at = { $gte: new Date(query.from_date)};
		}
	}
	Unavailable_date.getAll(final_query, function (err, unavailable_date) {
		if (err) {
			return res.json({ status: false, error: err });
		} if (unavailable_date.length > 0) {
			return res.json({ status: true, response: unavailable_date });
		} else {
			return res.json({ status: false, message: "No data" });
		}
	});
};

// Get Unavailable_date By Id
module.exports.getDateById = function (req, res, next) {
	unavailable_date_id = req.body.unavailable_date_id;

	//validation
	req.checkBody('unavailable_date_id', 'Unavailable_date id is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		return res.json({ status: false, error: errors });
	} else {
		Unavailable_date.getDateById(unavailable_date_id, function (err, unavailable_date) {
			if (err)
				return res.json({ status: false, error: err });
			if (unavailable_date) {
				return res.json({ status: true, response: unavailable_date });
			} else {
				return res.json({ status: false, message: "Invalid Unavailable date ID" });
			}
		});
	}
};

// Update Unavailable Date
module.exports.updateDate = function (req, res) {

	var unavailable_date_id = req.body.unavailable_date_id;
	var date = req.body.date;


	//validation
	req.checkBody('unavailable_date_id', 'Unavailable_date Id is required').notEmpty();
	req.checkBody('date', 'date is required').notEmpty();

	var errors = req.validationErrors();
	if (errors) {
		res.json({ status: false, error: errors });
	} else {
		var newUnavailable_date = {
			date: date,

			updated_at: Date()
		};

		Unavailable_date.updateUnavailable_Date(unavailable_date_id, newUnavailable_date, function (err, unavailable_date) {
			if (err) {
				return res.json({ status: false, error: err });
			} if (unavailable_date) {
				return res.json({ status: true, message: 'Updated successfully.' });
			} else {
				return res.json({ status: true, message: 'Invalid Id!' });
			}
		});
	}
};

// Remove 
module.exports.removeDate = function (req, res) {

	var unavailable_date_id = req.body.unavailable_date_id;

	Unavailable_date.removeUnavailable_Date(unavailable_date_id, function (err, unavailable_date) {
		if (err) {
			return res.json({ status: false, error: err });
		} if (unavailable_date) {
			return res.json({ status: true, message: "Removed successfully" });
		} else {
			return res.json({ status: true, message: "Invalid Id" });
		}
	});
};