const express = require('express');
const router = express.Router();
const { DeleteAdmin } = require('../controller/DeleteAdmin'); // Adjust the path as necessary

router.delete('/:id', DeleteAdmin);

module.exports = router;
