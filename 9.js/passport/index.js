const passport = require("passport");
const local = require("./localStrategy");
const kakao = require("./kakaoStrategy");
const User = require("../models/user");

module.exports = () => {
  passport.serializeUser((user, done) => {
    // 로그인 시 실행 됨
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    // 매 요청시 실행
    User.findOne({
      where: { id },
      include: [
        {
          model: User,
          attributes: ["nick", "id"],
          as: "Followers",
        },
        {
          model: User,
          attributes: ["nick", "id"],
          as: "Followings",
        },
      ],
    })
      .then((user) => done(null, user))
      .catch((err) => done(err));
  });

  local();
  kakao();
};
