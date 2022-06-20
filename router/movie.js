const express = require('express');
const Movie = require('../models/movie.js');

const router = express.Router();

router.post('/', async, (req, res, next) => {
  router.post('/', async (req, res, next) => {
    const { videoUrl, imgUrl, title, content, category, director, actor } =
      req.body;
    await Movie.create({
      videoUrl,
      imgUrl,
      title,
      content,
      category,
      director,
      actor,
    });
    res.json({ message: '생성완료' });
  });
});

module.exports = router;
