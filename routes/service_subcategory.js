var express = require('express');
var router = express.Router();
const passport = require('passport');

var Service_subcategory = require('../controller/service_subcategory');

router.post('/getServiceSubCategory', Service_subcategory.getServiceSubCategory);
router.post('/getServiceSubCategoryById', Service_subcategory.getServiceSubCategoryById);
router.post('/getAllSubCategory_details', Service_subcategory.getAllSubCategory_details);

//API for Admin
// router.post('/addService_subcategory', Service_subcategory.addService_subcategory);
router.post('/addService_subcategory', passport.authenticate('jwt', {session: false}), isAdmin, Service_subcategory.addService_subcategory);

router.post('/updateServiceSubcategory', passport.authenticate('jwt', {session: false}), isAdmin, Service_subcategory.updateServiceSubcategory);
router.post('/removeService_subcategory', passport.authenticate('jwt', {session: false}), isAdmin, Service_subcategory.remove);
router.post('/upload_image', Service_subcategory.upload_image);
router.post('/del_image', Service_subcategory.remove_Image);
router.post('/updateStatus', passport.authenticate('jwt', {session: false}), isAdmin, Service_subcategory.updateStatus);



function isAdmin(req, res, next) {
  if(req.user.userType == 'admin') next();
  else return res.json({status: false, response: "unauthorized"});
}

module.exports = router;