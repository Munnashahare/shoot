var mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

var Bannerdetail_Schema = mongoose.Schema({
    type: {
        type: Number
    },
    banner_status: {
        type: Boolean,
        default:false
    },
    banner_img: {
        type: String
    },
    created_at: {
        type: Date
    },
    updated_at: {
        type: Date
    }
});

Bannerdetail_Schema.plugin(uniqueValidator);

var Banner = module.exports = mongoose.model('Banner', Bannerdetail_Schema);

//Add Banner
module.exports.createBanner = function (newBanner, callback) {
    newBanner.save(callback);
}

//update banner
module.exports.updateBanner = (query, data, callback) => {
    Banner.findOneAndUpdate(query, data, callback)
}
//remove banner
module.exports.removeBanner = (query, callback) => {
    Banner.remove(query, callback);
}


// get all banner
module.exports.getBanner = (query, callback) => {
    Banner.find(query, callback);
}