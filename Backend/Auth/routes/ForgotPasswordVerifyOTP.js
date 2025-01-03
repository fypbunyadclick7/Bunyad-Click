const express = require('express');
const router = express.Router();
const { ForgotPasswordVerifyOTP } = require('../controller/ForgotPasswordVerifyOTP'); // Adjust the path as necessary

router.post('/', ForgotPasswordVerifyOTP);

module.exports = router;
