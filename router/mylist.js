const express = require('express');
const router = express.Router();
const Authmiddleware = require('../middleware/auth');
const mylistController = require('../controllers/mylistcontroller');

// 찜하기
router.put('/api/movie/:movieId/mylist', Authmiddleware, mylistController.myList);

// 찜한 목록
router.get('/api/mylist', Authmiddleware, mylistController.myLists);

module.exports = router;
