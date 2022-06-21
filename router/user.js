const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { body } = require('express-validator');
const validate = require('../middleware/validator.js');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');
require('dotenv').config();
const Authmiddleware = require('../middleware/auth');

const validateSignUp = [
    body('email').isEmail().withMessage('email을 입력하세요').normalizeEmail(),
    body('password')
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage('비밀번호는 4글자 이상으로 해주세요!'),
    validate,
];

// 회원가입
router.post('/signup', validateSignUp, async (req, res, next) => {
    // #swagger.tags = ['Users']
    const { email, password } = req.body;

    try {
        const existUsers = await User.findAll({
            where: {
                email,
            },
        });

        console.log(existUsers);

        if (existUsers.length) {
            res.status(400).send({
                result: false,
            });
            return;
        }

        const pwhashed = await bcrypt.hash(password, 10);

        await User.create({ email, password: pwhashed });

        const user = await User.findOne({
            where: {
                email,
            },
        });

        res.status(201).send({
            result: true,
            token: jwt.sign({ userId: user.id }, process.env.JWT_SECRET),
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 로그인 구현 API
router.post('/login', async (req, res) => {
    // #swagger.tags = ['Users']
    const { email, password } = req.body;

    const user = await User.findOne({
        where: {
            email,
        },
    });

    if (!user) {
        res.status(400).json({
            result: false,
            message: '이메일 또는 패스워드가 잘못됐습니다.',
        });
        return;
    }

    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
        res.status(400).json({
            result: false,
            message: '이메일 또는 패스워드가 잘못됐습니다.',
        });
        return;
    }

    res.send({
        result: true,
        token: jwt.sign({ userId: user.id }, process.env.JWT_SECRET),
    });
});

// 아이디 중복 검사
router.post(
    '/idCheck',
    body('email').isEmail().withMessage('이메일을 입력해주세요').normalizeEmail(),
    validate,
    async (req, res) => {
        // #swagger.tags = ['Users']
        const { email } = req.body;
        try {
            const user = await User.findOne({
                where: {
                    email,
                },
            });
            console.log(user);
            if (user === null) {
                return res.status(200).json({
                    result: true,
                    message: '사용 가능한 이메일입니다.',
                });
            }
            res.status(400).json({
                result: false,
                message: '중복된 이메일입니다.',
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    }
);

// 이메일 인증
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.EMAIL_PW,
    },
});

router.post('/emailAuth', Authmiddleware, async (req, res, next) => {
    // #swagger.tags = ['Users']
    let text = Math.floor(Math.random() * 10000);
    const user = res.locals.user;

    await User.update({ emailAuth: text }, { where: { id: user.id } });

    transporter
        .sendMail({
            from: `넥슬라이스 <neckslice@gmail.com>`,
            to: `${user.email}`,
            subject: '[넥슬라이스] 인증번호가 도착했습니다.',
            text: `${text}`,
            html: `
      <div style="text-align: center;">
        <h3 style="color: #FA5882">인증번호</h3>
        <br />
        <p>${text}</p>
      </div>
    `,
        })
        .then((send) => res.json({ message: '인증 메세지를 이메일로 보냈습니다' }))
        .catch((err) => next(err));
});

//  이메일 인증 체크
router.post('/checkEmailAuth', Authmiddleware, async (req, res, next) => {
    // #swagger.tags = ['Users']
    const { emailAuth } = req.body;
    const user = res.locals.user;
    const checkUser = await User.findOne({ where: { id: user.id } });
    if (emailAuth !== checkUser.emailAuth) {
        return res.status(401).json({ message: '인증번호가 틀렸습니다.' });
    }
    res.json({ message: '인증되었습니다.' });
});

// 비밀번호 변경
router.patch('/changePassword', Authmiddleware, async (req, res, next) => {
    // #swagger.tags = ['Users']
    const { password } = req.body;
    const user = res.locals.user;
    try {
        const pwhashed = await bcrypt.hash(password, 10);
        await User.update({ password: pwhashed }, { where: { id: user.id } });
        res.json({ message: '비밀번호가 변경됐습니다.' });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/', async (req, res, next) => {});

module.exports = router;
