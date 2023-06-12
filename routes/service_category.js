var express = require('express');
var router = express.Router();
const passport = require('passport');

var Service_category = require('../controller/service_category');

router.post('/getServiceCategory', Service_category.getServiceCategory);
router.post('/getServiceCategoryById', Service_category.getServiceCategoryById);

//API for Admin
// router.post('/addService_category', Service_category.addService_category);
router.post('/addService_category', passport.authenticate('jwt', {session: false}), isAdmin, Service_category.addService_category);

router.post('/updateServiceCategory', passport.authenticate('jwt', {session: false}), isAdmin,  Service_category.updateServiceCategory);
router.post('/removeService_category', passport.authenticate('jwt', {session: false}), isAdmin, Service_category.remove);
router.post('/upload_image', Service_category.upload_image);
router.post('/del_image', Service_category.remove_Image);
router.post('/updateStatus', passport.authenticate('jwt', {session: false}), isAdmin, Service_category.updateStatus);



function isAdmin(req, res, next) {
  if(req.user.userType == 'admin') next();
  else return res.json({status: false, response: "unauthorized"});
}

module.exports = router;