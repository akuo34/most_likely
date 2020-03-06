const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const router = require('./router.js');
const bodyParser = require('body-parser');
const db = require('../database/index.js');
const models = require('../database/model.js');

const port = process.env.PORT || 3500;

let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', router);

var clients = {};
var waiting = {};
var prompts = {};

io.on('connection', (socket) => {

  console.log('New user connected');

  socket.on('join', ({ name, newRoom }) => {

    if (!clients[newRoom]) {
      clients[newRoom] = [name];
    } else {
      clients[newRoom].push(name);
    }
    socket.join(newRoom);
    io.in(newRoom).emit('players', clients[newRoom]);

  });

  socket.on('wait', ({ name, room }) => {
    if (!waiting[room]) {
      waiting[room] = [name];
    } else {
      waiting[room].push(name);
    }

    var waitingOn = clients[room].length - waiting[room].length

    socket.join(room);
    let message = `waiting on ${waitingOn} more to play`
    if (waitingOn === 0) {
      message = 'game will begin shortly'
      let ready = true;
      io.in(room).emit('ready', { message, ready });
    } else {
      io.in(room).emit('waiting on', { message });
    }
  })

  socket.on('get prompt', ({ room }) => {
    socket.join(room);
    if (!prompts[room]) {
      models.Prompts.find()
        .then((response) => {
          prompts[room] = response;
          var rdmPrompt = Math.floor(Math.random() * (prompts[room].length + 1));
          var currentPrompt = prompts[room][rdmPrompt].prompt;
          prompts[room].splice(rdmPrompt, 1);
          setTimeout(() => {
            io.in(room).emit('send prompt', { currentPrompt });

          }, 10000);
        })
        .catch((err) => {
          console.error(err);
        })
    } else {
      var rdmPrompt = Math.floor(Math.random() * (prompts[room].length + 1));
      var currentPrompt = prompts[room][rdmPrompt].prompt;
      prompts[room].splice(rdmPrompt, 1);
      setTimeout(() => {
        io.in(room).emit('send prompt', { currentPrompt });

      }, 10000);
    }

  });

  socket.on('start game', ({ room }) => {
    let players = clients[room];
    io.in(room).emit('players', { players });
  });

  socket.on('send prompts', ({ prompts, currentPrompt, room }) => {
    io.in(room).emit('prompts', { prompts, currentPrompt, room })
  })

  // socket.on('disconnect', ({ name, newRoom }) => {
  //   if (clients[newRoom]) {
  //     let index = clients[newRoom].indexOf(name);
  //     clients[newRoom].splice(index, 1);
  //   }
  //   socket.to(newRoom).emit('players', clients[newRoom]);
  //   console.log('User disconnected');
  // });
});

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});

app.use(express.static(path.join(__dirname, '../client/dist')));