const express = require("express");
const axios = require("axios");

const router = express.Router();
const URL = "http://localhost:8002/v2";
axios.defaults.headers.origin = "http://localhost:4000";

const request = async (req, api) => {
  try {
    if (!req.session.jwt) {
      const tokenResult = await axios.post(`${URL}/token`, {
        clientSecret: process.env.CLIENT_SECRET,
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

router //
  .route("/mypost")
  .get(async (req, res, next) => {
    try {
      const result = await request(req, "/posts/my");
      res.json(result.data);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

router //
  .route("/search/:hashtag")
  .get(async (req, res, next) => {
    try {
      const result = await request(
        req,
        `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`
      );

      res.json(result.data);
    } catch (err) {
      if (err.code) {
        console.error(err);
        next(err);
      }
    }
  });

router //
  .route("/")
  .get(async (req, res, next) => {
    try {
      res.render("main", { key: process.env.CLIENT_SECRET });
    } catch (err) {
      console.error(err);
    }
  });

module.exports = router;
