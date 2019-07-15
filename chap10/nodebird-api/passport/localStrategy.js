const LocalStrategy = require('passport-local').Strategy;
//.Strategy는 인증에 대한 구성을 할때 붙여야 하고 아래의 use()에서 인증에 대한 전략을 설정한다.
//http://www.passportjs.org/docs/  참조 (.Strategy) 로 검색해서 찾으면 나온다.
const bcrypt = require('bcrypt');

const { User } = require('../models');

module.exports = (passport) => {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  }, async (email, password, done) => {
    try {
      const exUser = await User.find({ where: { email } });
      if (exUser) {
        const result = await bcrypt.compare(password, exUser.password); //비밀번호 비교
        if (result) {
          done(null, exUser); //done()은 매개함수로 데이터전달을 한다. routes/auth.js 의 로그인 부분과 연결된다.
        } else {
          done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
        }
      } else {
        done(null, false, { message: '가입되지 않은 회원입니다.' });
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};
