var express = require('express');
var router = express.Router();
var Banner=require('../controller/banner');
router.post('/add',Banner.addBanner);
router.post('/update',Banner.updateBanner);
router.post('/remove',Banner.removeBanner);
router.post('/getbanner',Banner.getAllBanner);
router.post('/upload',Banner.upload_image);
router.post('/delimg',Banner.remove_Image);
router.post('/updatestatus',Banner.updateStatus);




module.exports=router;