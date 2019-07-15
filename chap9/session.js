//////////////////////////////////////////////////
//https://m.blog.naver.com/scw0531/221165327133    <-- Redis, Express-session을 이용한 세션관리부분 정리하기

//세션 : 클라이언트와 서버간의 일정기간 동안 발생하는 일련의 통신이다. 클라이언트가 한번 로그인하고 각 요청에 대해
//       별도의 로그인 수행없이 요청을하거나 특정 페이지 접속가능하다. 로그인-로그아웃까지의 정보유지 및 관리를
//       세션이라고 한다. 세션은 서버에 저장하고 쿠키는 브라우저에 저장한다.쿠키는 서버에 부담이 없고 세션은 서버에
//       부담을 주기 때문에 중요한 데이터만 세션에 저장한다.  
//       노드에서 세션은 메모리에 저장이 되므로 노드서버를 다시 시작하면 기존의 것들은 날라간다.
//       하지만 메모리에 저장된 정보를 DB와 연결시키면 노드서버를 다시 시작해도 기존의 정보를 살릴 수 있다.
//       (Sping에선 Spring Security로 JSP는 HttpSession으로 세션관리를 한다.)

//express-session은 노드에서 Express 미들웨어를 이용하여 구성한다.express-session은 Express에서 같이 관리되고 
// 사용되는 세션 미들웨어이다. 아래의 사진처럼 세션관리를 할 수 있다.

//express-session 구조 사진넣기

//가장 바깥쪽으로 Express, express-session이 미들웨어로 동작을 하고, 내부적으로 세션은 Redis를 활용하여 관리한다.
//미들웨어 수준으로 관리되니 여러 라우팅 경로에서도 세션값을 필요로 할때 참조할 수 있다.

//Redis는 Remote Dictionary Server의 약자로서 'Key-Value'구조의 비관계형 데이터를 저장하고 관리하기위한 NOSQL일종
//이다. 모든 데이터를 메모리로 불러와서 처리하는 메모리기반(인메모리) DBMS이다. 
//자료구조형식으로 데이터를 관리한다. 문자열의 리스트, 문자열의 집합, 문자열의 정렬된 집합, key-value가 스티링인
//HASH이다.

//NODEjs에서 Redis 사용
//1. Redis, Express-session, connect-redis  를 npm으로 설치한다.
//2. 설치한 라이브러리 require로 연결함.
//Redis : Redis DB를 사용하기 위함
//express-session : express에서 세션을 관리하기 위함
//connect-redis : redis DB를 세션관리에 사용할 수 있도록 저장소를 연결시켜주는 기능 
//                (미들웨어에서 관리하기 위해 app.js에 위치함.)
//3. 세션관리설정
//createClient로 Redis 서버연결 설정을 한다.(redis.createClient(6379,'localhost') 로 포트번호,host주소 입력)
//use() 를 이용하여 미들웨어에서 session()을 정의해준다.
//session의 옵션은 secret, store, saveUninitialized, resave 등이 있다.
//secret : 쿠키를 임의로 변조하는 것을 방지하기 위한 값이다.(해당값을 통해 세션을 암호화하여 저장한다.)
//resave : 세션을 언제나 저장할지(변경하지 않아도) 정하는 값.
//          (express-session에서는 false로 하는것을 권장한다.)
//store : Redis에 대한 설정이다. (app.use(session{})를 이용하여 express와 connect-redis 를 연결한다.)
//        실제 세션관리시 redisStore(connect-redis의 require변수)를 만들어 저장한다.
//              내부옵션으로 Redis연결세션과 ttl값이 있다.
//              ttl : 언제 Redis DB에서 사라지게 할지에 대한 만료시간 설정
//4. 라우팅 파일 설정
//라우팅 파일에선 따로 Redis는 설정할 필요없고 session만 적용시켜주면 된다.
//세션값 설정은 request.session.key를 이용한다.
//세션값 삭제는 destroy()로 한다.




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