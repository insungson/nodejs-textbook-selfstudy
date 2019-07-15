#!/usr/bin/env node
const readline = require('readline');
                                      // readline 모듈은 아래의 옵션들을 사용하여 사용자로부터 
const rl = readline.createInterface({ //입력받고 그에맞게 출력한다.
  input: process.stdin,       //인풋옵션에 콘솔입력을 의미하는 process.stdIn를 넣는다. 
  output: process.stdout,     //아웃풋옵션에 콜솔출력을 의미하는 process.stdout를 넣는다.
});

console.clear();
const answerCallback = (answer) => {
  if (answer === 'y') {
    console.log('감사합니다!');
    rl.close();                   //close()는 question()를 종료해준다
  } else if (answer === 'n') {
    console.log('죄송합니다!');
    rl.close();
  } else {
    console.clear();        //console.clear()는 콘솔의 내용을 지워준다.
    console.log('y 또는 n만 입력하세요.');
    rl.question('예제가 재미있습니까? (y/n) ', answerCallback); //question(1,2) 1은 질문내용, 2는 답변이다.
  }
};

rl.question('예제가 재미있습니까? (y/n) ', answerCallback);