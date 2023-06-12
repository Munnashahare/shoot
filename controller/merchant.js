const jwt = require('jsonwebtoken');
const config = require('../config/db');

var Merchant = require('../models/merchant');
var Merchant_transaction = require('../models/merchant_transaction');
var Subscription = require('../models/subscription');
var MerchantOTP = require('../config/smsotp')
var Mail = require('../config/mail');

const http = require('http');
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var Filename = "";


//upload image and send image_url
var storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, 'uploads/merchant');
	},
	filename: function (req, file, callback) {
		Filename = file.fieldname + '_' + Date.now() + path.extname(file.originalname);
		callback(null, Filename);
	}
});

var upload = multer({ storage: storage }).single('avatar');

// delete image file
function delimg(imglink) {
	fs.stat('uploads/merchant/' + imglink, function (err, stats) {
		//here we got all information of file in stats variable
		console.log(stats);

		if (err) {
			return console.error(err);
		}
		fs.unlink('uploads/merchant/' + imglink, function (err) {
			if (err) {
				console.error(err);
			}
			// if no error, file has been deleted successfully
			console.log('File deleted!');
		});
	});
}

function generateMerchantId(length) {
	var result = '';
	var characters = '0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

function generateReferal(length) {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

//Get OTP
module.exports.getOTP = function (req, res) {
	var phone = req.body.phone;

	//validation
	req.checkBody('phone', 'phone is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) res.json({ status: false, message: "Fields are missing.", error: errors });
	else {
		Merchant.getMerchantByPhone(phone, function (err, merchant) {

			if (err) return res.json({ status: false, error: err });

			if (merchant) {
				if (merchant.block == false) {
					let otp = "" + Math.floor(1000 + Math.random() * 9000);
					// let otp = "1234";

					// test user for playstore
					if (phone == 9999999999) otp = "1234";

					Merchant.updateMerchantByQuery({ _id: merchant._id }, { otp: otp, updated_at: Date() }, function (err, merchantUpdate) {
						if (err) return res.json({ status: false, error: err });
						else {
							if (merchantUpdate) {
								//send otp to mobile number
								MerchantOTP.merchantOTP(phone, otp, merchant._id, res)
							}
							else return res.json({ status: false, message: 'Unable to update Merchant' });
						}
					});
				} else {
					return res.json({ status: true, message: 'Your account has been Blocked!' });
				}

			} else {
				console.log("2222222")
				let otp = "" + Math.floor(1000 + Math.random() * 9000);
				// let otp = "1234";

				// test user for playstore
				if (phone == 9999999999) otp = "1234";

				var newMerchant = new Merchant({
					phone: phone,
					m_id: 'MID' + generateMerchantId(4),
					otp: otp,
					referral_code: generateReferal(8),
					status: false,
					personal_detail_status: false,
					identity_proof_detail_status: false,
					bank_detail_status: false,
					business_detail_status: false,
					registration_payment_status: false,
					block: false,
					created_at: Date()
				});

				Merchant.createMerchant(newMerchant, function (err, merchant) {
					if (err) {
						return res.json({ status: false, error: err });
					} else {
						MerchantOTP.merchantOTP(phone, otp, merchant._id, res)
					}
				});
			}
		})

	}
}


// verify otp
module.exports.verifyOTP = function (req, res) {
	var merchant_id = req.body.merchant_id;
	var phone = req.body.phone;
	var otp = req.body.otp;

	//validation
	req.checkBody('merchant_id', 'Merchant Id is required').notEmpty();
	req.checkBody('phone', 'Phone is required').notEmpty();
	req.checkBody('otp', 'OTP is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) return res.json({ status: false, message: "Fields are missing.", error: errors });
	else {
		Merchant.verifyOTP(merchant_id, phone, otp, function (err, merchant) {
			if (err) return res.json({ status: false, error: err });
			else {
				if (merchant) {
					Merchant.updateMerchantByQuery({ _id: merchant_id }, { otp: otp, updated_at: Date() }, function (err, merchantUpdate) {
						if (err) return res.json({ status: false, error: err });
						else {
							if (merchantUpdate) {
								// if(merchant.personal_detail_status == true && merchant.identity_proof_detail_status == true && merchant.bank_detail_status == true && merchant.business_detail_status == true){
								// if(merchant.status == true){
								const user = {
									_id: merchant.merchant_id,
									name: merchant.name,
									email: merchant.business_email,
									brand_name: merchant.brand_name,
									image: merchant.image,
									referral_code: merchant.referral_code,
									referred_from: merchant.referred_from,
									status: merchant.status,
									personal_detail_status: merchant.personal_detail_status,
									registration_payment_status: merchant.registration_payment_status,
									city: merchant.city,
									userType: 'merchant'
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
								// } else {
								// 	return res.json({ status: false, message: "your account is not Approved"})
								// }

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

// Update Merchant personal details
module.exports.updatePersonalDetails = function (req, res) {
	var merchant_id = req.body.merchant_id;
	var name = req.body.name;
	var brand_name = req.body.brand_name;
	var temp_brand_name = req.body.temp_brand_name;
	var business_email = req.body.business_email;
	var image = req.body.image;

	//validation
	req.checkBody('merchant_id', 'Merchant id is required').notEmpty();
	req.checkBody('brand_name', 'Brand_name is required').notEmpty();
	req.checkBody('business_email', 'Business Email is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		return res.json({ status: false, error: errors });
	} else {
		var update = {
			name: name,
			brand_name: brand_name,
			temp_brand_name: temp_brand_name,
			business_email: business_email,
			image: image,
			personal_detail_status: true,
			updated_at: Date()
		}

		Merchant.updateMerchantByQuery({ _id: merchant_id }, update, function (err, merchant) {
			if (err) {
				return res.json({ status: false, error: err })
			} else {
				Mail.registrationMail(business_email, name);
				return res.json({ status: true, message: 'Personal Details Updated Successfully!' });
			}
		});
	}
};

// Update Merchant identity proof details
module.exports.updateIdentityProofDetails = function (req, res) {
	var merchant_id = req.body.merchant_id;
	var pan_card_image = req.body.pan_card_image;
	var aadhar_card_image = req.body.aadhar_card_image;
	var pan_card_number = req.body.pan_card_number;
	var aadhar_card_number = req.body.aadhar_card_number;
	var document_name = req.body.document_name;
	var current_address = req.body.current_address;
	var permanent_address = req.body.permanent_address;

	//validation
	req.checkBody('merchant_id', 'Merchant id is required').notEmpty();
	req.checkBody('pan_card_image', 'Pan Card image is required').notEmpty();
	req.checkBody('aadhar_card_image', 'aadhar_card_image is required').notEmpty();
	req.checkBody('pan_card_number', 'pan_card_number is required').notEmpty();
	req.checkBody('aadhar_card_number', 'aadhar_card_number is required').notEmpty();
	req.checkBody('document_name', 'document_name is required').notEmpty();
	req.checkBody('current_address', 'current_address is required').notEmpty();
	req.checkBody('permanent_address', 'permanent_address is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		return res.json({ status: false, error: errors });
	} else {
		var update = {
			pan_card_image: pan_card_image,
			aadhar_card_image: aadhar_card_image,
			pan_card_number: pan_card_number,
			aadhar_card_number: aadhar_card_number,
			document_name: document_name,
			current_address: current_address,
			permanent_address: permanent_address,
			identity_proof_detail_status: true,
			updated_at: Date()
		}

		Merchant.updateMerchantByQuery({ _id: merchant_id }, update, function (err, merchant) {
			if (err) {
				return res.json({ status: false, error: err })
			} else {
				return res.json({ status: true, message: 'Identity Proof Details Updated Successfully!' });
			}
		});
	}
};

// Update Merchant Bank Details
module.exports.updateBankDetails = function (req, res) {
	var merchant_id = req.body.merchant_id;
	var bank_name = req.body.bank_name;
	var account_holder_name = req.body.account_holder_name;
	var account_number = req.body.account_number;
	var ifsc = req.body.ifsc;


	//validation
	req.checkBody('merchant_id', 'Merchant id is required').notEmpty();
	req.checkBody('bank_name', 'Bank Name is required').notEmpty();
	req.checkBody('account_holder_name', 'account holder name is required').notEmpty();
	req.checkBody('account_number', 'Account Number is required').notEmpty();
	req.checkBody('ifsc', 'ifsc is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		return res.json({ status: false, error: errors });
	} else {
		var update = {
			bank_name: bank_name,
			account_holder_name: account_holder_name,
			account_number: account_number,
			ifsc: ifsc,
			bank_detail_status: true,
			updated_at: Date()
		}

		Merchant.updateMerchantByQuery({ _id: merchant_id }, update, function (err, merchant) {
			if (err) {
				return res.json({ status: false, error: err })
			} else {
				return res.json({ status: true, message: 'Bank Details Updated Successfully!' });
			}
		});
	}
};

// Update Business Details
module.exports.updateBusinessDetails = function (req, res) {
	var merchant_id = req.body.merchant_id;
	var type = req.body.type;
	var gst_number = req.body.gst_number;
	var location = req.body.location;
	var address = req.body.address;
	var city = req.body.city;

	//validation
	req.checkBody('merchant_id', 'Merchant id is required').notEmpty();
	req.checkBody('type', 'Type is required').notEmpty();
	req.checkBody('location', 'Location is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		return res.json({ status: false, error: errors });
	} else {
		var update = {
			type: type,
			gst_number: gst_number,
			location: location,
			address: address,
			city: city,
			business_detail_status: true,
			updated_at: Date()
		}

		Merchant.updateMerchantByQuery({ _id: merchant_id }, update, function (err, merchant) {
			if (err) {
				return res.json({ status: false, error: err })
			} else {
				return res.json({ status: true, message: 'Business Details Updated Successfully!' });
			}
		});
	}
};

// Get All Merchant
module.exports.getMerchant = function (req, res) {
	var query = req.body.query;

	Merchant.getMerchantByQuery(query, function (err, merchant) {
		if (err) {
			return res.json({ status: false, error: err })
		}
		return res.json({ status: true, response: merchant })
	})
}

// Get Merchant By Id
module.exports.getMerchantById = function (req, res) {
	var merchant_id = req.body.merchant_id;

	//validation
	req.checkBody('merchant_id', 'Merchant id is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		return res.json({ status: false, error: errors });
	} else {
		Merchant.getMerchantById(merchant_id, function (err, merchant) {
			if (err)
				return res.json({ status: false, error: err });
			if (merchant) {
				return res.json({ status: true, response: merchant });
			} else {
				return res.json({ status: false, message: "Invalid Merchant ID" });
			}
		});
	}
}


// Get Merchant All Status
module.exports.getMerchantAllStatus = function (req, res) {
	var merchant_id = req.body.merchant_id;

	//validation
	req.checkBody('merchant_id', 'Merchant id is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		return res.json({ status: false, error: errors });
	} else {
		Merchant.getMerchantById(merchant_id, function (err, merchant) {
			if (err)
				return res.json({ status: false, error: err });
			if (merchant) {

				const Merchant = {
					status: merchant.status,
					personal_detail_status: merchant.personal_detail_status,
					identity_proof_detail_status: merchant.identity_proof_detail_status,
					bank_detail_status: merchant.bank_detail_status,
					business_detail_status: merchant.business_detail_status,
					registration_payment_status: merchant.registration_payment_status,

				}
				return res.json({ status: true, response: Merchant });
			} else {
				return res.json({ status: false, message: "Invalid Merchant ID" });
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

// update Submit Status
module.exports.updateSubmitStatus = function (req, res) {
	var merchant_id = req.body.merchant_id;

	//validation
	req.checkBody('merchant_id', 'Merchant id is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		return res.json({ status: false, error: errors });
	} else {
		var query = {
			_id: merchant_id,
			personal_detail_status: true,
			identity_proof_detail_status: true,
			bank_detail_status: true,
			business_detail_status: true,
			registration_payment_status: true
		}
		var update = {
			status: true,
			updated_at: Date()
		}
		Merchant.updateMerchantByQuery(query, update, function (err, merchant) {
			if (err) {
				return res.json({ status: false, error: err })
			} else {
				if (merchant) {
					return res.json({ status: true, message: 'Submitted Successfully!' });
				} else {
					return res.json({ status: false, message: 'Onboarding Details are required!' });

				}
			}
		});
	}
};

// update online Status
module.exports.updateOnlineStatus = function (req, res) {
	var merchant_id = req.body.merchant_id;
	var online_status = req.body.online_status;

	//validation
	req.checkBody('merchant_id', 'Merchant id is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		return res.json({ status: false, error: errors });
	} else {
		var update = {
			online_status: online_status,
			updated_at: Date()
		}
		Merchant.updateMerchantByQuery({ _id: merchant_id }, update, function (err, merchant) {
			if (err) {
				return res.json({ status: false, error: err })
			} else {
				if (merchant) {
					return res.json({ status: true, message: 'Online Status Updated Successfully!' });
				} else {
					return res.json({ status: true, message: 'Some details are not filled!' });

				}
			}
		});
	}
};

// update Service Status
module.exports.updateServiceStatus = function (req, res) {
	var merchant_id = req.body.merchant_id;
	var service_status = req.body.service_status;

	//validation
	req.checkBody('merchant_id', 'Merchant id is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		return res.json({ status: false, error: errors });
	} else {
		var update = {
			service_status: service_status,
			updated_at: Date()
		}
		Merchant.updateMerchantByQuery({ _id: merchant_id }, update, function (err, merchant) {
			if (err) {
				return res.json({ status: false, error: err })
			} else {
				if (merchant) {
					return res.json({ status: true, message: 'Service Status Updated Successfully!' });
				} else {
					return res.json({ status: true, message: 'Some details are not filled!' });

				}
			}
		});
	}
};

// claim Referral
module.exports.claimReferral = function (req, res) {
	var merchant_id = req.body.merchant_id;
	var referral_code = req.body.referral_code;

	//validation
	req.checkBody('merchant_id', 'Merchant id is required').notEmpty();
	req.checkBody('referral_code', 'Referral code is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) return res.json({ status: false, message: "Fields are missing.", error: errors });
	else {

		Merchant.merchantByQuery({ referral_code: referral_code }, function (err, merchant) {
			console.log("1111")
			console.log(merchant)
			if (err) return res.json({ status: false, error: err });
			if (merchant) {
				if (merchant._id == merchant_id) return res.json({ status: false, message: "In-Valid Referral Code." });

				var ref_merchant_id = merchant._id;
				var shoot_money = merchant.shoot_money + 10;
				var referral_ammount = merchant.referral_ammount + 10;
				var total_referral = merchant.total_referral + 1;

				Merchant.getMerchantById(merchant_id, function (err, myMerchant) {
					if (err) return res.json({ status: false, error: err });
					else {
						if (myMerchant.referred_from) return res.json({ status: false, message: 'Referral already taken!' });
						else {
							var updateMerchant = {
								referred_from: referral_code,
								updated_at: Date()
							};
							Merchant.updateMerchantByQuery({ _id: merchant_id }, updateMerchant, function (err, result) {
								if (err) return res.json({ status: false, error: err });
								else {
									if (result) {
										console.log(ref_merchant_id);

										var updateRef_Merchant = {
											shoot_money: shoot_money,
											referral_ammount: referral_ammount,
											total_referral: total_referral,
											updated_at: Date()
										};
										Merchant.updateMerchantByQuery({ _id: ref_merchant_id }, updateRef_Merchant, function (err, updateMerchant) {
											if (err) return res.json({ status: false, error: err });
											else {
												if (updateMerchant) {
													var newMerchant_transaction = new Merchant_transaction({
														merchant_id: ref_merchant_id,
														reference_id: merchant_id,
														type: "credit",
														ammount: 10,
														mode: "referral",
														remark: "₹ " + 10 + " Added to Wallet for Referral",
														balance: shoot_money,
														created_at: Date()
													});

													Merchant_transaction.createMerchant_transaction(newMerchant_transaction, function (err, transaction) {
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

// Get Subscription by Id
module.exports.takeSubscription = function (req, res) {
	var subscription_id = req.body.subscription_id;
	var merchant_id = req.body.merchant_id;

	Subscription.getSubscriptionById({ _id: subscription_id, status: true }, function (err, subscription) {
		if (err) {
			return res.json({ status: false, error: err })
		} if (subscription) {
			var update = {
				subscription_details: { name: subscription.name, description: subscription.description, ammount: subscription.ammount, discount: subscription.discount, duration: subscription.duration, subscription_date: Date() }
			}
			Merchant.updateMerchantByQuery({ _id: merchant_id }, update, function (err, updateMerchant) {
				if (updateMerchant) {
					return res.json({ status: true, response: updateMerchant })
				} else {
					return res.json({ status: false, message: "Unable to update!" })
				}
			})
		} else {
			return res.json({ status: false, message: "Subscription is not active!" })
		}
	});
}



// View Count for Merchant By Id
module.exports.increaseMerchantViewCount = function (req, res) {
	var merchant_id = req.body.merchant_id;

	//validation
	req.checkBody('merchant_id', 'Merchant id is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		return res.json({ status: false, error: errors });
	} else {
		Merchant.getMerchantById(merchant_id, function (err, merchant) {
			if (err)
				return res.json({ status: false, error: err });
			if (merchant) {
				var view_count = merchant.view_count + 1;

				Merchant.updateMerchantByQuery({ _id: merchant_id }, { view_count: view_count }, function (err, updateMerchant) {
					if (updateMerchant) {
						return res.json({ status: true, merchant_id: merchant_id, view_count: view_count });
					} else {
						return res.json({ status: false, message: "Unable to update!" })
					}
				})
			} else {
				return res.json({ status: false, message: "Invalid Merchant ID" });
			}
		});
	}
}

// update Available Timing
module.exports.updateAvailableTime = function (req, res) {
	var merchant_id = req.body.merchant_id;
	var available_timing = req.body.available_timing
	//validation
	req.checkBody('merchant_id', 'Merchant id is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		return res.json({ status: false, error: errors });
	} else {
		var update = {
			available_timing: available_timing,
			updated_at: Date()
		}
		Merchant.updateMerchantByQuery({ _id: merchant_id }, update, function (err, merchant) {
			if (err) {
				return res.json({ status: false, error: err })
			} else {
				if (merchant) {
					return res.json({ status: true, message: 'Available Timing Updated Successfully!' });
				} else {
					return res.json({ status: true, message: 'Invalid Id!' });

				}
			}
		});
	}
};

// Block
module.exports.blockMerchant = function (req, res) {
	var merchant_id = req.body.merchant_id;
	var block = req.body.block;

	//validation
	req.checkBody('merchant_id', 'Merchant id is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		return res.json({ status: false, error: errors });
	} else {
		var update = {
			block: block,
			updated_at: Date()
		}
		Merchant.updateMerchantByQuery({ _id: merchant_id }, update, function (err, merchant) {
			if (err) {
				return res.json({ status: false, error: err })
			} else {
				if (merchant) {
					return res.json({ status: true, message: 'Updated Successfully!' });
				} else {
					return res.json({ status: true, message: 'Some details are not filled!' });

				}
			}
		});
	}
};

// Instant Available
module.exports.instanceAvailable = function (req, res) {
	var merchant_id = req.body.merchant_id;
	var instant_available = req.body.instant_available;

	//validation
	req.checkBody('merchant_id', 'Merchant id is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		return res.json({ status: false, error: errors });
	} else {
		var update = {
			instant_available: instant_available,
			updated_at: Date()
		}
		Merchant.updateMerchantByQuery({ _id: merchant_id }, update, function (err, merchant) {
			if (err) {
				return res.json({ status: false, error: err })
			} else {
				if (merchant) {
					return res.json({ status: true, message: 'Updated Successfully!' });
				} else {
					return res.json({ status: true, message: 'Some details are not filled!' });

				}
			}
		});
	}
};


// Updte banner Image
module.exports.updateBannerImage = function (req, res) {
	var merchant_id = req.body.merchant_id;
	var temp_banner_image = req.body.temp_banner_image;

	//validation
	req.checkBody('merchant_id', 'Merchant id is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		return res.json({ status: false, error: errors });
	} else {
		var update = {
			temp_banner_image: temp_banner_image,
			updated_at: Date()
		}
		Merchant.updateMerchantByQuery({ _id: merchant_id }, update, function (err, merchant) {
			if (err) {
				return res.json({ status: false, error: err })
			} else {
				if (merchant) {
					return res.json({ status: true, message: 'banner Image Updated Successfully!' });
				} else {
					return res.json({ status: true, message: 'Some details are not filled!' });

				}
			}
		});
	}
};

// approve banner Image
module.exports.approveBannerImage = function (req, res) {
	var merchant_id = req.body.merchant_id;
	var temp_banner_image = req.body.temp_banner_image;

	//validation
	req.checkBody('merchant_id', 'Merchant id is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		return res.json({ status: false, error: errors });
	} else {
		var update = {
			banner_image: temp_banner_image,
			temp_banner_image: "",
			updated_at: Date()
		}
		Merchant.updateMerchantByQuery({ _id: merchant_id }, update, function (err, merchant) {
			if (err) {
				return res.json({ status: false, error: err })
			} else {
				if (merchant) {
					return res.json({ status: true, message: 'banner Image Updated Successfully!' });
				} else {
					return res.json({ status: true, message: 'Some details are not filled!' });

				}
			}
		});
	}
};



// approve barnd name
module.exports.approveBrandName = function (req, res) {
	var merchant_id = req.body.merchant_id;
	var temp_brand_name = req.body.temp_brand_name;

	//validation
	req.checkBody('merchant_id', 'Merchant id is required').notEmpty();
	req.checkBody('temp_brand_name', 'temp_brand_name is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		return res.json({ status: false, error: errors });
	} else {
		var update = {
			brand_name: temp_brand_name,
			temp_brand_name: "",
			updated_at: Date()
		}
		Merchant.updateMerchantByQuery({ _id: merchant_id }, update, function (err, merchant) {
			if (err) {
				return res.json({ status: false, error: err })
			} else {
				if (merchant) {
					return res.json({ status: true, message: 'Brand Name Updated Successfully!' });
				} else {
					return res.json({ status: true, message: 'Some details are not filled!' });

				}
			}
		});
	}
};


// Approve Status
module.exports.approveStatus = function (req, res) {
	var merchant_id = req.body.merchant_id;
	var approve_status = req.body.approve_status;

	//validation
	req.checkBody('merchant_id', 'Merchant id is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		return res.json({ status: false, error: errors });
	} else {
		var update = {
			approve_status: approve_status,
			updated_at: Date()
		}
		Merchant.updateMerchantByQuery({ _id: merchant_id }, update, function (err, merchant) {
			if (err) {
				return res.json({ status: false, error: err })
			} else {
				if (merchant) {
					return res.json({ status: true, message: 'Approve Status Updated Successfully!' });
				} else {
					return res.json({ status: true, message: 'Some details are not filled!' });
				}
			}
		});
	}
};


// payment setup
var Razorpay = require('razorpay');
var razorpay_key = require('../config/razorpay');
const { query } = require('express');
var instance = new Razorpay(razorpay_key);



//create order
module.exports.createOrder = function (req, res) {

	var amount = req.body.amount;

	req.checkBody('amount', 'amount is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) return res.json({ status: false, message: "Fields are missing.", error: errors });
	else {
		var options = {
			amount: amount,  // amount in the smallest currency unit
			currency: "INR",
			receipt: "shoot_money",
			payment_capture: '1'
		};
		instance.orders.create(options, function (err, order) {
			if (err) return res.json({ status: false, message: 'Error while creating order for shoot money', error: err });
			if (order) {
				order.key = razorpay_key.key_id;
				return res.json({ status: true, message: 'Order created successfully', response: order });
			}
		});
	}
}



//payment details
module.exports.paymentDetails = function (req, res) {

	var payment_id = req.body.payment_id;
	var merchant_id = req.body.merchant_id;

	req.checkBody('merchant_id', 'merchant_id is required').notEmpty();
	req.checkBody('payment_id', 'payment_id is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) return res.json({ status: false, message: "Fields are missing.", error: errors });
	else {
		instance.payments.fetch(payment_id).then((data) => {
			if (data) {
				console.log(data);
				var update = {
					registration_payment: data,
					registration_payment_status: true,
					updated_at: Date()
				}
				Merchant.updateMerchantByQuery({ _id: merchant_id }, update, function (err, status) {
					if (err) {
						return res.json({ status: false, error: err })
					} else {
						return res.json({ status: true, message: 'Payment done successful.' });
					}
				})
			}
			else return res.json({ status: false, message: 'Unable to fetch payment details' });
		});
	}
}


// subscription_payment details
module.exports.subscriptionPaymentDetails = function (req, res) {

	var payment_id = req.body.payment_id;
	var merchant_id = req.body.merchant_id;
	var subscription_id = req.body.subscription_id;
	var subscription_details = req.body.subscription_details;

	req.checkBody('merchant_id', 'merchant_id is required').notEmpty();
	req.checkBody('payment_id', 'payment_id is required').notEmpty();
	req.checkBody('subscription_details', 'subscription_details is required').notEmpty
	req.checkBody('subscription_id', 'subscription_id is required').notEmpty

	var errors = req.validationErrors();

	if (errors) return res.json({ status: false, message: "Fields are missing.", error: errors });
	else {
		instance.payments.fetch(payment_id).then((data) => {
			if (data) {
				console.log(data);
				var update = {
					subscription_payment: data,
					subscription_id: subscription_id,
					subscription_details: subscription_details,
					// registration_payment_status: true,
					updated_at: Date()
				}
				Merchant.updateMerchantByQuery({ _id: merchant_id }, update, function (err, status) {
					if (err) {
						return res.json({ status: false, error: err })
					} else {
						return res.json({ status: true, message: 'Payment done successful.' });
					}
				})
			}
			else return res.json({ status: false, message: 'Unable to fetch payment details' });
		});
	}
}

// Get All Merchant with temp brand name
module.exports.getMerchantWithTemp_brand_name = function (req, res) {

	Merchant.allMerchant_temp_brand_name(function (err, merchant) {
		if (err) {
			return res.json({ status: false, error: err })
		}
		return res.json({ status: true, response: merchant })
	})
}


// Get All Merchant with temp_banner_image
module.exports.getMerchantWithTemp_banner_image = function (req, res) {

	Merchant.allMerchant_temp_banner_image(function (err, merchant) {
		if (err) {
			return res.json({ status: false, error: err })
		}
		return res.json({ status: true, response: merchant })
	})
}
//search merchant
module.exports.search = function (req, res) {
	let { brand_name = '', city } = req.query;
	Merchant.search_merchant({ city: city, brand_name: new RegExp(`^${brand_name}`, "i") }, function (err, search) {
		if (err) return res.json({ status: false, message: "Data not found" });
		else return res.json({ status: true, response: search });
	})

}

//get explore merchant
module.exports.exploreMerchant = function (req, res) {
	// var location = req.body.location;
	var city = req.body.city;

	Merchant.getExploreMerchant({ instant_available: true, city: city }, function (err, merchant) {
		if (err) {
			return res.json({ status: false, error: err })
		}
		return res.json({ status: true, response: { instant: merchant, live: [], nearby: [] } })
	})

}

//nearbymerchant

module.exports.getNearbyMerchant = function (req, res) {
	var city = req.body.city;
	var location = req.body.location;

	Merchant.getNearByMerchant({ city: city, location: location }, (err, merchant) => {
		if (err) {
			return res.json({ status: false, error: err })
		}
		else {
			return res.json({ status: true, response: merchant })

		}
	})
}

//getSubscribers
module.exports.getSubscribers = function (req, res) {
	Merchant.getSubscribers(function (err, merchant) {
		if (err) {
			return res.json({ status: false, error: err })
		}
		return res.json({ status: true, response: merchant })
	})
}




