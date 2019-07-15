//Express-generator로 Express 프레임 워크를 사용해보자
//express-generator는 프레임 워크에 필요한 구조를 잡아준다.
//콘솔 명령어이므로 전역 패키지 설치를 해준다.
//npm i -g express-generator    로 전역 패키지 설치를 한다.
//express learn-express --view=pug    로 탬플렛 엔진을 pug 로 사용한다
//(만약 EJS를 템플렛 엔진으로 사용하고 싶으면 --view=ejs 를 입력하면 된다.)
//cd learn-express && npm i   를 입력하여 express 프레임워크를 설치하자

//express프레임워크의 구조를 살펴보자
//app.js : 핵심적인 서버역할을 한다.
//bin폴더의 www : 서버를 실행하는 스크립트이다.
//public 폴더 : 외부(브라우저)에서 접근 가능한 파일들 (이미지, 자바스크립트, CSS 등)
//route 폴더 : 주소별 라우터들을 모아둔 곳
//views 폴더 : 템플렛 파일을 모아둔 곳

//앞으로 서버의 로직은 routes 폴더 안의 파일에 작성할 것이고,
//화면 부분은 views 폴더 안에 작성 할 것이다.
//데이터베이스를 배우면 models 폴더를 만들어 그 안에 작성을 할 것이다.

//라우터를 컨트롤러로 보면 MVC(모델-뷰-컨트롤러)패턴이 된다.

//설치된 learn-express에 package.json을 보면 
// "scripts": {
//     "start": "node ./bin/www"
//   },
//을 볼 수있다. start 부분이 세팅 된 것으로 앞으로 npm start 를 하면 저게 실행된다.

//우선 bin 폴더의 www를 하나씩 살펴보자(그 파일에서 보자)
//bin/www 파일은 http 모듈에 express 모듈을 연결하고, 포트를 지정하는 부분이다. 
//희한하게도 www파일에는 js가 안붙어있다.
// #!/usr/bin/env node 가 주석으로 붙어있다. (www파일을 콘솔 명령어로 만들 수 있는데 이때 이 주석이 사용된다.)
//(콘솔명령어는 14장에 나온다.)

//이제 app.js를 보자 (파일에 주석 넣음.)
//익스프레스 구조도 사진 넣기
//미들웨어 요청 흐름 사진 넣기
//익스프레스 미들웨어 흐름 사진 넣기

//사진의 순서로 미들웨어가 진행된다.
//app.js에 직접 미들웨어를 만들어보자
// 커스텀 미들웨어를 만들면서 굉장히 햇깔린점이 하나 있었다... 미들웨어로 넘어갈 때 next()를 붙여야 하는데 app.js에서
//next()가 별로 없었다... 이유는 logger, express.json, express.urlenconded, cookieparser, expressstatic 모두
// 내부적으로 next()를 내장하고 있기 때문에 next()를 따로 쓰지 않은 것이다. 
//(미들웨어 하나당 요청 응답은 req,res 객체로 하고 res.end()로 그 미들웨어에서 순환을 종료할수는 있다.)
//next() 에 인자를 넣지 않으면 그냥 다음 미들웨어로 넘어간다. 하지만 인자로 route를 넣으면 다음 미들웨어로 넘어간다.
//일단 예를 들면 
// app.get('/forum/:fid', middleware1, middleware2, function(){
//     // ...
//   })
//위와 같이 라우터에 미들웨어를 middleware1, middleware2 두개를 붙이는 경우... middleware1 후에 next('route') 를 붙이면
//middleware2 는 넘어가고 다음 미들웨어 중 '/' 의 주소가 일치하는 다음 라우터로 넘어가게 된다.

//또한 next()에 route 이외의 다른 값을 넣으면 다른 미들웨어나 라우터를 건너뛰고 바로 에러 핸들러로 이동한다.!!
//넣어준 값은 에러에 대한 내용으로 간주된다.
//next의 동작 사진 넣기

//next() : 다음 미들웨어로
//next('route') : 다음 라우터로
//next(error) : 에러핸들러로..

