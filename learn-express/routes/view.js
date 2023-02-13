const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index.njk', { title: 'nunjucks' });
});

module.exports = router;
