/**
 * 베이직 페이지에서 찜한 상품 목록을 보는 페이지 
 * 
 */

var express = require('express');
var router = express.Router();

// db connection
var connection = require('../db/db_conn')();
var db_conn = connection.init();

var mongodb_connection = require('../db/mongodb_conn');

var send_data = {};
router.get('/', function(req, res, next) {

    mongodb_connection.connectToServer(function(err, client) {
        if (err) return console.log(">>> mongodb 연결 중 에러 발생함 - " + err);

        var mongodb = mongodb_connection.getDb();
        mongodb.collection("like").find({prd_id: req.session.user_id}).toArray(function(err, result) {
            if (err) console.log(">>> 찜한 상품 전체 조회 중 에러 발생함 - " +  err)

            var str = "";
            for (var i = 0; i < result.length; i++) {
                if (i == 0) {
                    str = str + "'" + result[i].prd_like + "'";
                } else {
                    str = str + "," + "'" + result[i].prd_like + "'";
                }
            }

            console.log("### 찜한 상품 조회");
            console.log(str);

        if (result.length > 0) {
        // mongo DB에서 데이터 조회한 후에 해당 데이터를 mysql로 조회 
            db_conn.getConnection(function(err, conn) {
                if (err) {
                    if (conn) {
                        conn.release();
                    }
                }

                // product SQL 문을 실행함
                console.log("### like_list mysql 조회 중");
                var selectProductData = conn.query('select * from product where prd_id in(' + str + ')', function(err, result) {
                    console.log("실행 대상 SQL : " + selectProductData.sql);
                    
                    if (err) {
                        console.log("SQL 실행 시 에러 발생함 - " + err);         
                    } else {
                        console.log(result);
                        send_data.like = result;
                        res.render('../views/like_list', send_data);
                    }
                });
            });
        }

        });
    });

});

module.exports = router;
