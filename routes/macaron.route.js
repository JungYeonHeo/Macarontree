const express = require("express");
const router = express.Router();
const MacaronController = require("../controllers/macaron.controller");
const upload = require("../middleware/fileStore");

router.get("/basic", MacaronController.basicMacaron);
router.post("/like_add_delete", MacaronController.likeAddDeleteMacaron);
router.get("/unique", MacaronController.uniqueMacaron);
router.post("/order", MacaronController.orderMacaron);
router.get("/order_done", MacaronController.orderDoneMacaron);
router.get("/contest", MacaronController.contestMacaron);
router.post("/upload", upload.single("photo"), MacaronController.uploadMacaron);
router.get("/cooking", MacaronController.cookingMacaron);
router.get("/mind", MacaronController.mindMacaron);

module.exports = router;