const express = require('express');
const router = express.Router();
const { ResendOtp } = require('../controller/ResendOtp'); // Adjust the path as necessary

// Resend OTP route
router.post('/:id', ResendOtp);

module.exports = router;
