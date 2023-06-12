var City = require('../models/city');

//Add City
module.exports.addCity = function (req, res) {
    var name = req.body.name;
    var type = req.body.type;
    var ammount = req.body.ammount;

    //validation
    req.checkBody('name', 'Name is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) res.json({ status: false, message: "Fields are missing.", error: errors });
    else {
        if (type == 0) {
            var newCity = new City({
                name: name,
                type: type,
                ammount: 0,
                status: false,
                created_at: Date()
            });
        } if (type == 1) {
            var newCity = new City({
                name: name,
                type: type,
                ammount: ammount,
                status: false,
                created_at: Date()
            });
        }
        City.createCity(newCity, function (err, city) {
            if (err) {
                if (err.errors.name) {
                    return res.json({ status: false, message: "City already exits!" });
                }
                return res.json({ status: false, error: err });
            } else {
                return res.json({ status: true, message: "City Added Successfuly!" });
            }
        });
    }
}

// Update City
module.exports.updateCity = function (req, res) {
    var city_id = req.body.city_id;
    var name = req.body.name;
    var type = req.body.type;
    var ammount = req.body.ammount;

    //validation
    req.checkBody('city_id', 'Service City id is required').notEmpty();
    req.checkBody('name', 'Name is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.json({ status: false, error: errors });
    } else {
        var update = {
            name: name,
            type: type,
            ammount: ammount,
            updated_at: Date()
        }

        City.updateCity({ _id: city_id }, update, function (err, city) {
            if (err) {
                return res.json({ status: false, error: err })
            } else {
                return res.json({ status: true, message: 'City Updated Successfully!' });
            }
        });
    }
};


// Get All City
module.exports.getCity = function (req, res) {
    var query = req.body.query;
    City.getCity(query, function (err, city) {
        if (err) {
            return res.json({ status: false, error: err })
        } if (city.length > 0) {
            return res.json({ status: true, response: city })
        } else {
            return res.json({ status: false, message: "No Data" })
        }
    });
}

// Get Service City By Id
module.exports.getCityById = function (req, res) {
    var city_id = req.body.city_id;

    //validation
    req.checkBody('city_id', 'City Id is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.json({ status: false, error: errors });
    } else {
        City.getCityById(city_id, function (err, city) {
            if (err)
                return res.json({ status: false, error: err });
            if (city) {
                return res.json({ status: true, response: city });
            } else {
                return res.json({ status: false, message: "Invalid City ID" });
            }
        });
    }
}

//Remove City
module.exports.remove = function (req, res, next) {
    var city_id = req.body.city_id;
    //validation
    req.checkBody('city_id', 'City Id is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.json({ status: false, error: errors });
    } else {
        City.removeCity(city_id, function (err, city) {
            if (err)
                return res.json({ status: false, error: err });
            if (city) {
                return res.json({ status: true, message: "City Removed Succefully!" });
            } else {
                return res.json({ status: false, message: "Invalid Id" });
            }
        });
    }
}

// Update Status
module.exports.updateStatus = function (req, res) {
    var city_id = req.body.city_id;
    var status = req.body.status;

    //validation
    req.checkBody('city_id', 'City Id is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.json({ status: false, error: errors });
    } else {
        var update = {
            status: status,
            updated_at: Date()
        }
        City.updateCity({ _id: city_id }, update, function (err, city) {
            if (err) {
                return res.json({ status: false, error: err })
            } else {
                if (city) {
                    return res.json({ status: true, message: 'Status Updated Successfully!' });
                } else {
                    return res.json({ status: false, message: 'Invlid Id!' });

                }
            }
        });
    }
};