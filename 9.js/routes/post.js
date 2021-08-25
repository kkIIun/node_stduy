const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const { Post, Hashtag } = require("../models");
const { isLoggedIn } = require("./middlewares");

const router = express.Router();

try {
  fs.readdirSync("uploads");
} catch (err) {
  console.error("uploads 폴더가 없어 uploads 폴더를 생성합니다.");
  fs.mkdirSync("uploads");
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "uploads/");
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/img", isLoggedIn, upload.single("img"), (req, res) => {
  res.json({ url: `/img/${req.file.filename}` });
});

router
  .route("/:id/like")
  .post(isLoggedIn, async (req, res, next) => {
    try {
      const post = await Post.findOne({ where: { id: req.params.id } });
      if (post) {
        console.log(post.add);
        await post.addLiker(req.user.id);
        res.send("success");
      } else {
        res.status(404).send("no user");
      }
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  .delete(isLoggedIn, async (req, res, next) => {
    try {
      const post = await Post.findOne({ where: { id: req.params.id } });
      if (post) {
        await post.removeLiker(req.user.id);
        res.send("success");
      } else {
        res.status(404).send("no user");
      }
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

router.delete("/:id/remove", isLoggedIn, async (req, res, next) => {
  try {
    const result = await Post.destroy({ where: { id: req.params.id } });
    res.json(result);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

const upload2 = multer();
router.post("/", isLoggedIn, upload2.none(), async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      UserId: req.user.id,
    });
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          });
        })
      );
      await post.addHashtags(result.map((r) => r[0]));
    }
    res.redirect("/");
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
