const UserService = require("../services/user.service");
const session = require("express-session");
const crypto = require("crypto");

class UserController {
  static async loginUser(req, res) {
    res.status(200).render("login.ejs");
  }

  static async loginCheckUser(req, res) {
    const { id, pw } = req.body;
    const salt = id;
    const hashPassword = crypto.createHash("sha512").update(pw + salt).digest("hex");
    try {
      const userInfo = await UserService.getUser(id, hashPassword);
      if (userInfo) {
        res.locals.isLogin = true;
        req.session.logined = true;
        req.session.user_id = id;
        return res.json({ status: 200, message: "로그인되었습니다." });
      }
      res.json({ status: 400, message: "아이디 또는 패스워드가 일치하지 않습니다." });
    } catch (err) {
      console.log(err);
      return res.json({ status: 500, message: "로그인 중 에러가 발생하였습니다. 관리자에게 문의해주세요." });
    }
  }

  static async logoutUser(req, res) {
    req.session.destroy();
    res.redirect("/");
  }

  static async signupAgreeUser(req, res) {
    res.status(200).render("signup_agree.ejs");
  }

  static async signupInputUser(req, res) {
    res.status(200).render("signup_input.ejs");
  }

  static async signupIdCheckUser(req, res) {
    const { id } = req.body;
    try {
      const userInfo = await UserService.getUserById(id);
      if (userInfo) {
        return res.json({ status: 409, message: "아이디가 중복됩니다." });
      }
      res.json({ status: 200, message: "사용가능한 이메일입니다." });
    } catch (err) {
      console.log(err);
      return res.json({ status: 500, message: "아이디 중복 확인 중 에러가 발생하였습니다. 관리자에게 문의해주세요." });
    }
  }

  static async signupAddUser(req, res) {
    const { id, pw, name, tel, addr } = req.body;
    const salt = id;
    const hashPassword = crypto.createHash("sha512").update(pw + salt).digest("hex");
    try {
      await UserService.setUser(id, hashPassword, name, tel, addr);
      return res.json({ status: 200, message: "회원가입 되었습니다." });
    } catch (err) {
      console.log(err);
      return res.json({ status: 500, message: "회원가입 중 에러가 발생하였습니다. 관리자에게 문의해주세요." });
    }
  }

  static async orderListUser(req, res) {
    const userId = req.session.user_id;
    try {
      let order = await UserService.getOrderList(userId);
      res.status(200).render("order_list.ejs", { order: order });
    } catch (err) {
      console.log(err);
      return res.status(500).render("error.ejs", { status: 500, message: "주문내역조회 중 에러가 발생하였습니다. 관리자에게 문의해주세요." });
    }
  }

  static async likeListUser(req, res) {
    const userId = req.session.user_id;
    try {
      let like = await UserService.getLikeList(userId);
      if (like.length != 0) {  
        let likeArray = [];
        like.forEach(i => likeArray.push("'" + i.prd_id + "'"));
        like = await UserService.getLikeProductInfo(likeArray.join(","));
        console.log(like);
      }
      res.status(200).render("like_list.ejs", { like: like });
    } catch (err) {
      console.log(err);
      return res.status(500).render("error.ejs", { status: 500, message: "찜한 상품 조회 중 에러가 발생하였습니다. 관리자에게 문의해주세요." });
    }
  }

  static async likeListDeleteUser(req, res) {
    const all = req.body.all;
    const userId = req.session.user_id;
    try {
      if (all == "Yes") {
        await UserService.setDeleteLikeList({ m_id: req.session.user_id });
        return res.json({ status: 200, message: "찜한 상품에서 삭제되었습니다." });
      } else {
        const deleteList = JSON.parse(req.body.deleteList);
        for (var i = 0; i < deleteList.length; i++) {
          await UserService.setDeleteLikeOne(userId, deleteList[i]);
          if (i == deleteList.length - 1) {
            return res.json({ status: 200, message: "찜한 상품에서 삭제되었습니다." });
          }
        }
      }
    } catch (err) {
      console.log(err);
      res.status(500).render("error.ejs", { status: 500, message: "찜한 상품 삭제 중 에러가 발생하였습니다. 관리자에게 문의해주세요." });
    }
  }

  static async updateUser(req, res) {
    const userId = req.session.user_id;
    try {
      const user = await UserService.getUserInfo(userId);
      res.status(200).render("user_update.ejs", { user: user });
    } catch (err) {
      console.log(err);
      return res.status(500).render("error.ejs", { status: 500, message: "유저 정보 조회 중 에러가 발생하였습니다. 관리자에게 문의해주세요." });
    }
  }

  static async updateDoneUser(req, res) {
    const userId = req.session.user_id;
    const { pw, name, tel, addr } = req.body;
    const salt = userId;
    const hashPassword = crypto.createHash("sha512").update(pw + salt).digest("hex");
    try {
      await UserService.setUserInfo(userId, hashPassword, name, tel, addr);
      return res.json({ status: 200, message: "회원정보가 수정되었습니다." });
    } catch (err) {
      console.log(err);
      return res.status(500).render("error.ejs", { status: 500, message: "유저 정보 수정 중 에러가 발생하였습니다. 관리자에게 문의해주세요." });
    }

  }
}

module.exports = UserController;