//app.use의 응용방법에 대해 알아보자
//하나의 use에 여러개의 미들웨어를 장착할 수 있다.
//순서대로 실행된다. 아래의 코드를 보자
app.use('/', function(req,res, next){
    console.log('첫번째 미들웨어');
    next();
}, function(req, res, next){
    console.log('두번째 미들웨어');
    next();
}, function(req,res,next){
    console.log('세번째 미들웨어');
    next();
});
//위의 코드는 앞에서 본것처럼 app.use('/', middle1,middle1)  와 같은 구조이다.
//그렇다면 app.js의 app.use() 를 사용하는 미들웨어를 이렇게 바꿀 수 있다.
app.use(logger('dev'), express.json(), express.urlencoded({extended:false}), 
    cookieParser(), express.static(path.join(__dirname, 'public')));

//또한 next없이 다음 미들웨어로 넘어가지 않는다는 특성을 이용하면 아래와 같은 미들웨어도 만들 수 있다.
//(아래의 코드는 나중에 로그인 기능을 넣을 때 사용되는 코드이다.)
app.use(function(req,res,next){
    if(+new Date()%2 === 0){
        return res.status(404).send('50% 실패');
    }else{
        next();
    }
}, function(req,res,next){
    console.log('50% 성공');
    next();
});
//50%의 확률로 404 Not Found를 응답하는 미들웨어이다.

//morgan 미들웨어
//app.js 를 살펴보자
//morgan : 요청에 대한 정보를 콘솔에 기록한다.
//npm start를 할 때 콘솔창에 아래처럼 뜬다.
// GET / 200 2487.208 ms - 170
//HTTP요청(GET) 주소(/) HTTP상태코드(200) 응답속도(2487.208 ms) - 응답바이트(170)  이다.


//body-parser 미들웨어
//body-parser : 요청의 본문을 해석해주는 미들웨어이다. 보통 폼 데이터나 AJAX 요청의 데이터를 처리한다.
//              (express 4.16.0 버전 이상에서는 이 기능이 내장되어 body-parser 설치없이 사용가능하다.)
var bodyParser = require('body-parser');
app.use(bodyParser.json());        
app.use(bodyParser.urlencoded({ extended: false }));
//위 아래는 같은 코드이다. express에도 bodyparser가 내장되었기 때문이다.
var express = require('express');
app.use(express.json());        
app.use(express.urlencoded({ extended: false }));
//Json : json 형식의 데이터 전달 방식이다.
//urlencoded : 보통 폼 전송을 urlencoded 방식을 쓴다. 
//              extended 옵션에서 false는 노드의 quertstring 모듈을 사용하여 쿼리스티링 해석(내장모듈)
//                               true는 qs모듈을 사용하여 쿼리스트링을 해석(npm으로 qs모듈 설치) 
//                                                                     (querystring 확장버전임.)
//단 body-parser를 설치해야하는 경우도 있다.
//Raw Text 형식의 본문을 추가로 해석하는 경우이다.
//Raw : 본문(body)가 버퍼 데이터일때,  app.use(bodyParser.raw());  로 사용함
//Text : 본문이 텍스트 데이터일때      app.use(bodyParser.text()); 로 사용함
//예를 들면 
//JSON형식의 {name : 'zerocho', book : 'nodejs'}를 본문으로 보내면 req.body에 그대로 들어간다.
//URL-encoded형식의 name=zerocho&bok=nodejs 를 본문으로 보내면 req.body에 
//{name : 'zerocho', book : 'nodejs'} 형태로 들어간다.


//cookie-parser 미들웨어
//cookie-parser : 요청에 동봉된 쿠키를 해석해준다. 
//                 해석된 쿠키들은 req.cookies에 들어간다. 
//예를 들어 name=zerocho 쿠키를 보냈다면 req.cookies는 {name:'zerocho'} 가 된다.
app.use(cookieParser('secret code')); 
//위와 같이 첫번째 인자로 문자열을 넣는다면 쿠키들은 제공한 문자열로 서명된 쿠키가 된다.
//서명된 쿠키는 클라이언트(브라우저)에서 수정했을 때 에러가 발생하므로 클라이언트에서 쿠키로
//위험한 행동을 하는것을 방지할 수 있다.


//static 미들웨어
//static : 정적인 파일들을 제공한다. 함수인자로 정적 파일들이 담겨 있는 폴더를 지정하면 된다.
//app.js 에서 static미들웨어는 public 폴더를 지정하고 있다.
//현재 실제파일 경로는 public/stylesheets/styles.css  이다. 하지만 앞의 morgan미들웨어를 통해
//콘솔에 찍힌 경로는 /stylesheets/style.css  으로 public이 빠져있다.
//(서버의 실제 파일경로가 주소의 경로가 다르다면 보안에 큰 도움이 된다.)
//static 미들웨어는 요청에 부함된 정적 파일을 발견한 경우 응답으로 해당 파일을 전송한다.
//(위의 style.css 처럼 말이다.) 이 경우 응답을 했기 때문에 다음에 나오는 라우터가 실행되지 않는다.
//만약 파일을 찾지 못하면 요청을 라우터로 넘긴다.

