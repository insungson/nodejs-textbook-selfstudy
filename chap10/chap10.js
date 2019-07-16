//## 지금까지 post 방식은 브라우저에서 입력한 값을 받아서 DB와 연결하여 그 값을 DB에 넣었다.

//##여기선 토근을 발급할때 POST 방식으로 브라우저에서 입력한 값들을 받아 토근을 만들고 변수에 넣어서 보낸다.
//브라우저에서 POST 방식으로 보낸 것을 axois() 방식으로 받아서 그것을 변수 객체에 넣어 세션에 저장한다.
//세션에 저장된 토큰으로 검증후 서버에서 데이터를 가져온다.

//####전체적인 토큰 사용방식####
//1. nodebirdAPI 는 데이터베이스를 가진 서버이다.(여기서 API 기능함)  nodebirdCALL은 클라이언트 서버이다.
//   그리고 axois 모듈(CALL서버에 설치)은 API서버 <-> CALL서버  사이에 데이터를 운반하는 역할을 한다.
//2. 우선 API서버에서 routes/index.js 에서 get / 주소로 들으가면 login.pug가 렌더링된다.
//   login.pug 에서 도메인 및 항목을 채우고 등록을 누르면  form(action='/domain' method='post')에 의해
//   routes/index.js 에서 post /domain  요청이 가게되고 clientSecret: uuidv4() 로 도메인키를 생성 후
//   Domain DB에 저장하고, res.redirect('/') 리다이렉트로 login.pug에 도메인키를 준다.
//3. 도메인키를 CALL서버 .env에 넣는다.
//4. nodebirdcall 클라이언트서버(줄여서 call)에서 routes/index.js 에서 request 변수에서 세션에 토큰이
//   있는지 없는지 확인 후 없으면 서버에 axois모듈을 사용하여 .env에 있는 도메인키와 함께 POST방식으로 토큰을 
//   가져오는 요청을 하고 API서버에서 보낸값(5번과정)들을 tokenResult 변수에 토큰을 담는다.
//5. API서버에서 routes/v1.js에서  post /token 요청을 받았으므로 DB의 Domain과 연계된 User id,nick 값을 
//   jwt모듈의 sign()메서드를 통해 생성한 토큰에 넣는다. 이후 토큰을 보낸다.
//6. (4번과정에서 이어짐) CALL 서버 routes/index.js 에서 (5번에서 API 서버에서 보낸 토큰을 받아서)
//    토큰을 세션에 저장하고(req.session.jwt = tokenResult.data.token;)  세션을 헤더에 넣고 axois모듈을 통해
//    API서버에 요청을 한다.(아래 방식으로)
//     axios.get(`${URL}${api}`, {
//            headers: { authorization: req.session.jwt },
//     })
//    이렇게 CALL서버에서 도메인키를 보내서 토큰을 받고(user의 id,nick값이 포함된) 다시 API서버에 필요한 정보를 
//    요청하는 request함수변수가 완성된 것이다.
//7. CALL서버 routes/index.js에서 get /mypost 을 위에서 만든 request함수에 넣어 API 서버에 post관련 정보를 
//   요청한다.
//8. API서버 routes/v1.js에서 get /posts/my 는 verifyToken(routes/middlewares.js)를 통해 토큰을 확인한다.
//9. API서버 routes/middlewares.js에서 verifyToken은 jwt모듈의 verify()메서드로 확인후 그 값을 req.decoded에
//   넣는다. (그 값은 토큰 생성시 넣은 user의 id,nick 이다!!)
//10. req.decoded에는 id가 들어 있는데 이 id로 API서버 routes/v1.js의 get /posts/my 에서 DB에서 post 관련
//    정보를 가져와서 payload 속성에 넣고(토큰의 내용에 해당한다.) 다시 CALL서버로 JSON형태로 보낸다.
//    (P402를 보면 header에 토큰종류, 해시알고리즘정보를 넣고, payload에 토큰의 내용물을 넣는다.)
//11. CALL서버 routes/index.js 에서 API서버에서 받은 JSON값을 result에 넣고 출력하면 
//    화면에 API서버에서 가져온 JSON값들이 보인다.
/////////////////////////////(굳이 나누는 이유는 이 아래는 cors에 대한 부분이기 떄문이다.)
//12. XMLHttpRequest는 동일한 도메인으로만 HTTP요청이 가능한데, CALL서버는 API서버에서 토큰을 받으므로
//    에러가 발생한다. CORS모듈은 Access-Control-Allow-Origin: *(모두 허용) 도메인이 달라도 허용해준다.
//    개념은 이렇다. 실제로 살펴보자
//13. CALL서버 routes/index.js 에서 아래와 같이 설정을 하고
//    axios.defaults.headers.origin = 'http://localhost:8003'; //axios 디폴트 설정을 통해 origin헤더 추가한다
//14. API서버 routes.v2.js 에서 req.get('origin') 로 API에 요청하는 도메인 정보 객체를 받고 
//    url.parse(req.get('origin'))를 통해 도메인 객체를 JSON화 하여 항목을 나눈다.
//    url.parse(req.get('origin')).host를 통해 Domain 테이블의 host 항목을 검색한다.
//15. cors({ origin: req.get('origin') })(req, res, next); 를 통해
//    cors()을 통해 Access-Control-Allow-Origin 속성에서 localhost:8003만 허용하게 된다. 
//    (app.js에서 맨 앞에 use(cors()) 를 사용하면 Access-Control-Allow-Origin: *(모두 허용))
//    (모든 사용자를 허용하는 것보단 지정한 클라이언트주소만 토큰을 발급하게 만들 수 있다!!)


