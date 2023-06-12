const jwt = require('jsonwebtoken');
const config = require('../config/db');

var User = require('../models/user');
var Transaction = require('../models/user_transaction');
var UserOTP = require('../config/smsotp')

const http = require('http');
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var Filename = "";

function generateReferal(length) {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

//upload image and send image_url
var storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, 'uploads/user');
	},
	filename: function (req, file, callback) {
		Filename = file.fieldname + '_' + Date.now() + path.extname(file.originalname);
		callback(null, Filename);
	}
});

var upload = multer({ storage: storage }).single('avatar');

// delete image file
function delimg(imglink) {
	fs.stat('uploads/user/' + imglink, function (err, stats) {
		//here we got all information of file in stats variable
		console.log(stats);

		if (err) {
			return console.error(err);
		}
		fs.unlink('uploads/user/' + imglink, function (err) {
			if (err) {
				console.error(err);
			}
			// if no error, file has been deleted successfully
			console.log('File deleted!');
		});
	});
}

//Get OTP
module.exports.getOTP = function (req, res) {
	var phone = req.body.phone;

	//validation
	req.checkBody('phone', 'Phone number is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) res.json({ status: false, message: "please enter phone number.", error: errors });
	else {
		User.getUserByPhone(phone, function (err, user) {
			console.log(user);

			if (err) return res.json({ status: false, error: err });

			if (user) {
				if (user.block == false) {

					console.log(user)
					let otp = "" + Math.floor(1000 + Math.random() * 9000);
					// let otp = "1234";

					// test user for playstore
					if(phone==9999999999) otp = "1234";

					User.updateUserByQuery({ _id: user._id }, { otp: otp, updated_at: Date() }, function (err, userUpdate) {
						if (err) return res.json({ status: false, error: err });
						else {
							if (userUpdate) {
								//send otp to mobile number su
								UserOTP.userOTP(phone, otp, user._id, res)
								// return res.json({ status: true, message: 'OTP sent to your registered mobile number', response: { id: user._id, phone: phone, otp: otp, new_user: false } });
							}
							else return res.json({ status: false, message: 'Unable to update User' });
						}
					});
				} else {
					return res.json({ status: true, message: 'Your account has been Blocked!' });
				}
			} else {
				let otp = "" + Math.floor(1000 + Math.random() * 9000);
				// let otp = "1234";

				// test user for playstore
				if(phone==9999999999) otp = "1234";

				var newUser = new User({
					phone: phone,
					otp: otp,
					referral_code: generateReferal(8),
					new_user: true,
					block: false,
					status: false,
					created_at: Date()
				});

				User.createUser(newUser, function (err, user) {
					console.log(newUser);
					if (err) {
						return res.json({ status: false, error: err });
					} else {
						console.log(user.otp)
						UserOTP.userOTP(phone, otp, user._id, res)

						// return res.json({ status: true, message: 'OTP sent to your phone number', response: { id: user._id, phone: user.phone, otp: user.otp, new_user: true } });
					}
				});
			}
		})
	}
}


// verify otp
module.exports.verifyOTP = function (req, res) {
	var user_id = req.body.user_id;
	var phone = req.body.phone;
	var otp = req.body.otp;

	//validation
	req.checkBody('user_id', 'User Id is required').notEmpty();
	req.checkBody('phone', 'Phone is required').notEmpty();
	req.checkBody('otp', 'OTP is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) return res.json({ status: false, message: "Fields are missing.", error: errors });
	else {
		User.verifyOTP(user_id, phone, otp, function (err, users) {
			if (err) return res.json({ status: false, error: err });
			else {
				if (users) {
					User.updateUserByQuery({ _id: users._id }, { otp: otp, updated_at: Date() }, function (err, userUpdate) {
						if (err) return res.json({ status: false, error: err });
						else {
							if (userUpdate) {

								const user = {
									_id: users._id,
									phone: users.phone,
									status: users.status,
									new_user: users.new_user,
									userType: 'user'
								}

								const secret = config.secret;

								jwt.sign(user, secret, { expiresIn: '365d' }, (err, token) => {
									return res.json({
										status: true,
										token: "JWT " + token,
										message: 'Verified successfully!',
										response: user
									});
								});
							}
							else return res.json({ status: false, message: 'Unable to update otp.' });
						}
					});
				}
				else return res.json({ status: false, message: 'Invalid OTP!' });
			}
		});

	}
};

// Update User personal details
module.exports.updatePersonalDetails = function (req, res) {
	var user_id = req.body.user_id;
	var first_name = req.body.first_name;
	var last_name = req.body.last_name;
	var email = req.body.email;
	var phone = req.body.phone;
	var image = req.body.image;

	//validation
	req.checkBody('user_id', 'User id is required').notEmpty();
	req.checkBody('phone', 'Phone Number is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		return res.json({ status: false, error: errors });
	} else {
		var update = {
			first_name: first_name,
			last_name: last_name,
			email: email,
			phone: phone,
			image: image,
			new_user: false,
			updated_at: Date()
		}

		User.updateUserByQuery({ _id: user_id }, update, function (err, User) {
			if (err) {
				return res.json({ status: false, error: err })
			} else {
				return res.json({ status: true, message: 'Personal Details Updated Successfully!' });
			}
		});
	}
};

// Get All User
module.exports.getUserByQuery = function (req, res) {
	var query = req.body.query;

	User.getUserByQuery(query, function (err, user) {
		if (err) {
			return res.json({ status: false, error: err })
		}
		return res.json({ status: true, response: user })
	})
}

// Get User By Id
module.exports.getUserById = function (req, res) {
	var user_id = req.body.user_id;

	//validation
	req.checkBody('user_id', 'User id is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		return res.json({ status: false, error: errors });
	} else {
		User.getUserById(user_id, function (err, user) {
			if (err)
				return res.json({ status: false, error: err });
			if (user) {
				return res.json({ status: true, response: user });
			} else {
				return res.json({ status: false, message: "Invalid User ID" });
			}
		});
	}
}

// Update Status
module.exports.updateStatus = function (req, res) {
	var user_id = req.body.user_id;
	var status = req.body.status;

	//validation
	req.checkBody('user_id', 'User id is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		return res.json({ status: false, error: errors });
	} else {
		var update = {
			status: status,
			updated_at: Date()
		}

		User.updateUserByQuery({ _id: user_id }, update, function (err, user) {
			if (err) {
				return res.json({ status: false, error: err })
			} if (user) {
				return res.json({ status: true, message: 'Status Updated Successfully!' });
			} else {
				return res.json({ status: true, message: 'Invalid Id!' });
			}
		});
	}
};

// Upload Image and Get File Name
module.exports.upload_image = function (req, res) {
	Filename = "";
	upload(req, res, function (err) {
		if (err) {
			return res.json({ status: false, err: err, message: 'Error uploading file.' });
		}
		else {
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


// claim Referral
module.exports.claimReferral = function (req, res) {
	var user_id = req.body.user_id;
	var referral_code = req.body.referral_code;

	//validation
	req.checkBody('user_id', 'User id is required').notEmpty();
	req.checkBody('referral_code', 'Referral code is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) return res.json({ status: false, message: "Fields are missing.", error: errors });
	else {

		User.userByQuery({ referral_code: referral_code }, function (err, user) {
			if (err) return res.json({ status: false, error: err });
			if (user) {
				if (user._id == user_id) return res.json({ status: false, message: "In-Valid Referral Code." });

				var ref_user_id = user._id;
				var shoot_money = user.shoot_money + 10;
				var referral_ammount = user.referral_ammount + 10;
				var total_referral = user.total_referral + 1;

				User.getUserById(user_id, function (err, myuser) {
					if (err) return res.json({ status: false, error: err });
					else {
						if (myuser.referred_from) return res.json({ status: false, message: 'Referral already taken!' });
						else {
							var updateUser = {
								referred_from: referral_code,
								updated_at: Date()
							};
							User.updateUserByQuery({ _id: user_id }, updateUser, function (err, result) {
								if (err) return res.json({ status: false, error: err });
								else {
									if (result) {
										console.log(ref_user_id);

										var updateRef_User = {
											shoot_money: shoot_money,
											referral_ammount: referral_ammount,
											total_referral: total_referral,
											updated_at: Date()
										};
										User.updateUserByQuery({ _id: ref_user_id }, updateRef_User, function (err, updateuser) {
											if (err) return res.json({ status: false, error: err });
											else {
												if (updateuser) {
													var newTransaction = new Transaction({
														user_id: ref_user_id,
														reference_id: user_id,
														type: "credit",
														ammount: 10,
														mode: "referral",
														remark: "₹ " + 10 + " Added to Wallet for Referral",
														balance: shoot_money,
														created_at: Date()
													});

													Transaction.createUser_transaction(newTransaction, function (err, transaction) {
														if (err) return res.json({ status: false, error: err });
														else {
															if (transaction) {
																return res.json({ status: true, message: 'Referral taken successfully!' });
															}
															else return res.json({ status: false, message: 'Something went wrong!' });
														}
													})
												}
											}
										});
									}
									else return res.json({ status: false, message: 'Referral Code not updated!' });
								}
							});
						}
					}
				});
			}
			else return res.json({ status: false, message: 'Unable to find referral code.' });
		});
	}
};

// Block
module.exports.blockUser = function (req, res) {
	var user_id = req.body.user_id;
	var block = req.body.block;

	//validation
	req.checkBody('user_id', 'User id is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		return res.json({ status: false, error: errors });
	} else {
		var update = {
			block: block,
			updated_at: Date()
		}

		User.updateUserByQuery({ _id: user_id }, update, function (err, user) {
			if (err) {
				return res.json({ status: false, error: err })
			} if (user) {
				return res.json({ status: true, message: 'Updated Successfully!' });
			} else {
				return res.json({ status: true, message: 'Invalid Id!' });
			}
		});
	}
};