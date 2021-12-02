/**
 * 
 * 사용자 개인 정보를 수정하는 페이지에 사용자 정보를 로드 시킴
 */

var express = require('express');
var router = express.Router();

var connection = require('../db/db_conn')();
var db_conn = connection.init();

router.get('/', function(req, res, next) {
    console.log("### user_update 호출");

    var id = req.session.user_id;
    console.log("req.session.user_id: " + id);
    
    // 전달할 데이터 객체 생성
    var send_data = {};

    // 커넥션 풀에서 연결 객체를 가져옴
    db_conn.getConnection(function(err, conn) {
        if (err) {
        	if (conn) {
                conn.release(); 
            }
            return;
        }
    	
        // SQL 문을 실행함
        var query = conn.query('select m_id, m_pw, m_name, m_tel, m_addr from member where m_id = ?', id, function(err, rows) {
        	
        	if (err) {
                console.log(">>> SQL 실행 시 에러 발생함 - " +  err);
        		return;
            }
            
            console.log("실행 대상 SQL : " + query.sql);
            
            // 객체에 보여줄 데이터 추가
            send_data.user = rows;
            res.render('../views/user_update.ejs', send_data);
        });

        conn.on('error', function(err) {      
            console.log(">>> 데이터베이스 연결 시 에러 발생함 - " +  err);
        });
    });
});

module.exports = router;