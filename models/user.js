var mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// User Schema
var UserSchema = mongoose.Schema({
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    email: {
        type: String
    },
    phone: {
        type: Number,
        unique: true
    },
    otp: {
        type: Number
    },
    image: {
        type: String
    },
    referral_code: {
        type: String,
        unique: true
    },
    referred_from: {
        type: String
    },
    referral_ammount: {
        type: Number,
        default:0
    },
    total_referral: {
        type: Number,
        default: 0
    },
    shoot_money: {
        type: Number,
        default:0
    },
    new_user: {
        type: Boolean
    },
    status: {
        type: Boolean
    },
    block: {
        type: Boolean
    },
    created_at: {
        type: Date
    },
    updated_at: {
        type: Date
    },
    fcm_token: {
        type: String
    }
});

UserSchema.plugin(uniqueValidator);

var User = module.exports = mongoose.model('User', UserSchema);

//Add User
module.exports.createUser = function (newUser, callback) {
            newUser.save(callback);    
    }

//Get User List
module.exports.getUserByQuery = function (query, callback, limit) {
    User.find(query, { otp: 0 }, callback).sort({ _id: -1 });
}

//Get User By Id
module.exports.getUserById = function (id, callback) {
    User.findOne({ _id: id }, { otp: 0 }, callback);
}

//Get User query
module.exports.userByQuery = function (query, callback) {
    User.findOne( query, { otp: 0 }, callback);
}

//Get User By mobile
module.exports.getUserByPhone = function (phone, callback) {
    User.findOne({ phone: phone }, callback);
} 

//verify otp
module.exports.verifyOTP = function (id, phone, otp, callback) {
    User.findOne({ _id: id, phone: phone, otp: otp }, callback);
}

// Update User By Query
module.exports.updateUserByQuery = function(query, update, options, callback) {
	User.findOneAndUpdate(query, update, options, callback);
}
