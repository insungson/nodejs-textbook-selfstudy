const express = require('express');
const axios = require('axios');

const router = express.Router();
const URL = 'http://localhost:8002/v2';
axios.defaults.headers.origin = 'http://localhost:8003'; //axios 디폴트 설정을 통해 origin헤더 추가
// axios.defaults.headers = {             //이런식으로 디폴트 헤더 구성을 할 수 있다.
//   'Content-Type': 'application/json',
//   Authorization: 'myspecialpassword'
// }
const request = async (req, api) => {
  try {
    if (!req.session.jwt) { // 세션에 토큰이 없으면
      const tokenResult = await axios.post(`${URL}/token`, { //토큰을 요청
        clientSecret: process.env.CLIENT_SECRET,
      });
      req.session.jwt = tokenResult.data.token; // 세션에 토큰 저장
    }                         //(axios 구조상 data{서버자료(token)}라서 tokenResult.data.token 게 된것이다.)
    return await axios.get(`${URL}${api}`, {
      headers: { authorization: req.session.jwt },
    }); // API 요청
  } catch (error) {
    if (error.response.status === 419) { // 토큰 만료시 토큰 재발급 받기
      delete req.session.jwt;
      return request(req, api);
    } // 419 외의 다른 에러면
    return error.response;
  }
};

router.get('/mypost', async (req, res, next) => {
  try {
    const result = await request(req, '/posts/my');
    res.json(result.data);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/search/:hashtag', async (req, res, next) => {
  try {
    const result = await request(
      req, `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`, //한글 -> 문자열로 바꿔줌
    );
    res.json(result.data);
  } catch (error) {
    if (error.code) {
      console.error(error);
      next(error);
    }
  }
});

//////아래의 코드는 테스트 버전이다.(위의 코드는 토큰 만료시 재요청한 것이다.)
// router.get('/test', async (req, res, next) => {
//   try {
//     if (!req.session.jwt) { // 세션에 토큰이 없으면
//       const tokenResult = await axios.post('http://localhost:8002/v1/token', { //이주소의 라우터에서 토큰발급
//         clientSecret: process.env.CLIENT_SECRET,                               //토큰발급에 비밀키 같이보냄
//       });
//       console.log(tokenResult, '내용확인을위한');
//       if (tokenResult.data && tokenResult.data.code === 200) { // 토큰 발급 성공
//         req.session.jwt = tokenResult.data.token; // 세션에 토큰 저장
//       } else { // 토큰 발급 실패
//         return res.json(tokenResult.data); // 발급 실패 사유 응답
//       }
//     }
//     // 발급받은 토큰 테스트
//     const result = await axios.get('http://localhost:8002/v1/test', {
//       headers: { authorization: req.session.jwt },
//     });
//     return res.json(result.data);
//   } catch (error) {
//     console.error(error);
//     if (error.response.status === 419) { // 토큰 만료 시
//       return res.json(error.response.data);
//     }
//     return next(error);
//   }
// });

// / 라우터를 만들고 main.pug 페이지를 랜더링한다.
router.get('/', (req, res) => {
  res.render('main', { key: process.env.CLIENT_SECRET });
});

module.exports = router;

//axios 패키지 (https://tuhbm.github.io/2019/03/21/axios/) 참조
//Axios는 HTTP통신을 하는데 매우 인기있는 Javascript라이브러리입니다. 
//Axios는 브라우저와 Node.js 플랫폼에서 모두 사용할 수 있습니다.
//Axios는 Promise를 기반으로하여 async/await문법을 사용하여 XHR요청을 매우 쉽게 할 수 있습니다.
//Axios 객체의 구조
// axios({
//     url: 'https://test/api/cafe/list/today',
//     method: 'get',
//     data: {
//       foo: 'diary'
//     }
//   });
//하지만 아래처럼 메서드만 쓸 수 있다.
//axios.get()   Jquery의 $.get() 와 같다.
//axios.post()  Jquery의 $.post() 와 같다.

//axios.get(주소, {headers:{헤더}})  를 하면 해당 주소에 헤더와 함께 GET 요청을 보낸다.
//axios.post(주소, {데이터})     를 하면 해당 주소에 POST 요청을 보내면서 요청 본문에 데이터를 실어보낸다.

//보통 토큰은 HTTP 요청 헤더에 넣어서 보낸다. 응답결과는 await으로 받은 객체의 data 속성에 들어있다.
//위에서 result.data,  tokenResult.data가 API 서버에서 보내주는 응답값이다.
