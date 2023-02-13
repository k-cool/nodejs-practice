const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const multer = require('multer');
const { fstat } = require('fs');
const fs = require('fs');
const indexRouter = require('./routes');
const userRouter = require('./routes/user');

dotenv.config();

const app = express();
app.set('port', process.env.PORT || 8080);

// middleware
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production') morgan('combined')(req, res, next);
  else morgan('dev')(req, res, next);
});
// app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      cecure: false,
    },
    name: 'session-cookie',
  })
);

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use((req, res, next) => {
  res.status(404).send('NOT FOUND');
});

// 에러처리 미들웨어
app.use((err, req, res, next) => {
  res.status(500).send(err.message);
  console.error(err);
});

app.listen(app.get('port'), () => {
  console.log(`${app.get('port')}번 포트에 서버가 열렸어요!`);
});
