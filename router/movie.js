const express = require('express');
const Movie = require('../models/movie.js');
const User = require('../models/user');
const Authmiddleware = require('../middleware/auth');

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

// 영화 전체조회
router.get('/api/movies', async (req, res, next) => {
    // #swagger.tags = ['Movie']
    try {
        const movie = await Movie.findAll();
        res.json({
            movie,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
});

// 메인 영상
router.get('/api/movieUrl', (req, res, next) => {
    // #swagger.tags = ['Movie']
    const movieUrl1 =
        "https://nexslice.s3.ap-northeast-2.amazonaws.com/'%EB%B2%94%EC%A3%84%EB%8F%84%EC%8B%9C2'+%EB%A9%94%EC%9D%B8+%EC%98%88%EA%B3%A0%ED%8E%B8.mp4";
    const movieUrl2 =
        'https://nexslice.s3.ap-northeast-2.amazonaws.com/%EC%98%81%ED%99%94+%5B%EB%A7%88%EB%85%802%5D+%ED%8B%B0%EC%A0%80+%EC%98%88%EA%B3%A0%ED%8E%B8+%EC%8B%A0%EC%8B%9C%EC%95%84%2C+%EB%B0%95%EC%9D%80%EB%B9%88%2C+%EC%84%9C%EC%9D%80%EC%88%98%2C+%EC%9D%B4%EC%A2%85%EC%84%9D%2C+%EA%B9%80%EB%8B%A4%EB%AF%B8+2022.06++%EC%95%A1%EC%85%98.mp4';
    res.json({
        movieUrl1,
        movieUrl2,
    });
});

// 영화 상세조회
router.get('/api/movie/:movieId', Authmiddleware, async (req, res, next) => {
    // #swagger.tags = ['Movie']
    try {
        const id = req.params.movieId;
        const user = res.locals.user;
        const detail = await Movie.findOne({
            where: { id },
        });

        const likers = await detail.getLikers();
        const likersList = likers.map((v) => v.dataValues.id);
        const lister = await detail.getLister();
        const listerList = lister.map((v) => v.dataValues.id);
        let isLike;
        let isList;
        if (likersList.includes(user.id)) {
            isLike = true;
        } else {
            isLike = false;
        }
        if (listerList.includes(user.id)) {
            isList = true;
        } else {
            isList = false;
        }
        res.json({ detail, isLike, isList });
    } catch (error) {
        console.log(error);
        next(error);
    }
});

module.exports = router;
