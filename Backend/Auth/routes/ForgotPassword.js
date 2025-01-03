const express = require('express');
const router = express.Router();
const { ForgotPassword } = require('../controller/ForgotPassword'); // Adjust the path as necessary

// Resend OTP route
router.post('/', ForgotPassword);

module.exports = router;
