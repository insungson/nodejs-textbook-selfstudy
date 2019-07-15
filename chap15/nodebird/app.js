const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const helmet = require('helmet');
const hpp = require('hpp');
const RedisStore = require('connect-redis')(session);
require('dotenv').config();

const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const { sequelize } = require('./models');
const passportConfig = require('./passport');
const logger = require('./logger');

const app = express();
sequelize.sync();     // 시퀄라이즈에서 정의한 모델을 동기화하여 모델의 정의를 DB에서 만들수 있다.
passportConfig(passport);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 8001);

//process.env.NODE_ENV 는 배포, 개발 인지 판단할 수 있게 해주는 환경변수 설정 로직이다.
//(배포나 개발환경에 따라 process.env.NODE_ENV를 .env에 넣어야 하는데 그럴 수 없다.  
//.env는 정적인 파일이기 때문이다. 이를 바꾸는 방법은 cross-env 에서 알아보자)
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
  app.use(helmet());
  app.use(hpp());
} else {
  app.use(morgan('dev'));
}
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET)); // p201 참조(서명된 쿠키 - 브라우저에서 수정시 에러발생)

//세션을 배포환경에 맞게 바꿔보자
const sessionOption = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET, //비밀키를 저장한다.이 비밀키를 통해서 Session id를 암호화하여 관리한다.
  cookie: {
    httpOnly: true,
    secure: false,
  },
  store: new RedisStore({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    pass: process.env.REDIS_PASSWORD,
    logErrors: true,
  }),
};

//배포환경일때는 proxy를 true, cookie,secure를 true로 바꾼다.
//https를 적용할 경우에만 사용하면 된다.
//(proxy를 true로 적용해야하는 경우는 https 적용을 위해 노드 서버 앞에 다른 서버를 두었을 때이다.)
if (process.env.NODE_ENV === 'production') {
  sessionOption.proxy = true;
  // sessionOption.cookie.secure = true; //cookie.secure 또한 https 적용이나 로드밸런싱(요청 부하 분산)
  //                                       등을 위해 true로 바꿔준다.
}

app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  logger.info('hello'); //logger 객체를 만들어 메서드를 통해 심각도가 적용된 로그가 기록된다.
  logger.error(err.message);
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
