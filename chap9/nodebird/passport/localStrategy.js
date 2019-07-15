const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const { User } = require('../models');

module.exports = (passport) => {
  passport.use(new LocalStrategy({  //본문의 req.body의 속성명(name)을 적으면 된다.(여기선 layout.pug)
    usernameField: 'email',         //req.body.email 의 name인 email
    passwordField: 'password',      //req.body.password의 name인 password를 적으면 된다
  }, async (email, password, done) => {
    try {
      const exUser = await User.find({ where: { email } });
      if (exUser) {
        const result = await bcrypt.compare(password, exUser.password); //비밀번호 비교
        if (result) {
          done(null, exUser); //done()은 매개함수로 데이터전달을 한다. exUser데이터는 passport/index.js의 
        } else {              //  passport.serializeUser((user, done) 의 user로 들어간다!!
          done(null, false, { message: '비밀번호가 일치하지 않습니다.' }); //routes/auth.js의 로그인과 연결
        }
      } else {
        done(null, false, { message: '가입되지 않은 회원입니다.' });//routes/auth.js의 로그인과 연결
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};
