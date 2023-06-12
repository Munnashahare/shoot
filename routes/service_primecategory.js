var express = require('express');
var router = express.Router();
const passport = require('passport');

var Service_primecategory = require('../controller/service_primecategory');

router.post('/getServicePrimeCategory', Service_primecategory.getServicePrimeCategory);
router.post('/getServicePrimeCategoryById', Service_primecategory.getServicePrimeCategoryById);
router.post('/getAllPrimeCategory_details', Service_primecategory.getAllPrimeCategory_details);

//API for Admin
router.post('/addService_primecategory', passport.authenticate('jwt', {session: false}), isAdmin, Service_primecategory.addServicePrimecategory);
router.post('/updateServicePrimecategory', passport.authenticate('jwt', {session: false}), isAdmin, Service_primecategory.updateServicePrimecategory);
router.post('/removeService_primecategory', passport.authenticate('jwt', {session: false}), isAdmin, Service_primecategory.remove);
router.post('/updateStatus', passport.authenticate('jwt', {session: false}), isAdmin, Service_primecategory.updateStatus);



function isAdmin(req, res, next) {
  if(req.user.userType == 'admin') next();
  else return res.json({status: false, response: "unauthorized"});
}

module.exports = router;