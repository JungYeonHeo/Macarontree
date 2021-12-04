/**
 * 유니크한 개인 마카롱를 주문한 주문 목록을 보는 페이지 
 * 
 */
var express = require('express');
var router = express.Router();

// db connection
var mongodb_connection = require('../db/mongodb_conn');

// 전달할 데이터 객체 생성
var send_data = {};
router.get('/', function(req, res, next) {

  mongodb_connection.connectToServer(function(err, client) {
    if (err) console.log(">>> MongoDB 접속 중 에러 발생함 - " +  err);

    var mongodb = mongodb_connection.getDb();
    mongodb.collection("order").find({ord_id: req.session.user_id}).toArray(function(err, result) {
      if (err) console.log(">>> 주문 내역 조회 중 에러 발생함 - " +  err);

      console.log("### 주문 내역 조회");
      console.log(result);
      send_data.order = result;

      res.render('../views/order_list.ejs', send_data);
    });
  });
});


module.exports = router;
