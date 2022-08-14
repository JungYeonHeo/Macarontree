const express = require("express");
const router = express.Router();
const mongodb_connection = require("../db/mongoConfig");
let send_data = {};
router.get("/", function (req, res, next) {
  mongodb_connection.connectToServer(function (err, client) {
    if (err) console.log(">>> MongoDB 접속 중 에러 발생함 - " + err);

    var mongodb = mongodb_connection.getDb();
    mongodb
      .collection("order")
      .find({ ord_id: req.session.user_id })
      .sort({ ord_date: -1 })
      .toArray(function (err, result) {
        if (err) console.log(">>> 주문 내역 조회 중 에러 발생함 - " + err);

        console.log("### 주문 내역 조회");
        console.log(result);

        if (result.length > 0) {
          send_data.order = result;
        } else {
          send_data.order = null;
        }
        res.render("../views/order_list.ejs", send_data);
      });
  });
});

module.exports = router;