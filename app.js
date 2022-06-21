const express = require('express');
const db = require('./models');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const userRouter = require('./router/user.js');
const movieRouter = require('./router/movie.js');
const likeRouter = require('./router/like.js');
const mylistRouter = require('./router/mylist.js');
const app = express();

dotenv.config();

app.set('port', process.env.PORT);
db.sequelize
    .sync()
    .then(() => {
        console.log('db 연결 성공');
    })
    .catch(console.error);

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get('/', (req, res, next) => {
    res.send('Hello');
});

app.use('/user', userRouter);
app.use('/api', [movieRouter, likeRouter, mylistRouter]);

app.use((req, res, next) => {
    res.sendStatus(404);
});

app.use((error, req, res, next) => {
    console.error(error);
    res.sendStatus(500);
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
});
