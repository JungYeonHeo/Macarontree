/**
 * 
 * 마카롱 트리의 기본/프리미엄 상품에 대한 정보를 DB애서 불러오는 페이지 (--> Mysql 사용)
 * 로그인한 사용자일 경우에는 찜한 상품일 경우 빨간색 하트로 표시 (--> mongoDB 사용)
 * 
 */

var express = require('express');
var router = express.Router();
 
// db connection
var connection = require('../db/db_conn')();
var db_conn = connection.init();
 
var mongodb_connection = require('../db/mongodb_conn');

// 전달할 데이터 객체 생성
var send_data = {};
router.get('/', function(req, res, next) {
 
     // 커넥션 풀에서 연결 객체를 가져옴
    db_conn.getConnection(function(err, conn) {
        if (err) {
            if (conn) {
                conn.release(); 
            }
            return;
        }
         
        // product 데이터 SQL 문을 실행함
        conn.query('select prd_id, prd_img, prd_kor, prd_eng, prd_type from product', function(err, rows, columns) {
             
            if (err) {
                console.log(">>> product SQL 실행 시 에러 발생함 - " + err);
                return;
            }
             
            // 이미지 경로 지정
            for (var i = 0; i < rows.length; i++) {
                for (var keyNm in rows[i]) {
                    if (keyNm == "prd_img") {
                        rows[i][keyNm] = "/public/images/" + rows[i][keyNm];
                    }
                }
            }
            send_data.product = rows;
            console.log("### 상품 조회");
            console.log(rows);
        });
 
        conn.on('error', function(err) {      
            console.log(">>> 데이터베이스 연결 시 에러 발생함 - " + err);
        });

        return;
    });

    mongodb_connection.connectToServer(function(err, client) {
        if (err) return console.log(">>> mongodb 연결 중 에러 발생함 - " + err);

        var mongodb = mongodb_connection.getDb();
        mongodb.collection("like").find({ m_id: req.session.user_id }, {unique: true}).toArray(function (err, result) {
            if (err) console.log(">>> 찜한 상품 전체 조회 중 에러 발생함 - " +  err)
            console.log("### 찜한 상품 전체 조회");
            console.log(result);  
            send_data.likes = result; 

            // basic.html 렌더링
            res.render('../views/basic', send_data);
        });
    });

});
 
module.exports = router;