const passport = require("passport");
const local = require("./localStrategy");
const kakao = require("./kakaoStrategy");
const User = require("../models/user");

let users = {};
let expiredate = {};

module.exports = () => {
  passport.serializeUser((user, done) => {
    // 로그인 시 실행 됨
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    // 매 요청시 실행
    const user = users[id];
    const date = expiredate[id];
    if (!user || !date || date < Date.now())
      User.findOne({
        where: { id },
        include: [
          {
            model: User,
            attributes: ["id", "nick"],
            as: "Followers",
          },
          {
            model: User,
            attributes: ["id", "nick"],
            as: "Followings",
          },
        ],
      })
        .then((user) => {
          users[id] = user;
          expiredate[id] = Date.now() + 5000;
          done(null, user);
        })
        .catch((err) => done(err));
    else {
      done(null, user);
    }
  });

  local();
  kakao();
};
