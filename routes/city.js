var express = require('express');
var router = express.Router();
const passport = require('passport');

var City = require('../controller/city');

//API for Admin and Merchant
router.post('/getCity', City.getCity);
router.post('/getCityById', City.getCityById);

//API for Admin
router.post('/addCity', passport.authenticate('jwt', {session: false}), isAdmin, City.addCity);
router.post('/updateCity', passport.authenticate('jwt', {session: false}), isAdmin,  City.updateCity);
router.post('/removeCity', passport.authenticate('jwt', {session: false}), isAdmin, City.remove);
router.post('/updateStatus', passport.authenticate('jwt', {session: false}), isAdmin, City.updateStatus);

function isAdmin(req, res, next) {
  if(req.user.userType == 'admin') next();
  else return res.json({status: false, response: "unauthorized"});
}

function isAdmin_Merchant(req, res, next) {
    if(req.user.userType == 'merchant' || req.user.userType == 'admin') next();
    else return res.json({status: false, response: "unauthorized"});
  }

module.exports = router;