const express = require('express');
const router = express.Router();
const Authmiddleware = require('../middleware/auth');
const likeController = require('../controllers/likecontroller.js');

// 좋아요 추가
router.put('/api/movie/:movieId/like', Authmiddleware, likeController.like);

module.exports = router;
