//간략한 전체적인 흐름
//1. 랜더링 화면은 세가지  main.pug(채팅방 목록들 화면),room.pug(채팅방생성화면),chat.pug(채팅방 화면)
//2. 소켓은 각 라우터 별로 전부 연결시키고, socket.js에서 소켓 설정을 한다. (room, chat 의 소켓 방설정)
//3. 몽구스 디비설정에서 방의 구조는 방(room) > 채팅내용(chat) 으로 chat의 데이터 추가시 room의 
//   objectId(몽고디비 고유객체)를 가져와서 계속 추가한다. (그래야 연결 데이터를 불러올 수 있다.)
//4. 메인화면(main.pug)에서 채팅방 만들기 -> 채팅방 생성화면(room.pug) -> 방생성정보 room스키마에 저장
//   -> 채팅방 화면(chat.pug) -> 채팅방 화면(chat.pug)에서 내용입력 -> 
//   chat스키마에 입력내용 저장(방정보, 사용자, 채팅내용)
//   -> 채팅방 화면에 내용 보냄 -> 사진 올리기 -> chat 스키마에 사진정보저장(방정보, 사용자, 사진파일(multer이용))
//   -> 채팅방 화면에 사진 보냄 -> 채팅방 화면에서 방 나가기 -> 채팅방 목록들 화면(main.pug) 
//   -> 소켓 연결 끊김 이벤트 발생 -> 소켓 사용자 수 파악 후 0이면 -> 삭제 라우터 요청
//   -> chat, room 스키마에서 관련 내용 삭제 -> 소켓으로 삭제 이벤트 발생 
//   -> 채팅방 목록 내역화면에서 해당 채팅방 내역 삭제


//전체적인 흐름
//1. 우선 화면은 세가지로 구성된다. main.pug(채팅방 목록들 화면),room.pug(채팅방생성화면),chat.pug(채팅방 화면)

//2. 서버를 킨 후 기본주소는 get('/' 에서 main.pug 를 렌더링 한다. 
//   routes/index.js에서 const rooms = await Room.find({}); 를 통해 ROOM 스키마 내용모두를 가져와서 main.pug에
//   렌더링한다.

//3. main.pug 화면에서 a(href='/room') 채팅방 생성 버튼을 누르면 routes.index.js에서 get('/room 에서 
//   room.pug를 렌더링 하며 방 생성 정보를 넣는다.

//4. room.pug 에서 form(action='/room' method='post') 를 통해 화면에서 입력한 정보들을 ROOM 스키마에 저장을한다.
//   owner: req.session.color, 여기서 req.session.color는 app.js 에서
//   req.session.color = colorHash.hex(req.sessionID);  이렇게 설정을 하는데 session 패키지에서 req.sessionID
//   를 통해 브라우저의 sessionID를 가져온다. const io = req.app.get('io'); 는 소켓 객체를 socket.js 의 
//   app.set('io',io);  로 io 객체를 설정하여 io 객체를 통해 데이터를 주고 받는다.
//   io.of('/room').emit('newRoom', newRoom); 에서 /room 공간에서 newRoom이벤트 발생시 newRoom객체에 데이터를
//   넣어서 넘긴다.   res.redirect(`/room/${newRoom._id}?password=${req.body.password}`) 그리고 저 주소로
//   이동하는데 newRoom._id 여기서 ._id 가 이해 안되었는데... 몽고디비는 데이터를 입력할 때 자동적으로 _id를
//   생성한다. _id는 고유의 값이다. 5번에서 이걸 사용하게 된다.

//5. 여기서 잠깐 session으로 사용자를 구분하는데 세션을 공유하기 위해 app.js에서 
// const sessionMiddleware = session({
//     resave: false,
//     saveUninitialized: false,
//     secret:process.env.COOKIE_SECRET,
//     cookie:{
//         httpOnly:true,
//         secure:false,
//     },
// });
//   이렇게 세션설정을 변수로 묶고, 그 값을 socket.js 로 연결시키고 여기서
// io.use((socket, next)=>{ 
//     sessionMiddleware(socket.request, socket.request.res, next); 
//   }); 
//   로 전체로 연결시켜 세션을 공유한다. socket.request:요청하는 객체, socket.request.res:응답하는 객체
//   이렇게 구분을 하여 사용자를 정의한다.

