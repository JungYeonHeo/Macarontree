/**
 * 
 * Basic 상품 중 사용자가 찜한 상품 저장 
 * mongo DB 사용
 * 
 */

var express = require('express');
var router = express.Router();

// db connection
var mongodb_connection = require('../db/mongodb_conn');

var msg = "";
router.route('/').post(function(req, res) {
    console.log('### like_add_delete 호출됨.');
    console.log("찜한 상품 : " + req.body.prd_id + ", " + req.session.user_id);

    if (req.session.user_id == undefined) {
        msg = "로그인 후 이용해주세요";
        res.send({result: 0, msg: msg});
    } else {
        mongodb_connection.connectToServer(function(err, client) {
            if (err) console.log(">>> MongoDB 연결 중 에러 - " + err);
            var mongodb = mongodb_connection.getDb();

            var selectLike = { $and : [
                {
                    m_id: req.session.user_id,
                    prd_id: req.body.prd_id
                }
            ]};

            var likeList = [
                {
                    m_id: req.session.user_id,
                    prd_id: req.body.prd_id
                }
            ];

            mongodb.collection("like").find(selectLike).toArray(function (err, result) {
                if (err) { 
                    console.log(">>> 해당 상품 조회 중 에러 - " + err);
                } else if (result.length > 0) { // 이미 찜한 상품으로 등록이 되어 있는 경우 = 데이터 삭제 
                    mongodb.collection("like").deleteOne(selectLike, function(err, result) {
                        if (err) { 
                            console.log(">>> 해당 상품 삭제 중 에러 - " + err);
                        } else {
                            msg = "찜한 상품에서 삭제되었습니다.";
                            res.send({result: 1, msg: msg});
                        }
                    });
                } else {  // 기존에 찜 한 상품으로 등록되어 있지 않은 경우 = 데이터 추가 
                    mongodb.collection("like").insert(likeList, {unique:true}, function(err, result) {
                        if (err) {  
                            console.log(">>> 찜한 상품 추가 중 에러 - " + err);
                        } else {
                            msg = "찜한 상품에 추가되었습니다.";
                            res.send({result: 2, msg: msg});
                        }
                    });
                }
            });
        });
    }
});

module.exports = router;