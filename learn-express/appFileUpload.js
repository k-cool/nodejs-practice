const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const multer = require('multer');
const { fstat } = require('fs');
const fs = require('fs');

// upload 폴터 체크 및 생성
try {
  fs.readdirSync('uploads');
} catch (err) {
  console.error('uploads폴더가 없어서 생성합니다.');
  fs.mkdirSync('uploads');
}

dotenv.config();

const app = express();
app.set('port', process.env.PORT || 8080);

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

app.use((req, res, next) => {
  console.log('모든 요청에 대해서 실행');
  next();
});

app.get(
  '/',
  (req, res, next) => {
    console.log('GET요청에 대해서만 실행');
    next();
  },
  (req, res) => {
    throw new Error('에러는 에러 처리 미들웨어로 갑니다.');
  }
);

// 에러처리 미들웨어
app.use((err, req, res, next) => {
  res.status(500).send(err.message);
  console.error(err);
});

// multer post
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads/');
    },

    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// upload api
app.post('/uploadSingle', upload.single('image'), (req, res) => {
  console.log(req.file, req.body);
  res.send('ok');
});

app.post('/uploadArray', upload.array('image'), (req, res) => {
  console.log(req.files, req.body);
  res.send('ok');
});

app.post(
  '/uploadFields',
  upload.fields([{ name: 'image1' }, { name: 'image2' }]),
  (req, res) => {
    console.log(req.files, req.body);
    res.send('ok');
  }
);

app.post('/uploaNone', upload.none(), (req, res) => {
  console.log(req.body);
  res.send('ok');
});

app.listen(app.get('port'), () => {
  console.log(`${app.get('port')}번 포트에 서버가 열렸어요!`);
});
