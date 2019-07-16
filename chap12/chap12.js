//전체적인 흐름
//1. 화면 구성에 대해 살펴보자  
//   layout.pug(전체화면 구성) : 로그인 로그아웃 상품내역 등 화면을 내내 보여줌 (다른 화면들이 extends함)
//   main.pug(경매상품들 목록화면) : layout.pug를 extends로 가져옴 (서버센트 연결(경매실시간))
//   auction.pug(경매진행관련 화면) : 좀 햇깔리는 부분이 block good(경매정보), block content(경매채팅) 
//                                   두가지를 제공한다.
//   good.pug(경매상품 등록화면) : 
//   join.pug(회원 가입 화면) : 
//   list.pug(낙찰된 경매물품 화면) : 

//2. DB의 구성에 대해 살펴보자
//   사용자(user) 는 email(이멜),nick(사용명),password(비번),money(보유한돈)
//   물건(good)은 name(상품명),img(상품사진),price(상품의 시작가격)
//   경매(auction)은 bid(경매 호가),msg(경매 메시지)
//
//   DB의 관계는 good : user = 1 : N  으로 두번 적용시키고 상품등록자(owner) 낙찰자(sold)로 구분한다.
//    // db.Good.belongsTo(db.User, { as: 'owner' });
//    // db.Good.belongsTo(db.User, { as: 'sold' });
//   이제 good은 name(상품명),img(상품사진),price(상품의 시작가격)외에
//              + ownerId(상품등록자),soldId(낙찰자) 가 추가된다.
//
//   user : auction = 1 : N 으로 (한명이 여러 번 경매호가와 메시지를 올릴수 있으므로)
//    // db.User.hasMany(db.Auction);
//    // db.Auction.belongsTo(db.User);
//   이제 auctino은 bid(경매 호가),msg(경매 메시지) + userId(사용자) 가 추가된다.
//
//   good : auction = 1 : N 으로 (한 상품에 여러번의 경매호가와 메시지가 있으므로)
//    // db.Good.hasMany(db.Auction);
//    // db.Auction.belongsTo(db.Good);
//   이제 auctino은 bid(경매 호가),msg(경매 메시지),userId(사용자) + goodId(상품명) 가 추가된다.

//3. 기본 주소로 get('/' 들어가면 Good DB를 가져와서 상품 목록들을 main.pug에 렌더링 한다.(layout.pug 를 extends)
//   layout.pug에서 로그인을 한다. (로그인 과정은 chap9.js의 패스포트 작동원리 (패스포트의 로그인 과정)을 확인하자)

//4. 상품이 없으므로 상품 등록을 눌러 good.pug에서 상품을 등록한다
//   good DB에   ownerId(passport 모듈 사용), name, img(multer 모듈 사용), price 를 저장한다.
//   그리고 main.pug로 리다이렉트한다.

//5. 등록한 상품이 보인다. 이제 서버센트를 사용하여 실시간 경매시간 정보를 보내는것을 구현하자
//   (서버에서 관리해야 어떤 브라우저에서 봐도 시간이 동일해진다.)
//   main.pug에서   
//script(src='https://cdnjs.cloudflare.com/ajax/libs/event-source-polyfill/0.0.9/eventsource.min.js') 는
//   서버센트의 EventSource 를 사용하기 위함이다. (EventSource 는 IE 브라우저도 서버센트를 사용하게 해준다)
//   new EventSource('/sse');  로 서버(sse.js)와 연결한다. 
//   (sse.js 에서 보낸 정보는 main.pug 의 es.onmessage = function (e) { 에서 받는다.)
//   sse.js(경매남은시간관련 정보), socket.js(상품에 대한 경매 호가 및 메시지) 두곳과 app.js 을 연결한다.

//6. main.pug에서 입장을  눌러  get('/good/:id'  에서 경매에 참여해보자 <<- 경매상태목록뜸
//   auction.pug 를 렌더링 하고 여기서 sse.js, socket.js 를 연결시킨다.
// 첫번째는 sse.js, 두번째는 socket.js 을 auction.pug와 연결한것이다.
// script(src='https://cdnjs.cloudflare.com/ajax/libs/event-source-polyfill/0.0.9/eventsource.min.js')
// script(src='/socket.io/socket.io.js')
//   layout.pug 에는 block good(상품관련-여기에 sse연결), block content(경매호가 및 메시지 socket연결)
//   입찰금액, 입찰메시지를 입력하면 XMLHttpRequest를 통해 'POST', '/good/#{good.id}/bid' 와 연결된다.

