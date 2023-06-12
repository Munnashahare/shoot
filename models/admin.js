var mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
var bcrypt = require('bcryptjs');

// Admin Schema
var AdminSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        unique: true,
        index: true
    },
    image: {
        type: String
    },
    department: {
        type: String
    },
    type: {
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

AdminSchema.plugin(uniqueValidator);

var Admin = module.exports = mongoose.model('Admin', AdminSchema);

//Add Admin
module.exports.createAdmin = function (newAdmin, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newAdmin.password, salt, function (err, hash) {
            newAdmin.password = hash;
            newAdmin.save(callback);
        });
    });
}

//Get Admin List
module.exports.getAdmin = function (callback, limit) {
    Admin.find({ type: {$gt: 0} }, { password: 0 }, callback).sort({ _id: -1 });
}

//get Admin By Id
module.exports.getAdminById = function (id, callback) {
    Admin.findById({ _id: id }, { password: 0 }, callback);
}

//Get Admin By Mobile
module.exports.getAdminByMobile = function (mobile, callback) {
    Admin.findOne({ mobile: mobile }, { password : 0 }, callback);
}

//Get Admin By Email
module.exports.getAdminByEmail = function (email, callback) {
    Admin.findOne({ email: email }, callback);
}

// Compare Password
module.exports.comparePassword = function(adminPassword, hash, callback){
	bcrypt.compare(adminPassword, hash, function(err, isMatch) {
		console.log(adminPassword);
		console.log(hash)
		if(err) throw err;
    	callback(null, isMatch);
	});
}

// Update Admin
module.exports.updateAdmin = function(id, update, options, callback) {
    var query = { _id: id };
	Admin.findOneAndUpdate(query, update, options, callback);
}

// Update Password
module.exports.updatePassword = function(email, password, options, callback) {
    var query = { email: email };
    var update = {
        password: password,
        updated_at: Date()
    };
    bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(update.password, salt, function(err, hash) {
	        update.password = hash;
	        Admin.findOneAndUpdate(query, update, options, callback);
	    });
	});
}

// Remove Admin
module.exports.removeAdmin = function(id, callback) {
    var query = { _id: id };
    Admin.remove(query, callback);
}