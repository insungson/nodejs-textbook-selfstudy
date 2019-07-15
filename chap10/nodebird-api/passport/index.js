const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const { User } = require('../models');

module.exports = (passport) => {    //passport.authenticate()와 연결되어 login()을 호출한다.
  passport.serializeUser((user, done) => { //req.session 객체에 user.id를 저장한다.
    done(null, user.id);
  });

// ///아래부분을 잠시 주석처리하고 팔로워 팔로잉 관계로 바꿔보자
//   passport.deserializeUser((id, done) => {//세션에 저장한 아이디를 통해 사용자 정보 객체를 불러온다.
//     User.find({ where: { id } })          //(세션에 불필요한 데이터를 담아두지 않기 위한 과정이다.)
//       .then(user => done(null, user))     //위의 user.id를 첫번째 매개변수 id로 가져와서 DB에서 찾는다.
//       .catch(err => done(err));           //제대로 오면 then()으로 받고 req.user에 저장한다.
//   });
  passport.deserializeUser((id, done) => {
    User.find({
      where: { id },
      include: [{
        model: User,
        attributes: ['id', 'nick'],  //attributes는 실수로 비번조회하는 것을 방지하기위함이다.
        as: 'Followers',
      }, {
        model: User,
        attributes: ['id', 'nick'],
        as: 'Followings',
      }],
    })
      .then(user => done(null, user))
      .catch(err => done(err));
  });

  local(passport);
  kakao(passport);
};
//자세한건 p368을 읽으면 된다.
//전체적인 과정을 쓰면
//1. 로그인 요청이 들어옴
//2. passport.authenticate 메서드 호출
//3. 로그인 전략 수행
//4. 로그인 성공 시 사용자 정보 객체와 함께 req.login 호출
//5. req.login 메서드가 passport.serializeUser 호출
//6. req.session에 사용자 아이디만 저장
//7. 로그인 완료

//로그인 이후의 과정
//1. 모든 요청에 passport.session() 미들웨어가 passport.deserializeUser 메서드 호출
//2. req.session에 저장된 아이디로 데이터베이스에서 사용자 조회
//3. 조회된 사용자 정보를 req.user에 저장
//4. 라우터에서 req.user 객체 사용 가능