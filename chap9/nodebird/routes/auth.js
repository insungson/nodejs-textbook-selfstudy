const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User } = require('../models');

const router = express.Router();

router.post('/join', isNotLoggedIn, async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    const exUser = await User.find({ where: { email } });
    if (exUser) {
      req.flash('joinError', '이미 가입된 이메일입니다.'); //joinError객체에 []형태로 메시지가 들어간다.
      return res.redirect('/join');
    }
    const hash = await bcrypt.hash(password, 12); //hash알고리즘을 통한 비번 암호화 12는 해쉬를 생성하고
    await User.create({   // 검증하는 횟수다. 숫자가 늘어날수록 보안도 강화되지만 암호화 시간도 오래걸린다.
      email,
      nick,
      password: hash,
    });
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => { //이부분은 passport/localStrategy.js와 연결됨
    if (authError) {                                          //자세한건 책p374를 보자
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      req.flash('loginError', info.message);
      return res.redirect('/');
    }
    return req.login(user, (loginError) => { //Passport는 req객체에 login,logout 메서드를 추가한다.
      if (loginError) {             //req.login은 passport.serializeUser를 호출한다.(passport/index.js에있음)
        console.error(loginError);  //req.login에 제공하는 user객체가 serializeUser로 넘어가게 된다.
        return next(loginError);    //serializeUser는 passport/index.js 에 정의한다.
      }                             //위의 메서드가 돌아가는 자세한 설명은 위의 파일에 적어놨다.
      return res.redirect('/');
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();           //req.logout() 메서드는 req.user 객체를 제거한다.
  req.session.destroy();  //req.session.destroy() 메서드는 req.session 객체의 내용을 제거한다.
  res.redirect('/');
});

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/',
}), (req, res) => {
  res.redirect('/');
});

module.exports = router;
