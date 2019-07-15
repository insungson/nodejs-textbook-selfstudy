const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const schedule = require('node-schedule');

const { Good, Auction, User, sequelize } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;   //모든 pug 템플릿에 사용자 정보를 변수로 집어 넣었다.
  next();    //이렇게 하면 res.render() 메서드에 user: req.user를 하지 않아도 되므로 중복을 제거할 수 있다.
});

//메인화면 렌더링 (경매가 진행중인 상품 목록도 같이 불러옴)
router.get('/', async (req, res, next) => {
  try {
    const goods = await Good.findAll({ where: { soldId: null } });
    res.render('main', {
      title: 'NodeAuction',
      goods,
      loginError: req.flash('loginError'),
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//회원가입 화면 렌더링 하는 라우터
router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join', {
    title: '회원가입 - NodeAuction',
    joinError: req.flash('joinError'),
  });
});

//상품등록 화면 렌더링 하는 라우터
router.get('/good', isLoggedIn, (req, res) => {
  res.render('good', { title: '상품 등록 - NodeAuction' });
});

fs.readdir('uploads', (error) => {
  if (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
  }
});
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

//업로드한 상품을 처리하는 라우터이다.
router.post('/good', isLoggedIn, upload.single('img'), async (req, res, next) => {
  try { //위의 'img'는 폼데이터의 속성명이 img이거나 폼 태그 인풋의 name이 img인 파일 하나를 받겠다는 뜻이다
    const { name, price } = req.body;   //여기선 good.pug 에서 input 필드의 name이 img인 경우이다
    const good = await Good.create({
      ownerId: req.user.id,
      name,
      img: req.file.filename,
      price,
    });
    //스케줄링 구현을 위한 코드
    const end = new Date();
    end.setDate(end.getDate() + 1); // 하루 뒤
    //console.log('분정보',end.getDate())
    schedule.scheduleJob(end, async () => {  //scheduleJob(1,2) 1인자는 실행될 시각,2인자는
      const success = await Auction.find({    //해당시각일때 수행할 콜백함수
        where: { goodId: good.id },
        order: [['bid', 'DESC']],
      });
      //console.log('나올까?',success);
      await Good.update({ soldId: success.userId }, { where: { id: good.id } });
      await User.update({
        money: sequelize.literal(`money - ${success.bid}`), //{컬럼:sequelize.literal(컬럼-숫자)}
      }, {             //는 시퀄라이즈에서 해당 컬럼의 숫자를 줄이는 방법이다.늘리는법은 -를 +로 바꿔준다.
        where: { id: success.userId },
      });
    });
    res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//해당 상품과 기존 입찰 정보들을 불러온 뒤 렌더링한다.
router.get('/good/:id', isLoggedIn, async (req, res, next) => {
  try {
    const [good, auction] = await Promise.all([
      Good.find({
        where: { id: req.params.id },
        include: {
          model: User,
          as: 'owner',    //models/index.js 에서 Good,User모델은 현재 1:N의 관계가 2번연결(owner,sold)되어
        },                //있으므로 어떤 관계를 include 할지 as 속성으로 밝혀줘야한다.
      }),
      Auction.findAll({
        where: { goodId: req.params.id },
        include: { model: User },
        order: [['bid', 'ASC']],
      }),
    ]);
    res.render('auction', {
      title: `${good.name} - NodeAuction`,  
      good,
      auction,
      auctionError: req.flash('auctionError'),
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//클리이언트 로부터 받은 입찰정보를 저장한다.
router.post('/good/:id/bid', isLoggedIn, async (req, res, next) => {
  try {
    const { bid, msg } = req.body;
    const good = await Good.find({
      where: { id: req.params.id },
      include: { model: Auction },
      order: [[{ model: Auction }, 'bid', 'DESC']], //include될 모델의 컬럼을 정렬하는 방법이다.
    });                                             //Auction 모델의 bid를 내림차순으로 정렬하고있다.
    if (good.price > bid) { // 시작 가격보다 낮게 입찰하면
      return res.status(403).send('시작 가격보다 높게 입찰해야 합니다.');
    }
    // 경매 종료 시간이 지났으면
    if (new Date(good.createdAt).valueOf() + (24 * 60 * 60 * 1000) < new Date()) {
      return res.status(403).send('경매가 이미 종료되었습니다');
    }
    // 직전 입찰가와 현재 입찰가 비교
    if (good.auctions[0] && good.auctions[0].bid >= bid) {
      return res.status(403).send('이전 입찰가보다 높아야 합니다');
    }
    const result = await Auction.create({
      bid,
      msg,
      userId: req.user.id,
      goodId: req.params.id,
    });
    req.app.get('io').to(req.params.id).emit('bid', {
      bid: result.bid,
      msg: result.msg,
      nick: req.user.nick,
    });
    return res.send('ok');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

//낙찰된 상품과 그 상품의 입찰내역을 조회한 후 렌더링 한다.
router.get('/list', isLoggedIn, async (req, res, next) => {
  try {
    const goods = await Good.findAll({
      where: { soldId: req.user.id },
      include: { model: Auction },
      order: [[{ model: Auction }, 'bid', 'DESC']],
    });
    res.render('list', { title: '낙찰 목록 - NodeAuction', goods });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;