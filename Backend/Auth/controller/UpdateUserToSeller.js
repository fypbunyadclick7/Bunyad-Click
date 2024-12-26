const { sequelize } = require('../utils/database');
const User = require('../models/Users');

async function UpdateUserToSeller(req, res) {
    const { userId, image } = req.body;

    if (!userId || !image) {
        return res.status(400).json({ message: 'User ID and image are required.' });
    }

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Update user details
        user.Image = image;
        user.Role = 'Seller';
        await user.save();

        // Return success message along with user's name
        return res.status(200).json({ 
            message: 'User updated to seller successfully.', 
            name: user.Name ,
            email: user.Email 
        });
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

module.exports = {
    UpdateUserToSeller,
};
