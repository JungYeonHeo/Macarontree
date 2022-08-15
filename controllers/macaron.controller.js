const MacaronService = require("../services/macaron.service");
const UserService = require("../services/user.service");
const moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");

class MacaronController {
  static async index(req, res) {
    try {
      const product = await MacaronService.getProduct4();
      const contest = await MacaronService.getContest4();
      product.map(i => i.prd_img = "/public/images/" + i.prd_img);
      contest.map(i => i.cont_img = "/uploads/" + i.cont_img);
      res.status(200).render("index.ejs", {
        product : product, 
        contest : contest
      });
    } catch (err) {
      console.log(err);
      res.status(500).render("error.ejs", { status: 500, message: "메인페이지에서 에러가 발생하였습니다. 관리자에게 문의해주세요." });
    }
  }

  static async basicMacaron(req, res) {
    const userId = req.session.user_id;
    try {
      const product = await MacaronService.getProducts();
      product.map(i => i.prd_img = "/public/images/" + i.prd_img);
      const likes = await UserService.getLikeList(userId);
      res.status(200).render("basic.ejs", {
        product : product, 
        likes : likes
      });
    } catch (err) {
      console.log(err);
      res.status(500).render("error.ejs", { status: 500, message: "베이직 상품 조회 중 에러가 발생하였습니다. 관리자에게 문의해주세요." });
    }
  }

  static async likeAddDeleteMacaron(req, res) {
    const userId = req.session.user_id;
    const prdId = req.body.prd_id;
    if (userId == undefined) {
      return res.json({ status: 403, message: "로그인 후 이용해주세요." });
    }
    try {
      const likes = await MacaronService.getLikeList(userId, prdId);
      if (likes == null) {
        await MacaronService.setAddLikeItem(userId, prdId);
        return res.json({ status: 201, message: "찜한상품에 추가되었습니다." });
      } 
      await MacaronService.setMinusLikeItem(userId, prdId);
      return res.json({ status: 200, message: "찜한상품에 삭제되었습니다." });
    } catch (err) {
      console.log(err);
      res.status(500).render("error.ejs", { status: 500, message: "상품 찜 추가/삭제 중 에러가 발생하였습니다. 관리자에게 문의해주세요." });
    }
  }
  
  static async uniqueMacaron(req, res) {
    res.status(200).render("unique.ejs");
  }

  static async orderMacaron(req, res) {
    const userId = req.session.user_id;
    const orderList = req.body;
    if (userId == undefined) {
      return res.json({ status: 403, message: "로그인 후 이용해주세요." });
    }
    const date = moment().format("YYYY-MM-DD HH:mm:ss");
    try {
      await MacaronService.setAddOrder(userId, date, orderList);
      return res.json({ status: 201, message: "주문이 완료되었습니다." });
    } catch (err) {
      console.log(err);
      res.status(500).render("error.ejs", { status: 500, message: "주문 중 에러가 발생하였습니다. 관리자에게 문의해주세요." });
    }
  }

  static async orderDoneMacaron(req, res) {
    res.status(200).render("order_done.ejs");
  }

  static async contestMacaron(req, res) {
    try {
      const contest = await MacaronService.getContests();
      contest.map(i => i.cont_img = "/uploads/" + i.cont_img);
      res.status(200).render("contest.ejs", { results: contest });
    } catch (err) {
      console.log(err);
      res.status(500).render("error.ejs", { status: 500, message: "주문 중 에러가 발생하였습니다. 관리자에게 문의해주세요." });
    }
  }

  static async uploadMacaron(req, res) {
    /**
     * multer 미들웨어 사용 : 미들웨어 사용 순서 body-parser -> multer -> router
     * 파일 제한 : 10개, 1G
     * 저장경로, 파일명 설정
     */

    const { title, review } = req.body;
    const file = req.file;
    const filename = file.filename;
    const userId = req.session.user_id;
    try {
      await MacaronService.setAddContest(title, review, filename, userId);
      res.redirect("/macaron/contest");
    } catch (err) {
      console.log(err);
      res.status(500).render("error.ejs", { status: 500, message: "주문 중 에러가 발생하였습니다. 관리자에게 문의해주세요." });
    }
  }

  static async cookingMacaron(req, res) {
    res.status(200).render("cooking.ejs");
  }

  static async mindMacaron(req, res) {
    res.status(200).render("mind.ejs");
  }
}

module.exports = MacaronController;