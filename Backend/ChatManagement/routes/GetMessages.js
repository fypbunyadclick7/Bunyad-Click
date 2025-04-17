const express = require('express');
const router = express.Router();
const controller = require('../controller/GetMessages'); // Adjust the path as necessary

router.get('/:conversationId/user/:userId', controller.GetMessages);

module.exports = router;
