const {odd, even} = require('./var'); //require로 불러올 모듈의 경로를 적는다.

function checkOdOrEven(num) {
    if(num % 2){    //* true = 1 false = 0  이다!! 이걸 알아두자! 
        return odd; //홀수일때 
    }
    return even;
  }
module.exports = checkOdOrEven;