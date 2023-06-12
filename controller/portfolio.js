const jwt = require('jsonwebtoken');
// for aggregation
const config = require('../config/db');
var mongoose = require('mongoose');
mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;

var Portfolio = require('../models/portfolio');

const http = require('http');
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var Filename = "";


//upload image and send image_url
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads/portfolio');
    },
    filename: function (req, file, callback) {
        Filename = file.fieldname + '_' + Date.now() + path.extname(file.originalname);
        callback(null, Filename);
    }
});

var upload = multer({ storage: storage }).single('avatar');

// delete image file
function delimg(imglink) {
    fs.stat('uploads/portfolio/' + imglink, function (err, stats) {
        //here we got all information of file in stats variable
        console.log(stats);

        if (err) {
            return console.error(err);
        }
        fs.unlink('uploads/portfolio/' + imglink, function (err) {
            if (err) {
                console.error(err);
            }
            // if no error, file has been deleted successfully
            console.log('File deleted!');
        });
    });
}

//Add Portfolio
// module.exports.addPortfolio = function (req, res) {
//     var merchant_id = req.body.merchant_id;
//     var service_id = req.body.service_id;
//     var album = req.body.album;
//     var video_link = req.body.video_link;

//     //validation
//     req.checkBody('merchant_id', 'Merchant Id is required').notEmpty();

//     var errors = req.validationErrors();

//     if (errors) res.json({ status: false, message: "Fields are missing.", error: errors });
//     else {
//         var newPortfolio = {
//             merchant_id: merchant_id,
//             service_id: service_id,
//             album: album,
//             video_link: video_link,
//             favourite_portfolio: false,
//             created_at: Date()
//         };

//         Portfolio.createPortfolio({ merchant_id: merchant_id, service_id: service_id }, newPortfolio, function (err, portfolio) {
//             if (err) {
//                 return res.json({ status: false, error: err });
//             } else {
//                 return res.json({ status: true, message: 'Added Successfully!' });
//             }
//         });
//     }
// }

// Get All Portfolio
module.exports.getPortfolioByQuery = function (req, res) {
    var query = req.body.query;

    Portfolio.getPortfolioByQuery(query, function (err, portfolio) {
        if (err) {
            return res.json({ status: false, error: err })
        } if (portfolio.length > 0) {
            return res.json({ status: true, response: portfolio })
        } else {
            return res.json({ status: true, response: [] })
        }
    })
}

module.exports.getPortfolioByQueryforMerchant = function (req, res) {
    var query = req.body.query;

    Portfolio.getPortfolioByQueryforMerchant(query, function (err, portfolio) {
        if (err) {
            return res.json({ status: false, error: err })
        } if (portfolio.length > 0) {
            return res.json({ status: true, response: portfolio })
        } else {
            return res.json({ status: true, response: [] })
        }
    })
}

// Get Portfolio By Id
module.exports.getPortfolioById = function (req, res) {
    var portfolio_id = req.body.portfolio_id;

    //validation
    req.checkBody('portfolio_id', 'Portfolio id is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.json({ status: false, error: errors });
    } else {
        Portfolio.getPortfolioById(portfolio_id, function (err, portfolio) {
            if (err)
                return res.json({ status: false, error: err });
            if (portfolio) {
                return res.json({ status: true, response: portfolio });
            } else {
                return res.json({ status: false, message: "Invalid Portfolio ID" });
            }
        });
    }
}

// Update Portfolio personal details
module.exports.updatePortfolio = function (req, res) {
    var merchant_id = req.body.merchant_id;
    var service_id = req.body.service_id;
    var album = req.body.album;
    var video_link = req.body.video_link;

    //validation
    req.checkBody('merchant_id', 'Merchant id is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.json({ status: false, error: errors });
    } else {
        var update = {
            album: album,
            video_link: video_link,
            approve_status: false,
            updated_at: Date()
        }

        Portfolio.updatePortfolioByQuery({ merchant_id: merchant_id,  service_id: service_id }, update, function (err, portfolio) {
            if (err) {
                return res.json({ status: false, error: err })
            } else {
                return res.json({ status: true, message: 'Portfolio Updated Successfully!' });
            }
        });
    }
};

//Remove Portfolio
module.exports.remove = function (req, res, next) {
    var portfolio_id = req.body.portfolio_id;
    //validation
    req.checkBody('portfolio_id', 'Portfolio id is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.json({ status: false, error: errors });
    } else {
        Portfolio.removePortfolio(portfolio_id, function (err, portfolio) {
            if (err)
                return res.json({ status: false, error: err });
            if (Portfolio) {
                return res.json({ status: true, message: "Portfolio Removed Succefully!" });
            } else {
                return res.json({ status: false, message: "Invalid Id" });
            }
        });
    }
}

// Upload Image and Get File Name
module.exports.upload_image = function (req, res) {
    Filename = "";
    upload(req, res, function (err) {
        if (err) {
            return res.json({ status: false, err: err, message: 'Error uploading file.' });
        } else {
            return res.json({ status: true, image: Filename });
        }
    });
};

// Delete Image
module.exports.remove_Image = function (req, res) {
    var oldimage = req.body.image;
    delimg(oldimage);
    return res.json({ status: true, message: "File removed!" });
};


/// suraj
//Get getPortfolioCategory By Merchant Id
module.exports.getPortfolioCategory = function (req, res) {
	var merchant_id = req.body.merchant_id;

	//validation
	req.checkBody('merchant_id', 'Merchant Id is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		return res.json({ status: false, error: errors });
	} else {
		db.collection('portfolios').aggregate([
			{ $match: { "merchant_id": mongoose.Types.ObjectId(merchant_id) } },
			{
				$lookup:
				{
					from: "service_subcategories",
					localField: "service_id",
					foreignField: "_id",
					as: "service_subcategory"
				}
			}

		]).toArray(function (err, data) {
			if (err) return res.json({ status: false, error: err });
			return res.json({ status: true, response: data });
		});
	}
}

// Update Favourite portfolio
module.exports.updateFavouritePortfolio = function (req, res) {
	var portfolio_id = req.body.portfolio_id;
	var merchant_id = req.body.merchant_id;
	var favourite_portfolio = req.body.favourite_portfolio;

	//validation
	req.checkBody('portfolio_id', 'Portfolio Id is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		return res.json({ status: false, error: errors });
	} else {
		var update = {
			favourite_portfolio: favourite_portfolio,
			updated_at: Date()
		}

		Portfolio.updatePortfolioByQuery({ _id: portfolio_id, merchant_id: merchant_id }, update, function (err, portfolio) {
			if (err) {
				return res.json({ status: false, error: err })
			} else {
				if (portfolio) {
					return res.json({ status: true, message: 'Added to Favourite Successfully!' });
				} else {
					return res.json({ status: false, message: 'Invlid Id!' });

				}
			}
		});
	}
};



//portfolio Approve Status
module.exports.portfolioApproveStatus = function (req, res) {
	var portfolio_id = req.body.portfolio_id;
	var approve_status = req.body.approve_status;

	//validation
	req.checkBody('portfolio_id', 'portfolio id is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		return res.json({ status: false, error: errors });
	} else {
		var update = {
			approve_status: approve_status,
			updated_at: Date()
		}
		Portfolio.updatePortfolioByQuery({ _id: portfolio_id }, update, function (err, portfolio) {
			if (err) {
				return res.json({ status: false, error: err })
			} else {
				if (portfolio) {
					return res.json({ status: true, message: 'Approve Status Updated Successfully!' });
				} else {
					return res.json({ status: true, message: 'Some details are not filled!' });
				}
			}
		});
	}
};