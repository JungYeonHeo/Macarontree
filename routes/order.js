const express = require("express");
const router = express.Router();
const mongodb_connection = require("../db/mongodb_conn");
const moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");
var date = moment().format("YYYY-MM-DD HH:mm:ss");

let msg = "";

router.route("/").post(function (req, res) {
  console.log("### order 호출됨.");
  console.log(req.body);

  if (req.session.user_id == undefined) {
    msg = "로그인 후 이용해주세요";
    res.send({ result: 1, msg: msg });
  } else {
    mongodb_connection.connectToServer(function (err, client) {
      if (err) console.log(">>> MongoDB 접속 중 에러 발생함 - " + err);

      var mongodb = mongodb_connection.getDb();

      // orderSchema Model
      var orderList = [
        {
          ord_id: req.session.user_id,
          ord_date: date,
          ord_content: req.body,
        },
      ];
      mongodb.collection("order").insertMany(orderList, function (err, res) {
        if (err) console.log(">>> 주문 데이터 값 삽입 중 에러 발생함 - " + err);
      });

      msg = "주문이 완료되었습니다.";
      console.log("### " + msg);
      res.send({ result: 0, msg: msg });
    });
  }
});

module.exports = router;