//간단하게 정리하면
//1. API서버 토큰키 생성
//2. 클라이언트서버 토큰키 입력후 토큰생성 요청 
//3. API서버 토큰 생성(사용자id DB정보포함)후 클라이언트 서버로 토큰 보냄 
//4. 받은 토큰을 클라이언트 서버 세션에 저장
//5. 클라이언트 서버 세션에 저장된 토큰을 헤더에 넣어서 API서버에 정보요청
//6. API서버에서 토큰을 검증 후 필요한 정보를 DB에서 클라이언트 서버(CALL서버)로 보냄
//7. CALL서버에서 디폴트헤더 설정 후 API서버에서 요청된 헤더로 DB에 등록된 도메인과 비교한다.
//8. DB에 도메인이 등록되어 있다면, COR()모듈 함수를 써서 지정한 클라이언트주소만 토큰을 발급한다.



//API(Application Programming Interface)
//다른 응용프로그램(어플리케이션)에서 현재 프로그램의 기능을 사용할 수 있게 허용하는 접점을 의미한다.
//(HTTP요청과 응답에 형식적인 규약이 있으면 웹서비스, 없으면 웹앱이다.)
//웹API 형태
//1. 스크래핑 : 문법적으로 엉켜있는 HTML에서 불필요한 부분을 제거하고, 필요한 부분만큼만 정리한 처리이다.
//             (단점: 복잡해질 가능성, 특정 웹페이지만 사용가능, HTML업데이트에 의해 실행되지 않을 가능성)
//2. HTTP API : 요청 URL이나 응답의 데이터형식 정의
//3. 언어 API : 함수나 클래스 라이브러리 정의(Javascript 라이브러리)
//4. 웨젯 API : HTML 코드부분 (ex: facebook 소셜플러그인)

//REST API, Cache 관련 정보는 chap4.js 에 있다.

