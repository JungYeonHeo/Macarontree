/**
 * 회원가입시 id 중복을 막기 위한 id 중복을 체크
 * 
 */

var http = require('http');
var crypto = require('crypto');
var express = require('express');
var router = express.Router();

var connection = require('../db/db_conn')();
var db_conn = connection.init();
    
var result;
router.post('/', function(req, res) {
    console.log('/id_check 호출됨.');
     
    console.log(req.body);
    let id = req.body.id;
    db_conn.getConnection(function(err, conn) {
        if (err) {
        	if (conn) {
                conn.release();
            }
            msg = "사용자 로그인 중 에러  발생";
            result = 0;
			return;          
        }   
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);

        // 데이터를 객체로 만듦
        
        // id  중복 체크 
        var exec = conn.query('select * from member where m_id = ? ', [id], function(err, dbdata) {
        	console.log('실행 대상 SQL : ' + exec.sql);
        	
        	if (err) {
        		console.log('id 중복 체크 중 SQL 실행 시 에러 발생함.');
        		console.dir(err);
                
                result = 1;
                msg = "다시 시도해주세요.";
                return;          
            } 
            
            // 조회된 레코드가 있으면 id 중복 응답 전송
            if (dbdata.length != 0) {
                console.dir(dbdata);
                console.log("id 중복");

                result = 1;
            } else {
                console.log("id 중복 아님");
                result = 2;
            }
            res.send({result: result});
            return;
        });
    });
});
module.exports = router;