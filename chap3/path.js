const path = require('path');
const string = __filename;

console.log('path.sep : ', path.sep);
console.log('path.delimiter : ', path.delimiter);
console.log('------------------------------');
console.log('path.dirname() : ', path.dirname(string));
console.log('path.extname() : ', path.extname(string));
console.log('path.basename() : ', path.basename(string)); //파일의 확장자 보여줌
console.log('path.nasename() : ', path.basename(string, path.extname(string))); //(경로, 확장자) 매개변수2개
console.log('---------------------------------');
console.log('path.parse() : ', path.parse(string));
console.log('path.format() : ', path.format({
    dir : 'C:\\Users\\son\\Desktop\\cording\\nodejs\\Node.js 교과서\\chap3',
    name : 'path',
    ext : 'js',
}));
console.log(path.normalize('C:\\Users\\son\\Desktop\\cording\\\\nodejs\\\\Node.js 교과서\\chap3'));
// /\를 여려번쓸때 정상적인 경로로 변환해준다.
console.log('------------------------------------');
console.log('path.isAbsolute() : ', path.isAbsolute('C: \\'));
console.log('path.join() : ', path.join(__dirname,'..','..','users', '.', '/zerocho'));
console.log('path.resolve() : ', path.resolve(__dirname, '...', 'users', '.', '/zerocho'));
