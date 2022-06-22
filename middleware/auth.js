const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    // const [authType, authToken] = (authorization || '').split(' ');
    // console.log(authToken);
    // if (!authToken) {
    //     res.status(401).send({
    //         errorMessage: '로그인 후 이용 가능한 기능입니다.',
    //     });
    //     return;
    // }

    try {
        const { userId } = jwt.verify(authorization, process.env.JWT_SECRET);
        User.findByPk(userId).then((user) => {
            res.locals.user = user;
            next();
        });
    } catch (err) {
        res.status(401).send({
            errorMessage: '로그인 후 이용 가능한 기능입니다.',
        });
    }
};
