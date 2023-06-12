var mongoose = require('mongoose');

// Portfolio Schema
var PortfolioSchema = mongoose.Schema({
    merchant_id: {
        type: mongoose.Schema.ObjectId
    },
    service_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Service_subcategory'
    },
    album: {
        type: Array
    },
    favourite_service: {
        type: Boolean
    },
    video_link: {
        type: Array
    },
    color_code: {
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
    }
});


PortfolioSchema.index({ merchant_id: 1, service_id: 1 }, { unique: true });

var Portfolio = module.exports = mongoose.model('Portfolio', PortfolioSchema);

// //Add Portfolio
// module.exports.createPortfolio = function (newPortfolio, callback) {
//             newPortfolio.save(callback);    
//     }

//Add Portfolio
module.exports.createPortfolio = function (query, data, callback) {
    Portfolio.updateOne(query, { $set: data }, { upsert: true }, callback);
}

//Get Portfolio List
module.exports.getPortfolioByQuery = function (query, callback, limit) {
    Portfolio.find({ $or: [ query, {'album.1': { $exists:true }, 'video_link.1': { $exists:true } } ]} )
    .sort({ _id: -1 })
    .populate('service_id', 'subcategory_name tagline')
    .exec(callback);
}

module.exports.getPortfolioByQueryforMerchant = function (query, callback) {
    Portfolio.find(query).populate('service_id', 'subcategory_name tagline').exec(callback);

}

//Get Portfolio By Id
module.exports.getPortfolioById = function (id, callback) {
    Portfolio.findOne({ _id: id }, callback);
}

// Update Portfolio By Query
module.exports.updatePortfolioByQuery = function (query, update, options, callback) {
    Portfolio.findOneAndUpdate(query, update, options, callback);
}

// Remove Portfolio
module.exports.removePortfolio = function (id, callback) {
    var query = { _id: id };
    Portfolio.remove(query, callback);
}

