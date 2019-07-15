const A = require('./globalA');

global.message = '안녕하세요';
console.log(A()); //안녕하세요

//message 정의는 A에서 값 입력은 B에서 했지만 가능하다.