const http = require('http');

const parseCookies = (cookie = '') =>
    cookie 
        .split(';')
        .map(v => v.split('='))
        .map(([k, ... vs]) => [k, vs.join('=')])
        .reduce((acc,[k,v])=>{
            acc[k.trim()] = decodeURIComponent(v);  //trim()은 문자열 앞뒤 공백제거
            return acc;                     //decodeURIComponent(v) v는 시스템상 문자열
        }, {});                             //decodeURIComponent는 시스템 문자열 -> 우리가 아는 문자열
http.createServer((req,res)=>{
    const cookies = parseCookies(req.headers.cookie);
    console.log(req.url, cookies);
    res.writeHead(200, {'Set-Cookie' : 'mycookie=test'}); //Set-Cookie 는 명확하게 써야한다.
    res.end('Hello Cookie');                        //문자열을 화면에 랜더링한다.
})
    .listen(8080, () =>{
        console.log('8080번 포트에서 서버 대기 중입니다.');
    });

//parseCookies 함수를 직접 만들었다.
//**https://devhz.tistory.com/77   를 보면 자바스크립트 함수에 대해 알수 있다.
//쿠키는 name=zerocho;year=1994 처럼 문자열 형식이다.
//위의 함수는 위의 문자열을 {name : 'zerocho', year : '1994'} 와 같이 객체로 바꾸는 함수이다.

//createServer 매서드는 req객체에 담겨 있는 쿠키를 분석한다. 쿠키는 req.header.cookie에 들어있다.
//req.headers는 요청의 헤더를 의미한다. (쿠키는 요청과 응답의 헤더를 통해 오고 간다.)
//res.writeHead는 응답의 헤더에 쿠키를 기록하는 역할을 한다. 
//(첫번째 인자 200은 성공이라는 뜻.)
//(두번째 인자는 헤더내용 입력 Set-Cookie는 브라우저에게 다음 값의 쿠키를 저장하라는 의미이다.)

//서버를 키고 브라우저에 주소로 들어간 후 개발자도구에서 Headers에 General, Response Header, Request Header
//가 있는 것을 확인할 수 있다.  
//Response Header 의 Set-Cookie는 브라우저에게 해당 쿠키를 심으라는 명령을 내리는 것이다.
//브라우저는 쿠키를 심은 후, 다음부터 요청을 보낼 때 Request Headers에 Cookie로 쿠키를 보낸다.