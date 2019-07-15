var express = require('express');
var User = require('../models').User;

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.findAll()
    .then((users)=>{
      res.json(users);
    })
    .catch((err)=>{
      console.error(err);
      next(err);
    });
});

router.post('/', function(req, res, next){
  User.create({
    name: req.body.name,
    age: req.body.age,
    married: req.body.married,
  })
    .then((result) => {
      console.log(result);
      res.status(201).json(result); //문자열 데이터를 JSON형식으로 변환
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});

module.exports = router;
