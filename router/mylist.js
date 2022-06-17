const express = require('express');
const { findAll } = require('../models/movie');
const router = express.Router();
const Movie = require('../models/movie');


router.post('/api/movie/:movieId/mylist', (req, res, next) => {
  try {
    const { user } = res.locals;
      const id = req.params.movieId;
      const movie = await Movie.findOne({ where: { id } });
      if (movie) {
        movie.removeLister({
          // user.id
        })
        return res.status(400).send({
          mylist : true,
        })
      } else {
        movie.addlLister({
        // user.id,
      })
        return res.status(200).send({
          mylist: false,
          })
      }
    } catch (err) {
        console.log(err);
        next(err);
    }
});

router.get('/api/movie/mylist', (req, res, next) => {
  try {
    // const { user } = res.locals;
    // const movielist = await Mylist.findAll({ where: {user.id}} )
    res.status(400).send({
      movielist,
    })
    } catch (err) {
        console.log(err);
        next(err);
    }
});

module.exports = router;
