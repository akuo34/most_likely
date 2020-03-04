const model = require('../database/model.js');
const db = require('../database/');

module.exports = {
  getAll: (req, res) => {
    model.find()
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        res.status(404).send(data);
      })
  }
}