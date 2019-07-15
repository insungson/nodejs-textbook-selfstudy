const fs = require('fs');

fs.readFile('./readme.txt',(err,data)=>{
    if(err) throw err;
    console.log(data); //기존의 readFile이 버퍼로 제공하기 때문에
    console.log(data.toString()); //toString()으로 문자열로 바꿔줘야 한다.
});


//<Buffer ec a0 80 eb a5 bc 20 ec 9d bd ec 96 b4 ec a3 bc ec 84 b8 ec 9a 94>
//저를 읽어주세요