//7. routes/index.js에서 .post('/good/:id/bid'를 보면  Good(상품)DB를 req.params를 통해 검색하고 
//   auction(경매)DB와 연결이 되었기 때문에 상품에 대한 bid 가격중 DESC로 높은 가격을 가져온다.
//   등록한 상품에 대한 경매시간(created_at), 시작가격(price), 경매호가중 최고액(bid) 을 사용하여 논리를 만들고
//   논리가 맞으면 Auction(경매)DB에 아래의 4개 값을 입력한다.
//   bid,msg(auction.pug에서 입력한 값), 
//   userId(passport의 deserializeUser를 통한 모든 브라우저에서 사용가능한 req.user.id), 
//   goodId(req.params.id 는 URL을 통해 얻은 값)   
//   그리고 bid 소켓이벤트를 발생시키고    bid(result.bid), msg(result.msg), nick(req.user.nick) 데이터를
//   보낸다.

//8. auction.pug 에서 document.querySelector('#bid').appendChild(div); 으로 경매진행 창에 데이터를 추가시킨다.
//   6번에서 get('/good/:id 는 auction.pug를 렌더링 하는데
//   good(상품)DB - auction.pug의 block good와 연결하여 상품정보를 보여주고
//   auction(경매)DB - auction.pug의 block auction과 연결 경매호가, 메시지를 보여준다.(bid의 가격순으로 출력한다.)
//   하여 출력한다. (이제 해당 상품의 경매방을 나갔다 들어와도 모든 경매참여자들이 같은 정보를 볼 수 있다.)

//9. 경매시간이 종료 된 후 낙찰자에게 들어간 부분의 구현을 보자
//   처음 상품 등록시 (good.pug) node-schedule 모듈을 사용하여 설정한 시간 후 함수 실행을 한다.
//   routes/index.js에서 node-schedule모듈의 schedule.scheduleJob(end, async () => {  매서드를 사용하는데
//   첫번째 인자는 이 매서드라 실행할 시간, 두번째는 그 시간에 실행할 함수를 적으면 된다.
//   함수의 순서는 아래와 같다.
//   1) 우선 auction(경매)DB에서 bid(호가)의 최고가격 항목을 찾고 -> 
//   2) good(상품)DB에 최고 가격호가의 유저(userId)를 soldId(낙찰자)항목에 업데이트를 한다. ->
//   3) user(사용자)DB에 money: sequelize.literal(`money - ${success.bid}`) 로 money(보유금액)에서 
//      1)에서 찾은 bid 금액을 money(사용자의 보유금액)에서 차감후 DB에 업데이트 한다.
//   4) 설정 시간 후 good(상품)DB의 soldId, user(사용자)DB의 money, 컬럼의 데이터를 수정해준다.

//10. 낙찰목록을 확인하여 낙찰상품들을 보자
//    처음화면에서 낙찰목록을 누르면 get('/list' 를 통해 list.pug 가 렌더링 되고,
//    good(상품)DB에서 auction(경매)DB와 연결하여 데이터를 list.pug에 보낸다.
//    (findAll()을 사용하는 이유는 한명이 여러개의 상품을 받을 수 있기 때문이다.)

//11. list.pug에서 10번의 데이터를 받는데, 상품에 대한 bid(호가)는 여러개가 있으므로 bid 가격순으로 보내서
//    good.auctions[0].bid 를 통해 첫번째 배열을 출력하면 된다.


//실시간 경매시스템을 만들어보자
//서버와 클라이언트, 데이터베이스가 주고받는 요청과 응답, 세션, 데이터 흐름에 주목하자!

