const express = require('express');

const { isLoggedIn } = require('./middlewares');
const { User } = require('../models');

const router = express.Router();

router.post('/:id/follow', isLoggedIn, async (req, res, next) => { //현재 로그인한사람 구분
  try {
    const user = await User.find({ where: { id: req.user.id } }); // 현재 로긴한 팔로우 사용자를 DB에서 조회
    await user.addFollowing(parseInt(req.params.id, 10)); //parseInt()로 아이디를 10진수로 바꾼후 user객체에 저장
    res.send('success');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
