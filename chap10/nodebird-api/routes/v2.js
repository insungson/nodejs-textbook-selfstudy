const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const url = require('url');

const { verifyToken, apiLimiter } = require('./middlewares');
const { Domain, User, Post, Hashtag } = require('../models');

const router = express.Router();

// router.use(cors()); //어떤 라우터든 cors()가 적용, 보안키(process.env.CLIENT_SECRET)노출됨.
//위의 코드를 아래같이 수정해보자
router.use(async (req, res, next) => {
  console.log('이건 나올까? ->',req.get('origin'),'이건?',url.parse(req.get('origin')));
  //nodebird-CALL서버(클라이언트서버)에서 routes/index.js에서 axios.defaults.headers.origin 헤더에 origin 설정
  //origin속성은 url을 설정한다. (chap3 url.js 를 보자) 즉 도메인을 가져오는 것이다.

//http,https같은 프로토콜을 떼어낼때는 url.parse()를 쓴다.
//url.parse()는 기존의 주소를 항목별로 객체로 나눠 값을 저장한다.
  ///////////////////////
  // 이건 나올까? -> http://localhost:8003 이건? Url {
  // protocol: 'http:',
  // slashes: true,
  // auth: null,
  // host: 'localhost:8003',
  // port: '8003',
  // hostname: 'localhost',
  // hash: null,
  // search: null,
  // query: null,
  // pathname: '/',
  // path: '/',
  // href: 'http://localhost:8003/' }
//////////////////////////////



  const domain = await Domain.find({
    where: { host: url.parse(req.get('origin')).host },//서버의 DB에 Domain테이블에서 클라이언트 도메인인
  });                   //req.get('origin').host로 검색을 하고 DB에 도메인이 있으면 cors가 작동한다.
        console.log('도메인은 ->',domain);
  if (domain) {
    cors({ origin: req.get('origin') })(req, res, next); //req.get('origin') === localhost:8003 이고
  } else {      //cors()을 통해 Access-Control-Allow-Origin 속성에서 localhost:8003은 허용하게 된다.
    next();     //app.js에서 맨 앞에 use(cors()) 를 사용하면 Access-Control-Allow-Origin: *(모두 허용)
  }             //모든 사용자를 허용하는 것보단 지정한 클라이언트주소만 토큰을 발급하게 만들 수 있다!!
});
//참고로 아래의 두개 코드는 같은 것이다.
//1) router.use(cors());
//2) router.use((req,res,next)=>{cors()(req,res,next)});

router.post('/token', apiLimiter, async (req, res) => {
  const { clientSecret } = req.body;
  try {
    const domain = await Domain.find({
      where: { clientSecret },
      include: {
        model: User,
        attribute: ['nick', 'id'],
      },
    });
    if (!domain) {
      return res.status(401).json({
        code: 401,
        message: '등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요',
      });
    }
    const token = jwt.sign({
      id: domain.user.id,
      nick: domain.user.nick,
    }, process.env.JWT_SECRET, {
      expiresIn: '30m', // 30분
      issuer: 'nodebird',
    });
    return res.json({
      code: 200,
      message: '토큰이 발급되었습니다',
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: '서버 에러',
    });
  }
});

router.get('/test', verifyToken, apiLimiter, (req, res) => {
  res.json(req.decoded);
});

router.get('/posts/my', apiLimiter, verifyToken, (req, res) => {
  Post.findAll({ where: { userId: req.decoded.id } })
    .then((posts) => {
      console.log(posts);
      res.json({
        code: 200,
        payload: posts,
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({
        code: 500,
        message: '서버 에러',
      });
    });
});

router.get('/posts/hashtag/:title', verifyToken, apiLimiter, async (req, res) => {
  try {
    const hashtag = await Hashtag.find({ where: { title: req.params.title } });
    if (!hashtag) {
      return res.status(404).json({
        code: 404,
        message: '검색 결과가 없습니다',
      });
    }
    const posts = await hashtag.getPosts();
    return res.json({
      code: 200,
      payload: posts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: '서버 에러',
    });
  }
});

module.exports = router;