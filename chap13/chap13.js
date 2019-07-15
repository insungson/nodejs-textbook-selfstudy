//전반적인 사항들
//라우터를 기반으로 나눠서 코드를 보자
//1. 처음접속하면 get('/' 에서 favorite(즐겨찾기)DB에서 views/index.pug를 렌더링한다. 
//   views/index.pug에서 var positions = []; 로 빈 배열을 만들고 여기에 favorite(즐겨찾기)DB 데이터를 가져온다
//   (positions.push()로 가져온데이터 빈 배열에 추가), 
//   (positions.forEach() 로 배열에 들어간 데이터들 모두 new google.maps.Marker({}) 를 통해 지도에 마커표시함)
//   지도 부분에 아래의 코드를 넣어 지도를 렌더링 한다.
    // script(
    //     async
    //     defer
    //     src="https://maps.googleapis.com/maps/api/js"
    //       + "?key=AIzaSyCQLcDPNKpStLo5s-ReAX8vn8c1uSLSbE0&callback=initMap"
    //   )

//2. 검색어 자동완성 기능을 알아보자
//   layout.pug 에서  document.querySelector('#search').addEventListener('keyup', function (e) { 
//   코드에서 keyup 이벤트는 키보드를 누르는 순간 이벤트가 발생하고 자동완성 검색어를 가져오는 콜백함수를 실행한다.
//   var query = this.value.trim(); //this는 #search(검색필드요소) 부분을 가르킨다 
//   자세히 알아보면....    아래의 코드를 통해 xhr.open('GET', '/autocomplete/' + query);로 0.2초마다 요청한다.
    // timer = setTimeout(function () {
    //     if (query) {
    //       xhr.open('GET', '/autocomplete/' + query);
    //       xhr.send();
    //     }
    //   }, 200);

//3. routes/index.js의 googleMapsClient.placesQueryAutoComplete() 를 이용하여 검색어 자동완성 결과값을 
//   return res.json(response.json.predictions); 이렇게 layout.pug로 자동완성값은 최대 5개를 보내준다.
//   *여기서 아래와 같이 @google/maps 패키지로 부터 구글지도 클라이언트를 만든다.
    // const googleMapsClient = googleMaps.createClient({
    //     key: process.env.PLACES_API_KEY,
    //   });

//4. views/layout.pug의  keyup 이벤트에서 
//   var predictions = JSON.parse(xhr.responseText); 로 값을 받고
//   predictions.forEach() 을 통해 받은 값을 모두 페이지에 출력한다.

//5. 이제 검색후 지도에 값을 보여주는 코드를 보자
//   views/layout.pug 의 
//   document.querySelector('#search-form').addEventListener('submit', function (e) {   에서
//   this.search.value(html검색어element), this.type.value(html옵션element)의 논리를 정하고
//   location.href 와 this.action(form.action을 의미) 를 통해 서버에 요청을 한다.
//   (2가지 메서드를 사용하기 때문에 논리를 나눈 것이다.)

//6. routes/index.js 의 .get('/search/:query' 에서 
// const googlePlaces = util.promisify(googleMapsClient.places); //places()메서드로 장소를 검색한다.
// const googlePlacesNearby = util.promisify(googleMapsClient.placesNearby); //placesNearby()메서드로 주변검색
//   2개의 메서드로 위치를 검색해보자 google은 callback함수만 제공하기 때문에 promise로 바꾸기 위해 위와 같이쓴다
//   const {lat,lng,type} = req.query 를 통해 위도와 경도 값이 있다면 googlePlacesNearby() 를 사용하고
//   없으면 googlePlaces()를 사용한다.
//   메서드를 통해 나온 값은 views/result.pug 로 렌더링을 한다.

//7. views/result.pug에서 역시 빈배열로 6번에서 받은 값을 positions.forEach()를 통해 
//   marker()로 지도에 표시하고 즐겨찾기 추가 창을 만든다.
//   클릭시 아래의 코드를 통해 서버에 요청을 한다.
    // xhr.open('POST', '/location/' + pos.id + '/favorite');  //URI 방식(chap4 참조)의 주소로
    // xhr.setRequestHeader('Content-Type', 'application/json');//문자열 데이터를 넣어 보냄
    // xhr.send(JSON.stringify({                               //routes/index에서 확인
    //   name: pos.name,
    //   lat: pos.lat,
    //   lng: pos.lng
    // }));

//8. routes/index.js 의 .post('/location/:id/favorite' 을 통해 favorite(즐겨찾기)DB에 저장하고, 
//   값을 다시 result.pug로 보낸다.

//9. views/result.pug의 7번 XHR 부분에서 서버응답을 받으면 / 주소로 리다이렉트한다.
    // button.textContent = '즐겨찾기 추가';
    // button.onclick = function () {      //즐겨찾기 버튼을 누를때 Ajax로 POST 요청을 서버에 보냄
    //   var xhr = new XMLHttpRequest();
    //   xhr.onload = function () {
    //     if (xhr.status === 200) { //아래서 post 요청의 응답을 받으면 /로 이동한다 (chap4 참조)
    //       location.href = '/';
    //     }
    //   };

//10. 처음주소인  routes/index.js 의 get('/'  에서 favorites(즐겨찾기)DB에서 찾은 데이터를 index.pug로
//    렌더링 하기 때문에 즐겨찾기가 추가된 것을 확인할 수 있다.


////////////////////////////////////////////////////////////

//node-place            폴더를 만들고 package.json 파일을 만들고 설치관련 모듈을 적는다.
//npm i                 관련 모듈을 설치한다.
//이번 프로젝트는 관계형 데이터베이스가 아니라 NoSQL 데이터베이스인 몽고디비와 ORM인 몽구스를 사용할 것이다.

