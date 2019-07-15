const SocketIO = require('socket.io');
const axios = require('axios');

module.exports = (server, app, sessionMiddleware) =>{
  const io = SocketIO(server, {path: '/socket.io'});  //req.app.get('io')은 routes/index.js 에서 사용한다.
  app.set('io',io);       //로 라우터에서 io객체를 쓸 수 있게 저장해둔다. req.app.get('io')로 접근이 가능하다.
                          //랜더링할 페이지 .pug 파일에서 소켓을 이어서 데이터를 가져올때 쓰인다.
  const room = io.of('/room');  //of() 메소드는 Socket.IO에 네임스페이스를 부여하는 메서드이다.
  const chat = io.of('/chat');  //Socket.IO는 기본적으로 /네임스페이스에 접속하지만 of()를 사용하면 다른
                                //네임스페이스를 만들어 접속할 수 있다.(같은 네임스페이스만 데이터를 전달한다.)
                         //(여기선 /room(채팅방 생성 및 삭제), /chat(채팅 메시지를 전달) 같은것끼리 데이터전달)
  //Socket.IO의 네임스페이스와 방에 대한 개념은 p454를 보자
  
  io.use((socket, next)=>{ //io.use()메서드에 미들웨어를 장착할 수 있다.(use이기 때문에 모든 웹소켓연결시 실행)
    sessionMiddleware(socket.request, socket.request.res, next); //Socket.io - sessionMiddleware 을 연결함
  });       //socket.request : 요청 객체에 접근할 수 있다.
            //socket.request.res : 응답 객체에 접근할 수 있다.
  room.on('connection', (socket)=>{
    console.log('room 네임스페이스 접속');
    socket.on('disconnect', ()=>{
      console.log('room 네임스페이스 접속 해제');
    });
  });

  chat.on('connection', (socket)=>{
    console.log('chat 네임스페이스에 접속');
    console.log('살펴보자=>',socket.request.headers); //이부분은 chap11.js에서 보자
    const req = socket.request;         //socket.request 로 요청 객체에 접근
    const {headers:{referer}} = req;    //socket.request.headers.referer 에서 웹페이지 URL을 가져오고, 
    const roomId = referer              //URL에서 방의 ID부분을 추출한다. (사용자를 구분하는 요소는
      .split('/')[referer.split('/').length - 1]  //세션아이디(req.sessionID), 소켓아이디(socket.id)인데,
      .replace(/\?.+/,'');    //소켓아이디는 매번 페이지 이동시 소켓연결이 해제되고 다시연결되어 바뀌기 때문에
    socket.join(roomId);      // 그래서 세션아이디를 사용하고 color-hash 패키지로 세션아이디에 따른 색상을 
                              //만들어준다. 
                              //socket.join() 으로 기존 소켓의 방에 있는 client 모두에게 메시지를 보내기
                              //위함이다. chap11.js 를 보자
                              //https://socket.io/docs/server-api/#socket-rooms  
                              //https://socket.io/docs/server-api/#socket-join-room-callback  
                              //위에 자세하게 나와있다. 
    //위 referer의 문자열을 다음과 같다.
    //referer: 'http://localhost:8005/room/5d073f43859b7b1de89d0553?password='

    socket.to(roomId).emit('join', { //socket.to(방아이디).emit(이벤트,데이터)로 특정방에 데이터를 보낼 수 있다.
      user: 'system',  //위에서 Socket.IO-sessionMiddleware 를 연결했으므로 웹 소켓에서 세션을 사용할 수 있다.
      chat: `${req.session.color}님이 입장하셨습니다.`,//방에 참여할때 방에 누군가 입장했다는 시스템 메시지를 보냄.
    });         

    socket.on('disconnect', ()=>{   
      console.log('chat 네임스페이스 접속 해제');
      socket.leave(roomId);
      //아래에서 참여자수 계산 후 0일때 방 제거처리
      const currentRoom = socket.adapter.rooms[roomId];//socket.adaptor.rooms[방 아이디]: 참여중인 소켓정보있음
      //io.of('/').adapter.clients((err, clients)=>{console.log(clients);}) 
      //위의 코드는 '/' 주소에 연결된 모든 소켓id들을 배열정보로 준다.
      const userCount = currentRoom ? currentRoom.length : 0;//접속 해제시 현재 사람수를 구해서 참여자수가 0이면
      if(userCount ===0){                                    //방을 제거하는 HTTP요청을 보낸다.
        axios.delete(`http://localhost:8005/room/${roomId}`)
          .then(()=>{
            console.log('방 제거 요청 성공');
          })
          .catch((error)=>{
            console.error(error);
          });
      }else{
        socket.to(roomId).emit('exit', {
          user: 'system',
          chat: `${req.session.color}님이 퇴장하셨습니다.`,
        });
      }
    });

  });
};


