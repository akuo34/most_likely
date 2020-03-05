const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  id: Number,
  prompt: String
});

const roomSchema = new mongoose.Schema({
  room: String,
  users: [String] 
});

const Prompts = mongoose.model('prompt', gameSchema);
const Rooms = mongoose.model('room', roomSchema);

module.exports.Prompts = Prompts;
module.exports.Rooms = Rooms;
