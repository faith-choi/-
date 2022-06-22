const express = require('express');
const Movie = require('../models/movie.js');
const User = require('../models/user');
const Authmiddleware = require('../middleware/auth');

const router = express.Router();

// router.post('/api', async (req, res, next) => {
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
router.get('/api/movies', Authmiddleware, async (req, res, next) => {
    // #swagger.tags = ['Movie']
    try {
        const user = res.locals.user;
        const movie = await Movie.findAll({
            include: [
                { model: User, as: 'Likers', attributes: ['id'] },
                { model: User, as: 'Lister', attributes: ['id'] },
            ],
        });
        console.log(movie[0]['Likers'][0]['dataValues']['id']);
        const likers = movie.map((m) => m['Likers'].map((n) => n['dataValues']['id']));
        const likes = likers.map((m) => m.includes(user.id));
        const listers = movie.map((m) => m['Lister'].map((n) => n['dataValues']['id']));
        const lister = listers.map((m) => m.includes(user.id));
        console.log(likers);
        console.log(listers);
        res.json({
            movie,
            likes,
            lister,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
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
