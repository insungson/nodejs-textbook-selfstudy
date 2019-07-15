var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' }); // views/index.pug 파일에 {}객체를 보내는 것이다.
});                 //탬플렛 엔진 설정은 app.js에서 app.set('view engine', 'pug');  pug로 설정했다.

module.exports = router;
