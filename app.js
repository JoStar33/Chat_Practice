const express = require('express');
const app = express();

const port = 8080;
const server = app.listen(port, function() {
    console.log('Listening on '+port);
});

const SocketIO = require('socket.io');
const io = SocketIO(server, {path: '/socket.io'});

io.on('connection', function (socket) {
  console.log(socket.id, ' connected...');
  
  io.emit('msg', `${socket.id} has entered the chatroom.`);

  // message receives
  socket.on('msg', function (data) {
      console.log(socket.id,': ', data);
      // sender인 socket의 클라이언트는 제외한다.
      socket.broadcast.emit('msg', `${socket.id}: ${data}`);
  });

  // user connection lost
  socket.on('disconnect', function (data) {
      io.emit('msg', `${socket.id} has left the chatroom.`);
  });
});

app.get('/chat', function(req, res) {
    res.sendFile(__dirname + '/chat.html');
});