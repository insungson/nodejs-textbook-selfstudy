var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// //flash와 세션 테스트를 위한 임시 라우터 만듬.
// router.get('/flash', function(req,res){       // /user/flash 라우터로 GET 요청을 보내면 
//   req.session.message = '세션 메시지';         // 서버에서는 세션과 flash에 메시지를 설정하고
//   req.flash('message', 'flash 메시지');       // /users/flash/result 로 redirect 한다.
//   res.redirect('/users/flash/result');
// });
// router.get('/flash/result', function(req,res){        // /user/flash 라우터에 오면 메시지를 보낸다.
//   res.send(`${req.session.message} ${req.flash('message')}`);  //새로고침을 하면 flash() 메시지는 안보인다.
// });
// // 여기까지가 flash 테스트부분


// //라우터 아이디패턴을 알아보자 (주소가 일치해서 둘중 하나만 써야한다. 하난 주석처리)
// router.get('/:id', function(req,res){
//   console.log(req.params, req.query);
// });
// //http://localhost:3000/users/123?limit=5&skip=10 를 주소에 적으면 아래같이 나온다.
// // { id: '123' } { limit: '5', skip: '10' }
// router.get('/:type', function(req,res){
//   console.log(req.params, req.query);
// });
// // http://localhost:3000/users/son?limit=5&skip=10  를 주소에 적으면 아래같이 나온다.
// //{ type: 'son' } { limit: '5', skip: '10' } 
// //즉! :변수 를 적으면 req.params에서 원하는 부분을 뽑아 낼 수 있다.

module.exports = router;
