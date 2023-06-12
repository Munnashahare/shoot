var express = require('express');
var router = express.Router();
var Index = require('../controller/index');



router.get('/dashboard_count', Index.dasboard_count_api);

router.get('/*', (req, res) => {
    return res.render('index');
});

module.exports = router;