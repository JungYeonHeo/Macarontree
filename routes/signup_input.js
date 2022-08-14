const express = require("express");
const router = express.Router();

router.post("/", function (req, res, next) {
  res.render("../views/signup_input.ejs");
});

module.exports = router;