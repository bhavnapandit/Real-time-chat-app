const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/message')
const { userJoin, getCurrentUser, userLeave, getRoomUser } = require('./utils/user')

const app = express();
const server = http.createServer(app);
const io = socketio(server);


// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Bot'

io.on('connection', (socket) => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    //Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to the chat'));
  
    //Broadcast when a user connects
    socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));
  
    //send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUser(user.room)
    })
  });


  //listen for chat message
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  //disconnect from chat message
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUser(user.room)
      })
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
