const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Movie = require('../models/movie');
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
router.post('/user/signup', validateSignUp, async (req, res, next) => {
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
      res.status(200).json({
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
router.post('/user/login', async (req, res) => {
  // #swagger.tags = ['Users']
  const { email, password } = req.body;

  const user = await User.findOne({
    where: {
      email,
    },
  });
  //nexslice.s3.ap-northeast-2.amazonaws.com/%27%EB%B2%94%EC%A3%84%EB%8F%84%EC%8B%9C2%27%20%EB%A9%94%EC%9D%B8%20%EC%98%88%EA%B3%A0%ED%8E%B8.mp4?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECYaDmFwLW5vcnRoZWFzdC0yIkYwRAIgBf9fCOlwGKJYqSY80DwPPwtHeeM64TORhnDhv7lArZwCIC%2FUtJenxnGl7sfxsOnXyFQeUwuSIlf7H%2FhlDfmYb8fMKuQCCD8QABoMMDc4MTcxODU1NTQyIgzgA6dwohGC%2Faj4VcgqwQJDWfWUhH%2BiN6gQ3JMPOPRokyhGyemjC9hk4wesRS4Y1iWC618rb8hC1gw1jdMM1mYhkN9QkuU1VC7DoYIcyzJtPtLMBfigfO67PuI%2BzuztR%2BMljkhap1EKVnah30dqup%2BgMKuOLonArvKbVthEYl3XMDQjaSoRNM684nsYJz6VBhPNBQZyV7PHlIAAnThM7MrLK0WCD0XjgpvbzCiyO%2BcyDkWk6L6bmbRAW5AngKcCwD14S7rOmXweNlr1AqNOoHeffm2VBOhBDlcWelRUacRN%2BUNUVQkV6KQ5gbI7rAsqGC7Yh43cfagcj6BSafu4IVNijgQlXYWoUfu7Gh9d4MRBUrGzcZN1GgSwwomk%2Bk28nqba%2BA%2BLf6LrSE68oq8f4enG4jR7ceY9u%2FRSBz2X8z3T3kCE%2B4Ua86kaCMvejWuPS1ww067FlQY6tAJFEPAdCq6g3IThxSnbscKe8DVeiRg%2FQAjK%2BqotwLtD1F0R%2BzUKWtmSKcrREnEw6p5X%2FXpBi6J339cjACwO5Ae%2FAcS5aR8vo%2FnmVDnI03Mh5vJmSsnGJ0WQg3jh8ouEl64gcf0cn3zHw%2BYHc5YVuvVEk%2Be%2BN5Mk8AKZKcixv5kAH2Jsi2zeG1N96dhZYN0xn%2F3eGYvT318%2FCNWowL6MW%2Buufa13sx%2FVl%2FMwkarPkS09FAqlYv6JLggwxr2tVvwlApFMlGGFW3EZQJh1sF3K%2BjmDT2xIIeE7Hsnc5V%2FTHTMDmZ0UvqmMf5mXOoo%2BU5nBRI6y2XTa8yKFwlOcB4okSIYBdUVe2rWjQiYpHojSFVF9%2BD4qJDdCGKL7NSc%2BHrYWJ4YSo90ziHTu3H6QatkuHfrICv3IWw%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20220621T150604Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIAREM3H3K3KJ5SM6XU%2F20220621%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Signature=5f43ded21cf3aaf9f9ff1842b326a33db88de4460cfeaedaac40c9b719d8dc19
  https: if (!user) {
    res.status(200).json({
      result: false,
    });
    return;
  }

  const passwordCheck = await bcrypt.compare(password, user.password);
  if (!passwordCheck) {
    res.status(200).json({
      result: false,
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
  '/user/idCheck',
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
        });
      }
      res.status(200).json({
        result: false,
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

router.post('/user/emailAuth', Authmiddleware, async (req, res, next) => {
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
router.post('/user/checkEmailAuth', Authmiddleware, async (req, res, next) => {
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
router.patch('/user/changePassword', Authmiddleware, async (req, res, next) => {
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

// 마이페이지
router.get('/user/mypage', Authmiddleware, async (req, res, next) => {
  // #swagger.tags = ['Users']
  const user = res.locals.user;
  try {
    const myUser = await User.findOne({
      where: { id: user.id },
      include: [{ model: Movie, as: 'Liked' }],
    });
    res.status(200).json(myUser);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 마이페이지 수정
router.patch('/user/mypage', Authmiddleware, async (req, res, next) => {
  // #swagger.tags = ['Users']
  const user = res.locals.user;
  const { userImg, nickname } = req.body;
  try {
    await User.update(
      { userImg, nickname },
      {
        where: { id: user.id },
        include: [{ model: Movie, as: 'Liked' }],
      }
    );
    const myUser = await User.findOne({
      where: { id: user.id },
      include: [{ model: Movie, as: 'Liked' }],
    });

    res.status(200).json(myUser);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/', async (req, res, next) => {});

module.exports = router;
