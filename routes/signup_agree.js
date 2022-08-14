const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  res.render("../views/signup_agree.ejs");
});

module.exports = router;