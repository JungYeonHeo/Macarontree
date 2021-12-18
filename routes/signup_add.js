/**
 * 사용자 회원가입을 처리 
 * 
 */

var http = require('http');
var crypto = require('crypto');
var express = require('express');
var router = express.Router();

var connection = require('../db/db_conn')();
var db_conn = connection.init();

var  msg = "";
var result;

// 사용자를 등록하는 함수
router.post('/', function(req, res, next) {
    console.log("signup_add 호출됨");
    
    // 요청 파라미터 확인
    console.log(req.body);
    let id = req.body.id;
    let pw = req.body.pw;
    let name = req.body.name;
    let tel = req.body.tel;
    let addr = req.body.addr;
    let salt = id;
	let hashPassword = crypto.createHash("sha512").update(pw + salt).digest("hex");
	
	// 커넥션 풀에서 연결 객체를 가져옴
	db_conn.getConnection(function(err, conn) {
        if (err) {
        	if (conn) {
                conn.release();
            }
            console.log(">>> DB 연결 중 에러 발생함 - " +  err);
            msg = "DB 연결 중 에러 발생함";
			res.send({result: 0, msg: msg});
			return;          
        }   
        console.log("데이터베이스 연결 스레드 아이디 : " + conn.threadId);

        // 데이터를 객체로 만듦
        var data = { "m_id": id, "m_pw": hashPassword, "m_name": name, "m_tel": tel, "m_addr" : addr };
        
        // 회원가입 SQL 문을 실행함
        var inputUserData = conn.query('insert into member set ?', [data], function(err, result) {
            conn.release();  
            console.log("### 실행 대상 SQL : " + inputUserData.sql);
            
            if (err) {
                console.log(">>> 회원가입 중 에러 발생함 - " +  err);
                msg = "회원가입 중 에러 발생";
                res.send({result: 3, msg: msg});      
                return;  
            } else {
                msg = "회원가입 성공";
                res.send({result: 4, msg: msg});
                return; 
            }
        });
    });
	
});

module.exports = router;