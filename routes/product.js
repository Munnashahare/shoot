var express = require('express');
var router = express.Router();
var product = require('../controller/product');
const passport = require('passport');

// product api
router.post('/addproduct', product.addproduct);
router.post('/getallproduct',  product.getproduct);
router.post('/getproductById',  product.getproductById);
router.post('/updateproduct',  product.updateproduct);
router.post('/removeproduct',  product.remove);

router.post('/getproductwithcategory',  product.getproductwithcategory);
router.post('/approveproduct',product.approveproduct);


module.exports = router;