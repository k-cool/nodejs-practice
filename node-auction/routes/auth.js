const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const User = require("../models/user");

const router = express.Router();

router //
  .route("/join")
  .post(isNotLoggedIn, async (req, res, next) => {
    try {
      const { email, nick, password, money } = req.body;
      const exUser = await User.findOne({ where: { email } });

      if (exUser)
        return res.redirect("/join?joinError=이미 가입된 이메일입니다.");

      const hash = await bcrypt.hash(password, 12);

      await User.create({
        email,
        nick,
        password: hash,
        money: +money,
      });

      return res.redirect("/");
    } catch (err) {
      console.error(err);
      return next(err);
    }
  });

router //
  .route("/login")
  .post(isNotLoggedIn, async (req, res, next) => {
    try {
      passport.authenticate("local", (authErr, user, info) => {
        // 로그인 에러
        if (authErr) {
          console.error(authErr);
          return next(authErr);
        }

        // 비밀번호 불일치
        if (!user) return res.redirect(`/?loginError=${info.message}`);

        // 로그인 성공
        return req.login(user, (loginErr) => {
          if (loginErr) {
            console.error(loginErr);
            return next(loginErr);
          }

          return res.redirect("/");
        });
      })(req, res, next);
    } catch (err) {
      console.error(err);
      return next(err);
    }
  });

module.exports = router;
