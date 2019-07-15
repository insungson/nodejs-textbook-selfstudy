
////////////////////////// 교재 쳅터9

//**이제서야 알게된 중요한 것이지만... app.use(), router.get() 에서 use와 get의 차이는...
//  use는 모든 요청에대해 작동을 한다는 것이고... get은 get요청에 대해서만 작동을 한다는 것이다.

//처음에 nodebird 폴더에 package.json 파일을 만들고 시퀄라이즈 mysql 을 설치한다.

//npm i -g sequelize-cli
//npm i sequelize mysql2
//sequelize init

//그 다음에 views(템플릿 파일 넣음), routes(라우터 파일 넣음), public(정적 파일 넣음) 폴더를 만든다
//passport()폴더도 만든다.  passport는 로그인 할때 사용된다.
//https://www.zerocho.com/category/NodeJS/post/57b7101ecfbef617003bf457 자세한 설명은 여기에
//http://www.passportjs.org/docs/authenticate/   패스포트에 대한 문서

//npm i express cookie-parser express-session morgan connect-flash pug
//express, cookie-parser, express-session, morgan, connect-flash, pug  를 한번에 설치한다.

//npm i -D nodemon
//개발자모드로 nodemon을 설치한다.  nodemon은 서버 코드를 수정하면 자동으로 재시작해준다.
//(package.jon에 nodemon으로 시작)

//app.js   를 만들고 코드를 작성하자
//express-session의 옵션들(req.session에 값들이 들어간다.) 
//예를 들면 req.session.[원하는것] 으로 추가할 수 있다.
//   proxy : 프록시를 믿을 것인지, http와 관련하여 필요한 옵션이다.default는 undefined이다.
//   resave : 재저장을 계속 할 것인지 묻는 옵션이다. 세션에 요청이 들어간 후에 세션에 변동이 있든 없든 무조건
//            저장하겠다는 옵션. default는 true이나 false를 추천한다.
//   saveUninitialized : 세션이 세션 store에 저장되기 전에 uninitialized 된 상태로 만들어서 저장한다.
//   secret : 비밀키를 저장한다. 이 비밀키를 통해서 Session id를 암호화하여 관리한다.
//   cookie : 세션과 함께 쿠키를 사용할 수 있는데, 객체로서 들어간다. (secure, maxAge는 옵션이다.)
//express-session의 메서드들
//   session.destroy() : 세션을 삭제한다.
//   session.reload() : 세션을 다시 불러온다. 저장되지 않은 정보들은 사라진다.
//   session.save() : 세션에 변경된 값을 저장할 수 있다.
//   session.regenerate() : 세션을 새로 생성한다. 기존의 세션은 사라진다.

//cookie-parser와 express-session의 nodebirdsecret같은 비밀키는 직접 하드코딩하지 않고 dotenv 패키지를 사용한다.
//.env 를 만들어서 비밀키는 그 파일에 넣고, dotenv가 .env 를 읽어 process.env 객체에 넣는다.
//.env(dot + env 인 이유)
//npm i dotenv    로 dotenv 설치한다.

//app.js에 dotenv의 설정을 추가하여 .env의 비밀키들을 precess.env에 넣는다.
//(process.env.COOKIE_SECRET 처럼 키로 사용가능)

//이제 라우터와 템플릿 엔진을 만들어보자 
//routes/page.js  를 만들고, views/layout.pug,main.pug,profile.pug,join.pug,error.pug  들의 템플릿을 추가한다.
//디자인을 위해 public/main.css 를 추가한다.
//layout.pug(랜더링 할 때 사용된user가 존재하면 사용자 정보,팔로잉,팔로워 수를 보여주고, 존재하지 않으면 로긴보여줌.)
//main.pug(user변수가 존재할 때 게시글 업로드 폼을 보여준다.) 
//(랜더링 시 twits배열 안의 요소들을 읽어서 게시글로 만든다. 게시글 데이터를 나중에 twits에 넣어주면 된다.)
//profile.pug(사용자의 팔로워와 팔로잉 중인 목록을 보여준다.)
//join.pug(회원가입하는 폼을 보여준다.)
//error.pug(서버에 에러 발생 시 에러 내역을 보여준다. 에러를 브러우저 화면으로 보여준다.)

//이제 npm start 를 입력 후 localhost:8001  로 접속하면 화면이 보인다.