//node-auction  폴더를 만들고 package.json에 설치할 패키지를 적는다.
//기존의 패키지를 설치하고
//npm i -g sequelize-cli
//npm i sequelize mysql12
//sequelize init
//MySQL을 DB로 이용하고 시퀄라이즈를 설치하고 기본 디렉토리를 만든다.
//프로젝트의 모델은 사용자모델, 제품모델, 경매모델 로 구성한다.
//models/user.js            에서 사용자모델을 정의한다.
//password 필드는 null 값을 인정했다. 
//https://m.blog.naver.com/PostView.nhn?blogId=jevida&logNo=220544707002&targetKeyword=&targetRecommendationCode=1
//위의 링크에서 데이터를 null로 할지 not null로 할지 정한다.
//사용자모델(user.js)의 컬럼 이메일(email),닉네임(nick),비밀번호(password),보유자금(money)
//models/good.js         에서 상품 모델을 정의한다.
//상품모델(good.js)의 컬럼 상품명(name),상품사진(img),시작가격(price)
//models/auction.js      에서 경매모델을 정의한다.
//경매모델(auction.js)의 컬럼 입찰가(bid),입찰시메시지(msg)(입찰시 메시지는 null이어도 된다.)
//모델의 정의 하고 모델을 데이터베이스, 서버와 연결한다. 
//config/config.json            에서 데이터베이스에 맞게 수정한다.
//sequelize db:create           콘솔에 입력하여 데이터베이스를 생성한다.
//models/index.js               모델의 관계를 정의해보자
//사용자모델(user.js)-경매모델(auction.js)  1:N 의 관계이다.(한 상품에 여러 명이 입찰가능하다.)
//사용자모델(user.js)-상품모델(good.js)     N:M 의 관계이다.
//(사용자가 여러 상품을 등록할 수 있고, 사용자가 여러 상품을 낙찰 받을수도 있기 때문이다. 두 관계를
// 구별하기 위해 as 속성에 owner, sold로 관계명을 정했다. 그래서 ownerId, soldId 컬럼으로 상품모델에 추가된다.)

//npm i passport passport-local bcrypt         로 패스포트(로컬), bcrypt(암호화)를 설치한다.
//passport/localStrategy.js          로 패스포트(로컬)에 대한 전략을 설정해준다.(9장 패스포트 부분 참조)
//passport.index.js                  app.js에서 패스포트 설정을 위한 코드이다.(세션에 저장, 세션-DB연결부분 설정)
//routes/auth.js                     에서 로그인을 위한 라우터, 미들웨어를 추가한다.(9장 패스포트 부분)
//routes/middlewares.js              에서 로그인을 확인하는 미들웨어 코드를 만든다.

//.env                      에서 비밀키를 넣는다. dotenv 사용한 비밀키 보호적용
//app.js                    에서 서버코드를 작성한다.

//경매시스템은 회원가입, 로그인, 경매상품 등록, 방 참여, 경매 진행 으로 이뤄져 있다.
//회원가입, 로그인, 경매상품 등록 페이지와 라우터를 만들어보자

//views/layout.pug          에서 화면의 레이아웃 담당하는 코드를 작성하자
//views/main.pug            에서 메인 화면을 담당하는 코드를 작성하자
//views/join.pug            에서 회원가입 화면을 담당하는 코드를 작성하자
//views/good.pug            에서 상품을 업로드하는 페이지 화면 코드를 작성하자 
//HTML에서 form태그에서 enctype 속성을 이용하여 폼데이터를 사용하도록 설정했다.
//(form 태그의 enctype이 multipart/form-data로 폼데이터를 사용하도록 설정했다.)
//https://www.w3schools.com/tags/att_form_enctype.asp  여기서 자세한 사항을 알 수 있다.
//상품 이미지를 올리기 위함이다.
//public/main.css           에서 화면 구성에 도움되는 css 파일을 작성한다.

//routes/index.js           에서 라우터 코드를 작성한다.


///////////////////////////////////////////////////////
//서버센트 이벤트 사용하기
//온라인 경매는 모든 사람이 같은 시간에 경매가 종료되어야 한다.
//따라서 모든 사람들에게 같은 시간정보가 표시되어야 한다.
//하지만 클라이언트의 시간은 믿을 수 없다. (손쉽게 시간을 변경할 수 있기 때문이다.)
//따라서 서버에서 시간을 받는게 동일하게 적용을 받는다.
//폴링, 웹소켓 같은 양방향 통신을 사용해도 되지만, 주기적으로 서버 시간을 조회하는데는 양방향 통신은 필요없다.
//웹소켓을 사용하는데 경매 진행 중 다른 사람이 참여하거나 입찰했을 때 모두에게 금액을 알리는 역할을 할 것이다.
//서버센트 이벤트, 웹 소켓을 같이 사용할 것이다.
//npm i sse socket.io           로 sse, socket.io를 설치한다.
//app.js                        에서 서버와 sse, socket.io 모듈을 연결한다.
//sse.js                        에서 SSE모듈을 불러와서 new SSE(익스프레스서버 객체) 로 서버객체를 생성한다.
//                              생성한 객체에 connection 이벤트 리스너를 연결하여 클라이언트와 연결시 어떤
//                              동작을 할지 정의할 수 있다.
//(라우터에서 SSE를 사용하고 싶다면 app.set()메서드로 client 객체를 등록하고, req.app.get()메서드로 가져오면 된다)
//

