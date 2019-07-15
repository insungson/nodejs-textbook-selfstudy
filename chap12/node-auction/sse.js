const SSE = require('sse');

module.exports = (server) => {
  const sse = new SSE(server);
  sse.on('connection', (client) => {
    setInterval(() => {                            //1초마다 접속한 클라이언트에게 
      client.send(new Date().valueOf().toString());//서버 시간 타임스템프를 보낸다.
    }, 1000);   //client.send()로 보내는데 문자열만 보낼 수 있으므로 toString()을 사용해서 문자열로 변경
  });
};