////////////////////
//데이터베이스 세팅하기
//Mysql과 시퀄라이즈를 데이터베이스로 설정해보자
//로그인 기능이 있으므로 사용자 테이블이 필요하고(user.js), 게시글을 저장할 게시글 테이블이 필요하다(post.js),
//해시태그를 사용하므로 해시태그 테이블도 만들어야 한다.(hashtag.js)
//models/user.js, post.js, hashtag.js  를 만들어보자
// https://sequelize.readthedocs.io/en/2.0/docs/models-definition/  <--시퀄라이즈 모델정의 부분이다.참고하자
//이후 models/index.js   에서 위에서 생성한 모델을 시퀄라이즈에 등록한다. 
//NodeBird의 모델은 5개(직접 생성한 User, Hashtag, Post  와 생성된 모델의 관계를 설정하는 PostHashtag, Follow)

//7장은 MYSQL 프롬프트를 통해 SQL문으로 데이터베이스를 만들었다. 여기선 시퀄라이즈가 가진 config.json을 읽어
//데이터베이스를 생성하는 기능을 사용해보자
//config/config.json   에서 password, database 를 맞게 수정하자

//콘솔에서 sequelize db:create    를 입력하면 데이터베이스가 생성된다.
//(mysql 워크벤치에 테이블이 생성된것을 확인할 수 있다.)

//이제 모델을 서버와 연결해보자 
//app.js에서 추가를 하자

//이제 npm start 를 입력하면 생성된 DB의 테이블을 볼 수 있다.

/////////////////////////////////////////
//passport 모듈로 로그인 구현하기
//passport 모듈은 회원가입, 로그인에 관련된 세션,쿠키들을 쉽게 처리할수 있게 도와준다.

//npm i passport passport-local passport-kakao bcrypt    
//를 입력하여(passport, passport-local, passport-kakao, bcrypt)를 설치한다.

//설치한 passport패키지와 app.js를 연결시켜보자
//app.js     를 수정하자

//이제 app.js 와 연결했던 passport/index.js  를 만들고 코드를 작성하자

//추후에 만들 possport/localStrategy.js, kakaoStrategy.js 파일은 각각 로컬 로그인과 카카오 로그인에 대한 
//파일이다. 로컬로그인은 자체적으로 회원가입을 하고 로그인하는 것을 의미한다.
//(로그인한 사용자는 회원가입, 로그인 라우터에 접근하면 안되고, 로그인하지않은 사용자는 로그아웃 라우터에 접근
//하면 안된다.)

//라우터접근을 제한하고 구분해주는 미들웨어를 만들어보자
//routes/middlewares.js    를 만들어 로그인 여부를 파악하는 미들웨어를 만들어보자

//routes/page.js    에 routes/middlewares.js 에서 만든 isLoggedIn,isNotLoggedIn 미들웨어를 사용해보자

//routes/auth.js    에  회원가입, 로그인, 로그아웃에 대한 라우터를 작성해보자
//passport.authenticate() 메서드의 옵션이나 사용법은
//http://www.passportjs.org/docs/authenticate/   <-- 여기를 참고하면 된다.

//possport/localStrategy.js   를 만들자 

//possport/kakaoStrategy.js   를 만들어서 회원가입없이 인증을 카카오에 맡기자

//이제 routes/auth.js 에서  카카오 로그인 라우터를 만들어보자

//추가한 auth 라우터를 app.js에 연결하자
//* passport 패키지(login 인증기능)에 session 기능을 추가하고 싶다면
//app.js    에서 app.use(passport.initialize());로 초기화를 시키고, app.use(passport.session());로
//세션의 기능을 사용한다. 
//(반드시!! app.use(express.session({ secret: 'keyboard cat' })); 같은 기존의 express.session()이 먼저 
//나와야 한다.)

//이후 https://developers.kakao.com  에 들어가서 앱이름을 NodeBird로 등록하고 
//REST API키를 가져와서 .env 파일에 추가해준다.

//////////////////////////////////////////
//Multer 모듈로 이미지 업로드 구현해보자
//파일을 업로드시 사용하는 모듈이다. 
//템플렛의 form태그에서 내부 설정을 enctype='multipart/form-data'(views/main.pug) 이렇게 해줘야 한다.
//(데이터 형식이 multipart라는 뜻이다.)
//npm i multer      로 설치를 한다.
//routes/post.js   에 post라우터를 만들어보자
//post 라우터 부분에서 storage 안의 filename부분에 대한 설명이다.
//https://stackoverflow.com/questions/34328846/node-multer-get-filename
//request.file.originalname or request.file.filename to get the new filename created by nodejs app.
//req.file 의 구조는 대략 아래와 같다.  (여기서 originalname이 파일이름이다.)
// { 
//     fieldname: 'songUpload',
//     originalname: '04. Stairway To Heaven - Led Zeppelin.mp3',
//     encoding: '7bit',
//     mimetype: 'audio/mp3',
//     destination: './uploads',
//     filename: 'songUpload-1476677312011',
//     path: 'uploads/songUpload-1476677312011',
//     size: 14058414 
//   }


