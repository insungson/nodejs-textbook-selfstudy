const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User } = require('../models');

const router = express.Router();

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile', { title: '내 정보 - NodeBird', user: req.user });
}); //req.isAuthenticated()가 true여야 next()가 호출되어 res.render가 실행된다.

router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join', {
    title: '회원가입 - NodeBird',
    user: req.user,     //pug에서 user 객체를 통해 사용자 정보에 접근할 수 있게 되었다.
    joinError: req.flash('joinError'),
  });
});

router.get('/', (req, res, next) => {
  Post.findAll({
    include: {
      model: User,
      attributes: ['id', 'nick'],
    },
    order: [['createdAt', 'DESC']],
  })
    .then((posts) => {
      res.render('main', {
        title: 'NodeBird',
        twits: posts, //조회한것을 넣음.(JSON형태)
        user: req.user,
        loginError: req.flash('loginError'),
      });
    })
    .catch((error) => {
      console.error(error);
      next(error);
    });
});

module.exports = router;
