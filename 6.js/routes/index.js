const express = require("express");
const router = express.Router();

router
  .route("/")
  .get((req, res) => {
    res.send("GET /");
  })
  .post((req, res) => {
    res.send("POST /");
  });

module.exports = router;
