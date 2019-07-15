setInterval(()=>{
    console.log('시작');
    try{
        throw new Error('서버를 고장내주마!'); //에러를 throw 하는경우 반드시 try catch로 잡아야 한다.
    }catch(err){
        console.error(err);
    }
},1000);