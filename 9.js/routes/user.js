const express = require("express");
const { isLoggedIn } = require("./middlewares");
const { User } = require("../models");

const router = express.Router();

router.post("/:id/follow", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });

    if (user) {
      await user.addFollowing(parseInt(req.params.id, 10));
      res.send("success");
    } else {
      res.status(404).send("no user");
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/:id/defollow", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });

    if (user) {
      await user.removeFollowing(parseInt(req.params.id, 10));
      res.send("success");
    } else {
      res.status(404).send("no user");
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.patch("/update", isLoggedIn, async (req, res, next) => {
  try {
    const result = await User.update({ nick: req.body.nick }, { where: { id: req.user.id } });
    res.json(result);
  } catch (err) {
    console.error(err);
    next(err);
  }
});
module.exports = router;
