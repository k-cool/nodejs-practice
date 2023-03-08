const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const schedule = require("node-schedule");

const { Auction, Good, User, sequelize } = require("../models");
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

router //
  .route("/good/:id")
  .get(isLoggedIn, async (req, res, next) => {
    try {
      const [good, auction] = await Promise.all([
        Good.findOne({
          where: { id: req.params.id },
          include: { model: User, as: "Owner" },
        }),
        Auction.findAll({
          where: { GoodId: req.params.id },
          include: { model: User },
          order: [["bid", "ASC"]],
        }),
      ]);

      res.render("auction", {
        title: `${good.name} - NodeAuction`,
        good,
        auction,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

router //
  .route("/good/:id/bid")
  .post(isLoggedIn, async (req, res, next) => {
    try {
      const { bid, msg } = req.body;
      const good = await Good.findOne({
        where: { id: req.params.id },
        include: { model: Auction },
        order: [[{ model: Auction }, "bid", "DESC"]],
      });

      if (good.price >= bid)
        return res.status(403).send("시작 가격보다 높게 입찰해야 합니다.");

      if (new Date(good.createdAt).valueOf() + 24 * 60 * 60 * 1000 < new Date())
        return res.status(403).send("경매가 이미 종료되었습니다.");

      if (good.Auctions[0] && good.Auctions[0].bid >= bid)
        return res.status(403).send("이전 입찰가보다 높아야 합니다.");

      const result = await Auction.create({
        bid,
        msg,
        UserId: req.user.id,
        GoodId: req.params.id,
      });

      req.app
        .get("io")
        .to(req.params.id)
        .emit("bid", { bid: result.bid, msg: result.msg, nick: req.user.nick });

      return res.send("ok");
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

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
      const good = await Good.create({
        OwnerId: req.user.id,
        name,
        price,
        img: req.file.filename,
      });

      // 낙찰시간에 실행될 내용
      const end = new Date();
      end.setDate(end.getDate() + 1);

      schedule.scheduleJob(end, async () => {
        const success = await Auction.findOne({
          where: { GoodId: good.id },
          order: [["bid", "DESC"]],
        });

        await Good.update(
          { SoldId: success.UserId },
          { where: { id: good.id } }
        );
        await User.update(
          { money: sequelize.literal(`money - ${success.bid}`) },
          { where: { id: success.UserId } }
        );
      });

      res.redirect("/");
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

module.exports = router;
