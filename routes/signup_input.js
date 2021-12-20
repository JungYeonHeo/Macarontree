/**
 * 
 * 회원가입 절차 중 정보를 입력하는 페이지 
 */

var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
    res.render('../views/signup_input.ejs');
});

module.exports = router;
