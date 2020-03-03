const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const port = process.env.PORT || 3500;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(path.join(__dirname, '../client/dist')));

io.on('connection', (socket) => {
  console.log('New user connected');
});

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});