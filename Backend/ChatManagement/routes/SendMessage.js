const express = require('express');
const router = express.Router();
const controller = require('../controller/SendMessage'); // Adjust the path as necessary

router.post('/', controller.SendMessage);

module.exports = router;
