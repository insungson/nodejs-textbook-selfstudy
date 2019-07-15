const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Hashtag, User } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

//uploads 폴더가 없으면 폴더를 생성한다.
fs.readdir('uploads', (error) => {
  if (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads'); //폴더를 만든다.
  }
});
//multer 변수에는 미들웨어를 만드는 여러가지 메서드를 가지고 있다.(singgle, array, fields,none)
//(p383 메서드의 자세한 사항은 여기를 보자)
//Multer 모듈에 옵션을 주어 upload 변수에 대입했다. (upload는 미들웨어를 만드는 객체가 된다.)
const upload = multer({         //diskStorage() 메서드를 사용해 이미지를 서버디스크에 저장하도록함.
  storage: multer.diskStorage({ //storage 옵션에서 파일 저장 방식, 경로, 파일명등 설정 가능.
    destination(req, file, cb) {  //destination()으로 저장경로 지정(파일이 저장된 폴더)
      cb(null, 'uploads/');
    },    //filename : destination 에 저장된 파일 명
    filename(req, file, cb) {
      const ext = path.extname(file.originalname); //filename()에서 기존 파일이름(file.originalname)에
      cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
    },    //중복방지를 위한 업로드 날짜값과(new Date().valueOf()) 기존확장자(path.extname)를 설정했다.
  }),
  limits: { fileSize: 5 * 1024 * 1024 },  //limits는 최대 파일 용량 허용치를 의미한다.  (10MB 설정함)
});
//path.extname(filename)   예를 들면 filename=file.exe 일때 저 함수의 리턴값은 '.exe'이다.
//path.basename('/foo/bar/baz/asdf/quux.html', '.html'); 2개인자가 들어갈때의 리턴값은'quux' 이다
//path.basename('/foo/bar/baz/asdf/quux.html'); 1개 인자가 들어갈때의 리턴값은 'quux.html' 이다.

//이미지 업로드를 처리하는 라우터이다. (위에서 multer()를 포함한 upload변수에 single()를 붙인다.)
//single()의 이미지 관련 객체는 req.file로 나머지정보는 req.body 객체로 만들어진다
router.post('/img', isLoggedIn, upload.single('img'), (req, res) => { // upload.single('img') img는 
  console.log('req.file객체: ',req.file);//main.pug 에서 formData.append('img', this.files[0]); 
  res.json({ url: `/img/${req.file.filename}` });//'img'이름으로 넘긴다.(html의 input필드 name값 둘중 하나)
});//single()는 이미지 업로드시 req.file 객체를 생성한다.(req.file객체의 세부적인 정보는 p383을 보자)

//그냥 알아두자 이미지 업로드시 multer()를 포함한 upload 변수에 array(), field() 메서드가 들어가게되면
//메서드들은 이미지파일은 req.file 객체로 나머지정보들은 req.body 객체로 만들어진다.
//array()는 속성 하나에 이미지를 여러개 업로드하고, field()는 여러개의 속성에 하나의 이미지를 업로드한다.

//게시글 업로드를 처리하는 라우터이다. 
const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {  //데이터형식이 multipart이지만
  try {                                       //이미지 데이터가 들어있지 않으므로 none()를 사용했다. 
                                              //none()은 오직 텍스트필드만 허용된다.파일업로드시 에러발생
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      userId: req.user.id,                          //게시글을 DB에 저장하고, (1)
    });
    const hashtags = req.body.content.match(/#[^\s]*/g);   //게시글 내용에서 해시태그를 정규표현식으로 추출(2)
    if (hashtags) {
      const result = await Promise.all(hashtags.map(tag => Hashtag.findOrCreate({
        where: { title: tag.slice(1).toLowerCase() },       //추출한 해시태그를 DB에 저장한 후,(3)
      })));
      await post.addHashtags(result.map(r => r[0]));
    }                         //post.addHashtags()로 게시글-해시태그관계를 PostHashtag테이블에 넣는다.(4)
    res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error);
  }
});
//해시태그 검색 기능
router.get('/hashtag', async (req, res, next) => {
  const query = req.query.hashtag;
  if (!query) {
    return res.redirect('/');
  }
  try {
    const hashtag = await Hashtag.find({ where: { title: query } }); //해당 hashtag를 검색하고
    let posts = [];
    if (hashtag) {
      posts = await hashtag.getPosts({ include: [{ model: User }] });
    }              //시퀄라이즈 include 옵션으로 User 모델을 가져와서 JOIN 작업을 한다.
    return res.render('main', {
      title: `${query} | NodeBird`,
      user: req.user,
      twits: posts,//hashtag 검색을 통해 query를 찾고, User모델과 JOIN한 것을  twits에 넣는다.
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
