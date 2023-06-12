var express = require('express');
var router = express.Router();
var Unavailable_date = require('../controller/unavailable_date');
const passport = require('passport');

// Unavailable Date Api
router.post('/addUnavailable_Date', Unavailable_date.addDate);
router.post('/getAllByQuery', Unavailable_date.getAll);
router.post('/getDateById', Unavailable_date.getDateById);
router.post('/updateDate', Unavailable_date.updateDate);
router.post('/removeDate', Unavailable_date.removeDate);

function isAdmin(req, res, next) {
    if(req.user.userType == 'admin') next();
    else return res.json({status: false, response: "unauthorized"});
} 

module.exports = router;