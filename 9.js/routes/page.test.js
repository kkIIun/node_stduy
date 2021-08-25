const request = require("supertest");
const { sequelize } = require("../models");
const app = require("../app");
const User = require("../models/user");
const bcrypt = require("bcrypt");

beforeAll(async () => {
  await sequelize.sync(); // 데이터베이스에 테이블 생성
  const hash = await bcrypt.hash("nodejsbook", 12);
  await User.create({
    email: "rlwjd4177@like.org",
    nick: "leekijung",
    password: hash,
  });
});

describe("GET /profile", () => {
  test("로그인 안 했으면 403", (done) => {
    request(app).get("/profile").expect(403, done);
  });

  const agent = request.agent(app);
  beforeEach((done) => {
    agent
      .post("/auth/login")
      .send({
        email: "rlwjd4177@like.org",
        password: "nodejsbook",
      })
      .end(done);
  });

  test("프로필 페이지로 이동", (done) => {
    agent.get("/profile").expect(200, done);
  });

  afterEach((done) => {
    request(app).get("/auth/logout").end(done);
  });
});

describe("GET /join", () => {
  test("회원가입 페이지로 이동", (done) => {
    request(app).get("/join").expect(200, done);
  });
});

describe("GET /", () => {
  test("메인 페이지로 이동", (done) => {
    request(app).get("/").expect(200, done);
  });
});

describe("GET /hashtag", () => {
  test("해시태그 쿼리가 없으면 redirect /", (done) => {
    request(app)
      .get("/hashtag")
      .send({
        hashtag: "nodejs",
      })
      .expect("Location", "/")
      .expect(302, done);
  });

  const agent = request.agent(app);
  beforeEach((done) => {
    agent
      .post("/post")
      .send({
        content: "#nodejs 공부중",
        UserId: 4,
      })
      .end(done);
  });

  test("해시태그 관련된 게시물들 보여주기", (done) => {
    agent.get("/hashtag?hashtag=nodejs").expect(200, done);
  });
});
