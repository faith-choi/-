const express = require('express');
const router = express.Router();
const Authmiddleware = require('../middleware/auth');
const Movie = require('../models/movie.js');

// 좋아요 추가
router.put('/api/movie/:movieId/like', Authmiddleware, async (req, res, next) => {
    // #swagger.tags = ['Like']
    try {
        const { user } = res.locals;
        const id = req.params.movieId;
        const userlike = user.id;
        const movie = await Movie.findOne({ where: { id } });
        const likeckeck = await movie.getLikers({
            where: { id: user.id },
        });
        if (likeckeck.length) {
            await movie.addLikers(userlike);
            return res.status(200).send({
                islike: true,
            });
        } else {
            await movie.removeLikers(userlike);
            return res.status(200).send({
                islike: false,
            });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
});

module.exports = router;