//6. (4번에서 방정보를 저장하며) get('/room/:id' 주소로 이동하게 되는데, 
//   const room = await Room.findOne({ _id: req.params.id });  을 통해 ROOM 스키마에 들어가서 채팅방이 있는지
//   확인하는데 쓰인다.(if문으로 확인) 
//   const { rooms } = io.of('/chat').adapter 로 채팅방에 들어온 인원수를 파악한다. 
//   (adapter는 네임드스페이스에 들어온 사용자들 모두에게 이벤트를 전달하는 목적으로 쓰이지만 여기선 방에 들어온
//   클라이언트의 수를 파악하는데 쓰인다.)
//   if (rooms && rooms[req.params.id] && room.max <= rooms[req.params.id].length) 에서 
//   rooms[req.params.id].length 를 쓰는 이유는 마지막에 들어온 사람의 길이가 채팅방 소켓에 접속한 사용자 수이기
//   때문이다. 
//   const chats = await Chat.find({ room: room._id }).sort('createdAt'); 으로 채팅방정보로 채팅내용을 
//   시간순으로 나열해서 chats 객체에 넣는다. 
//   여기서 얻은 정보들을 chat.pug로 렌더링 하면서 보낸다.
//   socket.js 에서 chat.on('connection', (socket)=>{   로 routes/index.js 의 const io = req.app.get('io');
//   로 서로를 연결한다.  index.js에서 const { rooms } = io.of('/chat').adapter;의 rooms에 소켓 사용자 수를 
//   추가하고 제거하는것은 socket.js 의 socket.join(roomId);,socket.leave(roomId); 로 하고 
//   socket.to(roomId).emit('join', {로 'join' 이벤트를 발생시켜 관련 데이터를 chat.pug로 보낸다.(사용자입장메시지)

//7. chat.pug 에서 내용을 입력하고 
//   document.querySelector('#chat-form').addEventListener('submit', function (e) { 으로 내용을 보내는데
//  .addEventListener('submit', function (e) 과 socket.to(roomId).emit('join', { 은 다른 이벤트이다.
//   뒤에껀 소켓의 이벤트를 만들고 보내는 것이고, 앞의 것은 HTML이벤트로 
//   https://developer.mozilla.org/en-US/docs/Web/Events
//   https://www.w3schools.com/jsref/dom_obj_event.asp
//   위의 두개를 확인하면 알 수 있다.
//    xhr.open('POST', '/room/#{room._id}/chat'); 으로
//   xhr.send(JSON.stringify({ chat: this.chat.value })) JSON으로 데이터를 보낸다.
//   참고로 아래의 형태를 chat.pug에 설정해야 socket을 사용할 수 있다.
// var socket = io.connect('http://localhost:8005/chat', {
//     path: '/socket.io'
//   });

//8. routes/index.js 의 post('/room/:id/chat' 에서  chat.pug 의 내용을 Chat 스키마(DB)에 넣는다.
    //여기서 잠깐 schemas/chat.js를 살펴보자
        // room: {   //(채팅방 아이디)
        // type: ObjectId,    //room필드는 Room 스키마와 연결하여(ref:Room) Room컬렉션의 ObjectId가 들어간다.
        // required: true,
        // ref: 'Room',
    //에서 room 항목은 schemas/room.js 에서 DB에 넣을때 자동으로 생긴 ObjectId를 여기에 넣는 것이다.
    //ref로 room.js 와 연결한 것이다.
//   req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat); 로 chat 이벤트로 chat객체에
//   데이터를 담아 넘긴다.
//   따로 리다이렉트 설정이 없기 때문에 페이지 변환은 없다.

//9. chat.pug에서 socket.on('chat', function (data) {  를 통해 8번의 이벤트 객체데이터를 받는다.
//   기존 DB에서 렌더링 한 user와 이벤트로 넘어온 user 값을 비교하여 나와 타인을 비교한다.
//   이후 이벤트로 넘어온 내용을 div로 HTML 코드를 추가하여 화면에 내용을 띄운다.
//   4번에서 사용자의 색 설정코드를 chat.pug의  div.style.color 코드를 통해 사용자 별 색상을 구분한다.

//10. 이미지 전송 역시 chat.pug에서 document.querySelector('#gif').addEventListener('change', function (e) {
//    에서 change 이벤트로 기존의 이벤트를 바꿔주는 역할을 한다.
//     var formData = new FormData();
//     var xhr = new XMLHttpRequest();
//     formData.append('gif', e.target.files[0]);
//    formdata를 통해서 이미지를 넣고 보낸다.
//     xhr.open('POST', '/room/#{room._id}/gif');   주소로 보낸다.

