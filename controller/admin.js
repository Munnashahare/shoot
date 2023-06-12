const jwt = require('jsonwebtoken');
const config = require('../config/db');
var Admin = require('../models/admin');
var sendMail = require('../config/mail')
function generatePassword(length) {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
	   result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
 }

 // Add Master Admin
 module.exports.addMasterAdmin = function (req, res) {
	var name = req.body.name;
    var email = req.body.email;
	var mobile = req.body.mobile;
	var password = req.body.password;
	var department = req.body.department;
	
    //validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('mobile', 'Mobile is required').notEmpty();
    
	var errors = req.validationErrors();

	if (errors)
	 {
	 	return res.json({status: false, error: errors});
	 } else {
    //    let newpassword = generatePassword(8);

		var newAdmin = new Admin({
		    name: name,
			email: email,
			mobile: mobile,
			password: password,
			type: 0,
			department: department,
            created_at: Date(),

		});
		Admin.createAdmin(newAdmin, function(err, admin){
			if(err){
				if (err.errors.email) {
					return res.json({status: false, message: 'Email already exist!'});
				}
				if (err.errors.mobile) {
					return res.json({status: false, message: 'Mobile already exist!'});
				}
				return res.status(500).send(err);
			} else {
						console.log(admin);
                        if(admin) 
						return res.json({ status: true, message: "Master Admin Register Successfully.." });	
					}
            	}); 
			}
        }
        

// Add Admin
module.exports.addAdmin = function (req, res) {
	var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
	var mobile = req.body.mobile;
	var type = req.body.type;
	var department = req.body.department;
	
    //validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('mobile', 'Mobile is required').notEmpty();
    
	var errors = req.validationErrors();

	if (errors)
	 {
	 	return res.json({status: false, error: errors});
	 } else {
		//let newpassword =generatePassword(8)
		var newAdmin = new Admin({
		    name: name,
			email: email,
			password: password,
			mobile: mobile,
			//password: newpassword,
			type: type,
			department: department,
			status: false,
            created_at: Date(),

		});
		Admin.createAdmin(newAdmin, function(err, admin){
			if(err){
				if (err.errors.email) {
					return res.json({status: false, message: 'Email already exist!'});
				}
				if (err.errors.mobile) {
					return res.json({status: false, message: 'Mobile already exist!'});
				}
				return res.status(500).send(err);
			} else {
						console.log(admin);
						if(admin) 
						return res.json({ status: true, message: "Admin Register Successfully.." });	
					}
            	}); 
			}
		}


// Get All Admin
module.exports.getAdmin = function(req,res){
	Admin.getAdmin(function(err,admin){
		if(err) {
			return res.json({status: false, error: err})
		}
		return res.json({status: true, response: admin})
	})
}

// Get Admin By Id
module.exports.getAdminById = function(req,res){
	var adminid = req.body.adminid;

	//validation
	req.checkBody('adminid', 'Admin id is required').notEmpty();

	var errors = req.validationErrors();

	if (errors)
	{
	return res.json({status: false, error: errors});
	} else {
		Admin.getAdminById(adminid, function(err, admin){
			if(err) 
			return res.json({status: false, error: err});
			if(admin)
			{
				return res.json({status: true, response: admin});
			} else {
				return res.json({status: false, message: "Invalid Admin ID"});
			}
		});
	}
}

