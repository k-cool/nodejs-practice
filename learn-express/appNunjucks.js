const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const nunjucks = require('nunjucks');

const indexRouter = require('./routes');
const userRouter = require('./routes/user');
const viewRouter = require('./routes/view');

dotenv.config();

const app = express();
app.set('port', process.env.PORT || 8080);

// view setting
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'njk');

nunjucks.configure('views', {
  express: app,
  watch: true,
});

// middleware
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production') morgan('combined')(req, res, next);
  else morgan('dev')(req, res, next);
});
app.use('/', express.static(path.join(__dirname, 'public')));
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
app.use('/view', viewRouter);
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

// 에러처리 미들웨어
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error.njk');
});

app.listen(app.get('port'), () => {
  console.log(`${app.get('port')}번 포트에 서버가 열렸어요!`);
});
