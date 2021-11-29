/**
 * 
 * Basic 상품 중 사용자가 찜한 상품 삭제
 * mongo DB 사용
 * 
 */

var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var msg = "";


router.route('/').post(function(req, res) {
    console.log('/like_delete 호출됨.');
    console.log(req.body);
    console.log(req.body.prd_id);
    console.log(req.session.user_id);

    MongoClient.connect(url, function(err, db) {
        if (err) console.log("MongoDB에러");

        var database = db.db("mongo");

        var likeList = 
            {
                prd_id: req.session.user_id,
                prd_like: req.body.prd_id
            };

        // 넘겨 받은 데이터 삭제
        database.collection("like").remove(likeList, function(err, res) {
            if (err)  throw err; 
            db.close();
        });
            msg = "찜한 상품에서 삭제되었습니다.";
            console.log(msg);
            res.send({result: 0, msg: msg});
            return;
    });
});

module.exports = router;