//11. routes/index.js 에서 post('/room/:id/gif', upload.single('gif'), async (req, res, next) => { 
//    를 통해서 이미지를 업로드한다. (multer 이용 자세한 설명은 chap9를 보자)
//    chat스키마에 관련 내용을 저장한다. 
//    이후 req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);  에서
//    socket의 /chat방이름의 req.params.id 채팅방으로 'chat' 이벤트를 발생시키고 chat 객체에 데이터를 넣어 보낸다.
//    리다이렉트가 없으므로 chat.pug에서 이벤트가 발생된다.

//12. views/chat.pug 에서 socket.on('chat', function (data) { 이벤트를 받는다.
//    같은 'chat' 이벤트로 보내지만 보내는 데이터 항목중 chay이 빠지기 때문에 사진만 추가된다.

//13. routes/index.js 의 get('/room/:id' 는 chat.pug를 렌더링 하는데 방 나가기를 누르면 .get('/' 로 main.pug를
//    랜더링 하는데 소켓의 연결이 끊기게 된다. 
//    socket.js에서 chat 룸의 socket.on('disconnect', ()=>{  이벤트가 발생하고 socket.leave(roomId);로 
//    소켓 사용자를 뺀다. 
//    const currentRoom = socket.adapter.rooms[roomId] 로 현재 방의 소켓 사용자 수를 뽑고,
//    const userCount = currentRoom ? currentRoom.length : 0;  현재 수가 0일떄
//    axios.delete(`http://localhost:8005/room/${roomId}`)  로 route 요청을 한다.
//    routes/index.js 의 delete('/room/:id', async (req, res, next) => {   에서 room, chat 스키마의 
//    방 아이디에 속하는 DB 데이터를 다 지운다. (관계형이 아니기 때문에 다 지운다.)
    // setTimeout(() => {
    //     req.app.get('io').of('/room').emit('removeRoom', req.params.id); 
    //   }, 2000);
//    그리고 위의 부분에서 room 방으로 'removeRoom' 이벤트로 현재 방의 정보(req.params.id) 를 보낸다.
//    현재 화면은 / 주소에서 렌더링하는 main.pug 이고  socket.on('removeRoom', function (data) {
//    에서 removeRoom 이벤트 발생시 채팅방의 목록을 없앤다.


//https://medium.com/@chullino/http%EC%97%90%EC%84%9C%EB%B6%80%ED%84%B0-websocket%EA%B9%8C%EC%A7%80-94df91988788
//(웹소켓의 역사에 대한 사이트이다.)
//웹소켓의 정의
//웹소켓은 HTML5에서 새로 추가된 스펙으로 실시간 양방향 데이터 전송을 위한 기술이다.
//웹소켓은 약속입니다. HTTP와 같이 약속입니다. 브라우저와 서버가 양방향 통신을 할 수 있도록 지원하는 프로토콜입니다
//HTTP에서 원리적으로 해결할 수 없었던 문제는 
//“클라이언트의 요청이 없음에도, 그 다음 서버로부터 응답을 받는 상황”이었는데요
//웹소켓에서는 서버와 브라우저 사이에 양방향 소통이 가능합니다. 
//브라우저는 서버가 직접 보내는 데이터를 받아들일 수 있고, 사용자가 다른 웹사이트로 이동하지 않아도 
//최신 데이터가 적용된 웹을 볼 수 있게 해줍니다. 웹페이지를 ‘새로고침’하거나 다른 주소로 이동할 때 
//덧붙인 부가 정보를 통해서만 새로운 데이터를 제공하는 웹서비스 환경의 빗장을 본질적으로 풀어준 셈입니다.


///////////////////////////////////////////
//최신 브라우저는 대부분 웹소켓을 지원한다. 노드는 ws, SocketIO 같은 패키지를 통해 웹소켓을 사용할 수 있다.

//HTTP 폴링방식
//HTTP가 클라이언트에서 서버로 향하는 단방향 통신이므로 주기적으로 서버에 새로 업데이트가 없는지 요청을 보내
//있다면 새로운 내용을 가져오는 무식한 방법이다. 

