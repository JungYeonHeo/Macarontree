/**
 * 로그인을 하는 페이지 
 * 
 */

var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
    res.render('../views/login.ejs');
});

module.exports = router;
