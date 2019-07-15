const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');

const parseCookies = (cookie='') =>
    cookie
        .split(';')
        .map(v=>v.split('='))
        .map(([k, ...vs])=>[k, vs.join('=')])
        .reduce((acc,[k,v])=>{
            acc[k.trim()] = decodeURIComponent(v);
            return acc;
        },{});

const session = {};

http.createServer((req,res)=>{
    const cookies = parseCookies(req.headers.cookie);
    if(req.url.startsWith('/login')){
        const {query} = url.parse(req.url); //parse로 나눈다음에 query에 객체로 받아서 {}로 묶어준다.
        const {name} = qs.parse(query);
        const expires = new Date();
        expires.setMinutes(expires.getMinutes()+5); //setMinutes(v)는 현재시간에 분만 v분으로 설정된다.
        const randomInt = +new Date(); //(new Date()).getTime(); 와 같은것이다.(현재시간 가져온것)
        session[randomInt] = {  //
            name,
            expires,
        };
        res.writeHead(302,{ //Set-Cookie에 name 대신 session 객체를 넣는다.
            Location: '/',  //이제 cookie.session이 있고 만료기한을 넘기지 않았으면, 
                            //session 변수에서 사용자 정보 가져온다.
            'Set-Cookie': `session=${randomInt}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`,
        });
        res.end();
    }else if(cookies.session && session[cookies.session].expires > new Date()){ //Set-Cookie에 session넣음.
        res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
        res.end(`${session[cookies.session].name}님 안녕하세요!`);
    }else{
        fs.readFile('./server4.html', (err,data)=>{
            if(err) throw err;
            res.end(data);
        });
    }
}).listen(8080, ()=>{
    console.log('8080번 포트에서 서버 대기 중입니다.!');
})
