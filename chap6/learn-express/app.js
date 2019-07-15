var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var flash = require('connect-flash');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();   //express 패키지를 호출하여 app변수 객체로 만들었다. 이 변수에 각종 기능을 연결한다.

// view engine setup
app.set('views', path.join(__dirname, 'views')); //app.set()으로 express app을 설정할 수 있다.
app.set('view engine', 'pug');
//express 에서 set은 이렇게 쓰인다.
// app.set('title', 'My Site')   get으로 저 인자를 쓰면 뒤의 값이 나온다. 이런원리로 My Site => function()
// app.get('title')               을 쓰면 함수가 리턴되는 것이다.
// // => "My Site"


//직접 만든 미들웨어
app.use(function(req,res,next){
  console.log(req.url, '저도 미들웨어입니다.');
  next(); //next()를 주석처리하면 다음 미들웨어로 넘어가지 않는다.
});
                                      //app.use() 로 시작하는 코드는 미들웨어를 연결하는 부분이다.
app.use(logger('dev'));        //morgan은 요청에 대한 정보를 콘솔에 기록해준다.
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());       //bodyparse와 같은 요청의 본문(body)를 해석해주는 미들웨어이다.(JSON데이터형식)
app.use(express.urlencoded({ extended: false })); //URL주소형식으로 데이터를 보냄. extends:false 일때 내부함수씀
app.use(cookieParser('secret code'));       //요청에 동봉된 쿠키를 해석해준다.
//app.use(express.static(path.join(__dirname, 'public'))); //정적 파일 라우터 기능 수행.
                                                            //위치를 바꿔보자
app.use(session({ //express-session미들웨어 
  resave: false,           //요청이 왔을때 세션에 수정사항이 생기지 않더라도 세션을 다시 저장할지에 대한 옵션
  saveUninitialized: false,//세션에 저장할 내역이 없더라도 세션을 저장할지에 대한 옵션(방문자추적에 사용)
  secret: 'secret code',   //cookie-parser의 비밀키와 같은 역할을 한다.(cookie-paerser의 secret와 같게 해야한다.)
  cookie: {                //세션의 쿠키에 대한 설정이다.
    httpOnly: true,  //클라이언트에서 쿠키를 확인 못하게 했다.
    secure: false,   //false로 해서 https가 아닌 환경에서도 사용할 수 있게 했다.(배포할땐 https가 필수다.)
  },    //(여기없지만)store 옵션은 현재 메모리에 세션을 저장하는 것이다. (DB에 연결해서 세션을 유지하는게 좋다.)
}));    // redis 서버와 연결하는게 좋은데 15장에 나온다.
app.use(flash());

//라우터 연결 부분
app.use('/', indexRouter);
app.use('/users', usersRouter);//route/users.js 에서 get('/')로 사용되어 /users/로 GET요청을 하면 
                                //route/users.js 안의 콜백함수가 실행된다.

// catch 404 and forward to error handler
app.use(function(req, res, next) {  
  next(createError(404));     //기존의 노드는 throw로 에러처리하는 것과는 달리 next(에러인자)를 통해 
});                           //에러인자를 다음 미들웨어로 넘긴다.
                              //라우터에 등록되지 않은 주소로 올 때 404에러 발생시킨다.(에러만드는 미들웨어)

// error handler
app.use(function(err, req, res, next) { //위의 next(createError(404)); 는 여기 err로 연결된다.
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error'); // views/error.pug 파일을 랜더링 하는데 
});                     //res.locals.message, res.locals.error이 같이 렌더링 된다.

module.exports = app;         // app 객체를 모듈로 만들었다. 이것이 bin/www에서 사용된 app모듈이다.
