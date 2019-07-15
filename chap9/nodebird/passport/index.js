const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const { User } = require('../models');

 // passport.authenticate('local' 일경우 localStrategy.js를 통해 exUser 객체에 데이터를 받아 user로 넣는다.
module.exports = (passport) => {   
  passport.serializeUser((user, done) => { //req.session 객체(chap6.js참조)에 user.id를 저장한다.
    done(null, user.id);           //(user.id만 저장하는 이유는 세션 용량문제, 데이터 일관성을 위해 id만 저장)
  });    //express-session 모듈은 req 객체안에 req.session객체를 만든다.
      //(객체에 값을 대입하거나 삭제해서 세션을 변경할 수 있다.)현재의 세션은 req.sessionID로 확인가능

// ///아래부분을 잠시 주석처리하고 팔로워 팔로잉 관계로 바꿔보자

//   passport.deserializeUser((id, done) => {//세션에 저장한 아이디를 통해 사용자 정보 객체를 불러온다.
//     User.find({ where: { id } })          //(세션에 불필요한 데이터를 담아두지 않기 위한 과정이다.)
//       .then(user => done(null, user))     //위의 user.id를 첫번째 매개변수 id로 가져와서 DB에서 찾는다.
//       .catch(err => done(err));           //제대로 오면 then()으로 받고 req.user에 저장한다.
//   });

  passport.deserializeUser((id, done) => {//세션에 저장된 user.id -> id로 가져와서 DB정보를 꺼낸다.
    User.find({                           //꺼낸 정보는 promise의 done(user)로 받는데 이제 어떤 페이지로 
      where: { id },                      //가든 done(user)로 받는 정보를 각 라우터의 req.user로 준다.
      include: [{                         //예를 들면 routes/page/js에서 get('/profile' 에서 req.user로
        model: User,                      //done(user)의 정보를 사용할 수 있다.
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

//아래의 serializeUser(), deserializeUser()로 패스포트가 세션 위에서 동작하도록 세팅한다.
//serializeUser() : req.session 객체에 어떤 데이터를 저장할지 선택한다
//                  사용자 정보 객체를 세션에 아이디로 저장하는 것

//deserializeUser() : 매 요청 시 실행된다!!(브라우저의 모든 요청에 실행됨) 
//                    passport.session() 미들웨어가 이 메서드를 호출한다.
//                    세션에 저장한 아이디를 통해 사용자 정보객체를 불러오는 것 
//                    (세션에 불필요한 데이터를 담지 않기 위해 이런과정을 거치는 것이다.)

//자세한건 p368을 읽으면 된다.
//전체적인 과정을 쓰면
//1. 로그인 요청이 들어옴
//2. passport.authenticate 메서드 호출 (app.js와 연결)
//3. 로그인 전략 수행
//4. 로그인 성공 시 사용자 정보 객체와 함께 req.login 호출
//5. req.login 메서드가 passport.serializeUser 호출 (serializeUser는 세션에 저장한다, done()로 데이터 이동)
//6. req.session에 사용자 아이디만 저장 
//7. 로그인 완료

//로그인 이후의 과정
//1. 모든 요청에 passport.session() 미들웨어가 passport.deserializeUser 메서드 호출
//   (app.js에서 시작 라우터인 get / 위에 위치하는 설정을 한다.)
//2. req.session에 저장된 아이디로 데이터베이스에서 사용자 조회 (세션에 저장된 데이터와 DB의 데이터와 비교)
//3. 조회된 사용자 정보를 req.user에 저장
//4. 라우터에서 req.user 객체 사용 가능