//웹소켓의 등장
//HTML5가 나오면서 웹 브라우저와 웹 서버가 지속적으로 연결된 라인을 통해 실시간으로 데이터를 주고받을 수 있는
//웹소켓이 등장했다. 처음에 웹소켓이 연결이 되면 그 다음부턴 계속 연결된 상태로 있기 때문에 따로 업데이트가
//있는지 요청을 보낼 필요가 없다. (업데이트 사항이 있다면 서버에서 바로 클라이언트에게 알려준다.)
//HTTP 프로토콜과 포트를 공유할 수 있으므로 다른 포트에 연결할 필요도 없다. 

//서버 센트 이벤트(Server Sent Events, SSE)
//EventSource라는 객체를 이용하는데, 처음에 한번만 연결하면 서버가 클라이언트에 지속적으로 데이터를 보내준다.
//웹 소켓과 다른점은 클라이언트 -> 서버 로 데이터를 보낼 수 없다는 점이다. 
//(서버 -> 클라이언트 로만 데이터를 보내는 단방향 통신이다.) 주식차트, SNS 새게시글 확인은 굳이 양방향이 필요없다.

//(폴링, SSE, 웹소켓 사진확인) 자세한건 그림을 통해 확인해보자

//Socket.IO 는 웹소켓을 편리하게 사용할 수 있게 도와주는 라이브러리이다! 
//(IE9처럼 웹소켓이 지원안되는 브라우저는 폴링방식으로 통신을 해야한다.)

//이제 Socket.IO를 사용하기 전에 WS모듈로 웹소켓을 체험해보자!!


////////////////////////////////////
//ws 모듈로 웹소켓 사용하기
//gif-chat 폴더를 만들자
//package.json    에 내용을 옮기고,
//npm i           로 설치한다.
//.env           파일에 비밀키를 설정한다.
//app.js         에 코드를 작성한다.
//routes 폴더를 만들고, index.js 파일을 만들고 코드를 작성한다.
//npm i ws      이제 ws모듈을 설치하여 노드에 웹 소켓을 구현해보자!
//app.js        에서 웹 소켓을 익스프레스 서버에 연결하자
//socket.js     에서 웹소켓 로직을 만들어보자 (웹소켓 구조도는 p436을 보자)
//위의 과정으로 웹소켓을 서버에 설정하고. 이제 클라이언트에서 웹소켓을 사용하는 설정을 해보자
//views/index.pug       에서 script 태그에 웹소켓 코드를 넣어보자(layout, index 따로 구분해서 작성)
//  (https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) 클라이언트에서 웹소켓 사용방법이다.
//npm start         로 서버를 시작하고 브라우저에서 localhost:8005 로 접속하면 서버터미널에서 클라이언트가
//접속한게 보인다.  추가로 다른 브라우저로 접속하면 서버에서 확인이 가능하다. 
//브라우저에서 콘솔 및 네트워크 탭을 확인해보면 서버로 부터 메시지가 3초마다 지속적으로 오는것을 확인할 수 있다.
//이제 웹소켓이 아닌 Socket.IO를 이용해보자


///////////////////////////////////////
//Socket.IO사용하기
//ws 패키지는 간단한 서비스에선 사용할 수 있지만 좀 더 복잡한 서비스에서는 Socket.IO를 사용하는 편이 낫다.
//npm i socket.io       로 Socket.IO를 설치하자
//socket.js         에서 ws패키지 -> Socket.IO로 바꿔서 연결한다. 
//(https://socket.io/docs/server-api/)  소켓에 대한 상세한 자료는 여기 있다.
//views/index.pug           에서 클라이언트 부분도 바꿔주자 (연결할 이벤트 리스너들을 만들자 )
//Socket.IO는 먼저 폴링방식으로 서버와 연결한다.  그렇기 때문에 코드에서 HTTP프로토콜을 사용한 것이다.
//폴링 연결 후, 웹소켓을 사용할 수 있다면 웹소켓으로 업그레이드 해야한다 
//웹소켓을 사용할 수 없는 브라우저는 폴링방식으로 웹소켓을 사용할 수 있는 브라우저는 웹소켓을 사용한다.
//옵션으로 바꿔줄 수 있다.


