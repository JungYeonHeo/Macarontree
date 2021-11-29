/**
 * 
 * 유니크 상품을 주문 할 수 있는 페이지 
 */

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('../views/unique.ejs');
});


module.exports = router;