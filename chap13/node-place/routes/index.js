const express = require('express');
const util = require('util');
const googleMaps = require('@google/maps');

const History = require('../schemas/history');
const Favorite = require('../schemas/favorite');

const router = express.Router();
const googleMapsClient = googleMaps.createClient({//@google/maps 패키지로 부터 구글지도 클라이언트를 만드는 방법
  key: process.env.PLACES_API_KEY,
});

//메인화면을 보여주는 라우터 (즐겨찾기 화면 렌더링의 라우터 부분)
router.get('/', async (req, res, next) => {
  try {
    const favorites = await Favorite.find({});
    res.render('index', { results: favorites });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//검색어 자동완성 라우터
router.get('/autocomplete/:query', (req, res, next) => { 
  googleMapsClient.placesQueryAutoComplete({  //'강'을 입력하면 강북,강남,강동,강서 등을 추천해준다.
    input: req.params.query,        //라우터로 전달된 쿼리를 input으로 넣어주면 된다.
    language: 'ko',             //한국어 결과값을 얻는다.
  }, (err, response) => {   //https://developers.google.com/places/web-service/query (참조하자)
    if (err) {
      return next(err);
    }
    return res.json(response.json.predictions); //콜백 방식으로 동작하고, 결과는 response.json.predictions에
  });               //담겨 있다. 예상 검색어는 최대 다섯개까지 리턴된다. (리턴값 구조는 위의 참조부분에 나온다.)
});

//장소 검색 라우터
router.get('/search/:query', async (req, res, next) => {
  const googlePlaces = util.promisify(googleMapsClient.places); //places()메서드로 장소를 검색한다.
  const googlePlacesNearby = util.promisify(googleMapsClient.placesNearby); //placesNearby()메서드로 주변검색
  //구글api는 리턴을 콜백으로 해주기 때문에 promise 방식으로 바꿔준다.(async / await를 사용하기 위해)

  const {lat,lng,type} = req.query;//views/layout.pug에서 location.href로 URL값 설정후 쿼리값을 가져온다

  try {     
    const history = new History({ query: req.params.query });   //결과값 리턴 이전에 검색 내역을 구현하기 위해 
    await history.save();                                       //데이터베이스에 검색어를 저장한다.
    let response;
    if(lat && lng){
      response = await googlePlacesNearby({   //쿼리스트링으로 lat,lng을 가져왔다.
        keyword: req.params.query,//keyword: 찾을 검색어
        location: `${lat},${lng}`,//location: 위도와 경도
        rankby: 'distance',//rankby: 정렬순서
        language: 'ko',//language: 검색언어 설정
        type, //type변수 추가
        //radius: 5000,//radius: 검색반경 
        //(rankby 대신 radius(반경,미터단위)를 입력하면 현재장소에서 반경 내 장소들을 인기순으로 검색한다)
      });
    }else{
      response = await googlePlaces({
        query: req.params.query,          //검색어를 넣고
        language: 'ko',                   //한국어 설정을 한다.
        type,
      }); 
    }
    res.render('result', {
      title: `${req.params.query} 검색 결과`,
      results: response.json.results,   //결과는 response.json.results에 담겨있다. (배열 형태로 들어간다.)
      query: req.params.query,  //https://developers.google.com/places/web-service/search  (참조) 
    });  //위의 주소에서 여기서 Nearby Search and Text Search responses 로 검색하면 리턴해주는 데이터구조가 나온다
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//즐겨찾기 저장에 대한 라우터부분
router.post('/location/:id/favorite', async (req, res, next) => {
  try {
    const favorite = await Favorite.create({  //데이터를 받아서 DB에 저장한다.
      placeId: req.params.id,       //querystring 방식이기 때문에 이렇게 받는다
      name: req.body.name,          //post 방식으로 요청을 보내면서 바디형식의 문자열을 보냈기 때문에
      location: [req.body.lng, req.body.lat], //req.body 형식으로 데이터를 받는다.
    });
    res.send(favorite);   //res.send(변수) 로 서버에서 데이터를 보내준다.
  } catch (error) {     //(views/result.pug 에서 onload로 응답이 확인되면 location.href를 통해 /로 이동한다.)
    console.error(error);
    next(error);
  }
});



module.exports = router;