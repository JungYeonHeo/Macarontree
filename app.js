const express = require("express");
const cors = require("cors");
const path = require("path");
const logger = require("morgan");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const index = require("./routes/index.route");
const dotenv = require("dotenv");
dotenv.config();

class App {
  constructor() {
    this.app = express();
    this.setViewEngine();
    this.setMiddleWare();
    this.setStatic();
    this.setSession();
    this.getSession();
    this.getRouting();
    this.errorHandler();
  }

  setMiddleWare() {
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.json());
    this.app.use(logger("dev"));
    this.app.use(cors());
  }

  setViewEngine() {
    this.app.set("view engine", "ejs");
    this.app.set("views", path.join(__dirname, "views"));
  }

  setStatic() {
    this.app.use("/public", express.static(path.join(__dirname, "public")));
    this.app.use("/uploads", express.static(path.join(__dirname, "uploads")));
  }

  setSession() {
    this.app.use(
      session({
        key: "sid",
        secret: "secret",
        resave: false,
        saveUninitialized: true,
        store: new FileStore(), // sessions라는 디렉토리가 생김
        cookie: {
          maxAge: 24000 * 60 * 60, // 쿠키 유효기간 24시간
        },
      })
    );
  }

  getSession() {
    this.app.use(function (req, res, next) {
      if (req.session.logined) {
        res.locals.isLogin = true;
      } else {
        res.locals.isLogin = false;
      }
      next();
    });
  }

  getRouting() {
    this.app.use("/", index);
  }

  errorHandler() {
    this.app.use((req, res, _) => {
      res.status(400).render("error.ejs", { message: "404 not page found" });
    });

    this.app.use((req, res, _) => {
      res.status(500).render("error.ejs", { message: "500 Internal Server Error" });
    });
  }
}

module.exports = new App().app;