//게시글 작성 기능이 추가되었기 때문에 메인 페이지 로딩시 메인 페이지와 게시글을 함께 로딩해보자
//routes/page.js 에서 게시글을 순서대로 조회가 되는 코드를넣는다.


////////////////////////////////////
//프로젝트의 마무리
//routes/post.js    에서 해시태그 검색 기능을 추가해보자
//(위파일에서 posts = await hashtag.getPosts({include:[{model:User}]});  
//include 부분은     https://gist.github.com/zcaceres/83b554ee08726a734088d90d455bc566  여기를 참조한다.
//                  http://docs.sequelizejs.com/manual/models-usage.html  여기서 include를 검색해도 된다.
//include옵션에서 model 옵션을 주면 선택한 model과 JOIN이 가능하다.)

//routes/user.js     현재 로긴한 팔로우 유저 id를 찾고 넘긴다. 

//팔로우할 사용자의 아이디를 req.user 객체에 팔로워 팔로잉 관계를 같이 저장해야하기 때문에 설정을 바꿔야한다.
//passport/index.js   에서 req.user객체의 팔로잉 팔로워 세팅은 deserializeUser() 에서 하기 때문에 여기를 수정한다.

//이제 routes/post.js, user.js 를 app.js 에 연결해보자 


//시퀄라이즈에 대한 설명
//http://docs.sequelizejs.com/manual/querying.html
//http://docs.sequelizejs.com/manual/scopes.html
//http://docs.sequelizejs.com/manual/associations.html#basic-concepts

//https://sequelize.readthedocs.io/en/2.0/docs/models-definition/  !!! 



/////////////////////////////////////
//패스포트 작동원리 (패스포트의 로그인 과정)
//1. layout.pug 에서 이메일, 비번을 입력후 로긴 버튼을 누르면 form(action='/auth/login' method='post') 에 의해
//   routes/auth.js의 post('/login',  로 연결되고, 
//   여기서 passport.authenticate('local', (authError, user, info) 에 의해  여기서 local에 의해 
//   passport/localStrategy.js 로 연결된다. 
// (즉! layout.pug에서 입력한 email, password가 passport/localStrategy.js 로 가는것이다.)

//2. 아래의 부분을 참조하자
//   passport.use(new LocalStrategy({  //본문의 req.body의 속성명(name)을 적으면 된다.(여기선 layout.pug)
//     usernameField: 'email',         //req.body.email 의 name인 email
//     passwordField: 'password',      //req.body.password의 name인 password를 적으면 된다
//   email로 디비에서 사용자 존재유무를 확인하고, password는 디비정보와 비교한다.
//   done(null, exUser)  에서 exUser에 디비 정보를 넣고 done()을 통해 passport/index.js 의 
//   passport.serializeUser((user, done) 에 user로 들어간다.

//3. passport.serializeUser((user, done) 의 user에서 필요한 정보(user.id)만 done(null, user.id); 을 통해
//   세션에 저장을 한다.
//   (app.js의 app.use(passport.initialize());, app.use(passport.session()); 로 저장됨)

//4. passport/index.js의 passport.deserializeUser((id, done)에서 id로 세션에 저장된 3번의 user.id를 id로 받는다.
//   id로 DB의 데이터를 찾고 찾은 정보를 .then(user => done(null, user))  의 done()을 통해 user로 보낸다.

//5. 보낸 정보는 각 라우터의 req.user로 접근할 수 있다!! 
//   (어떤 페이지로 접근해도 req.user로 접근 가능!!!)

/////////////////////////////////////
//6. 로그아웃은 req.user 객체를 삭제하고, 세션을 지우면 된다.
//   아래와 같이 로그아웃 라우터에 해당 메서드를 추가하여 req.user 객체 삭제, req.session 삭제 후 리다이렉트해준다.
// router.get('/logout', isLoggedIn, (req, res) => {
//     req.logout();           //req.logout() 메서드는 req.user 객체를 제거한다.
//     req.session.destroy();  //req.session.destroy() 메서드는 req.session 객체의 내용을 제거한다.
//     res.redirect('/');