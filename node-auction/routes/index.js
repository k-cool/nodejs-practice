const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { Auction, Good, User } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

router //
  .route("/")
  .get(async (req, res, next) => {
    try {
      const goods = await Good.findAll({ where: { SoldId: null } });
      res.render("main", { title: "NodeAuction", goods });
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

router //
  .route("/join")
  .get(isNotLoggedIn, async (req, res, next) => {
    try {
      res.render("join", {
        title: "회원가입 - NodeAuction",
      });
    } catch (err) {
      console.error(err);
    }
  });

router //
  .route("/good")
  .get(isLoggedIn, async (req, res, next) => {
    try {
      res.render("good", { title: "상품등록 - NodeAuction" });
    } catch (err) {
      console.error(err);
    }
  });

try {
  fs.readdirSync("uploads");
} catch (err) {
  console.error("uploads 폴더가 없어서 새롭게 생성합니다.");
  fs.mkdirSync("uploads");
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "uploads/");
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(
        null,
        path.basename(file.originalname, ext) + new Date().valueOf() + ext
      );
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router //
  .route("/good")
  .post(isLoggedIn, upload.single("img"), async (req, res, next) => {
    try {
      const { name, price } = req.body;
      await Good.create({
        OwnerId: req.user.id,
        name,
        price,
        img: req.file.filename,
      });

      res.redirect("/");
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

module.exports = router;
