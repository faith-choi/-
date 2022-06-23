const express = require('express');
const sequelize = require('sequelize');
const router = express.Router();
const Movie = require('../models/movie');
const Authmiddleware = require('../middleware/auth');
const Op = sequelize.Op;

router.get('/api/search', Authmiddleware, async (req, res, next) => {
    // #swagger.tags = ['Search']
    try {
        const keyword = req.query.title; //검색어
        const newkeyword = decodeURIComponent(keyword);
        console.log(newkeyword);
        console.log(req.query);
        if (!newkeyword) {
            return res.status(400).json({ msg: '검색어를 입력하세요. ' });
        } //검색어가 없이 검색할 경우 error

        let result = await Movie.findAll({
            where: {
                title: {
                    [Op.like]: `%${newkeyword}%`,
                },
            },
        });
        console.log(result);

        if (result.length !== 0) {
            res.status(201).json(result);
        } else {
            return res.status(400).json({
                msg: `${keyword}에 대한 검색 결과가 없습니다.`,
            });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
});

module.exports = router;
