const { find } = require('cheerio/lib/api/traversing');
const express = require('express');
const router = express.Router();
const Movie = require('../models/movie');

// 검색어 찾기
router.post('/api/movie/', async (req, res, next) => {
    try {
        const { search } = req.query;

        const searchecking = await Movie.findAll({
            where: {
                search: {
                    [Op.substring]: title,
                },
            },
        });
        res.send({
            searchecking,
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
});

module.exports = router;
