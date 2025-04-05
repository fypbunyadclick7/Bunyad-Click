const express = require('express');
const router = express.Router();
const controller = require('../controller/GetConversations'); // Adjust the path as necessary

router.get('/:userId', controller.GetConversations);

module.exports = router;
