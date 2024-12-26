const express = require('express');
const router = express.Router();
const { GetAdmins } = require('../controller/GetAdmins'); // Adjust the path as necessary

router.get('/', GetAdmins);

module.exports = router;
