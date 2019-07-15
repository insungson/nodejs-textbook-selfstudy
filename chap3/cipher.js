const crypto = require('crypto');

const cipher = crypto.createCipher('aes-256-cbc','열쇠');
let result = cipher.update('암호화할 문장','utf9','base64');
result += cipher.final('base64');
console.log('암호화 : ',result);

const decipher = crypto.createCipher('aes-256-cbc','열쇠');
let result2 = decipher.update(result, 'base64','utf8');
result2 += decipher.final('utf8');
console.log('복호화 : ', result2);


// 암호화 :  ooogp/vac4l26/ezEglCluFn9vjfixVtCUCaqiaMr28=
// 복호화 :  v��Z����s= #k��y���}0
//                                c╗��oN�>F�|�͟�f"�
