let i =1;
setInterval(()=>{
    if( i===5){
        console.log('종료!');
        process.exit(); //exit()에 인자를 주지않거나 0이면 정상종료가 되고,
    }                   //에러가 발생해서 종료하는 경우 1을 넣어주면 된다.
    console.log(i);
    i +=1;
},1000);

// 1
// 2
// 3
// 4
// 종료!
