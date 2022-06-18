const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { body } = require('express-validator');
const validate = require('../middleware/validator.js');
const { Op } = require('sequelize');

const validateSignUp = [
  body('email').isEmail().withMessage('email을 입력하세요').normalizeEmail(),
  body('nickname')
    .trim()
    .isLength({ min: 2 })
    .withMessage('닉네입은 두글자 이상으로 해주세요!'),
  body('password')
    .notEmpty()
    .isLength({ min: 2 })
    .withMessage('비밀번호는 4글자 이상으로 해주세요!'),
  validate,
];

// 회원가입
router.post('/signup', validateSignUp, async (req, res) => {
  const { email, nickname, password, passwordCheck } = req.body;

  try {
    if (password !== passwordCheck) {
      res.status(400).send({ result: false });
      return;
    }

    const existUsers = await User.findAll({
      where: {
        [Op.or]: [{ email }, { nickname }],
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

    await User.create({ email, nickname, password: pwhashed });
    res.status(201).send({
      result: true,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 로그인 구현 API
router.post('/login', async (req, res) => {
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
    token: jwt.sign({ userId: user.id }, 'customized-secret-key'),
  });
});

// 아이디 중복 검사
router.get(
  '/idCheck',
  body('email').isEmail().withMessage('이메일을 입력해주세요').normalizeEmail(),
  validate,
  async (req, res) => {
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

module.exports = router;
