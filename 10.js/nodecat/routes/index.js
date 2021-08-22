const express = require('express');
const axios = require('axios');

const router = express.Router();
const URL = 'http://localhost:8001/v2';
axios.defaults.headers.origin = 'http://localhost:4000';
const request = async (req, api) => {
  try {
    if (!req.session.jwt) {
      const tokenResult = await axios.post(`${URL}/token`, {
        frontSecret: process.env.FRONT_SECRET,
      });
        req.session.jwt = tokenResult.data.token;
    }
      return await axios.get(`${URL}${api}`, {
          headers: { authorization: req.session.jwt },
      });
  } catch (err) {
    if (err.response.status === 419) {
      delete req.session.jwt;
      return request(req, api);
    }
    return err.response;
  }
};

router.get('/', (req, res) => {
    res.render("main", { key: process.env.FRONT_SECRET });
});

router.get("/mypost", async (req, res, next) => {
  try {
    const result = await request(
      req,
      '/posts/my'
    );
    res.json(result.data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/myfollow", async (req, res, next) => {
  try {
    const result = await request(req, "/follow/my");
    res.json(result.data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get('/search/:hashtag', async (req, res, next) => {
    try {
        const result = await request(req, `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`);
        res.json(result.data);
    } catch (err) {
        if (err.code) {
            console.error(err);
            next(err);
        }
    }
})

module.exports = router;