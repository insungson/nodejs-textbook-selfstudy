const buffer = Buffer.from('저를 버퍼로 바꿔보세요'); //from(문자열) : 문자열을 버퍼로 바꿔준다.
console.log('from() : ', buffer);
console.log('length : ', buffer.length);
console.log('toString() : ', buffer.toString());

const array = [Buffer.from('띄엄 '), Buffer.from('띄엄 '), Buffer.from('띄어쓰기')];
const buffer2 = Buffer.concat(array);
console.log('concat() : ', buffer2.toString());

const buffer3 = Buffer.alloc(5);
//alloc(바이트) : 빈 버퍼를 생성한다. 바이트를 인자로 지정해주면 해당 버퍼가 생성된다.
console.log('alloc() : ', buffer3);