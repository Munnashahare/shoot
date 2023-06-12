var mongoose = require('mongoose');

// Subscription Schema
var SubscriptionSchema = mongoose.Schema({
  
    name: {
        type: String
    },
    description: {
         type: String
    },
    ammount: {
        type: Number,
    },
    discount: {
        type: Number, 
    },
    subscription_date: {
        type: Date, 
    },
    duration: {
        type: String
    },
    status: {
        type: Boolean
    },
	created_at: {
		type: Date
	  },
	updated_at: {
		type: Date
	  }
});


var Subscription = module.exports = mongoose.model('Subscription', SubscriptionSchema);

// Add Subscription Request
module.exports.createSubscription = function (newSubscription, callback) {
    newSubscription.save(callback);
}

// Get All Subscription 
module.exports.getSubscription = function(query, callback, limit) {
    Subscription.find(query, callback).sort({_id:-1});
}

// Get Subscription By Id
module.exports.getSubscriptionById = function(query, callback, limit) {
    Subscription.findOne(query, callback);
}

// Update Subscription
module.exports.updateSubscription = function (query, update, options, callback) {
    Subscription.findOneAndUpdate(query, update, options, callback);
}

// Remove Booking_details
module.exports.removeSubscription = function (id, callback) {
    var query = { _id: id };
    Subscription.remove(query, callback);
}
