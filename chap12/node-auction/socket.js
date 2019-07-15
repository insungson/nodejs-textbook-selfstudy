const SocketIO = require('socket.io');

module.exports = (server, app) => {
  const io = SocketIO(server, { path: '/socket.io' });

  app.set('io', io);

  io.on('connection', (socket) => {     //chap11 에서 관련 정보를 볼 수 있다.
    const req = socket.request;
    const { headers: { referer } } = req;
    const roomId = referer.split('/')[referer.split('/').length - 1]; //client연결시 주소로부터 경매방 아이디
    socket.join(roomId);            //경매방 아이디를 가지고 socket.join()으로 해당방에 입장
    socket.on('disconnect', () => {
      socket.leave(roomId);     //연결이 끊겼다면 socket.leave() 로 해당방에서 나간다.
    });
  });
};