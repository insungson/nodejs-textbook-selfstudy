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