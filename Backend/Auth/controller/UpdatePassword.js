const crypto = require('crypto'); // For hashing the password
const User = require('../models/Users'); // Import your User model

// Controller for updating password
const UpdatePassword = async (req, res) => {
    const { id } = req.params; // User ID from params
    const { password } = req.body; // New password from body

    try {
        // Check if the user exists
        const user = await User.findOne({ where: { Id: id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user is active
        if (!user.Active) {
            return res.status(403).json({ message: 'Your account is not active. Please verify your email or contact support.' });
        }

        // Hash the new password using SHA-256
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        // Update the user's password
        user.Password = hashedPassword; // Assuming Password is the field name
        await user.save();

        return res.status(200).json({ message: 'Password updated successfully.' });

    } catch (error) {
        console.error('Error updating password:', error);
        return res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

module.exports = { UpdatePassword };
