var Support = require('../models/support');

//Add Support
module.exports.addSupport = function (req, res) {
    var type = req.body.type;
    var user_id = req.body.user_id;
    var description = req.body.description;
    var merchant_id = req.body.merchant_id

    //validation
    req.checkBody('type', 'Type is required').notEmpty();
    req.checkBody('description', 'Description is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) res.json({ status: false, message: "Fields are missing.", error: errors });
    else {
        var newSupport = new Support({
            type: type,
            user_id: user_id,
            merchant_id: merchant_id,
            description: description,
            status: false,
            created_at: Date()
        });

        Support.createSupport(newSupport, function (err, support) {
            console.log(support);
            if (err) {
                return res.json({ status: false, error: err });
            } else {
                return res.json({ status: true, message: "Support Added Successfuly!", response: support });
            }
        });
    }
}

// Get All Support
module.exports.getSupport =  (req, res) => {
    let { query = {} } = req.body;
    Support.getSupport(query, function (err, support) {
        console.log("0000");
        if (err) {
            console.log("1234")
            return res.json({ status: false, error: err })
        } else {
            console.log("5555");
            return res.json({ status: true, response: support })
        }
    });
}

// Get Service Support By Id
module.exports.getSupportById = function (req, res) {
    var support_id = req.body.support_id;

    //validation
    req.checkBody('support_id', 'Support Id is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.json({ status: false, error: errors });
    } else {
        Support.getSupportById(support_id, function (err, support) {
            if (err)
                return res.json({ status: false, error: err });
            if (support) {
                return res.json({ status: true, response: support });
            } else {
                return res.json({ status: false, message: "Invalid Support ID" });
            }
        });
    }
}

//Remove Support
module.exports.remove = function (req, res, next) {
    var support_id = req.body.support_id;
    //validation
    req.checkBody('support_id', 'Support Id is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.json({ status: false, error: errors });
    } else {
        Support.removeSupport(support_id, function (err, support) {
            if (err)
                return res.json({ status: false, error: err });
            if (support) {
                return res.json({ status: true, message: "Support Removed Succefully!" });
            } else {
                return res.json({ status: false, message: "Invalid Id" });
            }
        });
    }
}

// Update Status
module.exports.updateStatus = function (req, res) {
    var support_id = req.body.support_id;
    var status = req.body.status;

    //validation
    req.checkBody('support_id', 'Support Id is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.json({ status: false, error: errors });
    } else {
        var update = {
            status: status,
            updated_at: Date()
        }
        Support.updateSupport({ _id: support_id }, update, function (err, support) {
            if (err) {
                return res.json({ status: false, error: err })
            } else {
                if (support) {
                    return res.json({ status: true, message: 'Status Updated Successfully!' });
                } else {
                    return res.json({ status: false, message: 'Invlid Id!' });

                }
            }
        });
    }
};