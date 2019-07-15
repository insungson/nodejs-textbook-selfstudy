var express = require('express');
var User = require('../schemas/user');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({})
    .then((users)=>{
      res.json(users);
    })
    .catch((err)=>{
      console.error(err);
      next(err);
    });
});
//사용자 등록 시 먼저 모델로 user 객체를 만든 후 객체 안에 다큐먼트에 들어갈 내용들을 넣어준다.
//이 후 save메서드에 저장한다. 만약 정의한 스키마에 부함하지 않는 데이터를 넣을때 몽구스가 에러를 발생시킨다.
router.post('/', function(req,res,next){
  const user = new User({
    name: req.body.name,
    age: req.body.age,
    married: req.body.married,
  });
  user.save()
    .then((result)=>{
      console.log(result);
      res.status(201).json(result);
    })
    .catch((err)=>{
      console.error(err);
      next(err);
    });
});

module.exports = router;