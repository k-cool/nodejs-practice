const express = require('express');
const Comment = require('../schemas/comment');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { id, comment } = req.body;

    const newComment = await Comment.create({ commenter: id, comment });
    console.log(newComment);
    const result = await Comment.populate(newComment, { path: 'commenter' });

    res.status(201).json(result);
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

      const result = await Comment.updateOne({ _id: id }, { comment });

      res.json(result);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const { id } = req.params;

      const result = await Comment.remove({ _id: id });

      res.json(result);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

module.exports = router;
