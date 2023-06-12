var express = require('express');
var router = express.Router();
var product_size = require('../controller/product_size');
const passport = require('passport');

// product_size api
router.post('/addproduct_size', product_size.addproduct_size);
router.post('/getallproduct_size',  product_size.getproduct_size);
router.post('/removeproduct_size',  product_size.remove);


module.exports = router;