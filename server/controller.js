const models = require('../database/model.js');
const db = require('../database/');

module.exports = {
  getAllPrompts: (req, res) => {
    models.Prompts.find()
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        res.status(404).send(err);
      });
  },
  getRoom: (req, res) => {
    const { room } = req.params;
    models.Rooms.findOne({ room })
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        res.status(404).send(err);
      });
  },
  postRoom: (req, res) => {
    const { room, name } = req.body;
    models.Rooms.create({ room, users: [name] })
      .then((data) => {
        res.status(201).send(data);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  }
}