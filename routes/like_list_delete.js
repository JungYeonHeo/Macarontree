const express = require("express");
const router = express.Router();
const connection = require("../db/mysqlConfig")();
const db_conn = connection.init();
const mongodb_connection = require("../db/mongoConfig");

router.post("/", function (req, res, next) {
  console.log("### like_list_delete 호출됨.");
  console.log("### 전체 삭제 여부 : " + req.body.all);

  mongodb_connection.connectToServer(function (err, client) {
    if (err) {
      console.log(">>> MongoDB 연결 중 에러 - " + err);
      msg = "찜한 상품 삭제를 실패하였습니다.";
      res.send({ result: 1, msg: msg });
    }
    var mongodb = mongodb_connection.getDb();

    if (req.body.all == "Yes") {
      // 전체 삭제

      var deleteUser = {
        m_id: req.session.user_id,
      };

      mongodb.collection("like").deleteMany(deleteUser, function (err, result) {
        if (err) {
          console.log(">>> 해당 상품 삭제 중 에러 - " + err);
          msg = "찜한 상품 삭제를 실패하였습니다.";
          res.send({ result: 1, msg: msg });
        } else {
          msg = "찜한 상품에서 삭제되었습니다.";
          res.send({ result: 0, msg: msg });
        }
      });
    } else {
      // 선택 삭제

      console.log("### 삭제 상품 번호 : " + req.body.deleteList + ", " + req.session.user_id);

      var jsonDeleteList = JSON.parse(req.body.deleteList);

      for (var i = 0; i < jsonDeleteList.length; i++) {
        var deleteUserItem = {
          $and: [
            {
              m_id: req.session.user_id,
              prd_id: jsonDeleteList[i],
            },
          ],
        };

        mongodb.collection("like").deleteOne(deleteUserItem, function (err, result) {
          if (err) {
            console.log(">>> 해당 상품 삭제 중 에러 - " + err);
            msg = "찜한 상품 삭제를 실패하였습니다.";
            res.send({ result: 1, msg: msg });
          }
        });

        if (i == jsonDeleteList.length - 1) {
          msg = "찜한 상품에서 삭제되었습니다.";
          res.send({ result: 0, msg: msg });
        }
      }
    }
  });
});

module.exports = router;
