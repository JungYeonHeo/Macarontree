/*
 * 사용자 로그인 처리
 *
 */

var crypto = require('crypto');

var express = require('express');
var router = express.Router();
var session = require('express-session');


// db connection
var connection = require('../db/db_conn')();
var db_conn = connection.init();


var  msg = "";
// 로그인
router.post('/', function(req, res) {
	 console.log('/login_check 호출됨.');

    // 요청 파라미터 확인
    var paramId = req.body.id || req.query.id;
	var paramPassword = req.body.password || req.query.password;
	var salt = paramId; 
	let hashPassword = crypto.createHash("sha512").update(paramPassword + salt).digest("hex");
    console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword);
	
    // pool 객체가 초기화된 경우, authUser 함수 호출하여 사용자 인증
	if (db_conn) {
		authUser(paramId, hashPassword, function(err, rows) {
		// 에러 발생 시, 클라이언트로 에러 전송
		if (err) {
			console.error('사용자 로그인 중 에러 발생 : ' + err.stack);
			
			msg = "사용자 로그인 중 에러 발생";
			res.send({result: 0, msg: msg});
			return;          
		}
			
		// 조회된 레코드가 있으면 성공 응답 전송
		if (rows) {
			console.dir(rows);
			console.log("로그인 성공");

			// 조회 결과에서 사용자 이름 확인
			// var username = rows[0].m_name;
			// console.log("로그인한 사용자: " +rows[0].m_name);

			res.locals.isLogin = true;
			
			req.session.logined = true;
			req.session.user_id = paramId;
			msg = "로그인 되었습니다.";
			res.send({result: 1, msg: msg});
			return;          
		} else {  // 조회된 레코드가 없는 경우 실패 응답 전송
			msg = "아이디 또는 패스워드가 일치하지 않습니다.";
			res.send({result: 2, msg: msg});
			return;          
		}
	});
	} else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
		msg = "데이터 베이스 연결 실패";
		res.send({result: 3, msg: msg});
		return;          
	}
});


// 사용자 인증
var authUser =  function(id, password, callback) {
	console.log('authUser 호출됨 : ' + id + ', ' + password);
	
	// 커넥션 풀에서 연결 객체를 가져옴
	db_conn.getConnection(function(err, conn) {
        if (err) {
		console.log("Error");
        	if (conn) {
                conn.release();  
            }
            callback(err, null);
            return;
        }   
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);
          
        var columns = ['m_id', 'm_name'];
        var tablename = 'member';
 
        // 로그인 할 계정 조회 SQL 문을 실행
        var exec = conn.query("select ?? from ?? where m_id = ? and m_pw = ?", [columns, tablename, id, password], function(err, rows) {
            conn.release();  
            console.log('실행 대상 SQL : ' + exec.sql);
            
			console.log(rows.length);
            if (rows.length) {
    	    	console.log('아이디 [%s], 패스워드 [%s] 가 일치하는 사용자 찾음.', id, password);
    	    	callback(null, rows);
            } else {
            	console.log("일치하는 사용자를 찾지 못함.");
    	    	callback(null, null);
            }
        });

        conn.on('error', function(err) {      
            console.log('데이터베이스 연결 시 에러 발생함.');
            console.dir(err);
            
            callback(err, null);
        });
    });
	
}

// 로그아웃
router.get('/logout', function(req, res, next) {
	req.session.destroy();

	res.redirect('/');
});

module.exports = router;
