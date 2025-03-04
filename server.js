const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('New connection established');
    
    //Welcome current user
    socket.emit('message', 'Welcome to the chat');

    //Broadcast when a user connects
    socket.broadcast.emit('message','A user has joined the chat');

    //listen for chat message
    socket.on('chatMessage',(msg)=>{
      io.emit('message', msg);
    })
  
    //disconnect from chat message
    socket.on('disconnect', () => {
       io.emit('message', 'A user has left the chat');
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
