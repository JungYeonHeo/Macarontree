const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  res.render("../views/order_done.ejs");
});

module.exports = router;