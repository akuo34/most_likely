const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const router = require('./router.js');

const port = process.env.PORT || 3500;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(path.join(__dirname, '../client/dist')));

app.use('/api', router);

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


server.listen(port, () => {
  console.log(`listening on port ${port}`);
});