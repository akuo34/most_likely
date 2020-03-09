const mongoose = require('mongoose');

const db = mongoose.connect('mongodb://localhost:27017/mostlikely', { useNewUrlParser: true, useUnifiedTopology: true }, )
  .then(() => {
    console.log('db connected');
  })
  .catch((err) => {
    console.error(err);
  });

module.exports = db;
