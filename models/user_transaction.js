var mongoose = require('mongoose');

// User_transaction Schema
var User_transactionSchema = mongoose.Schema({
    user_id: {
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

var User_transaction = module.exports = mongoose.model('User_transaction', User_transactionSchema);

// Add User_transaction
module.exports.createUser_transaction = function(newUser_transaction, callback){
	newUser_transaction.save(callback);
}

// Get User_transaction History By User Id
module.exports.getUser_transactionHistory = function(user_id, callback, limit){
	User_transaction.find({ user_id: user_id}, callback).sort({ _id: -1 });
}