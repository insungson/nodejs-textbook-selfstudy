process.on('uncaughtException', (err)=>{ //process객체에 uncaughtException 이벤트 리스너를 달았다.
    console.error('예기치 못한 에러',err);//처리하지 못한 에러가 발생할때 이벤트 리스너가 실행되고,
});                                     //프로세스가 유지된다. 이부분이 없다면 setTimeout이 실행되지 않는다.

setInterval(()=>{
    throw new Error('서버를 고장내주마'); //위의 이벤트리스너가 없다면 .프로세스가 멈춰버려 이부분에서
},1000);                            //실행 후 1초만에 에러가 발생하기 때문에 아래의 setTimeout이
                                    //실행되지 않는다. 
setTimeout(()=>{
    console.log('실행됩니다.');
},2000);