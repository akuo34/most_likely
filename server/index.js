const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const router = require('./router.js');
const bodyParser = require('body-parser');

const port = process.env.PORT || 3500;

let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', router);

var clients = {};

io.on('connection', (socket) => {

  socket.on('join', ({ name, newRoom }) => {

    if (!clients[newRoom]) {
      clients[newRoom] = [name];
    } else {
      clients[newRoom].push(name);
    }
    socket.join(newRoom);
    io.in(newRoom).emit('players', clients[newRoom]);

  });

  socket.on('start game', ({ room }) => {
    console.log(room);
    socket.to(room).emit('players', clients[room]);
  })

  console.log('New user connected');
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});

app.use(express.static(path.join(__dirname, '../client/dist')));