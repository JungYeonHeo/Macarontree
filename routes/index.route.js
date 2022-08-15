const express = require("express");
const router = express.Router();

const user = require("./user.route");
const macaron = require("./macaron.route");
const MacaronController = require("../controllers/macaron.controller");

router.use("/user", user);
router.use("/macaron", macaron);
router.get("/", MacaronController.index);

module.exports = router;