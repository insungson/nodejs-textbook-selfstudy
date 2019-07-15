//https://m.blog.naver.com/PostView.nhn?blogId=scw0531&logNo=221175584994&proxyReferer=https%3A%2F%2Fwww.google.com%2F
//위의 링크에서 자세한걸 보자
//https://opentutorials.org/course/3402/21878 패스포트 설명

//passport는 NodeJS에서 인증관련 미들웨어이다!!   로그인 기능이나 어떤 기능을 수행, 특정 페이지에 접속을 위해서
//관리자 권한, 로그인이 되어 있어야지 가능하게끔 인터셉터를 해주고 권한체크를 해주는 것이다.
//express , express-session 미들웨어를 연동하여 더 유연한 기능을 제공하고, 인증을 위한 다양한 strategy를 제공한다.
//HTTP Basic Auth, HTTP digest authentication, OAuth, OpenAPI 등 다양한 인증 프로토콜을 지원한다.
//passport 미들웨어 구조 사진 첨부
//사진의 구조를 보면 바깥으로 Express가 있고 내부에 Express-session 과 Passport가 있다.
//인증로직을 수행하는데 있어 세션관리도 같이 되는 구조이다
//즉 Passport로 인증을 하면 해당 인증 정보를 Redis를 이용하는 세션에 저장하고 해당세션을 불러와 사용하게 된다.

//인증전략(strategy)
//passport는 기본적으로 인증을 하기 위한 strategy라는 패턴을 가진다.
//기본 전략은 로컬전략으로 개발자가 DB를 이용하여 직접 인증 로직을 구현할 수 있고, 구글,페이스북,다음,네이버
//등 각각 소셜 API를 이용한 전략들도 있다. passport의 strategy부분을 바꾸면 유연하게 대처할 수 있다.

//passport 인증과정 사진넣기
//위의 구조는 Spring security에서 권하는 구조와 동일하다.
//사용자가 로그인이나 특정 URL을 호출하면 권한체크(isAuthenticated)를 하게되고 권한이 맞지 않거나 로그인이
//되어있지 않으면 인증모듈을 타게된다. (passport가 관리하는 미들웨어로 들어와 선택된 전략에 따른 로직을 수행한다.)
//
//만약 로그인 에러나 정확하지 않은 정보일때 다시 로그인 페이지로 돌아가게 리다이렉트 할 수 있다. 
//로그아웃을 할때도 현재 등록된 세션을 만료시켜 다시 로그인을 하게 유도할 수있다.
//다른 strategy를 사용할때 passport의 strategy부분의 내용만 변경하면 된다.
//인증을 성공하면 해당 정보를 세션(Redis)에 저장하고 해당 페이지에 접근하게된다. 로그인 에러,정확하지 않은 정보면
//다시 로그인 페이지로 돌아가게끔 리다이렉트 하게된다. 
//로그아웃을 하게 되면 현재 등록된 세션을 만료시켜 다시 로그인을 하게끔 유도할 수 있다.
//(상황에따라 다른 전략을 등록하여 여러방법을 동시에 쓸수 있다.)



//아래와 같이 passport를 적용해보자 (passport의 기본적인 설정방법)
//1. npm passport 설치 
//2. 변수에 require로 가져오기
    //(로컬전략은 라우팅환경에서 인증로직이 실제 들어가는 파일이 필요하기 때문에 app.js에서는 적용하지 않는다.)
//3. passport 초기화 및 Express-session 설정
    //(인증로직은 세션을 반드시 필요하다. 세션은 Express-session이고 Redis 이용한다.)
    //(initialize()를 이용하여  해당 프로젝트에 passport 미들웨어를 초기화하고, session()을 이용하여 앞에서
    //정의한 Express-session정보와 연동한다.) app.js 에서 함.
//4. 인증(Auth)기능 구현
    //기능 구현 부분에 실제 전략패턴이 들어가므로 전략패턴관련 라이브러리를 require로 불러온다.
    //require 마지막에 Strategy 를 붙여서 전략적용을 설정한다. Strategy를 찍어보면 클래스구조로 되어있다.
    //사용자가 지정한 라우터로 접속할 때 passport.anthenticate() 를 통해 인증 성공/실패를 구분하고
    //successRedirect, failureRedirect 를 통해 인증의 성공 실패에 따라 주소를 변경해준다.
    //세션값의 호출 방법은 Express-session에 passport가 있으니 request.session.passport.[등록한정보] 를 통해
    //등록한정보를 가져온다.
//5. strategy 구성
    // 로컬구성은 직접DB와 연동한 인증로직을 만들어야 하고 facebook,다음 같은 거기서 제공한 strategy를 가져오면된다.
    // 로컬전략은 내부적으로 LocalStrategy를 생성하여 전략에 필요한 username, password를 받아 기존의 아디,비번과
    //비교하여 로직을 만든다. done()은 인증에 대한 성공과 실패를 전송해주는 함수이다.(인증 성공시 done(1,2)의 2번에
    //세션에 저장할 값을 넘기고, 실패시 null을 넘기면 된다.)
    //facebook 전략이면 LocalStrategy 대신 facebook전략을 쓰면 된다.
//6. 세션설정
    //세션은 Redis에 의해 관리된다. passport에서 인증이 정상적으로 종료되면 serializeUser()를 호출하여
    //자동으로 현재 연결된 세션에 저장한다.  세션은 Redis에 저장되어있으니 세션값을 참조하여 deserializeUser()에서 
    //인증 검사를 한다.
//7. request를 받아 현재 인증사항이 정상인지 isAuthenticated()를 통해 true, false로 판단한다.
    //true일떄 next()를 적어 인증이 되면 다음으로 넘어갈 수 있도록 로직을 짠다.
//8. 이제 라우팅 구성을 하는데 라우팅 설정을 할 때 7번에서 설정한 변수를 불러와 인증이 정상일때 작동되도록 설정한다.
//9. 로그아웃 시 destroy() 를 사용하여 Redis에 저장된 세션을 삭제한다.
