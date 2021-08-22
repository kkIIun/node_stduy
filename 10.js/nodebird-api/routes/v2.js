const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require('cors');
const url = require('url');

const { verifyToken, apiLimiter, premiuMapiLimiter } = require("./middlewares");
const { Domain, User, Post, Hashtag } = require("../models");

const router = express.Router();

router.use(async (req, res, next) => {
  const domain = await Domain.findOne({ where: { host: url.parse(req.get('origin')).host }, });
  if (domain) {
    cors({
      origin: req.get("origin"),
      credentials: true,
    })(req, res, next);
  } else {
      next();
  }
});

router.use(async (req, res, next) => {
  const domain = await Domain.findOne({
    where: { host: url.parse(req.get("origin")).host },
  });
  if (domain) {
    if (domain.type === 'premium') premiuMapiLimiter(req, res, next);
    if (domain.type === "free") apiLimiter(req, res, next);
  } else {
    next();
  }
});

router.post("/token", async (req, res, next) => {
  
  const { frontSecret } = req.body;
  try {
    const domain = await Domain.findOne({
      where: { frontSecret },
      include: {
        model: User,
        attributes: ["nick", "id"],
      },
    });
    if (!domain) {
      return res.status(401).json({
        code: 401,
        message: "등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요",
      });
    }
    const token = jwt.sign(
      {
        id: domain.User.id,
        nick: domain.User.nick,
        type: domain.type,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30m",
        issuer: "nodebird",
      }
    );
    return res.json({
      code: 200,
      message: "토큰이 발급되었습니다.",
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      code: 500,
      message: "서버 에러",
    });
  }
});

router.get("/test", verifyToken, (req, res) => {
  res.json(req.decoded);
});

router.get("/posts/my", verifyToken, (req, res) => {
  Post.findAll({ where: { userId: req.decoded.id } })
    .then((posts) => {
      console.log(posts);
      res.json({
        code: 200,
        payload: posts,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        code: 500,
        message: "서버에러",
      });
    });
});

router.get("/posts/hashtag/:title", verifyToken, async (req, res, next) => {
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
    return res.status(500).json({
      code: 500,
      message: "서버 에러",
    });
  }
});

router.get("/follow/my", verifyToken, (req, res) => {
  User.findOne({
    where: { id: req.decoded.id },
    include: [
      { model: User, attributes: ["nick", "id"], as: "Followers" },
      { model: User, attributes: ["nick", "id"], as: "Followings" },
    ],
  })
    .then((user) => {
      
      res.json({
        code: 200,
        followings: user.Followers,
        followers: user.Followings,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        code: 500,
        message: "서버에러",
      });
    });
});

module.exports = router;
