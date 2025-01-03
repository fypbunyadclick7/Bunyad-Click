const crypto = require('crypto');
const User = require('../models/Users'); // Assuming the User model is in the models folder

// Function to verify OTP, activate user, and send JWT
async function ForgotPasswordVerifyOTP(req, res) {
    const { hashedOtp, userOtp } = req.body; // Get hashed OTP and user OTP from the request body

    // Validate input
    if (!hashedOtp || !userOtp) {
        return res.status(400).json({ message: 'User ID, hashed OTP, and user OTP are required.' });
    }

    try {
        // Hash the user's entered OTP to compare with the stored hashed OTP
        const hashedUserOtp = crypto.createHash('sha256').update(userOtp).digest('hex');

        // Check if the hashed OTPs match
        if (hashedOtp !== hashedUserOtp) {
            return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
        }


        // Return success response with user details and token
        return res.status(200).json({
            message: 'Email verified successfully.',
        });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

module.exports = {
    ForgotPasswordVerifyOTP,
};
