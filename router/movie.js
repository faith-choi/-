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
    const movieUrl1 = "s3://nexslice/'범죄도시2' 메인 예고편.mp4";
    const movieUrl2 =
        'https://nexslice.s3.ap-northeast-2.amazonaws.com/%27%EB%B2%94%EC%A3%84%EB%8F%84%EC%8B%9C2%27%20%EB%A9%94%EC%9D%B8%20%EC%98%88%EA%B3%A0%ED%8E%B8.mp4?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECYaDmFwLW5vcnRoZWFzdC0yIkYwRAIgBf9fCOlwGKJYqSY80DwPPwtHeeM64TORhnDhv7lArZwCIC%2FUtJenxnGl7sfxsOnXyFQeUwuSIlf7H%2FhlDfmYb8fMKuQCCD8QABoMMDc4MTcxODU1NTQyIgzgA6dwohGC%2Faj4VcgqwQJDWfWUhH%2BiN6gQ3JMPOPRokyhGyemjC9hk4wesRS4Y1iWC618rb8hC1gw1jdMM1mYhkN9QkuU1VC7DoYIcyzJtPtLMBfigfO67PuI%2BzuztR%2BMljkhap1EKVnah30dqup%2BgMKuOLonArvKbVthEYl3XMDQjaSoRNM684nsYJz6VBhPNBQZyV7PHlIAAnThM7MrLK0WCD0XjgpvbzCiyO%2BcyDkWk6L6bmbRAW5AngKcCwD14S7rOmXweNlr1AqNOoHeffm2VBOhBDlcWelRUacRN%2BUNUVQkV6KQ5gbI7rAsqGC7Yh43cfagcj6BSafu4IVNijgQlXYWoUfu7Gh9d4MRBUrGzcZN1GgSwwomk%2Bk28nqba%2BA%2BLf6LrSE68oq8f4enG4jR7ceY9u%2FRSBz2X8z3T3kCE%2B4Ua86kaCMvejWuPS1ww067FlQY6tAJFEPAdCq6g3IThxSnbscKe8DVeiRg%2FQAjK%2BqotwLtD1F0R%2BzUKWtmSKcrREnEw6p5X%2FXpBi6J339cjACwO5Ae%2FAcS5aR8vo%2FnmVDnI03Mh5vJmSsnGJ0WQg3jh8ouEl64gcf0cn3zHw%2BYHc5YVuvVEk%2Be%2BN5Mk8AKZKcixv5kAH2Jsi2zeG1N96dhZYN0xn%2F3eGYvT318%2FCNWowL6MW%2Buufa13sx%2FVl%2FMwkarPkS09FAqlYv6JLggwxr2tVvwlApFMlGGFW3EZQJh1sF3K%2BjmDT2xIIeE7Hsnc5V%2FTHTMDmZ0UvqmMf5mXOoo%2BU5nBRI6y2XTa8yKFwlOcB4okSIYBdUVe2rWjQiYpHojSFVF9%2BD4qJDdCGKL7NSc%2BHrYWJ4YSo90ziHTu3H6QatkuHfrICv3IWw%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20220621T150604Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIAREM3H3K3KJ5SM6XU%2F20220621%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Signature=5f43ded21cf3aaf9f9ff1842b326a33db88de4460cfeaedaac40c9b719d8dc19';
    res.json({
        movieUrl1,
        movieUrl2,
    });
});

// 영화 상세조회
router.get('/api/movie/:movieId', async (req, res, next) => {
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
