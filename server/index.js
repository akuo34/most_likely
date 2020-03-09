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
var hosts = {};
var votes = {};
var scores = {};
var rounds = {};

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

    if (!hosts[room]) {
      hosts[room] = name;
    }

    if (!scores[room]) {
      scores[room] = {};
    }
    if (!scores[room][name]) {
      scores[room][name] = 0;
    }

    var waitingOn = clients[room].length - waiting[room].length

    // socket.join(room);
    let message = `waiting on ${waitingOn} more to play`
    let initialScore = scores[room];

    var host = hosts[room];
    if (waitingOn === 0) {
      message = 'game will begin shortly'
      var players = waiting[room];
      let ready = true;
      io.in(room).emit('ready', { message, ready, players, initialScore, host });
    } else {
      // let host = hosts[room];
      io.in(room).emit('waiting on', { message, initialScore, host });
    }
  })

  socket.on('get prompt', ({ room, name }) => {
    // socket.join(room);
    if (hosts[room] === name) {
      if (!prompts[room]) {
        models.Prompts.find()
          .then((response) => {
            prompts[room] = response;
            // console.log(response);
            var rdmPrompt = Math.floor(Math.random() * prompts[room].length);
            var currentPrompt = prompts[room][rdmPrompt].prompt;
            prompts[room].splice(rdmPrompt, 1);
            setTimeout(() => {
              io.in(room).emit('send prompt', { currentPrompt });
              delete votes[room];
            }, 8000);
          })
          .catch((err) => {
            console.error(err);
          })
      } else {
        var rdmPrompt = Math.floor(Math.random() * prompts[room].length);
        var currentPrompt = prompts[room][rdmPrompt].prompt;
        prompts[room].splice(rdmPrompt, 1);
        setTimeout(() => {
          if (!rounds[room]) {
            rounds[room] = 1;
          } else {
            rounds[room]++;
          }

          if (rounds[room] === 10) {
            var lastRound = true;
          }
          io.in(room).emit('send prompt', { currentPrompt, lastRound });
          delete votes[room];
          
        }, 8000);
      }
    }

  });

  socket.on('vote', ({ vote, name, room }) => {

    // socket.join(room);
    if (!votes[room]) {
      votes[room] = {};
      votes[room][vote] = 1;
    } else {
      if (!votes[room][vote]) {
        votes[room][vote] = 1;
      } else {  
        votes[room][vote]++;
      }
    }
    // console.log(votes[room]);
    var totalVotes = 0;
    for (var key in votes[room]) {
      totalVotes += votes[room][key];
    }

    if (totalVotes === waiting[room].length) {
      var firstVote = Object.keys(votes[room])[0];
      var largestVote = votes[room][firstVote];
      var winner = firstVote;
      var winners = [];
      Object.keys(votes[room]).forEach((key) => {
        if (votes[room][key] > largestVote) {
          largestVote = votes[room][key];
          winner = key;
        }
      })
      winners.push(winner);
      Object.keys(votes[room]).forEach((key) => {
        if (votes[room][key] === largestVote && key !== winner) {
          winners.push(key);
        }
      })
      // console.log(winners);
      io.in(room).emit('winner', { winners });

      // socket.on('update score', ({ score, name, room }) => {
      //   console.log(score)
      //   if (!scores[room]) {
      //     scores[room] = {};
      //     scores[room][name] = score;
      //   } else {
      //     scores[room][name] = score;
      //   }
      //   console.log(scores[room]);
      //   let scoreboard = scores[room];
      //   io.in(room).emit('scoreboard', { scoreboard });
      // });
    }
  });

  socket.on('update score', ({ score, name, room }) => {
    
    // socket.join(room);
    if (!scores[room]) {
      scores[room] = {};
      scores[room][name] = score;
    } else {
      scores[room][name] = score;
    }
    console.log(scores[room]);
    io.in(room).emit('scoreboard', scores[room]);
  });



  // socket.on('start game', ({ room }) => {
  //   let players = clients[room];
  //   io.in(room).emit('players', { players });
  // });

  // socket.on('send prompts', ({ prompts, currentPrompt, room }) => {
  //   io.in(room).emit('prompts', { prompts, currentPrompt, room })
  // })

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