/////////////////////////////////////////
//실시간 GIF 채팅방 만들기
//사람들이 익명으로 채팅방을 생성하고 자유롭게 참여하여 GIF 파일을 올리는 채팅방을 만들어보자
//몽고디비, 몽구스(몽고디비 ORM) 를 사용할 것이다.
//채팅방 스키마, 채팅 내역 스키마에 대해 몽구스 스키마를 생성한다.
//npm i mongoose multer axios color-hash        로 필요한 모듈을 설치한다.
//이미지를 업로드하고 서버에 HTTP요청을 하는데 필요한 multer,axios 사용
//랜덤 색상을 구현해주는 color-hash 를 사용
//(https://alexband.tistory.com/24) 몽구스 데이터스키마에 넣는 옵션들
//schemas/room.js           에서 채팅방스키마를 만들어보자
//schemas.chat.js           에서 채팅스키마를 만든다. 
//schemas/index.js          에서 몽고디비와 연결해보자

/////////////////////////////////////////////
//스키마의 연결관계에 대한 건 https://mongoosejs.com/docs/populate.html  여기들어가면 알 수 있다.
// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const personSchema = Schema({
//   _id: Schema.Types.ObjectId,
//   name: String,
//   age: Number,
//   stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }]
// });

// const storySchema = Schema({
//   author: { type: Schema.Types.ObjectId, ref: 'Person' },
//   title: String,
//   fans: [{ type: Schema.Types.ObjectId, ref: 'Person' }]
// });

// const Story = mongoose.model('Story', storySchema);
// const Person = mongoose.model('Person', personSchema);
///////////////////////////////////////////////////

//.env                      에서 보안을 위한 설정을 하자
//app.js                    에서 서버실행 시 몽고디비에 접속할 수 있도록 서버와 몽구스를 연결한다.
//이제 채팅앱 메인화면과 채팅방 등록화면을 만들어보자 채팅뿐 아니라 채팅방도 실시간으로 추가 및 제거가 된다.
//views/layout.pug          에서 화면 레이아웃 코드을 짜자
//public/main.css           에서 화면 디자인을 꾸미자
//views/main.pug            에서 메인화면을 담당하는 코드를 짜자
//main.pug 에서 io.connect() 메서드의 주소가 다르다. 주소 뒤에 /room이 붙었다. 이걸 네임스페이스라고 부른다.
//(서버에서는 /room 네임스페이스로 보낸 데이터만 받을 수 있다.)
//socket에는 newRoom, removeRoom 이벤트를 달아서 서버에서 웹소켓으로 이벤트를 발생시키면 이벤트 리스너의 콜백함수가
//발생한다.(이벤트를 받는 부분은 main.pug 파일이다.)
//https://www.zerocho.com/category/HTML&DOM/post/594bc4e9991b0e0018fff5ed
//Ajax 요청 과 받는 부분에 대한 설명이다.
//https://www.zerocho.com/category/HTML&DOM/post/59465380f2c7fb0018a1a263
//formdata에 대한 설명부분이다.
//views/room.pug            에서 채팅방 생성 화면을 담당하는 코드를 짜자
//views/chat.pug            에서 채팅방 화면을 담당하는 코드를 짜자
//채팅메시지는 세가지 내메시지(mine), 시스템메시지(system), 남의 메시지(other) 로 구분한다.(종류별로 스타일다름)
//스크립트 부분은 socket.io 연결부분, socket.io 이벤트 리스너, 폼 전송부분으로 구분된다.
//join, exit로 사용자 입장과 퇴장에 관련된 데이터가 웹소켓으로 전송될때 호출된다. 
//socket.js                 에서 웹소켓이벤트를 연결하자
//app.js                    에서 위의 미들웨어를 붙여보자
//방에 입장하거나 퇴장할때 '~~님이 입장하였습니다.', '퇴장하였습니다.' 같은 시스템 메시지를 보내려고 한다면 
//사용자이름이 세션에 들어있기 때문에 Socket.IO에서 세션에 접근하려면 추가 작업이 필요하다.
//Socket.IO도 미들웨어로 사용할 수 있으므로 express-session을 공유하면 된다.(app.js에서 기존 session부분을 바꾸자)
//socket.js                 에서 위의 사항을 연결시키자
//routes/index.js           에서 라우터부분을 작성한다. 라우터에서 몽고디비, 웹소켓 모두에 접근할 수 있다.
//이제 몽고디비 서버를 키고, npm start로 실행 후 localhost:8005 로 들어가서 브라우저 창 2개를 띄우고 방을 만들고
//다른 브라우저로 들어가면 다른 사용자가 입장한것처럼 보인다.

//아래는 socket.js 의 채팅방 만들때 socket.request.headers 는 어떻게 구성된건지 확인차 찍어본 콘솔결과이다.

