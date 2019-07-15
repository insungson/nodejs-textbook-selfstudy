const crypto = require('crypto');

crypto.randomBytes(64, (err, buf)=>{    //64바이트 길이의 문자열로 만들어준다. 
    const salt = buf.toString('base64'); //64바이트 길이로 만든 문자열을 salt 넣는다.
    console.log('salt : ', salt);
    crypto.pbkdf2('비밀번호',salt, 100000,64,'sha512', (err,key) => {
        console.log('password : ', key.toString('base64'));
    });
});
//pdkdf2(비밀번호, salt, 반복 횟수, 출력바이트, 해시 알고리즘) 이렇게 인자를 넣으면 된다.


// salt :  M+DO4d18B8Gz4z40UHqShwTrjf0oKWXeGWbM2kouVT2Qr1ZS6m32I/mYYRBJ2CpeGfQcUGlCl82B3oP/b+DlWw==
// password :  ubhOsZw9Y8x534ib3RSaORLO/2nDCe1w7Rz46si1VKlUrLVnLRxOcwv9uA8nBFL1wMQ6HQ9JxE8/0ajRN7GkNg==