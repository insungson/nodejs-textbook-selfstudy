const url = require('url');

const URL = url.URL;
const myURL = new URL('http://www.gilbut.co.kr/book/bookList.aspx?sercate1=001001000#anchor');
console.log('new URL() : ', myURL);
console.log('url.format() : ', url.format(myURL));
console.log('위는 노드 URL 구분법-----------------------------------------아래가 WHATAG 구분법');
const parsedUrl = url.parse('http://www.gilbut.co.kr/book/bookList.aspx?sercate1=001001000#anchor');
console.log('url.parse() : ', parsedUrl);
console.log('url.format() : ', url.format(parsedUrl));


// new URL() :  URL {
//     href: 'http://www.gilbut.co.kr/book/bookList.aspx?sercate1=001001000#anchor',
//     origin: 'http://www.gilbut.co.kr',
//     protocol: 'http:',
//     username: '',
//     password: '',
//     host: 'www.gilbut.co.kr',
//     hostname: 'www.gilbut.co.kr',
//     port: '',
//     pathname: '/book/bookList.aspx',
//     search: '?sercate1=001001000',
//     searchParams: URLSearchParams { 'sercate1' => '001001000' },
//     hash: '#anchor' }
//   url.format() :  http://www.gilbut.co.kr/book/bookList.aspx?sercate1=001001000#anchor
//   위는 노드 URL 구분법-----------------------------------------아래가 WHATAG 구분법
//   url.parse() :  Url {
//     protocol: 'http:',
//     slashes: true,
//     auth: null,
//     host: 'www.gilbut.co.kr',
//     port: null,
//     hostname: 'www.gilbut.co.kr',
//     hash: '#anchor',
//     search: '?sercate1=001001000',
//     query: 'sercate1=001001000',
//     pathname: '/book/bookList.aspx',
//     path: '/book/bookList.aspx?sercate1=001001000',
//     href: 'http://www.gilbut.co.kr/book/bookList.aspx?sercate1=001001000#anchor' }
//   url.format() :  http://www.gilbut.co.kr/book/bookList.aspx?sercate1=001001000#anchor