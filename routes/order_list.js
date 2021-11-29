/**
 * 유니크한 개인 마카롱를 주문한 주문 목록을 보는 페이지 
 * 
 */
var express = require('express');
var router = express.Router();
var session = require('express-session');


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

// 전달할 데이터 객체 생성
var send_data = {};
router.get('/', function(req, res, next) {

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var database = db.db("mongo");
    database.collection("order").find({ord_id: req.session.user_id}).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      send_data.order = result;
      res.render('../views/order_list.ejs', send_data);
      db.close();

    });
  });
});


module.exports = router;