// 살펴보자=> { host: 'localhost:8005',
//   connection: 'keep-alive',
//   accept: '*/*',
//   'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
//   'alexatoolbar-alx_ns_ph': 'AlexaToolbar/alx-4.0.3',
//   referer: 'http://localhost:8005/room/5d073f43859b7b1de89d0553?password=',
//   'accept-encoding': 'gzip, deflate, br',
//   'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
//   cookie: '__utma=111872281.1695925934.1547987853.1547987853.1547987853.1; __utmz=111872281.1547987853.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); connect.sid=s%3Au2-d8H_8QUAlqG6bZZrDrexbrFCbRcxK.sCSSVfeQNtpbxDRQu6XMNzgouFDNtUTWuvyCjAGb0nI; io=BBcOCnkL-tPnHSNwAAAD' }


//socket.js 에서 socket.join() 부분에 대한 설명이다. (https://socket.io/docs/server-api/#socket-rooms)
// io.on('connection', (socket) => {
//     socket.join('room 237', () => {          join() 을 쓰면 기존의 소켓(client)가 있는 방에 다른 client를
//       let rooms = Object.keys(socket.rooms);  추가시킬 수 있다. 
//       console.log(rooms); // [ <socket.id>, 'room 237' ]    **봐라!! 여기 room 237이 추가되었다.
//       io.to('room 237').emit('a new user has joined the room'); // broadcast to everyone in the room
//     });                  이후io.to()로 소켓에 연결된 모두에게 ()안의 값을 보낼 수 있다.
//   });


//////////////////////////////////////////
//채팅 구현하기 (브라우저 페이지에서 웹소켓리스너를 만들고,폼데이터를 보내고 라우터에서 채팅내역을 가져오는걸 추가하자)
//views/chat.pug        에서 채팅데이터를 받을 소켓 이벤트 리스너를 추가하고, 폼에 submit 이벤트 리스너도 추가한다.
//routes/index.js       에서 방 접속관련 라우터에 채팅 내역을 불러오도록 수정하고,  채팅 메시지에 대한 
//                      라우터도 추가한다.(DB에 저장, DB에서 소켓을 통해 다시 불러오는것)
//이제 실행해서 다른 브라우저2개로 채팅방을 사용해보자


////////////////////////////////////////////
//프로젝트 마무리! (GIF 이미지를 전송해보자)
//views/chat.pug        에서 GIF 이미지를 선택했을 때 업로드하는 이벤트 리스너를 추가하자
//routes/index.js       에서 이미지 업로드에 대한 라우터를 추가하자
//app.js                에서 이미지를 제공할 upload폴더를 express.static 미들웨어로 연결해보자



///////////////////////////////////////
//p466에서 자세히 보자
//웹소켓만으로 채팅 구현하기 (라우터를 거치지 않고 채팅 구현하기)
//views/chat.pug에서
// document.querySelector('#chat-form').addEventListener('submit',function(e){
//     e.preventDefault();
//     if(e.target.chat.value){
//         socket.emit('chat', {
//             room:'#{room._id}',
//             user:'#{user}',
//             chat: e.target.chat.value
//         });
//         e.target.chat.value='';
//     }
// });

//웹소켓을 통해 서버에 chat 이벤트로 채팅에 관한 정보를 보낸다. #{room._id}나 #{user} 는 pug에서 서버데이터를
//스크립트에 문자열로 렌더링하는 부분이다.

//app.js 에서
// chat.on('connection',(socket) => {
//     ...
//     socket.on('disconnect', ()=>{
//         ...
//     });
//     socket.on('chat', (data)=>{
//         socket.to(data.room).emit(data);
//     });
// });

//웹 소켓에서는 chat 이벤트를 받아서 다시 방에 들어있는 소켓에서 메시지 데이터를 보낸다.
//chat 이벤트 리스너에 채팅 내용을 데이터베이스에 저장하는 코드를 넣어도 되긴하다.
//하지만 코드관리가 어려워 예제에서는 라우터를 거쳐 저장하는 방식을 택했다.


/////////////////////////////////////////
//Socket.IO API
// //특정인에게 메시지를 보내는 방법
// Socket.to(소켓 아이디).emit(이벤트, 데이터);
// //나를 제외한 전체에게 메시지 보내기
// Socket.broadcast.emit(이벤트, 데이터);
// Socket.broadcast.to(방 아이디).emit(이벤트, 데이터);