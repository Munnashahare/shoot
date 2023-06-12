var express = require('express');
var router = express.Router();
const passport = require('passport');

var Subscription = require('../controller/subscription');

//API for Admin
router.post('/getSubscription',Subscription.getSubscription);
router.post('/getSubscriptionById',Subscription.getSubscriptionById);

//API for Admin
router.post('/addSubscription', passport.authenticate('jwt', {session: false}), isAdmin, Subscription.addSubscription);
router.post('/updateSubscription', passport.authenticate('jwt', {session: false}), isAdmin,  Subscription.updateSubscription);
router.post('/removeSubscription', passport.authenticate('jwt', {session: false}), isAdmin, Subscription.remove);
router.post('/updateStatus', passport.authenticate('jwt', {session: false}), isAdmin, Subscription.updateStatus);

function isAdmin(req, res, next) {
  if(req.user.userType == 'admin') next();
  else return res.json({status: false, response: "unauthorized"});
}

module.exports = router;