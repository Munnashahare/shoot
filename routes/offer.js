var express = require('express');
var router = express.Router();
const passport = require('passport');

var offer = require('../controller/offer');

router.post('/addOffer', offer.addOffer);
router.post('/getOfferById', offer.getOfferById);
router.post('/getallOffer', offer.allOffer);
router.post('/getOfferByCode', offer.getOfferByCode);
router.post('/updateOffer', offer.updateOffer);
router.post('/updateStatus', offer.updateStatus);
router.post('/removeOffer', offer.removeOffer);

module.exports = router;