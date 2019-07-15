const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Room = require('../schemas/room');
const Chat = require('../schemas/chat');

const router = express.Router();

//채팅방 목록이 보이는 메인 화면을 렌더링 하는 라우터이다.
router.get('/', async (req, res, next) => {
  try {
    const rooms = await Room.find({});
    res.render('main', { rooms, title: 'GIF 채팅방', error: req.flash('roomError') });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//채팅방 생성 화면을 헨더링 하는 라우터이다.
router.get('/room', (req, res) => {
  res.render('room', { title: 'GIF 채팅방 생성' });
});

//채팅방을 만드는 라우터이다.
router.post('/room', async (req, res, next) => {
  try {
    const room = new Room({
      title: req.body.title,
      max: req.body.max,
      owner: req.session.color,
      password: req.body.password,
    });
    const newRoom = await room.save();    //(socket.js에 req.app.get('io')설정함)
    const io = req.app.get('io'); //app.set('io', io)로 저장했던 io객체를 req.app.get('io')로 가져옴
    io.of('/room').emit('newRoom', newRoom); ///room 네임스페이스에 연결된 모든 클리이언트에 데이터를 보낸다.
    res.redirect(`/room/${newRoom._id}?password=${req.body.password}`);//네임스페이스가 없을땐 io.emit()
  } catch (error) {                            //메서드로 모든 클라이언트에게 데이터를 보낼 수 있다.
    console.error(error);                      //데이터는 main.pug 의 newRoom 으로 보냄
    next(error);
  }
});

//채팅방을 렌더링하는 라우터이다.
router.get('/room/:id', async (req, res, next) => {
  try {
    const room = await Room.findOne({ _id: req.params.id });
    const io = req.app.get('io');
    if (!room) {
      req.flash('roomError', '존재하지 않는 방입니다.');
      return res.redirect('/');
    }
    if (room.password && room.password !== req.query.password) {
      req.flash('roomError', '비밀번호가 틀렸습니다.');
      return res.redirect('/');
    }
    const { rooms } = io.of('/chat').adapter; //io.of('/chat').adaptor.rooms에 방 목록이 들어있다.
    //io.of('/chat').adaptor.rooms[req.params.id] 를 하면 해당 방의 소켓 목록이 나온다. 
    //**/chat 방의 사용자수 추가 및 제거는 socket.js 에서 이뤄진다! 
    //socket.join(roomId);, socket.leave(roomId)  로 추가 및 제거를 한다.
    //이것으로 소켓의 수를 세서 참가 인원의 수를 알아낼 수 있다. 이부분은 shemas/chat.js 의 아래 예를 보자
    //adapter는 저 라우터로 모인 소켓에게 이벤트를 알리기 위해 사용된다.(다른 방의소켓접속자도 포함할수 있음)
    //https://socket.io/docs/using-multiple-nodes/  여기서 adapter로 검색해서 관련사항을 찾자
    //if you want to broadcast events to everyone (or even everyone in a certain room) 
    //you’ll need some way of passing messages between processes or computers.
    //The interface in charge of routing messages is what we call the Adapter
    //위의 영어가 socket.io-adapter에 대한 설명이다.
    if (rooms && rooms[req.params.id] && room.max <= rooms[req.params.id].length) {
      req.flash('roomError', '허용 인원이 초과하였습니다.');
      return res.redirect('/');
    }
    const chats = await Chat.find({ room: room._id }).sort('createdAt'); //DB 채팅내역에서 시간순으로 나열
    return res.render('chat', {
      room,
      title: room.title,
      chats, //위에서 찾은 채팅 내역을 넣는다.
      user: req.session.color,  //app.js에서 / 라우터에 들어가기전에 colorhash를 통해 사용자를 구분한다.
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

//채팅방을 삭제하는 라우터이다.
router.delete('/room/:id', async (req, res, next) => {
  try {
    await Room.remove({ _id: req.params.id });
    await Chat.remove({ room: req.params.id });
    res.send('ok');
    //채팅방과 채팅내역을 삭제한 후 2초 뒤에 웹 소켓으로 /room 네임스페이스에 방이 삭제됨을 알린다
    setTimeout(() => {
      req.app.get('io').of('/room').emit('removeRoom', req.params.id); 
    }, 2000);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//채팅내용에 대한 라우터이다.
router.post('/room/:id/chat', async (req, res, next) => {
    try {
      const chat = new Chat({
        room: req.params.id,
        user: req.session.color,
        chat: req.body.chat,
      });
      await chat.save(); //채팅 내역을 DB에 저장한다.
      req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
      res.send('ok');   //DB저장 내역을 io.of('/chat').to(방아이디).emit 으로 같은방에 들어있는 소켓들에게
    } catch (error) {   //메시지 데이터를 전송한다.
      console.error(error);
      next(error);
    }
  });

  //이미지 폴더 생성
  fs.readdir('uploads', (error) => {
    if (error) {
      console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
      fs.mkdirSync('uploads');
    }
  });
  //9장의 routes/post.js 를 보면 알 수 있다.
  const upload = multer({
    storage: multer.diskStorage({
      destination(req, file, cb) {
        cb(null, 'uploads/');
      },
      filename(req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext); //파일이름+생성시간
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
  });
  // 사진 업로드에 대한 라우터이다.
  router.post('/room/:id/gif', upload.single('gif'), async (req, res, next) => {
    try {
      const chat = new Chat({
        room: req.params.id,
        user: req.session.color,
        gif: req.file.filename,
      });
      await chat.save();
      req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
      res.send('ok');
    } catch (error) {
      console.error(error);
      next(error);
    }
  });

module.exports = router;