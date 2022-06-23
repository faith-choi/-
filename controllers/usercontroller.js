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
const e = require('express');
require('dotenv').config();

exports.signUp = async (req, res, next) => {
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
};

exports.logIn = async (req, res, next) => {
  // #swagger.tags = ['Users']
  const { email, password } = req.body;

  const user = await User.findOne({
    where: {
      email,
    },
  });
  if (!user) {
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
};

exports.checkId = async (req, res, next) => {
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
};

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.EMAIL_PW,
  },
});

exports.emailAuth = async (req, res, next) => {
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
};

exports.checkEmailAuth = async (req, res, next) => {
  // #swagger.tags = ['Users']
  const { emailAuth } = req.body;
  const user = res.locals.user;
  const checkUser = await User.findOne({ where: { id: user.id } });
  if (emailAuth !== checkUser.emailAuth) {
    return res.status(401).json({ message: '인증번호가 틀렸습니다.' });
  }
  res.json({ message: '인증되었습니다.' });
};

exports.changePassword = async (req, res, next) => {
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
};

exports.myprofile = async (req, res, next) => {
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
};

exports.changeMyprofile = async (req, res, next) => {
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
};
