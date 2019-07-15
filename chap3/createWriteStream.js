const fs = require('fs');

const writeStream = fs.createWriteStream('./writeme2.txt');
writeStream.on('finish', ()=>{ //finish 이벤트는 파일 쓰기가 종료되면 콜백함수라 호출된다
    console.log('파일 쓰기 완료');
});

writeStream.write('이 글을 쓴다..\n');
writeStream.write('한 번 더 쓴다.\n');
writeStream.end(); //write로 쓰고 end로 종료를 한다. 이때 finish 이벤트가 발생한다.