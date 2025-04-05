const express = require('express');
const router = express.Router();
const controller = require('../controller/SendOffer'); // Adjust the path as necessary

router.post('/', controller.SendOffer);

module.exports = router;
