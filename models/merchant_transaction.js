var mongoose = require('mongoose');

// Merchant_transaction Schema
var Merchant_transactionSchema = mongoose.Schema({
    merchant_id: {
        type: mongoose.Schema.ObjectId,
        require: true
    },
	reference_id: {
		type: String
    },
    type: {
        type: String          //  Debit, Credit
    },
    mode: {
        type: String
    },
    ammount: {
        type: Number
    },
    balance: {
        type: Number
    },
    remark: {
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

var Merchant_transaction = module.exports = mongoose.model('Merchant_transaction', Merchant_transactionSchema);

// Add Merchant_transaction
module.exports.createMerchant_transaction = function(newMerchant_transaction, callback){
	newMerchant_transaction.save(callback);
}

// Get Merchant_transaction History By Merchant Id
module.exports.getMerchant_transactionHistory = function(merchant_id, callback, limit){
	Merchant_transaction.find({ merchant_id: merchant_id}, callback).sort({ _id: -1 });
}