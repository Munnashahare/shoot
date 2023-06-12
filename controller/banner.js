var Banner = require('../models/banner');
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var Filename = "";


//upload image and send image_url
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads/banner');
    },
    filename: function (req, file, callback) {
        Filename = file.fieldname + '_' + Date.now() + path.extname(file.originalname);
        callback(null, Filename);
    }
});

var upload = multer({ storage: storage }).single('avatar');

// delete image file
function delimg(imglink) {
    fs.stat('uploads/banner/' + imglink, function (err, stats) {
        //here we got all information of file in stats variable
        console.log(stats);

        if (err) {
            return console.error(err);
        }
        fs.unlink('uploads/banner/' + imglink, function (err) {
            if (err) {
                console.error(err);
            }
            // if no error, file has been deleted successfully
            console.log('File deleted!');
        });
    });
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
    var oldimage = req.body.oldimage;
    delimg(oldimage);
    return res.json({ status: true, message: "File removed!" });
};

//Add banner
module.exports.addBanner = function (req, res) {
    var banner_img = req.body.banner_img;
    var type = req.body.type;
    let banner_status = req.body.banner_status;

    //validation
    req.checkBody('banner_img', 'Banner Img is required').notEmpty();
    req.checkBody('type', 'type is required').notEmpty();
    req.checkBody('banner_status', 'Banner Img is required').notEmpty();
    var errors = req.validationErrors();
    if (errors)
        return res.json({ status: false, response: errors });
    else {
        let newBanner = new Banner({
            banner_img: banner_img,
            banner_status: banner_status,
            created_at: Date(),
            updated_at: Date(),
            type: type

        });
        Banner.createBanner(newBanner, function (err, result) {
            if (err) return res.json({ status: false, error: err });
            else return res.json({ status: true, response: result });
        })
    }
}
//update banner
module.exports.updateBanner = function (req, res) {
    let banner_id = req.body.banner_id;
    let banner_img = req.body.banner_img;
    let oldimage = req.body.oldimage
    let banner_status = req.body.banner_status;
    let type = req.body.type;

    //validation
    req.checkBody('banner_id', 'Banner_id is required').notEmpty();
    req.checkBody('banner_img', 'Banner Img is required').notEmpty();
    req.checkBody('type', 'type is required').notEmpty();
    req.checkBody('banner_status', 'banner_status is required').notEmpty();
    var errors = req.validationErrors();
    if (errors)
        return res.json({ status: false, response: errors });
    else {
        Banner.updateBanner({ _id: banner_id }, { banner_img: banner_img, banner_status: banner_status, type: type }, function (err, banner) {
            if (banner) {
                if (oldimage) delimg(oldimage);

                return res.json({
                    status: true,
                    message: "update success"
                });
            } else {
                return res.json({ status: false, message: "Can't update" });
            }

        })
    }

}

//delete banner
module.exports.removeBanner = function (req, res) {
    let banner_id = req.body.banner_id;
    var banner_img = req.body.banner_img;

    //validation
    req.checkBody('banner_id', 'Banner_id is required').notEmpty();
    req.checkBody('banner_img', 'Banner Img is required').notEmpty();
    var errors = req.validationErrors();
    if (errors)
        return res.json({ status: false, response: errors });
    else {
        Banner.removeBanner({ _id: banner_id }, function (err, banner) {
            if (banner) {
                delimg(banner_img);
                return res.json({
                    status: true,
                    response: banner,
                    message: "removed success"
                });
            } else {
                return res.json({ status: false, response: err });
            }
        })
    }
}

//get all the banner
module.exports.getAllBanner = function (req, res) {
    let { query = {} } = req.body;
    Banner.getBanner(query, (err, result) => {
        res.json({ status: true, response: result });
    })
}

//update status
module.exports.updateStatus = function (req, res) {
    let banner_id = req.body.banner_id;
    let banner_status = req.body.banner_status;

    req.checkBody('banner_id', 'Banner_id is required').notEmpty();
    req.checkBody('banner_status', 'Banner status is required').notEmpty();
    var errors = req.validationErrors();
    if (errors)
        return res.json({ status: false, response: errors });
    else {
        Banner.updateBanner({ _id: banner_id }, { banner_status: banner_status }, function (err, banner) {
            if (banner) {
                return res.json({
                    status: true,
                    message: " status updated successfully"
                });
            } else {
                return res.json({ status: false, message: "Can't update" });
            }

        })
    }

}