//이렇게 자체적으로 정적 라우터 기능을 하므로 최대한 위로 배치하자. 로그 기능읗 해주는 morgan밑으로 
//배치를 바꿔보자(app.js 위치 바꾸기) 교재 p202


//express-session 미들웨어
//express-session : 세션관리용 미들웨어로 로그인 등의 이유로 세션을 관리할 때 매우 유용하다.
//express-generator에 없으므로 직접 설치하자 (npm i express-session 으로 설치하기)
//express-session 은 인자로 세션에 대한 설정을 받는다.
//express-session은 req.session 객체를 만들어서 이 객체에 값을 대입하거나 삭제해서 세션을 변경한다.
//req.session.destroy()는 세션을 한번에 삭제하는것이고, req.sessionID는 세션아이디를 확인할수 있다.


//connect-flash 미들웨어
//일회성 메시지들을 웹브라우저에 나타낼때 쓴다. (로그인 에러나 회원가입 에러같은 일회성 메시지를 보낼때 쓴다.)
//npm i connect-flash 로 설치하자.
//connect-flash 미들웨어는  cookie-parser와 express-session을 사용하기 때문에 이둘 보다 뒤에 쓰자
//app.js 에 추가하고   route/users.js 에 코드를 추가하자


//////////////////////////////////
//Router 객체로 라우팅 분리하기
//4장의 restServer.js 에서 if 로 라우팅을 구분했다. 
//express를 사용하면 쉽고 깔끔하게 라우팅을 할 수 있다.
// *app.js에서 app.use('/',indexRouter) 처럼 use를 사용했는데 get, post, put, patch, delete같은 HTTP메서드도
// use대신 사용이 가능하다.
app.use('/', function(req,res,next){
    console.log('/ 주소의 요청일 때 실행된다. HTTP메서드는 상관없다.');
    next();
});
app.get('/', function(req,res,next){
    console.log('GET메서드 + / 주소의 요청일때만 실행된다.');
    next();
});
app.post('/', function(req,res,next){
    console.log('POST메서드 + / data 주소의 요청일때만 실행된다.');
    next();
});
// 즉!! use는 주소만 일치하면 되지만 HTTP 메서드는 메서드 방법 + 주소까지 일치해야한다.

//routes/index.js 를 보자.

//라우터 주소에서 특별한 패턴이 있다. 아래를 보자 (route/users.js 에서 확인해보자)
router.get('/users/:id', function(req,res){
    console.log(req.params, req.query);
});
//주소에 :id가 있는데 이 부분에는 다른 값을 넣을 수 있다. /users/1 , /users/123 같이 가능하다.
//이 값은 req.params 객체 안에 들어있다.

//** 라우터가 요청을 보낸 브라우저에게 응답을 보내주는 방법을 알아보자
//send, sendFile, json, redirect, render 메서드를 사용하여 보낸다.
//send : 만능 메서드이다. 버퍼 데이터, 문자열, HTML코드, JSON 데이터를 전송할 수 있다.
//sendFile : 파일을 응답으로 보내주는 메서드
//json : JSON데이터를 보내준다
//redirect : 응답을 다른 라우터로 보낸다.
//render : 템플렛 엔진을 렌더링 할 때 사용한다. app.js에서 폴더명, 엔진명을 세팅했다.

//res.send(버퍼, 문자열, HTML, JSON);
//res.sendFile(파일 경로);
//res.json(JSON 데이터);
//res.redirect(주소);
//res.render('템플렛 파일경로',{변수});


///////////////////////////////
//템플릿 엔진 사용하기
//템플렛 엔진은 자바스크립트를 이용하여 HTML을 렌더링할 수 있게 도와준다. 
//그래서 기존의 HTML과 다르고 자바스크립트 문법도 들어간다.
//pug에 대해 알아보자
//app.js의 아래 부분이 템플렛 엔진을 세팅하는 부분이다.
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');
//views 는 템플렛 파일들이 위치한 폴더이다.  
//(만약 res.render('index') 라면  views/index.pug 를 선택한다.) 

//책 p211 부터 pug EJS 의 문법이 나와 있으니 살펴보자