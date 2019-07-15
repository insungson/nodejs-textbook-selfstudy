const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');

const parseCookies = (cookie = '') => 
    cookie
        .split(';')
        .map(v=>v.split('='))
        .reduce((acc, [k,v]) => {
            acc[k.trim()] = decodeURIComponent(v);
            return acc;
        }, {});

http.createServer((req,res) => {
    const cookies = parseCookies(req.headers.cookie);
    if(req.url.startsWith('/login')){  //html 파일에서 form action에서 폼 내용을 주소로 보내는 기능을 한다.
        const{query} = url.parse(req.url);
        const{name} = qs.parse(query);
        const expires = new Date();
        expires.setMinutes(expires.getMinutes()+5); //현재 시간에서 5분을 추가한다.
        res.writeHead(302, {    //3xx는 리다이렉션을 알리는 상태코드로 302(임시이동) /로 이동시킨다.
            Location : '/',
            'Set-Cookie' : `name=${encodeURIComponent(name)}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`,
        }); //위의 코드를 아래로 엔터를 치면 Set-Cookie가 작동안해서 cookies.name 값이 설정 안된다.
            //Set-Cookie에서 Expires를 설정하여 현재 시간에서 5분 후 삭제한다.
            //헤더에는 한글을 사용할 수 없으므로 encodeURIComponent로 한글로 인코딩한다.
            //toGMTString 는 Wed, 22 May 2019 00:54:47 GMT 이런식의 날짜 문자열로 바꿔준다.
        res.end();
    }else if(cookies.name){ //쿠키.name이 있으면 아래의 코드가 end로 전달이 된다. Set-Cookie에 저장이 되면 뜬다.
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(`${cookies.name}님 안녕하세요`);
    }else{              //쿠키가 없으면 로그인 화면(server4.html)이 뜬다.
        fs.readFile('./server4.html', (err,data)=>{
            if(err) throw err;
            res.end(data);
        });
    }
})
    .listen(8080, ()=>{
        console.log('8080번 포트에서 서버 대기 중입니다.!');
    });

//