//기존의 프로젝트에서 Nodebird의 데이터나 서비스를 이용할 수 있는 API를 만든다.
//다른 서비스에 Nodebird 서비스의 게시글, 해시태그, 사용자 정보를 JSON형식으로 제공한다.(서비스 보급 웹페이지 생성)
//p394 그림 참조
//chap9의 nodebird 폴더에서 config,models,passport 폴더와 내용물을 모두 복사하고, routes 폴더에서 auth.js
//middlewares.js만 그대로 복사한다.  마지막으로 .env 파일을 복사한다. views폴더를 만들고 error.pug파일을 생성한다.
//app.js를 생성하고 코드를 작성한다.
//nodebird-api/models/domain.js     파일을 만들고 도메인 모델을 추가해보자
//models/index.js      에서 User - domain 모델을 1:N 관계로 연결시킨다.
//nodebird-api/views/login.pug     에서 nodebird의 도메인을 등록하는 화면 관련 파일이다.
//nodebird-api/routes/index.js      에서 루트 라우터(GET /)와 도메인 등록 라우터(POST /domain)이다.
//                                      루트라우터는 접속시 로그인 화면을 보여준다.
//                                      도메인 등록 라우터는 폼으로부터 온 데이터를 도메인 모델에 저장한다
//////////////////////////////////////////////////
//https://velopert.com/2350  (여기서 참조했다.)
//토큰이란

//Stateful 서버는 클라이언트에게서 요청을 받을 때 마다, 클라이언트의 상태를 계속해서 유지하고, 
//이 정보를 서비스 제공에 이용합니다. stateful 서버의 예제로는 세션을 유지하는 웹서버가 있습니다. 
//예를들어 유저가 로그인을 하면, 세션에 로그인이 되었다고 저장을 해 두고, 서비스를 제공 할 때에 
//그 데이터를 사용하지요. 여기서 이 세션은, 서버컴퓨터의 메모리에 담을 때도 있고, 데이터베이스 
//시스템에 담을 때도 있습니다

//Stateless 서버는 반대로, 상태를 유지 하지 않습니다. 상태정보를 저장하지 않으면, 서버는 
//클라이언트측에서 들어오는 요청만으로만 작업을 처리합니다. 이렇게 상태가 없는 경우 클라이언트와 
//서버의 연결고리가 없기 때문에 서버의 확장성 (Scalability) 이 높아집니다.

//Stateful 서버는 서버기반 인증 시스템이다.
//서버기반인증 사진넣기
//서버기반인증의 문제점
//1. 세션 :  서버는 유저의 인증에 대한 기록을 서버에 저장하고 이를 세션이라한다.
//           대부분의 경우엔 메모리에 이를 저장하는데, 로그인 중인 유저의 수가 늘어난다면 어떻게될까요?
//           서버의 램이 과부화가 되겠지요? 이를 피하기 위해서, 세션을 데이터베이스에 시스템에 저장하는 
//           방식도 있지만, 이 또한 유저의 수가 많으면 데이터베이스의 성능에 무리를 줄 수 있습니다.
//2. 확장성 : 세션을 사용하면 서버를 확장하는것이 어려워집니다. 
//            여기서 서버의 확장이란, 단순히 서버의 사양을 업그레이드 하는것이 아니라,
//            더 많은 트래픽을 감당하기 위하여 여러개의 프로세스를 돌리거나, 
//            여러대의 서버 컴퓨터를 추가 하는것을 의미합니다. 
//            세션을 사용하면서 분산된 시스템을 설계하는건 불가능한것은 아니지만 과정이 매우 복잡해집니다.
//3. CORS (Cross-Origin Resource Sharing)
//          웹 어플리케이션에서 세션을 관리 할 때 자주 사용되는 쿠키는 단일 도메인 및 서브 도메인에서만 
//          작동하도록 설계되어있습니다. 따라서 쿠키를 여러 도메인에서 관리하는것은 좀 번거롭습니다.

