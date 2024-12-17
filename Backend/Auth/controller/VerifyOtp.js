const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/Users'); // Assuming the User model is in the models folder

// Secret key for JWT signing (use a secure key and store it in environment variables)
const JWT_SECRET = process.env.JWT_SECRET ;

// Function to verify OTP, activate user, and send JWT
async function VerifyOtp(req, res) {
    const { id } = req.params; // Get user ID from params
    const { hashedOtp, userOtp } = req.body; // Get hashed OTP and user OTP from the request body

    // Validate input
    if (!id || !hashedOtp || !userOtp) {
        return res.status(400).json({ message: 'User ID, hashed OTP, and user OTP are required.' });
    }

    try {
        // Hash the user's entered OTP to compare with the stored hashed OTP
        const hashedUserOtp = crypto.createHash('sha256').update(userOtp).digest('hex');

        // Check if the hashed OTPs match
        if (hashedOtp !== hashedUserOtp) {
            return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
        }

        // Find the user by ID
        const user = await User.findOne({ where: { Id: id } });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Update user's Active status to true
        user.Active = true;
        await user.save();

        // Generate JWT
        const token = jwt.sign(
            {
                id: user.Id,
                name: user.Name,
                email: user.Email,
                role: user.Role,
                image: user.Image // Assuming Image field exists in your User model
            },
            JWT_SECRET,
            { expiresIn: '1h' } // Token valid for 1 hour
        );

        // Return success response with user details and token
        return res.status(200).json({
            message: 'Email verified successfully. Your account is now active.',
            user: {
                id: user.Id,
                name: user.Name,
                email: user.Email,
                role: user.Role,
                image: user.Image,
            },
            token: token // JSON Web Token
        });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

module.exports = {
    VerifyOtp,
};
