const express = require('express');
const router = express.Router();
const { ChangePassword } = require('../controller/ChangePassword'); // Adjust the path as necessary

router.put('/:id', ChangePassword);

module.exports = router;
