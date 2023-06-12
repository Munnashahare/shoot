var Subscription = require('../models/subscription');

//Add Subscription
module.exports.addSubscription = function (req, res) {
    var name = req.body.name;
    var description = req.body.description;
    var ammount = req.body.ammount;
    var discount = req.body.discount;
    var duration = req.body.duration;

    //validation
    req.checkBody('name', 'Name is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) res.json({ status: false, message: "Fields are missing.", error: errors });
    else {
            var newSubscription = new Subscription({
                name: name,
                description: description,
                ammount: ammount,
                discount: discount,
                duration: duration,
                status: false,
                created_at: Date()
            });

        Subscription.createSubscription(newSubscription, function (err, subscription) {
            if (err) {
                if (err.errors.name) {
                    return res.json({ status: false, message: "Subscription already exits!" });
                }
                return res.json({ status: false, error: err });
            } else {
                return res.json({ status: true, message: "Subscription Added Successfuly!" });
            }
        });
    }
}

// Update Subscription
module.exports.updateSubscription = function (req, res) {
    var subscription_id = req.body.subscription_id;
    var name = req.body.name;
    var description = req.body.description;
    var ammount = req.body.ammount;
    var discount = req.body.discount;
    var duration = req.body.duration;

    //validation
    req.checkBody('subscription_id', 'Service Subscription id is required').notEmpty();
    req.checkBody('name', 'Name is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.json({ status: false, error: errors });
    } else {
        var update = {
            name: name,
            description: description,
            ammount: ammount,
            discount: discount,
            duration: duration,
            updated_at: Date()
        }

        Subscription.updateSubscription({ _id: subscription_id }, update, function (err, subscription) {
            if (err) {
                return res.json({ status: false, error: err })
            } else {
                return res.json({ status: true, message: 'Subscription Updated Successfully!' });
            }
        });
    }
};


// Get All Subscription
module.exports.getSubscription = function (req, res) {
    var query = req.body.query;
    Subscription.getSubscription(query, function (err, subscription) {
        if (err) {
            return res.json({ status: false, error: err })
        } if (subscription.length > 0) {
            return res.json({ status: true, response: subscription })
        } else {
            return res.json({ status: false, message: "No Data" })
        }
    });
}

// Get Subscription by Id
module.exports.getSubscriptionById = function (req, res) {
    var subscription_id = req.body.subscription_id;
    Subscription.getSubscriptionById({_id: subscription_id}, function (err, subscription) {
        if (err) {
            return res.json({ status: false, error: err })
        } if (subscription) {
            return res.json({ status: true, response: subscription })
        } else {
            return res.json({ status: false, message: "No Data" })
        }
    });
}

//Remove Subscription
module.exports.remove = function (req, res, next) {
    var subscription_id = req.body.subscription_id;
    //validation
    req.checkBody('subscription_id', 'Subscription Id is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.json({ status: false, error: errors });
    } else {
        Subscription.removeSubscription(subscription_id, function (err, subscription) {
            if (err)
                return res.json({ status: false, error: err });
            if (subscription) {
                return res.json({ status: true, message: "Subscription Removed Succefully!" });
            } else {
                return res.json({ status: false, message: "Invalid Id" });
            }
        });
    }
}

// Update Status
module.exports.updateStatus = function (req, res) {
    var subscription_id = req.body.subscription_id;
    var status = req.body.status;

    //validation
    req.checkBody('subscription_id', 'Subscription Id is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.json({ status: false, error: errors });
    } else {
        var update = {
            status: status,
            updated_at: Date()
        }
        Subscription.updateSubscription({ _id: subscription_id }, update, function (err, subscription) {
            if (err) {
                return res.json({ status: false, error: err })
            } else {
                if (subscription) {
                    return res.json({ status: true, message: 'Status Updated Successfully!' });
                } else {
                    return res.json({ status: false, message: 'Invlid Id!' });

                }
            }
        });
    }
};