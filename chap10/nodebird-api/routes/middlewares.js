const jwt = require('jsonwebtoken');
const RateLimit = require('express-rate-limit');

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send('로그인 필요');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/');
  }
};
//PassPort는 req객체에 isAuthenticated 메서드를 추가한다.
//로그인 중이면 req.isAuthenticated() 가 true 이고 아니면 false이다!!  
//isAuthenticated() 로 로그인의 여부를 파악할 수 있다.

exports.verifyToken = (req, res, next) => { //사용자가 해더에 쿠키처럼 토큰을 넣는다.
  try {                       //req.headers.authorization 는 헤더에 저장된 토큰이다.
                              //(여기선 api-call/routes/index.js에서 헤더에 authorization를 넣음)
    req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);//jwt.verify()함수로 토큰검정
    return next();        //첫번째 인자는 토큰, 두번째 인자는 토큰의 비밀키이다.
  } catch (error) {       //(인증이 확인되면 next()로 req.decoded 객체를 다음 미들웨어로 값을 넘김)
    if (error.name === 'TokenExpiredError') { // 유효기간 초과
      return res.status(419).json({
        code: 419,
        message: '토큰이 만료되었습니다',
      });
    }
    return res.status(401).json({     //비밀키가 일치하지 않음.
      code: 401,
      message: '유효하지 않은 토큰입니다',
    });
  }
};
//인증에 성공한 경우 토큰의 내용을 리턴한다. 토큰의 내용은 사용자id, 닉네임, 발급자, 유효기간이다.
//이 내용을 req.decoded에 대입하여 next()를 통해 다음 미들웨어에서 사용하게 한다.

exports.apiLimiter = new RateLimit({
  windowMs: 60 * 1000, // 1분  
  max: 1,
  delayMs: 0,
  handler(req, res) {
    res.status(this.statusCode).json({
      code: this.statusCode, // 기본값 429
      message: '1분에 한 번만 요청할 수 있습니다.',
    });
  },
});
//windowMs(기준시간), max(허용횟수), delayMs(호출간격), handler(제한 초과 시 콜백 함수)
//https://www.npmjs.com/package/express-rate-limit  사용법은 여기 들어가서 보면된다.

exports.deprecated = (req, res) => {
  res.status(410).json({
    code: 410,
    message: '새로운 버전이 나왔습니다. 새로운 버전을 사용하세요.',
  });
};
// 사용하면 안되는 라우터에 사용할 것이다.
