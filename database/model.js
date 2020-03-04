const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  id: Number,
  prompt: String
});

const Prompts = mongoose.model('prompt', gameSchema);

module.exports = Prompts;
