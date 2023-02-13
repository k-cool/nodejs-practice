const express = require('express');
const User = require('../schemas/user');
const Comment = require('../schemas/comment');

const router = express.Router();

router
  .route('/')
  .get(async (req, res, next) => {
    try {
      const users = await User.find({});
      res.json(users);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      const { name, age, married } = req.body;

      const user = await User.create({ name, age, married });
      console.log(user);

      res.status(201).json(user);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

router.route('/:id/comments').get(async (req, res, next) => {
  try {
    const { id } = req.params;
    const comments = await Comment.find({
      commenter: id,
    }).populate('commenter');
    console.log(comments);

    res.json(comments);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
