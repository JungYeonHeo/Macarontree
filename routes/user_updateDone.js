/**
 * 
 * 개인 정보를 수정을 처리
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
    console.log('user_updateDone 호출됨');
    
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
            msg = "정보 수정 중 에러  발생";
            result = 0;
			res.send({result: 0, msg: msg});
			return;          
        }   
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);

        // 회원가입 SQL 문을 실행함
        var updateUserData = conn.query('update member set m_pw =?, m_name = ?, m_tel = ?, m_addr = ? where m_id = ?', [hashPassword, name, tel, addr, id], function(err, result) {
            conn.release();  
            console.log('실행 대상 SQL : ' + updateUserData.sql);
            
            if (err) {
                console.log('SQL 실행 시 에러 발생함.');
                console.dir(err);
                msg = "정보 수정 중 에러  발생";
                res.json({result: 3, msg: msg});
                return;          
            } else {
                msg = "정보 수정 성공";
                console.log("성공");
                res.send({result:1, msg:msg});
                return;
            }
        });
    });
	
});

module.exports = router;