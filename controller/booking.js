var Booking = require('../models/booking');
var Merchant = require('../models/merchant');
var Booking_details = require('../models/booking_details');
var Users = require('../models/user');
var Merchant_transaction = require('../models/merchant_transaction');
var FCM = require('./fcm_handler')

// for aggregation
const config = require('../config/db');
var mongoose = require('mongoose');
mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;

function generateBooking(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}




// payment setup
var Razorpay = require('razorpay');
var razorpay_key = require('../config/razorpay');
var instance = new Razorpay(razorpay_key);



//create order
module.exports.createOrder = function (req, res) {

    var amount = req.body.amount;

    req.checkBody('amount', 'amount is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) return res.json({ status: false, message: "Fields are missing.", error: errors });
    else {
        var options = {
            amount: amount,  // amount in the smallest currency unit
            currency: "INR",
            receipt: "customer_payment",
            payment_capture: '1'
        };
        instance.orders.create(options, function (err, order) {
            if (err) return res.json({ status: false, message: 'Error while creating order for customer', error: err });
            if (order) {
                order.key = razorpay_key.key_id;
                return res.json({ status: true, message: 'Order created successfully', response: order });
            }
        });
    }
}

//payment details
module.exports.paymentDetails = function (req, res) {

    var payment_id = req.body.payment_id;
    var booking_id = req.body.booking_id;

    req.checkBody('booking_id', 'booking_id is required').notEmpty();
    req.checkBody('payment_id', 'payment_id is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) return res.json({ status: false, message: "Fields are missing.", error: errors });
    else {
        instance.payments.fetch(payment_id).then((data) => {
            console.log("1");
            if (data) {
                console.log(data);
                var update = {
                    booking_payment_details: data,
                    booking_payment_status: true,
                    updated_at: Date()
                }
                Booking.updateBookingByPaymentStatus({ _id: booking_id }, update, function (err, status) {
                    console.log("2");
                    console.log(status);
                    if (err) {
                        return res.json({ status: false, error: err })
                    } else {
                        return res.json({ status: true, message: 'Payment done successful.' });
                    }
                })
            }
            else return res.json({ status: false, message: 'Unable to fetch payment details' });
        });
    }
}



// Add Booking
module.exports.addBooking = function (req, res) {
    var merchant_id = req.body.merchant_id;
    var user_id = req.body.user_id;
    var booking_date = req.body.booking_date;
    var booking_time = req.body.booking_time;
    var location = req.body.location;
    var address = req.body.address;
    var total_ammount = req.body.total_ammount;
    var place_order = req.body.place_order;
    var delivery_address = req.body.delivery_address;
    var isProduct = req.body.isProduct;



    //validation
    req.checkBody('user_id', 'User Id is required').notEmpty();
    req.checkBody('merchant_id', 'Merchant Id is required').notEmpty();
    // req.checkBody('booking_date', 'Booking Date is required').notEmpty();

    // req.checkBody('booking_time', 'Booking Time is required').notEmpty();


    var errors = req.validationErrors();

    if (errors) {
        res.json({ status: false, response: errors });
    } else {
        var newBooking = new Booking({
            booking_number: "BID" + generateBooking(5),
            merchant_id: merchant_id,
            user_id: user_id,
            booking_date: booking_date,
            booking_time: booking_time,
            location: location,
            address: address,
            total_ammount: total_ammount,
            booking_status: "pending",
            delivery_address: delivery_address,
            isProduct: isProduct,
            created_at: Date(),

        });

        Booking.createBooking(newBooking, function (err, booking) {
            if (err) {
                return res.json({ status: false, error: err });
            } else {
                var total_ammount = 0;
                for (let i = 0; i < place_order.length; i++) {

                    var discount_amount = Math.round((place_order[i].rate * place_order[i].discount) / 100);
                    var final_amount = Math.round(place_order[i].rate - discount_amount);

                    console.log("discount_amount " + discount_amount)
                    console.log("final_amount " + final_amount)

                    total_ammount = total_ammount + final_amount;
                    console.log("total_ammount " + total_ammount)

                    var newBooking_details = new Booking_details({
                        booking_number: booking.booking_number,
                        service_category: place_order[i].service_category,
                        service_subcategory: place_order[i].service_subcategory,
                        service_primecategory: place_order[i].service_primecategory,
                        primecategory_name: place_order[i].primecategory_name,
                        service_name: place_order[i].service_name,
                        service_type: place_order[i].service_type,
                        number_of_photo: place_order[i].number_of_photo,
                        hours: place_order[i].hours,
                        softcopy: place_order[i].softcopy,
                        rate: place_order[i].rate,
                        discount: place_order[i].discount,
                        final_amount: final_amount,
                        created_at: Date(),
                        product_name: place_order[i].product_name,
                        product_description: place_order[i].product_description,
                        product_delivery_day: place_order[i].product_delivery_day,
                        product_delivery_charge: place_order[i].product_delivery_charge,
                        product_quantity: place_order[i].product_quantity,
                        user_feedback: false

                        // isProduct:isProduct

                    })

                    Booking_details.createBooking_details(newBooking_details, function (err, booking_details) {
                        if (err) {
                            return res.json({ status: false, error: err });
                        } else {
                            console.log(booking_details)
                        }
                        if (i == (place_order.length - 1)) {
                            //booking update total amount
                            console.log(newBooking_details);
                            Booking.updateBooking({ _id: booking._id }, { total_ammount: total_ammount }, function (err, amount) {
                                if (err) {
                                    return res.json({ status: false, error: err });
                                } else {
                                    Merchant.getMerchantById(merchant_id, function (err, merchant) {
                                        if (err) return res.json({ status: false, error: err });
                                        else
                                        {
                                            if (merchant.fcm_token) {
                                                console.log("in token block");
                            
                                                console.log(merchant.fcm_token);
                                                FCM.sendNotification(merchant.fcm_token, {
                                                    title: 'Notification',
                                                    message: 'New Booking',
                                                    body: 'New Booking Arrived'
                                                });
                                            }
                                            else console.log('Invalid merchant ID or fcm_token is not found.')
                                            
                                            return res.json({ status: true, message: "Booking Successfull!", response: { booking: booking } });
                                        }
                                    });
                                }
                            });
                        }
                    })
                }
            }
        });
    }
};

// Get all Booking
module.exports.getallBooking = function (req, res) {
    var query = req.body.query;
    Booking.getBooking(query, function (err, booking) {
        if (err) {
            return res.json({ status: false, error: err });
        } if (booking.length > 0) {
            return res.json({ status: true, length: booking.length, response: booking });
        } else {
            return res.json({ status: false, message: "No Data!" });
        }
    });
};

// Get Booking By Id
module.exports.getBookingById = function (req, res) {
    var booking_id = req.body.booking_id;

    //validation
    req.checkBody('booking_id', 'Booking id is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.json({ status: false, error: errors });
    } else {
        Booking.getBookingById(booking_id, function (err, booking) {
            if (err)
                return res.json({ status: false, error: err });
            if (booking) {
                return res.json({ status: true, response: booking });
            } else {
                return res.json({ status: false, message: "Invalid Booking ID" });
            }
        });
    }
};

// Update Status
module.exports.updateStatus = function (req, res) {
    var booking_id = req.body.booking_id;
    var status = req.body.status;

    //validation
    req.checkBody('booking_id', 'Booking Id is required').notEmpty();
    req.checkBody('status', 'Status is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.json({ status: false, error: errors });
    } else {
        Booking.updateBooking({ _id: booking_id }, { status: status }, function (err, booking) {
            if (err) {
                return res.json({ status: false, error: err });
            } else {
                return res.json({ status: true, message: 'Status updated successfully.' });
            }
        });
    }
};

// Accept Booking By Merchant
module.exports.acceptBooking = function (req, res) {
    var merchant_id = req.body.merchant_id;
    var booking_id = req.body.booking_id;


    // validation

    req.checkBody('merchant_id', 'merchant Id is required').notEmpty();
    req.checkBody('booking_id', 'Booking Id is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.json({ status: false, error: errors });
    } else {
        Booking.getBookingById(booking_id, function (err, booking) {
            if (err) return res.json({ status: false, error: err })
            console.log(booking)
            if (booking.booking_status == "accepted") {
                return res.json({ status: false, message: "Already Accepted" })
            }
            if (booking.booking_status == "pending") {
                let otp = "" + Math.floor(1000 + Math.random() * 9000);
                // let otp = "1234";
                Booking.updateBooking({ _id: booking_id }, { merchant_id: merchant_id, booking_status: "accepted", otp: otp, updated_at: Date() }, function (err, booking) {
                    if (err) {
                        return res.json({ status: false, error: err });
                    } else {
                        console.log(booking.user_id);
                        Users.getUserById(booking.user_id, (err, user) => {
                            console.log(user)
                            if (err) return res.json({ status: false, error: err });
                            if (user.fcm_token) {
                                console.log(user.fcm_token)
                                FCM.sendNotification(user.fcm_token, {
                                    title: 'Notification',
                                    message: 'Booking Accepted',
                                    body: "Your Booking Got Accepted"
                                });
                                return res.json({ status: true, message: "Booking has been accepted..", response: booking })
                            }
                            else {
                                return res.json({ status: false, message: "Invalid User ID" });
                            }

                        })
                    }
                })
            }
        })
    }
};

// Reject Booking By Merchant
module.exports.rejectBooking = function (req, res) {
    var merchant_id = req.body.merchant_id;
    var booking_id = req.body.booking_id;

    // validation
    req.checkBody('merchant_id', 'merchant Id is required').notEmpty();
    req.checkBody('booking_id', 'Booking Id is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.json({ status: false, error: errors });
    } else {
        Booking.getBookingById(booking_id, function (err, booking) {
            if (err) return res.json({ status: false, error: err })

            if (booking.booking_status == "rejected") {
                return res.json({ status: false, message: "Already rejected" })
            }
            if (booking.booking_status == "pending") {
                Booking.updateBooking({ _id: booking_id }, { merchant_id: merchant_id, booking_status: "rejected", updated_at: Date() }, function (err, booking) {
                    if (err) {
                        return res.json({ status: false, error: err });
                    } else {
                        return res.json({ status: true, message: "Booking has been rejected successfully.." })
                    }
                })
            } else {
                return res.json({ status: false, message: "Invalid" })

            }
        })
    }
};

// //Cancel Booking By Merchant
// module.exports.cancelBooking = function (req, res) {
//     var cancel_by = req.body.cancel_by;
//     var booking_id = req.body.booking_id;

//     // validation
//     req.checkBody('cancel_by', 'Cancel_by is required').notEmpty();
//     req.checkBody('booking_id', 'Booking Id is required').notEmpty();

//     var errors = req.validationErrors();

//     if (errors) {
//         return res.json({ status: false, error: errors });
//     } else {
//         Booking.getBookingById(booking_id, function (err, booking) {
//             if (err) {
//                 return res.json({ status: false, error: err })
//             } else {
//                 Booking.updateBooking({ _id: booking_id }, { cancel_by: cancel_by, booking_status: "cancelled", updated_at: Date() }, function (err, booking) {
//                     if (err) {
//                         return res.json({ status: false, error: err });
//                     } else {
//                         return res.json({ status: true, message: "Booking calcelled successfully.." })
//                     }
//                 });
//             }
//         })
//     }
// };


//Start Booking
module.exports.startService = function (req, res) {
    var otp = req.body.otp;
    var booking_id = req.body.booking_id;

    // validation
    req.checkBody('booking_id', 'Booking Id is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.json({ status: false, error: errors });
    } else {
        Booking.getBookingById(booking_id, function (err, booking) {
            if (err) {
                return res.json({ status: false, error: err })
            } else {
                console.log(otp)
                console.log(booking)
                if (booking.otp == otp || booking.otp == "1234") {
                    let otp = "" + Math.floor(1000 + Math.random() * 9000);
                    Booking.updateBooking({ _id: booking_id }, { otp: otp, booking_status: "ongoing", updated_at: Date() }, function (err, booking) {
                        if (err) {
                            return res.json({ status: false, error: err });
                        } else {
                            return res.json({ status: true, message: "Service started.." })
                        }
                    });
                } else {
                    return res.json({ status: true, message: "Invalid OTP" })
                }
            }
        })
    }
};


//End Service
module.exports.endService = function (req, res) {
    var otp = req.body.otp;

    var booking_id = req.body.booking_id;

    // validation
    req.checkBody('booking_id', 'Booking Id is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.json({ status: false, error: errors });
    } else {
        Booking.getBookingById(booking_id, function (err, booking) {
            if (err) {
                return res.json({ status: false, error: err })
            } else {
                if (booking.booking_status == "ongoing" && booking.otp == otp) {
                    Booking.updateBooking({ _id: booking_id }, { otp: '', booking_status: "completed", updated_at: Date() }, function (err, booking) {
                        if (err) {
                            return res.json({ status: false, error: err });
                        } else {
                            return res.json({ status: true, message: "Service completed.." })
                        }
                    });
                } else if (booking.booking_status == "completed") {
                    return res.json({ status: true, message: "Services completed.." })
                } else {
                    return res.json({ status: true, message: "Invalid OTP" })
                }
            }
        });
    }
};

//Rating And Feedback by User
module.exports.feedbackByUser = function (req, res) {
    var booking_id = req.body.booking_id;
    var user_id = req.body.user_id;
    var rating = req.body.rating;
    var feedback = req.body.feedback;

    //validation
    req.checkBody('booking_id', 'Booking Id is required').notEmpty();
    req.checkBody('user_id', 'User Id is required').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.json({ status: false, message: "fields are required", error: errors });
    } else {
        var query = {
            _id: booking_id,
            user_id: user_id
        }
        var update = {
            rating: rating,
            feedback: feedback,

            updated_at: Date(),
        }

        Booking.updateBooking(query, update, function (err, result) {
            if (err) {
                return res.json({ status: false, error: err });
            } else {
                if (result) {
                    console.log(result)
                    db.collection('bookings').aggregate([
                        { $match: { "merchant_id": mongoose.Types.ObjectId(result.merchant_id) } },
                        { $group: { "_id": "$merchant_id", "avg": { $avg: "$rating" } } }
                    ]).toArray(function (err, data) {
                        if (err) return res.json(err);
                        console.log("total rating");
                        console.log(data);

                        let rate = (Math.floor(data[0].avg * 10)) / 10;
                        console.log(rate);
                        var query = { _id: result.merchant_id }
                        var update = { rating: rate };

                        Merchant.updateMerchantByQuery( query, update , function (err, updatemerchant) {
                                if (err)
                                    return res.json({ status: false, error: err });
                                else if (updatemerchant) {
                                    console.log("111111111")
                                    Booking_details.updateBookingDetails({ booking_number: result.booking_number }, { user_feedback: true }, (err, updateFeedback) => {
                                        if (err) return res.json({ status: false, error: err });
                                        else return res.json({ status: true, message: "rating successfully" });
                                    })

                                } else {
                                    return res.json({ status: false, message: "Unable to set rating" });
                                }
                            }
                        );
                    });



                } else {
                    return res.json({ status: false, "message": "Invalid Id" })

                }
            }
        });
    }
};


// Get Booking Details
module.exports.bookingDetails = function (req, res) {
    var booking_number = req.body.booking_number;

    //validation
    req.checkBody('booking_number', 'Booking Number is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.json({ status: false, message: "fields are required", error: errors });
    }
    else {
        db.collection('bookings').aggregate([
            { $match: { "booking_number": booking_number } },
            {
                $lookup:
                {
                    from: "booking_details",
                    localField: "booking_number",
                    foreignField: "booking_number",
                    as: "booking_details"
                }
            },
            {
                $lookup:
                {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "customer"
                }
            },
            {
                $lookup:
                {
                    from: "merchants",
                    localField: "merchant_id",
                    foreignField: "_id",
                    as: "merchant"
                }
            },
        ]).toArray(function (err, data) {
            if (err) return res.json({ status: false, error: err });
            return res.json({ status: true, response: data });
        });
    }
};


// Get Booking Details
module.exports.getAllBookingByMerchantId = function (req, res) {
    var merchant_id = req.body.merchant_id;
    var booking_status = req.body.booking_status;

    //validation
    req.checkBody('merchant_id', 'Merchant Id is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.json({ status: false, message: "fields are required", error: errors });
    } else {
        db.collection('bookings').aggregate([
            { $match: { "merchant_id": mongoose.Types.ObjectId(merchant_id), "booking_status": booking_status } },
            {
                $lookup:
                {
                    from: "booking_details",
                    localField: "booking_number",
                    foreignField: "booking_number",
                    as: "booking_details"
                }

            },
            {
                $lookup:
                {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "customer"
                }
            },
            // {
            //     $sort: {booking_date:-1}
            // }
        ]).toArray(function (err, data) {
            if (err) return res.json({ status: false, error: err });
            return res.json({ status: true, response: data });
        });
    }
};

// Get Booking Details
module.exports.getAllBookingByUserId = function (req, res) {
    var user_id = req.body.user_id;
    var booking_status = req.body.booking_status;

    //validation
    req.checkBody('user_id', 'User Id is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.json({ status: false, message: "fields are required", error: errors });
    } else {
        db.collection('bookings').aggregate([
            { $match: { "user_id": mongoose.Types.ObjectId(user_id), "booking_status": booking_status } },
            {
                $lookup:
                {
                    from: "booking_details",
                    localField: "booking_number",
                    foreignField: "booking_number",
                    as: "booking_details"
                }
            },
            {
                $lookup:
                {
                    from: "merchants",
                    localField: "merchant_id",
                    foreignField: "_id",
                    as: "merchant"
                }
            }
        ]).toArray(function (err, data) {
            if (err) return res.json({ status: false, error: err });
            return res.json({ status: true, response: data });
        });
    }
};

// Get Merchant Booking Count
module.exports.bookingCount = function (req, res) {
    var merchant_id = req.body.query.merchant_id;

    //validation
    req.checkBody('merchant_id', 'Merchant Id is required').notEmpty();

    db.collection('bookings').find({ "merchant_id": mongoose.Types.ObjectId(merchant_id), booking_status: 'completed' }).count().then((cmp_bookings) => {
        db.collection('bookings').find({ "merchant_id": mongoose.Types.ObjectId(merchant_id), "booking_status": 'cancelled' }).count().then((cmpp_bookings) => {
            db.collection('services').find({ "merchant_id": mongoose.Types.ObjectId(merchant_id) }).count().then((services) => {
                db.collection('bookings').find({ "merchant_id": mongoose.Types.ObjectId(merchant_id), "booking_status": 'pending' }).count().then((pending_booking) => {

                    return res.json({ status: true, response: { completed_bookings: cmp_bookings, cancelled_booking: cmpp_bookings, services: services, pending_booking: pending_booking } });

                })
            })
        })
    })

    // var errors = req.validationErrors();

    // if (errors) {
    //     res.json({ status: false, message: "fields are required", error: errors });
    // } else {
    //     Booking.getBooking(query, function (err, booking) {
    //         if (err) {
    //             return res.json({ status: false, error: err });
    //         } if (booking.length > 0) {
    //             return res.json({ status: true, no_of_booking: booking.length });
    //         } else {
    //             return res.json({ status: false, message: "No Data!" });
    //         }
    //     });
    // }
};


// Cancel Booking By Merchant
module.exports.cancelBooking = function (req, res) {
    var booking_id = req.body.booking_id;

    // validation
    req.checkBody('booking_id', 'Booking Id is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.json({ status: false, error: errors });
    } else {
        Booking.getBookingById(booking_id, function (err, booking) {
            if (err) {
                return res.json({ status: false, error: err })
            } else {
                if (booking) {
                    Booking.updateBooking({ _id: booking_id }, { cancel_by: "merchant", booking_status: "cancelled", cancellation_charge: 10, updated_at: Date() }, function (err, updatebooking) {
                        if (err) {
                            return res.json({ status: false, error: err });
                        } else {
                            console.log(updatebooking)
                            console.log("cancelled")
                            Merchant.getMerchantById(booking.merchant_id, function (err, merchant) {
                                if (err)
                                    return res.json({ status: false, error: err });
                                if (merchant) {
                                    Merchant.updateMerchantByQuery({ _id: booking.merchant_id }, { shoot_money: merchant.shoot_money - 10, updated_at: Date() }, function (err, updatemerchant) {
                                        if (err) {
                                            return res.json({ status: false, error: err });
                                        } if (updatemerchant) {
                                            console.log("121212")
                                            console.log(updatemerchant)
                                            var newMerchant_transaction = new Merchant_transaction({
                                                merchant_id: booking.merchant_id,
                                                reference_id: booking_id,
                                                type: "debit",
                                                mode: "cancel booking",
                                                remark: "₹ " + 10 + "Deducted From Wallet for Cancellation",
                                                balance: merchant.shoot_money - 10,
                                                created_at: Date()
                                            });
                                            Merchant_transaction.createMerchant_transaction(newMerchant_transaction, function (err, transaction) {
                                                if (err) return res.json({ status: false, error: err });
                                                if (transaction) {
                                                    Users.getUserById(booking.user_id, (err, user) => {
                                                        if (err) return res.json({ status: false, error: err });
                                                        if (user.fcm_token) {
                                                            FCM.sendNotification(user.fcm_token, {
                                                                title: 'Notification',
                                                                message: "Booking Cancelled",
                                                                body: 'Your Booking Got Cancelled'
                                                            });
                                                            return res.json({ status: true, message: "Booking cancelled successfully.." })

                                                        }
                                                        else return res.json({ status: true, message: "Invalid User Id!" })

                                                    })

                                                } else {
                                                    return res.json({ status: false, message: 'Something went wrong!' });
                                                }
                                            })
                                        } else {
                                            return res.json({ status: false, message: 'Not able to update merchant money!' });

                                        }
                                    })

                                }
                            })
                        }
                    });
                } else {
                    return res.json({ status: true, message: "Invalid Booking Id!" })
                }
            }
        });
    }
};


// Total Earning
module.exports.totalEarning = function (req, res) {
    var merchant_id = req.body.merchant_id;

    //validation
    req.checkBody('merchant_id', 'Merchant Id is required').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.json({ status: false, message: "fields are required", error: errors });
    } else {
        db.collection('bookings').aggregate([
            {
                $match: {
                    "merchant_id": mongoose.Types.ObjectId(merchant_id),
                    "booking_status": 'completed'
                }
            },
            {
                $group: {
                    _id: null,
                    total_earning: { $sum: "$total_ammount" }
                }
            }
        ]).toArray(function (err, data) {
            if (err) return res.json(err);
            else {
                return res.json({ status: true, response: data })
            }
        });
    }
};




