var express = require('express');
var router = express.Router();
const passport = require('passport');

var Service = require('../controller/service');

router.post('/getService', Service.getService);
router.post('/getServiceById', Service.getServiceById);

//API for Admin
router.post('/addService', Service.addService);
router.post('/updateServicePrimecategory', Service.updateService);
router.post('/removeService', Service.remove);
router.post('/updateStatus', Service.updateStatus);
router.post('/getAllService_details', Service.getAllService_details);
router.post('/favouriteService', Service.updateFavouriteService);
router.post('/getServiceByMerchantId', Service.getServiceByMerchantId);
router.post('/getMerchantBySubCategory', Service.getMerchantBySubCategory);



function isAdmin(req, res, next) {
  if(req.user.userType == 'admin') next();
  else return res.json({status: false, response: "unauthorized"});
}

module.exports = router;