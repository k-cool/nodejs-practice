const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const url = require("url");

const { verifyToken, apiLimiter } = require("./middlewares");
const { Domain, User, Post, Hashtag } = require("../models");

const router = express.Router();

router.use(async (req, res, next) => {
  const domain = await Domain.findOne({
    where: { host: url.parse(req.get("origin")).host },
  });

  if (domain)
    cors({
      origin: req.get("origin"),
      credentials: true,
    })(req, res, next);
  else next();
});

router //
  .route("/token")
  .post(apiLimiter, async (req, res, next) => {
    try {
      const { clientSecret } = req.body;
      const domain = await Domain.findOne({
        where: { clientSecret },
        include: { model: User, attributes: ["nick", "id"] },
      });

      if (!domain) {
        return res.status(401).json({
          code: 401,
          message: "등록되지 않은 도메인입니다. 먼저  도메인을 등록하세요",
        });
      }

      const { id, nick } = domain.User;

      const token = jwt.sign({ id, nick }, process.env.JWT_SECRET, {
        expiresIn: "30m",
        issuer: "nodebird",
      });

      return res.json({
        code: 200,
        message: "토큰이 발급되었습니다.",
        token,
      });
    } catch (err) {
      console.error(err);
      return res.json({
        code: 500,
        message: "서버 에러",
      });
    }
  });

router //
  .route("/test")
  .get(verifyToken, apiLimiter, async (req, res, next) => {
    res.json(req.decoded);
  });

router //
  .route("/posts/my")
  .get(verifyToken, apiLimiter, async (req, res, next) => {
    try {
      const posts = await Post.findAll({ where: { userId: req.decoded.id } });

      console.log(posts);

      res.json({ code: 200, payload: posts });
    } catch (err) {
      console.error(err);
    }
  });

router //
  .route("/posts/hashtag/:title")
  .get(verifyToken, apiLimiter, async (req, res, next) => {
    try {
      const hashtag = await Hashtag.findOne({
        where: { title: req.params.title },
      });

      if (!hashtag) {
        return res.status(404).json({
          code: 404,
          message: "검색 결과가 없습니다.",
        });
      }

      const posts = await hashtag.getPosts();
      return res.json({
        code: 200,
        payload: posts,
      });
    } catch (err) {
      console.error(err);
    }
  });

module.exports = router;