//토큰기반 인증 시스템의 작동원리
//토큰 기반 시스템은 stateless 합니다. 무상태. 즉 상태유지를 하지 않는다는 것이죠. 
//이 시스템에서는 더 이상 유저의 인증 정보를 서버나 세션에 담아두지 않습니다. 
//토큰기반 인증 시스템의 작동순서는 다음과 같다
//1. 유저가 아이디와 비밀번호로 로그인을 합니다
//2. 서버측에서 해당 계정정보를 검증합니다.
//3. 계정정보가 정확하다면, 서버측에서 유저에게 signed 토큰을 발급해줍니다.
//   여기서 signed 의 의미는 해당 토큰이 서버에서 정상적으로 발급된 토큰임을 
//   증명하는 signature 를 지니고 있다는 것입니다
//4. 클라이언트 측에서 전달받은 토큰을 저장해두고, 서버에 요청을 할 때 마다, 해당 토큰을 함께 서버에 전달합니다.
//5. 서버는 토큰을 검증하고, 요청에 응답합니다.

//토큰의 장점
//1. 무상태(stateless) 이며 확장성(scalability)이 있다
//   토큰은 클라이언트사이드에 저장하기때문에 완전히 stateless 하며, 서버를 확장하기에 매우 적합한 환경을
//   제공합니다. 만약에 세션을 서버측에 저장하고 있고, 서버를 여러대를 사용하여 요청을 분산하였다면, 
//   어떤 유저가 로그인 했을땐, 그 유저는 처음 로그인했었던 그 서버에만 요청을 보내도록 설정을 해야합니다. 
//   하지만, 토큰을 사용한다면, 어떤 서버로 요청이 들어가던, 이제 상관이 없죠.
//2. 보안성
//   클라이언트가 서버에 요청을 보낼 때, 더 이상 쿠키를 전달하지 않음으로 쿠키를 사용함으로 인해 
//   발생하는 취약점이 사라집니다. (토큰을 사용하는 환경에서도 취약점이 존재 할 수 있다.)
//3. Extensibility (확장성)
//   여기서의 확장성은, Scalability 와는 또 다른 개념입니다. 
//   Scalability 는 서버를 확장하는걸 의미하는 반면, Extensibility 는 로그인 정보가 사용되는 분야를 
//   확장하는것을 의미합니다. 토큰을 사용하여 다른 서비스에서도 권한을 공유 할 수 있습니다. 
//   예를 들어서, 스타트업 구인구직 웹서비스인 로켓펀치에서는 Facebook, LinkedIn, GitHub, Google 계정으로 
//   로그인을 할 수 있습니다. 토큰 기반 시스템에서는, 토큰에 선택적인 권한만 부여하여 발급을 할 수 있습니다 
//   (예를들어서 로켓펀치에서 페이스북 계정으로 로그인을 했다면, 프로필 정보를 가져오는 권한은 있어도, 
//   포스트를 작성 할 수 있는 권한은 없죠)
//4. 여러 플랫폼 및 도메인
//   서버 기반 인증 시스템의 문제점을 다룰 때 CORS 에 대하여 언급 했었죠? 
//   어플리케이션과 서비스의 규모가 커지면, 우리는 여러 디바이스를 호환 시키고, 더 많은 종류의 서비스를 
//   제공하게 됩니다. 토큰을 사용한다면, 그 어떤 디바이스에서도, 그 어떤 도메인에서도, 토큰만 유효하다면 
//   요청이 정상적으로 처리 됩니다. 서버측에서 어플리케이션의 응답부분에 다음 헤더만 포함시켜주면 되지요.
//Access-Control-Allow-Origin: *
//   이런 구조라면, assets 파일들(이미지, css, js, html 파일 등)은 모두 CDN 에서 제공을 하도록 하고, 
//   서버측에서는 오직 API만 다루도록 하도록 설계 할 수도 있지요.
///////////////////////////////////////////////교재로 돌아와서
//JWT 토큰으로 인증하기
//다른 클라이언트가 nodebird의 데이터를 가져가기 위해서 별도의 인증과정이 필요하다.
//JWT 토큰은 JSON Web Token의 약어로 JSON 형식의 데이터를 저장하는 토큰이다.
//JWT 토큰은 aaaaaa.bbbbbb.cccccc 형태로 되어있다. (a는 해더(header), b는 내용(payload),c는 서명(signature))
//header : 토큰 종류와 해시 알고리즘 정보가 들어있다.
//payload : 토큰의 내용물이 인코딩된 부분이다.
//signature : 일련의 문자열로, 시그니처를 통해 토큰이 변조되었는지 여부를 확인할 수 있다.

