const config = require('../config/fcm');
const fcm = require('fcm-node');
var Merchant = require('../models/merchant');
var User = require('../models/user');


//merchant fcm token
const setMerchantFcmToken = function (req, res) {
    var merchant_id = req.body.merchant_id;
    var fcm_token = req.body.fcm_token;

    //validation
    req.checkBody('merchant_id', 'merchant_id is required').notEmpty();
    req.checkBody('fcm_token', 'fcm_token is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) return res.json({ status: false, message: "Fields are missing.", error: errors });
    else {
        var updateMerchant = {
            fcm_token: fcm_token,
            updated_at: Date()
        };

        Merchant.updateMerchantByQuery({_id:merchant_id}, updateMerchant, function (err, data) {
            if (err) return res.json({ status: false, message: 'something went wrong.', error: err });
            else {
                console.log(data);
                if (data) return res.json({ status: true, message: 'Merchant FCM Token Updated Successfully!' });
                else return res.json({ status: false, message: 'Merchant FCM Token Not Updated!' });
            }
        });
    }
};


//user FCM token

const setUserFcmToken = function (req, res) {
    var user_id = req.body.user_id;
    var fcm_token = req.body.fcm_token;

    //validation
    req.checkBody('user_id', 'user_id is required').notEmpty();
    req.checkBody('fcm_token', 'fcm_token is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) return res.json({ status: false, message: "Fields are missing.", error: errors });
    else {
        var updateUser = {
            fcm_token: fcm_token,
            updated_at: Date()
        };

       User.updateUserByQuery({_id:user_id}, updateUser, function (err, data) {
            if (err) return res.json({ status: false, message: 'something went wrong.', error: err });
            else {
                console.log(data);
                if (data) return res.json({ status: true, message: 'User FCM Token Updated Successfully!' });
                else return res.json({ status: false, message: 'User FCM Token Not Updated!' });
            }
        });
    }
};




//  send push notification
const sendNotification = function (token, data) {
    var FCM = new fcm(config.serverKey);
    var Tokens = [token];

    let message = {
        registration_ids: Tokens,
        data: data,
        notification: data,
        priority: 'high',
        content_available: true
    };

    FCM.send(message, function (err, response) {
        if (err) {
            console.log(err);
        } else {
            console.log(response);
        }
    });
}

//test api
const test = (req, res) => {
    var _id = "61fbd254ce549028c8e1fda7";
    Merchant.getMerchantById(_id, function (err, merchant) {
        if (err)
            return res.json({ status: false, error: err });
        if (merchant.fcm_token) {
            console.log(merchant.fcm_token)
            sendNotification(merchant.fcm_token, {
                title: 'Notification',
                message: 'New Booking',
                body:"new booking arrived"
            });
            return res.json({ status: true, response: merchant.fcm_token })
        }
        else {
            return res.json({ status: false, message: 'Invalid merchant ID' })
        }
    })
}

module.exports = { sendNotification, test, setMerchantFcmToken,setUserFcmToken }