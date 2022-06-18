const express = require('express');
const router = express.Router();
const Like = require('../models/movie');

router.post('/api/movie/:movieId/like', async (req, res, next) => {
    try {
        // const { user } = res.locals;
        const id = req.params.movieId;
        const like = await Like.findOne({ where: { id } });
        if (like) {
            like.removeLister({
                // user.id
            });
            return res.status(400).send({
                mylist: true,
            });
        } else {
            like.addlLister({
                // user.id,
            });
            return res.status(200).send({
                mylist: false,
            });
        }
    } catch (err) {
        console.log(err);
        next(err);
    }
});

module.exports = router;