//https://velopert.com/2448 (참고)
//jsonwebtoken 으로 JWT 발급하기
//사용법: jwt.sign(payload, secret, options, [callback])
//  만약에 callback 이 전달되면 비동기적으로 작동하며, 콜백함수의 파라미터는 (err, token) 입니다. 
//  전달되지 않을시엔 동기적으로 작동하며, JWT 를 문자열 형태로 리턴합니다.
//  payload : 객체, buffer, 혹은 문자열형태로 전달 될 수있습니다.
//  secret : 서명을 만들 때 사용되는 알고리즘에서 사용되는 문자열 혹은 buffer 형태의 값 입니다.
//  options: https://github.com/auth0/node-jsonwebtoken 자세한건 여기서
//      algorithm: 기본값은 HS256 으로 지정됩니다.
//      expiresIn: JWT 의 등록된 클레임중 exp 값을 x 초후 혹은 rauchg/ms 형태의 기간 후로 설정합니다.
//      (예제: (60, “2 days”, “10h”, “7d”)
//      notbefore: JWT 의 등록된 클레임중 nbf 값을 x 초후 혹은 rauchg/ms 형태의 기간 후로 설정합니다.
//      (예제: (60, “2 days”, “10h”, “7d”)
//      audience
//      issuer
//      jwtid
//      subject
//      noTimestamp
//      header

//https://jwt.io/ 여기 들어가면 JWT 토큰의 payload 부분을 볼 수 있다.

//*JWT 토큰은 JWT 비밀키를 알지 않는 이상 변조가 불가능하다. 변조한 토큰은 시그니처를 검사할때 들통난다.
//  변조할 수 없으므로 내용물이 바뀌지 않았는지 걱정할 필요가 없다.  즉 사용자이름, 권한 같은 것을 
//  넣어두고 안심하고 사용할 수 있다. (외부에 노출되어도 상관없는 자료에 한해서)
//  단점은 내용물이 들어있기 떄문에 용량이 크다.  그래서 아래와 같은 것을 따지고 설계를 해야한다.
//  (랜덤 스트링으로 매번 사용자 정보를 조회하는작업 VS 내용물이 들어있는 JWT토큰을 사용)

//npm i jsonwebtoken      으로 설치한다.
//이제 JWT를 사용한 API를 만들어보자.  다른 사용자가 API를 쓰려면 JWT토큰을 발급받고 인증받아야 한다.
//(이 부분은 대부분의 라우터에 공통되므로 미들웨어로 만들어두자)
//.env              에서 토큰 비밀키 설정을 하고
//nodebird-api/routes/middlewares.js       토큰의 검정부분을 추가하자 (검정되었으면 다음 미들웨어로 넘김)
//nodebird-api/routes/v1.js    토큰을 발급하는 라우터(POST /v1/token), 사용자가 토큰을 테스트하는 라우터
//                             (GET /v1/test)를 만들어보자
//v1은 version1 의미로 다른사람이 기존 API를 쓰고 있기 때문에 기존의 라우터를 함부로 수정하면 안되기 떄문이다.
//서버의 코드를 바꾸면 API를 사용중인 다른 사람에게 영향을 미친다. 기존에 있던 라우터가 수정되는 순간 API를 
//사용하던 프로그램들이 오작동할 수 있다. 그러므로 많은 수정을 해야한다면 버전을 올린 라우터를 새로 추가하고
//이전 API를 쓰는 사용자들에게 새로운 API가 나왔음을 알리는게 좋다.
//app.js 에서 위에서 만든 라우터를 서버에 연결하자 

