var express = require('express');
var router = express.Router();
var admin = require('../controller/admin');
const passport = require('passport');

// Admin api
router.post('/masterAdmin', admin.addMasterAdmin);
router.post('/login', admin.login);
router.post('/forgotPassword', admin.forgotPassword);

router.post('/addAdmin', passport.authenticate('jwt', {session: false}), isadmin, admin.addAdmin);
router.post('/changePassword', passport.authenticate('jwt', {session: false}), isadmin, admin.changePassword);
router.get('/getallAdmin', passport.authenticate('jwt', {session: false}), isadmin, admin.getAdmin);
router.post('/getAdminById', passport.authenticate('jwt', {session: false}), isadmin, admin.getAdminById);
router.post('/updateAdmin', passport.authenticate('jwt', {session: false}), isadmin, admin.updateAdmin);
router.post('/updateStatus', passport.authenticate('jwt', {session: false}), isadmin, admin.updateStatus);
router.post('/removeAdmin', passport.authenticate('jwt', {session: false}), isadmin,  admin.remove);


function isadmin(req, res, next) {
    if(req.user.userType == 'admin') next();
    else return res.json({status: false, response: "unauthorized"});
} 

module.exports = router;