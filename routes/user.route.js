const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");

router.get("/login", UserController.loginUser);
router.post("/login_check", UserController.loginCheckUser);
router.get("/logout", UserController.logoutUser);
router.get("/signup_agree", UserController.signupAgreeUser);
router.post("/signup_input", UserController.signupInputUser);
router.post("/signup_id_check", UserController.signupIdCheckUser);
router.post("/signup_add", UserController.signupAddUser);

router.get("/order_list", UserController.orderListUser);
router.get("/like_list", UserController.likeListUser);
router.put("/like_list_delete", UserController.likeListDeleteUser);
router.get("/user_update", UserController.updateUser);
router.put("/user_update", UserController.updateDoneUser);

module.exports = router;