////////////////////////////////////
//호출서버 만들기
//API 제공 서버(nodebird-api)를 만들었으니  API를 사용하는 호출서버(nodebird-call)도 만들어보자
//nodebird-api와 같은 폴더에 nodebird-call 폴더를 만든다.
//package.json 파일에 설치할 모듈을 설정한다.
//npm i 로 모듈을 설치한다. 
//이 서버의 주 목적은 nodebird-api의 API를 통해 데이터를 가져오는 것이다. 
//가져올 데이터가 JSON 형태이므로 pug, ejs 같은 템플렛 엔진으로 데이터를 랜더링할 수 있다.
//nodebird-call/app.js      (서버파일)을 만들고
//nodebird-call/views/error.pug     (에러를 표시할 파일)을 만들자
//API를 사용라혀면 먼저 사용자 인증을 받아야 하기 때문에 사용자인증이 원활하게 진행되는지 테스트하는 라우터를
//만들어보자   이전에 만든 도메인의 ClientSecret을 .env에 넣는다. (mysql 에서 찾아서 넣는다.)
//nodebird-call/.env        (인증키 넣기)
//nodebird-call/routes/index.js     (사용자 인증이 되는지 테스트하는 라우터 생성)
//이제 nodebird-api 서버를 실행하고, nodebird-call을 실행한다.
//브라우저창에서 localhost:8003/test   에 들어가면 토큰을 받은 정보를 확인할 수 있다.
//(nodebird-api/routes/v1에서 생성한 토큰의 JSON정보들)  토큰 유지시간은 1분으로 한정했으므로 1분후 
//브라우저 주소로 재접속하면 토큰이 만료된것을 확인할 수 있다.


///////////////////////////////////////////////
//SNS API 서버만들기
//이제 다시 API 제공자(nodebird-api)의 입장에 되어 나머지 API라우터를 완성시키자
//nodebird-api/routes/v1.js   에 GET /posts/my 라우터, GET /posts/hashtag/:title 라우터를 만든다.
//GET /posts/my 라우터 : 내가올린 게시글을 가져온다.
//GET /posts/hashtag/:title 라우터 : 해시태그 검색결과를 가져온다.
//이제 사용하는 쪽(nodebird-call)에서 위의 라우터를 이용하는 코드를 추가하자
//nodebird-call/routes/index.js    의 코드에서 기존의 테스트 라우터로 받은것을 수정하자
// GET /test  라우터 (이것은 없앤다.) (토큰이 1분만 유지된다.)
// GET /mypost 라우터,  GET /search/:hashtag 라우터 를 만든다. (토큰만료 후 재요청 매서드를 만들었다.)
//이제 nodebirds-api , nodebirds-call 을 실행하고 localhost:8003/mypost 로 들어가면 자신의 게시글 정보가 나온다.
//localhost:8003/search/해쉬태그이름   을 들어가면 해시태그가 달린 게시글 정보가 나온다.


///////////////////////////////////////////////
//사용량 제한 구현하기
//위의 과정을 통해 일차적으로 사용자(토큰을 발급받은 사용자)만 API를 사용할 수 있게 필터를 두긴 했지만,
//아직 충분한것은 아니다. 인증된 사용자라 하더라도 과도하게 API를 사용하면 API 서버에 무리가 간다.
//API 사용자중 free / premium에 따라 횟수를 제한하도록 만들어보자
//(예를 들면 free 사용자는 1시간에 10번, premium은 1시간에 100번을 허용한다.)
//npm i express-rate-limit    를  API서버(nodebird-api)에 설치하자
//nodebird-api/routes/middlewares.js     에서 사용횟수 제한에 대한 메서드를 추가하자
//nodebird-api/routes/v2.js         에서 사용횟수 제한에 대한 라우터를 만들어보자
//nodebird-api/routes/v1.js         에서 기존 v1 라우터 사용시 경고 메시지를 띄우는 코드를 작성하자
//실제 서비스 운영시 v2가 나왔다고 바로 v1을 닫기보단 일정 기간을 두고 옮기는게 좋다.(v3,v4가 나와도 같이 대처하기)
//nodebird-api/app.js          에서 새로만든 라우터를 서버와 연결한다.
//다시 사용자의 입장(nodebird-call)로 돌아와서 새로 생긴 버전을 호출해보자
//nodebird-call/routes/index.js     에서 URL 부분을 v1->v2로 바꿔야된다.
//(nodebird-api/routes/middlewares.js 에서 토큰 사용량을 1분에 1번으로 제한했다.)


