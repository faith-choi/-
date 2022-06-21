const express = require('express');
const Movie = require('../models/movie.js');
const User = require("../models/user");

const router = express.Router();

// router.post('/', async (req, res, next) => {
//     const { videoUrl, imgUrl, title, content, category, director, actor } = req.body;
//     await Movie.create({
//         videoUrl,
//         imgUrl,
//         title, 
//         content,
//         category,
//         director,
//         actor, 
//     });
//     res.json({ message: '생성완료' });
// });

router.get("/movies", async (req, res, next) => {
    try {
        const movie = await Movie.findAll();

        res.json(
            movie,
        );
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.get("/movie/:movieId", async (req, res, next) => {
    try {
        const id = req.params.movieId;

        const detail = await Movie.findOne({ where: {id}, include:[{ model: User, as: 'Likers', attributes: ['id'] }, { model: User, as: 'Lister', attributes: ['id'] }]} )

        res.json(
            detail,
        );
    } catch (error) {
        console.log(error);
        next(error);
    }
});

module.exports = router;