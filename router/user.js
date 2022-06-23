const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validator.js');
const Authmiddleware = require('../middleware/auth');
const userController = require('../controllers/usercontroller');

const validateSignUp = [
  body('email').isEmail().withMessage('email을 입력하세요').normalizeEmail(),
  body('password')
    .notEmpty()
    .isLength({ min: 2 })
    .withMessage('비밀번호는 4글자 이상으로 해주세요!'),
  validate,
];

const validateCheckId = [
  body('email').isEmail().withMessage('이메일을 입력해주세요').normalizeEmail(),
  validate,
];

// 회원가입
router.post('/user/signup', validateSignUp, userController.signUp);

// 로그인 구현 API
router.post('/user/login', userController.logIn);

// 아이디 중복 검사
router.post('/user/idCheck', validateCheckId, userController.checkId);

// 이메일 인증
router.post('/user/emailAuth', Authmiddleware, userController.emailAuth);

//  이메일 인증 체크
router.post(
  '/user/checkEmailAuth',
  Authmiddleware,
  userController.checkEmailAuth
);

// 비밀번호 변경
router.patch(
  '/user/changePassword',
  Authmiddleware,
  userController.changePassword
);

// 마이페이지
router.get('/user/mypage', Authmiddleware, userController.myprofile);

// 마이페이지 수정
router.patch('/user/mypage', Authmiddleware, userController.changeMyprofile);

module.exports = router;
