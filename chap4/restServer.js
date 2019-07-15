const http = require('http');
const fs = require('fs');

const users = {};

http.createServer((req,res)=>{
    if(req.method === 'GET'){
        if(req.url === '/'){
            return fs.readFile('./restFront.html', (err,data)=>{
                if(err) throw err;
                res.end(data);
            });
        }else if(req.url === '/about'){
            return fs.readFile('./about.html', (err,data)=>{
                if(err) throw err;
                res.end(data);
            });
        }else if(req.url === '/users'){
            return res.end(JSON.stringify(users)); //users의 데이터를 JSON형식으로 보내기위한 JSON.stringify
        }                        //JSON.stringify() method converts JavaScript objects into strings.
        return fs.readFile(`.${req.url}`, (err,data)=>{
            if(err){
                res.writeHead(404, 'NOT FOUND');
                return res.end('NOT FOUND');
            }
            return res.end(data);
        });
    }else if(req.method === 'POST'){
        if(req.url === '/users'){
            let body='';
            req.on('data',(data)=>{ //이부분은 3장의 createReadStream.js 에 나와있다.  ReadStream 부분이다.
                body +=data;    // 이부분은 문자열로 받기 때문에 JSON.parse()로 객체로 바꿔줘야한다.
            });
            return req.on('end',()=>{
                console.log('POST 본문(Body):', body);
                const {name} = JSON.parse(body); //Json.parse(값) 값 프로퍼티로 들어가는데
                const id = +new Date();       //{name} 프로퍼티로 받으면 name을 호출하면 값이 나온다.
                users[id] = name;           //만약{name}->name을 쓰면 여기서 name.name을 해야 값이 호출된다.
                res.writeHead(201);
                res.end('등록 성공');
            });
        }
    }else if(req.method === 'PUT'){
        if(req.url.startsWith('/users/')){
            const key = req.url.split('/')[2]; //split('/')로 구분하고, 인덱스 2번째를 가져온다.
            let body = '';
            req.on('data',(data)=>{
                body += data;
            });
            return req.on('end', ()=>{
                console.log('PUT 본문(Body) : ', body);
                users[key] = JSON.parse(body).name; //위의 POST와 비교된다. {name}으로 안받아서 .name을 쓴다.
                return res.end(JSON.stringify(users));
            });
        }
    }else if(req.method === 'DELETE'){
        if(req.url.startsWith('/users/')){
            const key = req.url.split('/')[2];
            delete users[key];
            return res.end(JSON.stringify(users));
        }
    }
    res.writeHead(404, 'NOT FOUND');
    return res.end('NOT FOUND');
})
    .listen(8080, ()=>{
        console.log('8080번 포트에서 서버 대기 중입니다.');
    });


//POST, PUT 부분에서 req.on('data', 콜백) req.on('end',콜백) 부분은 버퍼봐 스트림의 ReadStream 이다.
// 자세한건 3장의 createReadStream.js 에서 확인 가능하다. 