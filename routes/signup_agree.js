/**
 * 
 * 회원가입 절차 중 약관 동의 페이지 
 */

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('../views/signup_agree.ejs');
});

module.exports = router;