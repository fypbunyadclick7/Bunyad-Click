const User = require('../models/Users'); // Adjust path based on your project structure

// Controller to get all Admins and SuperAdmins
async function GetAdmins(req, res) {
    try {
        // Fetch all users with Role 'Admin' or 'SuperAdmin'
        const admins = await User.findAll({
            where: {
                Role: ['Admin'] // Sequelize automatically handles ENUM filtering
            },
            attributes: ['Id', 'Name', 'Email', 'PhoneNumber', 'Country', 'State', 'City', 'Role', 'Active', 'Image'] // Select only relevant fields
        });

        // Check if there are any admins
        if (!admins.length) {
            return res.status(404).json({ message: 'No admins found.' });
        }

        // Respond with the list of admins
        return res.status(200).json({
            message: 'Admins fetched successfully.',
            data: admins
        });
    } catch (error) {
        console.error('Error fetching admins:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

module.exports = {
    GetAdmins
};