//schemas/favorite.js       에서 즐겨찾기 스키마를 만들고, 
//장소아이디(placeId) 장소명(name) 좌표(location) 생성시간(cratedAt)으로 구성이 되어있다. 

//schemas/history.js        에서 검색내역 스키마를 만들고, 검색어(query) 생성시간(createdAt) 스키마로 구성된다.

//schemas/index.js          에서 위에서 만든 스키마들을 몽고디비와 연결한다.

//app.js                에서 몽구스를 서버와 연결한다.

//.env              에서 비밀키를 관리파일을 만든다.

//여기까지 기본 서버 구조를 만들었다. 이제 google place API를 사용하여 장소검색을 구현해보자


/////////////////////////////
//Google Places API 사용하기
//구글 검색창에 google places api 를 검색해서 사용하기 하면 관련 api를 다 사용할 수 있다.
//Google Places API를 사용하면 구글 지도와 구글 플러스가 사용하는 장소 데이터베이스에서 데이터를 가져올수 있다.
//Google API 계정에서 프로젝트를 만들고 places api 를 사용으로 바꾸고 api키를 생성한다. (자세한사항 p513)

//.env          에 키를 복사한 값을 넣는다.

//npm i @google/maps        구글은 노드를 위한 API 모듈을 따로 제공한다. 설치하자

//routes/index.js           에서 핵심 로직이 담긴 라우터를 만들어보자
//메인화면 라우터(GET /),  검색어 자동완성 라우터(GET /autocomplete/:query), 장소 검색 라우터(GET /search/:query)
//로 구성한다.
//https://www.npmjs.com/package/@google/maps   에서 API 를 사용하는 방법이 나온다.

//views/layout.pug          에서 서비스 프런트 화면을 구성하자 (검색창이 달려있어 모든 화면에서 검색창 사용가능)
//https://www.w3schools.com/js/js_window_location.asp 에서 location.href가 뭔지 확인해보자
//location.href는 현재 URL을 바꿔줄수도 있고, 현재 URL을 가져올 수도 있다.

//views/index.pug           에서 서비스의 메인화면이다.
//(나중에 지도에 자신의 위치와 즐겨찾기한 장소들의 위치를 표시할 것이다.)

//views/result.pug          에서 결과 화면을 보여준다.

//public/main.css           에서 화면 구성에 대해 설정하자

//npm start                 localhost:8015로 접속하여 검색어를 검색하면 좌표값이 나온다.


///////////////////////////////////////////
//Google Maps API 사용하기
//프런트 화면에 지도를 보여주고, 검색결과에 따른 마커들을 지도위에 표시한다. 

//views/result.pug          에서 화면에 지도와 마커가 나오도록 하자(랜더링 하는 방법에 대해 보자)


////////////////////////////////////////////
//위치 기반 검색 수행하기
//Google Places API가 정확한 결과를 리턴하지는 않기 때문에 정확도를 높이기 위해 검색 위치 주변을 검색하는
//API와 특정 종류의 장소(카페, 병원등)만 검색하는 API를 추가로 만들어보자
//* views/result.pug를 보면  navigator.geolocation.getCurrentPosition(function (position) { 부분에서
//  위치정보를 주면 

//views/layout.pug          에서 주변검색(내위치확인) 버튼을 추가하고 관련 이벤트를 추가해보자

//routes/index.js           에서 GET /search/:query  라우터도 수정한다.
//npm start로 시작하고 검색어를 입력한 후에 주변검색을 눌르면 주변 검색이 된다(console.log()로 확인해봄)

//검색 결과를 좀 더 정확하게 만들고 싶다면 아예 장소의 종류까지 지정해주면 된다.
//places와 placesNear API의 옵션으로 type을 줄 수 있다.
//type 의 변수 목록은 https://developers.google.com/places/supported_types  에 나와있다.

//views/layout.pug      에서 select태그에서 type 목록 중 카페(cafe), 상점(store), 은행(bank), 학교(school)
//목록을 고르게 하고 location.href 로 type을 쿼리스티링으로 붙여서 서버에 보낸다.(서버라우터에서 가져온다.)
//select 태그에 type을 id로 설정하고 이벤트마다 조건을 넣어 type 값을 넣는다.

//routes/index.js       에서 서버라우터로 쿼리스트링을 type값을 가져온다.(lat,lng을 가져온것처럼)

//이제 마커를 눌렀을 때 즐겨찾기를 할 수 있게 바꿔보자

//views/result.pug          에서 즐겨찾기를 위한 기존의 마커를 수정한다. 
//(마커에 창을 띄우고, Ajax 방식으로 POST 요청을 서버에 데이터를 보낸다.)

//routes/index.js           에서 즐가찾기를 처리하는 라우터를 만들어보자
//result.pug - index.js 에서 연결된 XMLHttpRequest 방식은 XMLHttpRequest_.js 을 보자

//npm start로 서버를 실행 후 주소로 들어가서 검색후 마커를 클릭하면 즐겨찾기 버튼이 
//추가된것을 볼 수 있고, 처음 주소로 돌아가는걸 확인할 수 있다.


/////////////////////////////////////////////////
//마무~~으리
//이제 즐겨찾기 화면 구현과 화면구성을 렌더링할 라우터를 구현해보자

//views/index.pug           에서 즐겨찾기에 대한 화면 구현을 하자

//routes/index.js           에서 화면을 렌더링할 라우터를 구현하자
//메인화면에 즐겨찾기 부분을 마커로 표시해서 초기 접속시 지도에 뜬다.