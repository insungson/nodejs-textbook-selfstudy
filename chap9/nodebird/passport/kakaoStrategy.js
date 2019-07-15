const KakaoStrategy = require('passport-kakao').Strategy;

const { User } = require('../models');

module.exports = (passport) => {
  passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_ID,
    callbackURL: '/auth/kakao/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    try {     //기존에 카카오로 로긴한 사용자가 있는지 조회한다. 있다면 done함수를 호출한다.
      const exUser = await User.find({ where: { snsId: profile.id, provider: 'kakao' } });
      if (exUser) {
        done(null, exUser);
      } else { //기존에 카카오로 로긴한 사용자가 없다면 회원가입을 진행한다.
        //카카오에서는 인증 후 callbackURL에 적힌 주소로 accessToken, refreshToken, profile을 보내준다.
        //porflie에 사용자 정보들이 들어 있다. 카카오에서 보내주는 것으로 console.log로 확인해보자
        //profile객체에서 원하는 정보를 가져와 회원가입을 하면 된다. 사용자를 생성한 뒤 done함수를 호출하자
        //https://www.npmjs.com/package/passport-kakao  <<-- 여기에 들어가면 자세히 나와있다.
        const newUser = await User.create({
          email: profile._json && profile._json.kaccount_email,
          nick: profile.displayName,
          snsId: profile.id,
          provider: 'kakao',
        });
        done(null, newUser);
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};
