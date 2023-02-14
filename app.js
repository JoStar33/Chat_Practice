const express = require('express');
const app = express();

const port = 8080;
const server = app.listen(port, function() {
    console.log('Listening on '+port);
});


//참고로 소켓io는 웹소켓의 부가기능이 아니다.
const SocketIO = require('socket.io');
//지금같은 경우는 io 영역에서 채팅을 하고있는것.
const io = SocketIO(server, {path: '/socket.io'});


io.on('connection', function (socket) {
  //이렇게 소켓을 알 수 있게 된것.
  //콘솔 찍어보면 webSocket은 webSocket이라고 나오지만 여긴 소켓이라고 나온다.
  console.log(socket.id, ' connected...');
  
  io.emit('msg', `${socket.id} has entered the chatroom.`);

  // message receives. 서버에서 전달받는 메시지.
  // socket.emit('msg', e.target.value);에 대한 이벤트 리스너같은 셈이지.
  // 여기 data뿐만이 아니라 (data, done)이렇게 콜백함수를 받아서 실행시키는것도 가능해.
  socket.on('msg', function (data) {
      console.log(socket.id,': ', data);
      // sender인 socket의 클라이언트는 제외한다.
      socket.broadcast.emit('msg', data);
  });

  // user connection lost
  socket.on('disconnect', function (data) {
      io.emit('msg', `${socket.id} has left the chatroom.`);
  });
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/chat.html');
});