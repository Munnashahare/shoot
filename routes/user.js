var express = require('express');
var router = express.Router();
const passport = require('passport');

var User = require('../controller/user');

// User API
router.post('/getOTP', User.getOTP);
router.post('/verifyOTP', User.verifyOTP);
router.post('/upload_image', User.upload_image);
router.post('/del_image', User.remove_Image);
router.post('/claimReferral', User.claimReferral);

// Api for Admin
router.post('/getUserByQuery', User.getUserByQuery);
router.post('/getUserById', User.getUserById);
router.post('/updateStatus', passport.authenticate('jwt', {session: false}), isAdmin, User.updateStatus);
router.post('/blockUser', User.blockUser);

router.post('/updatePersonalDetails', passport.authenticate('jwt', {session: false}), isUser_Admin, User.updatePersonalDetails);

function isUser_Admin(req, res, next) {
  if(req.user.userType == 'user' || req.user.userType == 'admin') next();
  else return res.json({status: false, response: "unauthorized"});
}

function isAdmin(req, res, next) {
  if(req.user.userType == 'admin') next();
  else return res.json({status: false, response: "unauthorized"});
}

module.exports = router;