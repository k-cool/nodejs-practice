const express = require('express');
const { Comment } = require('../models');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { id, comment } = req.body;
    const newComment = await Comment.create({
      commenter: id,
      comment,
    });

    console.log(newComment);
    res.status(201).json(newComment);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router
  .route('/:id')
  .patch(async (req, res, next) => {
    try {
      const { id } = req.params;
      const { comment } = req.body;
      const result = await Comment.update({ comment }, { where: { id } });

      res.json(result);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await Comment.destroy({ where: { id } });
      res.json(result);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

module.exports = router;