// Total Cancellation Amount
module.exports.cancellation_amount = function (req, res) {
    var merchant_id = req.body.merchant_id;

    //validation
    req.checkBody('merchant_id', 'Merchant Id is required').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.json({ status: false, message: "fields are required", error: errors });
    } else {
        db.collection('bookings').aggregate([
            {
                $match: {
                    "merchant_id": mongoose.Types.ObjectId(merchant_id),
                    "booking_status": 'cancelled'
                }
            },
            {
                $group: {
                    _id: null,
                    cancellation_charges: { $sum: "$cancellation_charge" }
                }
            }
        ]).toArray(function (err, data) {
            if (err) return res.json(err);
            else {
                return res.json({ status: false, response: data })
            }
        });
    }
};


// Near By Event
// module.exports.nearByEvents = function (req, res) {
//     var query = req.body.query;
//     // var long = req.body.query;
//     // var lat = req.body.query;
//     Booking.getBooking(query, function (err, booking) {
//         if (err) {
//             return res.json({ status: false, error: err });
//         } if (booking.length > 0) {
//             return res.json({ status: true, length: booking.length, response: booking });
//         } else {
//             return res.json({ status: false, message: "No Data!" });
//         }
//     });
// };

module.exports.getLiveEvent = function (req, res) {
    var location = req.body.location;

    Booking.getLiveEvent({ location: location }, (err, booking) => {
        if (err) {
            return res.json({ status: false, error: err })
        }
        else {
            return res.json({ status: true, response: booking })

        }
    })
}

