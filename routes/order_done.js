/**
 * 유니크 상품을 주문 완료하였을시 보여주는 페이지로 마이페이지의 주문 내역화면으로 이동할 수 있는 페이지 
 * 
 */

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('../views/order_done.ejs');
});

module.exports = router;
