const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");

const User = require("../models/user");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwoedField: "password",
      },
      async (email, password, done) => {
        try {
          const exUser = await User.findOne({ where: { email } });

          if (exUser) {
            const result = await bcrypt.compare(password, exUser.password);

            if (result) done(null, exUser);
            else
              done(null, false, { message: "비밀번호가 일치하지 않습니다." });
          } else done(null, false, { message: "존재하지 않는 이메일 입니다." });
        } catch (err) {
          console.error(err);
          done(err);
        }
      }
    )
  );
};