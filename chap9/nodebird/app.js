const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
require('dotenv').config();

const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const { sequelize } = require('./models'); //(DB생성후)모델과 서버를 연결한다. (실제는 ./models/index 이다.) 
const passportConfig = require('./passport');
//require('./passport') === require('./passport/index.js') 이다.
const app = express();  
sequelize.sync();   // 시퀄라이즈에서 정의한 모델을 동기화하여 모델의 정의를 DB에서 만들수 있다.
passportConfig(passport); 

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 8001);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET)); // p201 참조(서명된 쿠키 - 브라우저에서 수정시 에러발생)
app.use(session({ //세션의 설정을 여기서 해줌.
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,  //비밀키를 저장한다.이 비밀키를 통해서 Session id를 암호화하여 관리한다.
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));
app.use(flash());
app.use(passport.initialize()); //passport.initialize() 미들웨어는 요청(req 객체)에 passport 설정을 심고,
app.use(passport.session());    //passport.session() 미들웨어는 req.session객체에 passport 정보를 저장한다.

app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});
