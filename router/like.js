const express = require('express');
const router = express.Router();
const Authmiddleware = require('../middleware/auth');
const Movie = require('../models/movie.js');

// 좋아요 추가
router.post('/movie/:movieId/like', Authmiddleware, async (req, res, next) => {
    try {
        const { user } = res.locals;
        const id = req.params.movieId;
        const userlike = user.id;
        const movie = await Movie.findOne({ where: { id } });
        await movie.addLikers(userlike);
        return res.status(200).send({
            islike: true,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
});

// 좋아요 취소
router.delete('/movie/:movieId/like', Authmiddleware, async (req, res, next) => {
    try {
        const { user } = res.locals;
        const id = req.params.movieId;
        const userlike = user.id;
        const movie = await Movie.findOne({ where: { id } });
        await movie.removeLikers(userlike);
        return res.status(200).send({
            islike: true,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
});

module.exports = router;
