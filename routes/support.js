var express = require('express');
var router = express.Router();
const passport = require('passport');

var Support = require('../controller/support');

router.post('/addSupport', Support.addSupport);

//API for Admin and Merchant
router.post('/getSupport', passport.authenticate('jwt', {session: false}), isAdmin, Support.getSupport);
router.post('/getSupportById',passport.authenticate('jwt', {session: false}), isAdmin, Support.getSupportById);

//API for Admin
router.post('/removeSupport', passport.authenticate('jwt', {session: false}), isAdmin, Support.remove);
router.post('/updateStatus', passport.authenticate('jwt', {session: false}), isAdmin, Support.updateStatus);

function isAdmin(req, res, next) {
  if(req.user.userType == 'admin') next();
  else return res.json({status: false, response: "unauthorized"});
}

function isMerchant_User(req, res, next) {
    if(req.user.userType == 'merchant' || req.user.userType == 'user') next();
    else return res.json({status: false, response: "unauthorized"});
  }

module.exports = router;