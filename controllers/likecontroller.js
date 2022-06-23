const Movie = require('../models/movie.js');

exports.like = async (req, res, next) => {
    // #swagger.tags = ['Like']
    try {
        const { user } = res.locals;
        const id = req.params.movieId;
        const userlike = user.id;
        const movie = await Movie.findOne({ where: { id } });
        const likeckeck = await movie.getLikers({
            where: { id: user.id },
        });
        if (!likeckeck.length) {
            await movie.addLikers(userlike);
            return res.status(200).send({
                isLike: true,
            });
        } else {
            await movie.removeLikers(userlike);
            return res.status(200).send({
                isLike: false,
            });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
};