//////////////////////////////////////////////////////
//https://zamezzz.tistory.com/137 개념설명 참고사이트
//CORS 이해하기 (CORS_principle 사진을 보면 기본적인개념을 알 수 있다.)
//CORS는 Cross Origin Resource Sharing의 줄임말로, Cross-Site Http Request를 가능하게하는 표준 규약입니다.
//다른 도메인으로부터 리소스가 필요할 경우 cross-site http request가 필요합니다
//기존에는 XMLHttpRequest는 보안상의 이유로 자신과 동일한 도메인으로만 HTTP요청을 보내도록
//제한하였습니다. 즉 cross-origin http 요청을 제한하였죠   하지만 지속적으로 웹 애플리케이션을 
//개선하고 쉽게 개발하기 위해서는 이러한 request가 꼭 필요했습니다. 
//그래서 XMLHttpRequest가 cross-domain을 요청할 수 있도록하는 방법이 필요하게 되었죠. 
//이러한 요청을 바탕으로 CORS가 탄생하였습니다.

// CORS의 종류
// 크게 4종류로 나누어 볼 수 있습니다. 4가지 종류는 아래와 같습니다.
// 1 Simple Request
// 2 Preflight Request
// 3 Credential Request
// 4 Non-Credential Request

//nodebird-call이 nodebird-api를 호출하는 과정을 이전까지 한 코딩인데 이는 서버->서버로 API를 호출한것이다.
//만약 nodebird-call의 브라우저에서 nodebird-api 서버API를 호출하면 어떻게 해야할까?
//nodebird-call/routes/index.js     에서 GET / 라우터를 추가하여 main.pug 부분을 랜더링 한다.
//nodebird-call/views/main.pug      에서 main.pug를 만든다. 
//api,call 서버를 실행 후 localhost:8003 으로 접속하고 개발자모드를 보면 CORS 문제로 인해서 에러가 발생한다.
//콘솔창에 Access-Control-Allow-Origin' header is present on the requested resource  이렇게 뜬다.
//CORS 문제를 해결하기 위해선 응답헤더에 Access-Control-Allow-Origin 헤더를 넣어줘야한다.
//이 헤더는 클라이언트 도메인의 요청을 허락하겠다는 뜻을 가지고 있다. res.set() 메서드로 직접 넣어도 되지만
//npm i cors         로 nodebird-api에 설치해야한다.  응답은 서버에서 하기 때문이다!! 
//이후 nodebird-api/routes/v2.js    에서 설치한 cors 패키지를 연결시킨다.
//토큰 요청을 보내는 주체가 브라우저 스크립트(클라이언트)라서 비밀키(process.env.CLIENT_SECRET)가 모두에게 노출된다
//위의 문제를 막기 위해 처음에 비밀키 발급 시 허용된 도메인을 적게 했다. 
//호스트와 비밀키가 모두 일치할때만 CORS를 허용하게 수정하면 된다.
//nodebird-api/routes/v2.js       에서 코드를 수정하여 Access-Control-Allow-Origin이 *으로 되어있는데
//*는 모든 클라이언트의 요청을 허용한다는 뜻이다.
//비밀키노출1(모든 클라이언트 허용), 비밀키노출2(도메인을 등록한 클라이언트만 허용)
//위의 것을 실행하려면 Domain 테이블의 host 를 localhost:8003 으로 맞춰야 된다.