const url = require('url');
const querystring = require('querystring');

const parsedUrl = url.parse('http://www.gilbut.co.kr/?page=3&limit=10&category=nodejs&category=javascript');
//url.parse는 그냥 기존의 노드url을 구분해준다.
const query = querystring.parse(parsedUrl.query); 
//이건 위에서 분해된 url의 query부분을 자바스크립트 객체로 나눠준다.
console.log('querystring.parse() : ',query);
console.log('querystring.stringfy() : ', querystring.stringify(query));
//해체된 자바스크립트 객체를 다시 문자열로 바꿔준다.
console.log('parsedUrl : ', parsedUrl);


// querystring.parse() :  { page: '3', limit: '10', category: [ 'nodejs', 'javascript' ] }
// querystring.stringfy() :  page=3&limit=10&category=nodejs&category=javascript