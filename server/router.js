const router = require('express').Router();
const controller = require('./controller.js');

router
  .route('/')
  .get(controller.getAllPrompts)

router
  .route('/rooms/:room')
  .get(controller.getRoom)

router
  .route('/rooms')
  .post(controller.postRoom)

module.exports = router;