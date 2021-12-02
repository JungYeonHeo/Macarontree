
var express = require('express');
var path = require('path');

// 라우터 사용하여 라우팅 함수 등록
var router = express.Router();

// db connection
var connection = require('../db/db_conn')();
var db_conn = connection.init();

// get으로 요청올 때 router 에 연결
router.get('/', function(req, res, next) {

    // 커넥션 풀에서 연결 객체를 가져옴
    db_conn.getConnection(function(err, conn) {
        if (err) {
        	if (conn) {
                conn.release();  // 반드시 해제해야 함
            }
            return;
        }
    	
        // SQL 문을 실행함
        conn.query('select cont_title, cont_review, cont_img, m_id from contest order by cont_date desc', function(err, rows, columns) {
            conn.release();
            
        	if (err) {
        		console.log(">>> SQL 실행 시 에러 발생함 - " + err);
        		return;
            }
            
            // 이미지 경로 지정
            for (var i = 0; i < rows.length; i++) {
                for (var keyNm in rows[i]) {
                    if (keyNm == "cont_img") {
                        rows[i][keyNm] = "/uploads/" + rows[i][keyNm];
                    }
                }
            }

            var send_data = {
                results: rows
            };

            // contest.html 렌더링
            res.render('../views/contest.ejs', send_data);
        });
        
        conn.on('error', function(err) {      
            console.log(">>> 데이터베이스 연결 시 에러 발생함 - " + err);
        });
    });
});


/* 후기 업로드 */

// 파일 업로드용 미들웨어
var multer = require('multer');

//multer 미들웨어 사용 : 미들웨어 사용 순서 중요  body-parser -> multer -> router
// 파일 제한 : 10개, 1G
// 저장경로, 파일명 설정
var storage = multer.diskStorage({ 
    destination: function (req, file, callback) {
        callback(null, 'uploads')
    },
    filename: function (req, file, callback) {
        var extension = path.extname(file.originalname);
        var basename = path.basename(file.originalname, extension);
        callback(null, basename + Date.now() + extension);
    }
});

var upload = multer({ 
    storage: storage,
    limits: {
		files: 10,
		fileSize: 1024 * 1024 * 1024
	}
});

// 후기 업로드 // post으로 요청올 때 router 에 연결
router.post('/upload', upload.single('photo'), function(req, res, next) {
    
    // html의 form 에서 받아온 데이터
    var title = req.body.title;
    console.log("contest title: " + title);

    var review = req.body.review;
    console.log("contest review: " + review);

     var file = req.file;

     var filename = file.filename;
     console.log("contest file: " + filename);

     // 데이터를 객체로 만듦
     var data = {cont_title:title, cont_review:review, cont_img:filename};

     // 커넥션 풀에서 연결 객체를 가져옴
	db_conn.getConnection(function(err, conn) {
        if (err) {
        	if (conn) {
                conn.release();  // 반드시 해제해야 함
            }
            return;
        }
    	
        // SQL 문을 실행함
        var exec = conn.query('insert into contest set ?', data, function(err, result) {
        	conn.release();  // 반드시 해제해야 함
        	console.log('SQL : ' + exec.sql);
        	
        	if (err) {
        		console.log(">>> SQL 실행 시 에러 발생함 - " + err);
        		return;
        	}
        	
        });
        
        conn.on('error', function(err) {      
            console.log(">>> 데이터베이스 연결 시 에러 발생함 - " + err);
        });
    });

    // 후기 업로드 후 리다이렉트로 새로고침
    res.redirect('/contest');
});

module.exports = router;