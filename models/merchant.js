const { query } = require('express');
var mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Merchant Schema
var MerchantSchema = mongoose.Schema({
    name: {
        type: String,
        index: true
    },
    m_id: {
        type: String
    },
    business_email: {
        type: String,
        index: true
    },
    phone: {
        type: Number,
        unique: true,
        index: true
    },
    otp: {
        type: Number
    },
    brand_name: {
        type: String
    },
    temp_brand_name: {
        type: String
    },
    business_address: {
        type: String
    },
    image: {
        type: String
    },
    pan_card_image: {
        type: String
    },
    aadhar_card_image: {
        type: Array
    },
    pan_card_number: {
        type: String
    },
    aadhar_card_number: {
        type: String
    },
    document_name: {
        type: String
    },
    current_address: {
        type: String
    },
    permanent_address: {
        type: String
    },
    bank_name: {
        type: String
    },
    account_holder_name: {
        type: String
    },
    account_number: {
        type: String
    },
    ifsc: {
        type: String
    },
    type: {
        type: Number                // 1 for individual, 2 for company
    },
    gst_number: {
        type: String
    },
    location: {
        type: [Number],
        index: '2d'
    },
    address: {
        type: Object
    },
    city: {
        type: String
    },
    description: {
        type: String
    },
    status: {
        type: Boolean
    },
    personal_detail_status: {
        type: Boolean
    },
    identity_proof_detail_status: {
        type: Boolean
    },
    bank_detail_status: {
        type: Boolean
    },
    business_detail_status: {
        type: Boolean
    },
    online_status: {
        type: Boolean
    },
    service_status: {
        type: Boolean
    },
    rating: {
        type: Number
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
        default: 0
    },
    total_referral: {
        type: Number,
        default: 0
    },
    shoot_money: {
        type: Number,
        default: 0
    },
    subscription_id: {
        type: mongoose.Schema.ObjectId
    },
    subscription_details: {
        type: Object
    },
    subscription_payment: {
        type: Object
    },
    view_count: {
        type: Number,
        default: 0
    },
    available_timing: {
        type: Object
    },
    block: {
        type: Boolean
    },
    instant_available: {
        type: Boolean
    },
    registration_payment_status: {
        type: Boolean
    },
    registration_payment: {
        type: Object
    },
    registration_payment: {
        type: Object
    },
    banner_image: {
        type: String
    },
    temp_banner_image: {
        type: String
    },
    approve_status: {
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

MerchantSchema.plugin(uniqueValidator);

var Merchant = module.exports = mongoose.model('Merchant', MerchantSchema);

//Add Merchant
module.exports.createMerchant = function (newMerchant, callback) {
    newMerchant.save(callback);
}

//Get Merchant List
module.exports.getMerchantByQuery = function (query, callback, limit) {
    Merchant.find(query, { otp: 0 }, callback).sort({ _id: -1 });
}

//Get Single Merchant 
module.exports.merchantByQuery = function (query, callback, limit) {
    Merchant.findOne(query, { otp: 0 }, callback).sort({ _id: -1 });
}
//Get merchant By Id
module.exports.getMerchantById = function (id, callback) {
    Merchant.findOne({ _id: id }, { otp: 0 }, callback);
}

//Get Merchant By mobile
module.exports.getMerchantByPhone = function (phone, callback) {
    Merchant.findOne({ phone: phone }, callback);
}

//verify otp
module.exports.verifyOTP = function (id, phone, otp, callback) {
    Merchant.findOne({ _id: id, phone: phone, otp: otp }, callback);
}

// Update Merchant By Query
module.exports.updateMerchantByQuery = function (query, update, options, callback) {
    Merchant.findOneAndUpdate(query, update, options, callback);
}

//nearByMerchant
var max_distance = 5 / 111.12;

module.exports.getNearByMerchant = function (user, callback) {
    Merchant.find({
        city: user.city,
        status: true,

        location: { $near: user.location, $maxDistance: max_distance },
        // current_location_updated_at: { $gt: new Date().getTime() - (10 * 60 * 1000) }
    },
        // { _id: 1, vehicle_type: 1, online: 1, currentStatus: 1, current_location: 1, current_address: 1, fcm_token: 1 }, callback).sort({ _id: -1 });
        { _id: 1, name: 1, online_status: 1, brand_name: 1, address: 1, rating: 1, banner_image: 1 }, callback)
}


// module.exports.getNearByMerchant=function(query,callback){
//     Merchant.find(query,callback);
// }
//get all merchant with temp_brand_name
module.exports.allMerchant_temp_brand_name = function (callback) {
    Merchant.find({ $and: [{ 'temp_brand_name': { $exists: true, $ne: null } }, { 'temp_brand_name': { $exists: true, $ne: "" } }] }, { name: 1, phone: 1, business_email: 1, brand_name: 1, temp_brand_name: 1 }, callback);
}

//get all merchant with temp_banner_image
module.exports.allMerchant_temp_banner_image = function (callback) {
    Merchant.find({ $and: [{ 'temp_banner_image': { $exists: true, $ne: null } }, { 'temp_banner_image': { $exists: true, $ne: "" } }] }, { name: 1, phone: 1, business_email: 1, banner_image: 1, temp_banner_image: 1 }, callback);
}

module.exports.search_merchant = function (query, callback) {
    Merchant.find(query, callback);
}
module.exports.getExploreMerchant = (query, callback) => {

    Merchant.find(query, callback);
}

// /getSubscribers
module.exports.getSubscribers = function (callback) {
    Merchant.find({ 'subscription_id': { $exists: true, $ne: null } }, callback);
}
