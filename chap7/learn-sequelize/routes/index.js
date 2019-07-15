var express = require('express');
var User = require('../models').User; //ctrl 클릭 시 models/index.js안의 db.User와 연결된다.

var router = express.Router();

/* GET home page. */ 
//라우터 부분을 promise()로 처리한건데.. 12장의 routes/index.js에서 async/await처리와 비교하기 (서로바꾸는거 연습)
router.get('/', function(req, res, next) {
  User.findAll()
    .then((users)=>{
      res.render('sequelize', {users});
    })
    .catch((err)=>{
      console.error(err);
      next(err);
    });
});

module.exports = router;
