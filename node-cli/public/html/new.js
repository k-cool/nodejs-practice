
const express = require("express");

const router = express.Router();

router //
  .route("/")
  .get(async (req, res, next) => {
    try {
      res.send("ok");
    } catch (err) {
      console.error(err);
    }
  });

module.exports = router;
