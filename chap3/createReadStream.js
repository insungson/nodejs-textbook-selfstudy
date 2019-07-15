const fs = require('fs');

const readStream = fs.createReadStream('./readme3.txt',{highWaterMark : 16});
//createReadStream 로 읽기 스트림을 만들어준다. 
//첫번째 인자는 읽을 파일
//두번째 인자는 옵션 객체, highWaterMark 는 버퍼의 크기(바이트 단위)를 정할수 있는 옵션이다. 
//(기본값:64KB) 여기선 16바이트로 설정하여 16바이트 만큼 여러번 보내진다.
const data = [];

readStream.on('data', (chunk)=>{
    data.push(chunk);
    console.log('data : ', chunk, chunk.length);
});

readStream.on('end', ()=>{
    console.log('end : ', Buffer.concat(data).toString());
});

readStream.on('error', (err)=>{
    console.log('error : ', err);
});