/////////////////////////////////////////////////11-3

// module.exports = (server) => {
//   const io = SocketIO(server, { path: '/socket.io' }); //첫번째 인자는 express 서버와 연결
//     //두번째 인자는 옵션 객체를 넣어 서버에 대한 설정을 하는데 클라이언트와 연결할 수 있는 경로를 의미하는
//     //path 옵션만 사용했다. /socket.io는 디폴트 값이다.
//   io.on('connection', (socket) => {//connection 이벤트는 클라이언트가 접속했을 때 발생, socket객체를 콜백으로 사용
//     const req = socket.request;  //socket.request 속성으로 요청 객체에 접근할 수 있다. 
//                                  //(socket.request.res로는 응답 객체에 접근할 수 있다.
//     const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//     console.log('새로운 클라이언트 접속!', ip, socket.id, req.ip);
//                                         //socket.id 는 소켓 고유의 아이디를 가져올수 있다.
//                                         //(이 아이디로 소켓의 주인이 누군지 특정할 수 있다.)
//     socket.on('disconnect', () => { //disconnect 이벤트는 클라이언트가 연결을 끊었을때 발생
//       console.log('클라이언트 접속 해제', ip, socket.id); 
//       clearInterval(socket.interval);
//     });
//     socket.on('error', (error) => { //error 이벤트는 통신과정에서 에러 시 발생 
//       console.error(error);
//     });
//     socket.on('reply', (data) => {  //reply 이벤트는 사용자가 직접 만든 이벤트이다.
//       console.log(data);   //클라이언트에서 reply이벤트명으로 데이터를 보낼때 서버에서 받는 부분이다.
//     });                     //이렇게 이벤트명을 사용하는점이 기존의 ws모듈과 다른점이다.
//     socket.interval = setInterval(() => {
//       socket.emit('news', 'Hello Socket.IO'); //emit()메서드로 클라이언트에게 3초마다 메시지를 보낸다.
//     }, 3000);                           //첫번째인자(news)는 이벤트 이름, 두번째인자는 데이터이다.
//   });           //즉! news라는 이벤트이름으로 Hello Socket.IO 라는 데이터를 클라이언트에 보내는 것이다.
// };              //클라이언트는 이 메시지를 받기 위해 news 이벤트 리스너를 만들어야 한다!! 



///////////////////////////////////////////////////////아래는 ws 패키지를 사용한 코드이다.
// const WebSocket = require('ws');

// module.exports = (server) => {
//   const wss = new WebSocket.Server({ server }); //wss(웹 소켓 서버)에 이제 이벤트 리스너를 붙일것이다.
//                               //웹 소켓은 이벤트 기반으로 작동한다고 생각하면 된다!!
//                               //실시간으로 데이터를 전달받으므로 항상 대기하고 있어야 한다.
//   wss.on('connection', (ws, req) => {   //connection 이벤트는 클라이언트가 서버와 웹소켓 연결을 맻을때 발생한다.
//     const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//     //클라이언트 IP를 알아내는 유명한 방법중 하나이다. 익스프레스에서는 IP를 확인할 때, proxy-addr 패키지를
//     //사용하므로 이 패키지를 사용해도 괜찮다. 크롬에서 로컬호스트로 접속한 경우, IP가 ::1로 뜬다.
//     //(다른 부라우저에서는 ::1 외에 다른IP가 뜰 수 있다.)
//     console.log('새로운 클라이언트 접속', ip); 
//     ws.on('message', (message) => { //message 이벤트는 클라이언트로부터 메시지가 왔을때 발생
//       console.log(message);
//     });
//     ws.on('error', (error) => { //error 이벤트는 웹소켓 연결 중 문제가 생겼을때 발생
//       console.error(error);
//     });
//     ws.on('close', () => { //close 이벤트는 클라이언트와 연결이 끊겼을 때 발생
//       console.log('클라이언트 접속 해제', ip);
//       clearInterval(ws.interval);
//     });
//     const interval = setInterval(() => {    
//       if (ws.readyState === ws.OPEN) {
//         ws.send('서버에서 클라이언트로 메시지를 보냅니다.');
//       }
//     }, 3000);
//     //3초마다 연결된 모든 클라이언트에게 메시지를 보내는 부분이다.
//     //먼저 readyState가 OPEN 상태인지 확인한다. 
//     //웹소켓은 4가지 상태가 있다.  CONNECTING(연결 중),OPEN(열림),CLOSING(닫는 중),CLOSED(닫힘)
//     //OPEN일때만 메시지를 보낼 수 있다.   그래서 ws.send()로 클라이언트에 메시지를 보내고 
//     //close 이벤트에서 setInterval을 clearInterval로 정리하는 것도 꼭 기억하자!!(메모리누수 방지) 
//     ws.interval = interval;
//   });
// };