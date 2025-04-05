const express = require('express');
const router = express.Router();
const controller = require('../controller/StartConversation'); // Adjust the path as necessary

router.post('/', controller.StartConversation);

module.exports = router;
