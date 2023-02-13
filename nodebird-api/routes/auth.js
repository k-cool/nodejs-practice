const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");

const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const User = require("../models/user");

const router = express.Router();

router //
  .route("/join")
  .post(isNotLoggedIn, async (req, res, next) => {
    try {
      const { email, nick, password } = req.body;

      const exUser = await User.findOne({ where: { email } });

      if (exUser) return res.redirect("/join?error=exist");

      const hash = await bcrypt.hash(password, 12);
      await User.create({ email, nick, password: hash });

      return res.redirect("/");
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

router //
  .route("/login")
  .post(isNotLoggedIn, async (req, res, next) => {
    passport.authenticate("local", (authError, user, info) => {
      if (authError) {
        console.error(authError);
        return next(authError);
      }

      if (!user) res.redirect(`/?loginError=${info.message}`);

      return req.login(user, (loginError) => {
        if (loginError) {
          console.error(loginError);
          return next(loginError);
        }

        return res.redirect("/");
      });
    })(req, res, next);
  });

router //
  .route("/logout")
  .get(isLoggedIn, async (req, res, next) => {
    try {
      req.logout((err) => {
        if (err) return next(err);
        req.session.destroy();
        res.redirect("/");
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

router.get("/kakao", passport.authenticate("kakao"));

router.get(
  "/kakao/callback",
  passport.authenticate("kakao", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/");
  }
);

module.exports = router;
