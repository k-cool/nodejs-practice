const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello User');
});

router.get('/:id', (req, res) => {
  console.log(req.params);
  res.send(`Hello ${req.params.id}`);
});

module.exports = router;
