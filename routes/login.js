/**
 * 로그인을 하는 페이지 
 * 
 */

var express = require('express');
var router = express.Router();
var session = require('express-session');


router.get('/', function(req, res, next) {
    res.render('../views/login.ejs');
});

router.post('/', function(req, res, next) {
    res.render('../views/login');
});
module.exports = router;
