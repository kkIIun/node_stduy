const express = require("express");
const { isLoggedIn } = require("./middlewares");
const {
  addFollowing,
  removeFollowing,
  updateUser,
} = require("../controllers/user");

const router = express.Router();

router.post("/:id/follow", isLoggedIn, addFollowing);
router.post("/:id/defollow", isLoggedIn, removeFollowing);
router.patch("/update", isLoggedIn, updateUser);

module.exports = router;
