const util = require('util');
const crypto = require('crypto');

const dontUseMe = util.deprecate((x,y)=>{
    console.log(x+y);
}, 'dontUseMe 함수는 deprecated 되었으니 더 이상 사용하지 마세요!');
dontUseMe(1,2);

const randomBytesPromise = util.promisify(crypto.randomBytes);
randomBytesPromise(64)
    .then((buf)=>{
        console.log(buf.toString('base64'));
    })
    .catch((error) => {
        console.error(error);
    });


// 3
// (node:16268) DeprecationWarning: dontUseMe 함수는 deprecated 되었으니 더 이상 사용하지 마세요!
// MeUve936RhJp5r4TiGGmpEK/Tf1HzoL/KTc0ab3zrWiSYQCrdZJy9eqvhPK+P/0D4T7tf9ijz8N2mLYUOnn9+A==