//socket.js                 에서 chap11의 of() 메서드를 통한 네임스페이스는 쓰지 않고 연결한다.
//                          경매 화면에서 실시간으로 입찰 정보를 올리기 위해 사용한다.

//서버센트 이벤트는 IE, Edge 브라우저에서 사용할수 없는 단점이 있다.
//EventSource라는 객체를 지원하지 않아서 그렇다. EventSource를 직접 구현할 수 있다.
//IE, Edge 브라우저를 위해 클라이언트(브라우저) 코드에 EventSource polyfill을 넣어줬다.
//views/main.pug            에 서버센트를 넣어보자  (서버시간과 경매종료시간을 계산하여 넣었다.) p495를 보자
//script(src='https://cdnjs.cloudflare.com/ajax/libs/event-source-polyfill/0.0.9/eventsource.min.js')
//main.pug 에서 위의 코드는 EventSource polyfill 가 클라이언트에 스크립트로 들어간 것이다.

//view/auction.pug          에서 경매를 진행하는 페이지를 만들어보자(서버센트 이벤트, 웹 소켓 둘 모두에 연결하자)
//script(src='/socket.io/socket.io.js') 코드는 Socket.IO 가 클라이언트에 스크립트로 들어간 것이다.
//main.pug에서 넣었던 EventSource polyfill 과 위의 Socket.IO를 클라이언트에 스크립트로 넣었다.
//EventSource polyfill : 서버센트 이벤트 데이터로 서버시간을 받아 카운트다운을 한다.
//Socket.IO : 입찰 정보를 렌더링한다.

//routes/index.js           에서 기존의 라우터에 GET /good/:id    POST /good/:id/bid   를 추가한다.


//////////////////////////////////////////////////
//스케줄링 구현하기
//카운트 다운이 끝나면 더이상 경매를 진행할 수는 없지만, 아직 낙찰자가 정해지지 않았다.
//경매 종료를 24시간으로 정했기 때문에 이후 낙찰자를 정하는 시스템을 구현해야한다.
//npm i node-schedule           을 설치하여 이부분을 구현해보자

//routes/index.js           에서 scheduleJob() 메서드로 일정을 예약할 수 있다.
//                          경매모델에서 가장 높은 입찰을 한 사람을 찾아 상품모델의 낙찰자 아이디에
//                          넣어주도록 정의한다.
//여기서 node-schedule 패키지의 단점은 스케줄링이 노드 기반으로 작동하므로 노드가 종료되면 스케줄 예약도
//같이 종료된다. 

//checkAuction.js           이를 보완하기위해 낙찰자 없는 경매를 찾아서 낙찰자를 지정하는 코드를 추가해보자

//app.js                    에서 checkAuction을 서버에 연결한다. 서버를 재시작하면 앞으로 서버를 시작할 때마다
//낙찰자를 지정하는 작업을 수행한다.(checkAuction은 app.js에 포함시켜도 되지만 코드가 길어져 나눴다.)
//하루가 지나 경매가 마무리되면 node-schedule 모듈이 예정된 스케줄에 따라 낙찰자를 지정한다.
//(단, 서버가 계속 켜져 있어야 한다. 중간에 서버가 꺼졌다면 checkAuction.js 코드에 따라 낙찰자를 선정하게 된다.)


//////////////////////////////////////////////////////////
//프로젝트 마무리하기
//지금까지 경매 시스템을 제작했다. 마지막으로 낙찰자가 낙찰내역을 볼 수 있도록 바꿔보자
//routes/index.js           GET /list 라우터를 추가하고, 낙찰된 상품과 그 상품의 입찰 내역을 조회한후 렌더링한다.
//                          (입찰내역은 내림차순으로 정렬한다.)
//views/list.pug            낙찰목록 화면을 구현한다.
//views/layout.pug          낙찰 목록으로 이동할 수 있는 버튼을 추가한다.