const crypto = require('crypto'); // For password encryption using SHA-256
const User = require('../models/Users'); // Import the User model

// Controller to update password
const ChangePassword = async (req, res) => {
    const { id } = req.params; // Get user ID from request params
    const { oldPassword, newPassword } = req.body; // Get old and new password from request body

    try {
        // Fetch user from the database by ID
        const user = await User.findOne({ where: { Id: id, Active: true } });

        // If the user is not found
        if (!user) {
            return res.status(404).json({ message: 'User not found or inactive.' });
        }

        // Encrypt the old password using SHA-256
        const oldPasswordHash = crypto.createHash('sha256').update(oldPassword).digest('hex');

        // Compare the old password with the current password
        if (oldPasswordHash !== user.Password) {
            return res.status(400).json({ message: 'Old password is incorrect.' });
        }

        // Encrypt the new password using SHA-256
        const newPasswordHash = crypto.createHash('sha256').update(newPassword).digest('hex');

        // Update the user's password with the new hashed password
        user.Password = newPasswordHash;

        // Save the updated user in the database
        await user.save();

        // Return success message
        return res.status(200).json({ message: 'Password updated successfully.' });

    } catch (error) {
        console.error('Error updating password:', error);
        return res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

module.exports = { ChangePassword };
