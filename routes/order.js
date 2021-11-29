/**
 * 
 * unique 상품 주문을 처리 
 * mongo DB 사용
 * 
 */

var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

// 현재 시간 구하기 
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
var date = moment().format('YYYY-MM-DD HH:mm:ss');
console.log("현재시간: " + date);

var msg = "";

router.route('/').post(function(req, res) {
    console.log('/order 호출됨.');
    console.log(req.body);
    
    if (req.session.user_id == undefined) {
        msg = "로그인 후 이용해주세요";
        res.send({result: 1, msg: msg});
        return;
    } else {
        MongoClient.connect(url, function(err, db) {
            if (err) console.log("MongoDB에러");

            var database = db.db("mongo");
            // console.log(req.body);

            // orderSchema Model
            var orderList = [
                {
                    ord_id: req.session.user_id,
                    ord_date: date,
                    ord_content: req.body
                } 
            ];
            database.collection("order").insertMany(orderList, function(err, res) {
                if (err)  throw err; 
                db.close();
            });

            msg = "주문이 완료되었습니다.";
            console.log(msg);
            res.send({result: 0, msg: msg});
            return;
        });
    }
});

module.exports = router;