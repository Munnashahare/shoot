var express = require('express');
var router = express.Router();
const passport = require('passport');

var Merchant = require('../controller/merchant');
var Portfolio = require('../controller/portfolio');
var FCMHandler = require('../controller/fcm_handler');

router.post('/setFCM',FCMHandler.setMerchantFcmToken);
router.post('/setUserFcm',FCMHandler.setUserFcmToken);

router.get('/test',FCMHandler.test)


// API for Merchant and Admin Both
router.post('/getOTP', Merchant.getOTP);
router.post('/verifyOTP', Merchant.verifyOTP);
router.post('/upload_image', Merchant.upload_image);
router.post('/del_image', Merchant.remove_Image);
router.post('/updatePersonalDetails', Merchant.updatePersonalDetails);
router.post('/updateIdentityProofDetails', Merchant.updateIdentityProofDetails);
router.post('/updateBankDetails', Merchant.updateBankDetails);
router.post('/updateBusinessDetails', Merchant.updateBusinessDetails);
router.post('/updateSubmitStatus', Merchant.updateSubmitStatus);
router.post('/updateOnlineStatus', Merchant.updateOnlineStatus);
router.post('/updateServiceStatus', Merchant.updateServiceStatus);
router.post('/getMerchantAllStatus', Merchant.getMerchantAllStatus);
router.post('/getMerchantById', Merchant.getMerchantById);
router.post('/blockMerchant', Merchant.blockMerchant);
router.post('/instanceAvailableMerchant', Merchant.instanceAvailable);
router.post('/updateBannerImage', Merchant.updateBannerImage);
router.post('/approveStatus', Merchant.approveStatus);
router.post('/approveBannerImage', Merchant.approveBannerImage);
router.post('/approveBrandName', Merchant.approveBrandName);

router.post('/increaseMerchantViewCount', Merchant.increaseMerchantViewCount);
router.post('/updateAvailableTime', Merchant.updateAvailableTime);
router.get('/search',Merchant.search);
router.post('/getExploreMerchant',Merchant.exploreMerchant);
router.post('/getNearbyMerchant',Merchant.getNearbyMerchant)
router.get('/getSubscribers',Merchant.getSubscribers)

// Api for Merchant
router.post('/claimReferral', Merchant.claimReferral);
router.post('/takeSubscription', Merchant.takeSubscription);

// Api for Admin
router.post('/getAllMerchantByQuery', Merchant.getMerchant);
router.post('/getAllMerchantWithTemp_brand_name', Merchant.getMerchantWithTemp_brand_name);
router.post('/getMerchantWithTemp_banner_image', Merchant.getMerchantWithTemp_banner_image);


// Portfolio API
router.post('/uploadImage', Portfolio.upload_image);
router.post('/delImage', Portfolio.remove_Image);
// router.post('/addPortfolio', Portfolio.addPortfolio);
router.post('/updatePortfolio', Portfolio.updatePortfolio);
router.post('/getPortfolioByQuery', Portfolio.getPortfolioByQuery);
router.post('/getPortfolioById', Portfolio.getPortfolioById);
router.post('/removePortfolio', Portfolio.remove);
router.post('/getPortfolioCategory', Portfolio.getPortfolioCategory);
router.post('/favouritePortfolio', Portfolio.updateFavouritePortfolio);
router.post('/portfolioApproveStatus', Portfolio.portfolioApproveStatus);
router.post('/getPortfolioByQueryforMerchant',Portfolio.getPortfolioByQueryforMerchant)


// payment api
router.post('/createOrder', Merchant.createOrder);
router.post('/paymentDetails', Merchant.paymentDetails);
router.post('/subscriptionPaymentDetails', Merchant.subscriptionPaymentDetails);




function isAdmin(req, res, next) {
  if(req.user.userType == 'admin') next();
  else return res.json({status: false, response: "unauthorized"});
}

function isMerchant_Admin(req, res, next) {
  if(req.user.userType == 'merchant' || req.user.userType == 'admin') next();
  else return res.json({status: false, response: "unauthorized"});
}

module.exports = router;