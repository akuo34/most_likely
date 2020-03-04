const router = require('express').Router();
const controller = require('./controller.js');

router
  .route('/')
  .get(controller.getAll)

module.exports = router;