// Update Admin
module.exports.updateAdmin = function(req, res){
	var adminid	= req.body.adminid;
	var name = req.body.name;
    var email = req.body.email;
	var mobile = req.body.mobile;
	var type = req.body.type;
	var department = req.body.department;
	
	//validation
	req.checkBody('adminid', 'Admin id is required').notEmpty();
	req.checkBody('mobile', 'Mobile Number is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();

	var errors = req.validationErrors();

	if (errors)
	{
		return res.json({status: false, error: errors});
	} else {
		var update = {
			name   		: name,
			email      	: email,
			mobile     	: mobile,
			department	: department,
			type		: type,
			updated_at 	: Date()
		 }

		Admin.updateAdmin(adminid, update, function(err, admin){
			if(err){
				return res.json({status: false, error: err})
			} else {
				console.log(admin);
				return res.json({status: true, message: 'Admin Updated Successfully!'});
			}
		});
	}
};

//  Admin login and token generate
module.exports.login = function(req, res) {
	var email = req.body.email;
	var password = req.body.password;
  
	Admin.getAdminByEmail(email, function(err, admin) {
        console.log(admin)
	  if (err) return res.json({ status: false, error: err });
	  if (admin) {
		Admin.comparePassword(password, admin.password, function(err, isMatch) {
		  if (err) 
		  return res.json({ status: false, error: err });
		  if (isMatch) {
			const user = {
				_id: admin._id,
				name: admin.name,
				mobile: admin.mobile,
				email: admin.email,
				userType: 'admin'
			}

			const secret = config.secret;
			  
			jwt.sign(user, secret, { expiresIn: 86400 }, (err, token)=>{
				return res.json({
					status: true,
					token: "JWT " + token,
					secretkey: secret,
					response: user
				});
			});
		  } else {
			return res.json({ status: false, message: "Invalid Password" });
		  }
		});
	  } else {
		return res.json({ status: false, message: "Invalid Email" });
	  }
	});
  }

// Change Password
module.exports.changePassword = function (req, res) {
	var email = req.body.email;
	var old_password = req.body.old_password;
	var new_password = req.body.new_password;
	var confirm_password = req.body.confirm_password;

	//validation
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('old_password', 'Old password is required').notEmpty();
	req.checkBody('new_password', 'New Password is required').notEmpty();
	req.checkBody('confirm_password', 'Confirm Password is required').notEmpty();
	req.checkBody('confirm_password', 'Confirm_password do not match').equals(req.body.new_password);

	var errors = req.validationErrors();

	if (errors)
	{
		return res.json({status: false, error: errors});
	} else {
		Admin.getAdminByEmail(email, function (err, admin) {
			if (err) return res.json({ status: false, error: err });
			if (admin) {
				Admin.comparePassword(old_password, admin.password, function (err, isMatch) {
					if (err)
						return res.json({ status: false, error: err });
					if(isMatch)
					{
						Admin.updatePassword(email, confirm_password, function(err, admin){
							if(err) return res.json({status: false, error: err});
							if(admin)
							{
								return res.json({status: true, message: "Password updated successfully!"});
							} else {
								return res.json({status: false, message: "Unable to upadte password"});
							}
						});
					} else {
						return res.json({status: false, message: "Old password do not match."});
					}
				});
			} else {
				return res.json({status: false, message: "Invalid Id."});
			}
		});
	}
}

// update status 
module.exports.updateStatus =  function(req, res){
	var adminid = req.body.adminid;
	var status = req.body.status;

		//validation
		req.checkBody('adminid', 'Admin Id is required').notEmpty();
	
	var errors = req.validationErrors();
		if (errors)
		{
			res.json({status: false, error: errors});
		} else {
			Admin.updateAdmin(adminid, {status: status}, function(err, admin){
				if(err) 
				return res.json({status: false, error: err});
				if(admin){
					return res.json({status: true, message: "Status Updated Successfully"});
				} else {
					return res.json({status: false, message: "Invalid Id!!"});
				}
			});
		}
	};


  //Remove Admin
module.exports.remove = function(req,res,next){
	var adminid = req.body.adminid;
	//validation
	req.checkBody('adminid', 'Admin id is required').notEmpty();

	var errors = req.validationErrors();

	if (errors)
	{
	return res.json({status: false, error: errors});
	} else {
	Admin.removeAdmin(adminid, function(err, admin){
		if(err)
		return res.json({status: false, error: err});
		if(admin) {
		return res.json({status: true, message: "Admin Removed Succefully!"});
		} else {
		return res.json({status:false, message: "Invalid Id"});
			}
		});
	}
}

// Forgot Password
module.exports.forgotPassword = function(req,res){
	var email = req.body.email;
	
		//validation
		req.checkBody('email', 'Email id is required').notEmpty();
	
		var errors = req.validationErrors();

		if (errors) {
			return res.json({ status: false, error: errors});
		} else {
			let newpassword = generatePassword(8);
			Admin.updatePassword(email, newpassword, function(err, admin){
				if (err) {
					return res.json({ status: false, error: errors});
				} 
				if(admin) {
					sendMail.forgotPasswordMail(email, newpassword)
					return res.json({status: true, message: "Your password has been sent to your register email address" })
				} else {
					return res.json({ status: false, message: "Email not found."})
				}
				
			})
		}
	}