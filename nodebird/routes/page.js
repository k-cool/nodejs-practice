const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const { Post, User, Hashtag } = require("../models");

const router = express.Router();

// 변수값 초기화
router.use((req, res, next) => {
  const { user } = req;
  res.locals.user = user;
  res.locals.followerCount = user ? user.Followers.length : 0;
  res.locals.followingCount = user ? user.Followings.length : 0;
  res.locals.followingIdList = user ? user.Followings.map((f) => f.id) : [];
  next();
});

router.get("/profile", isLoggedIn, (req, res) => {
  res.render("profile", { title: "내 정보 - NodeBird" });
});

router.get("/join", isNotLoggedIn, (req, res) => {
  res.render("join", { title: "회원가입 - NodeBird" });
});

router.get("/", async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      include: {
        model: User,
        attributes: ["id", "nick"],
      },
      order: [["createdAt", "DESC"]],
    });

    res.render("main", { title: "NodeBird", twits: posts });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/hashtag", async (req, res, next) => {
  const query = req.query.hashtag;

  if (!query) return res.redirect("/");

  try {
    const hashtag = await Hashtag.findOne({ where: { title: query } });
    let posts = [];

    if (hashtag)
      posts = await hashtag.getPosts({ indclude: [{ model: User }] });

    return res.render("main", { title: `${query} | NodeBird`, twits: posts });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
