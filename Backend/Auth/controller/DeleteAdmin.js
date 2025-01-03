const Users = require('../models/Users');  // Import the Users model

// Controller to delete an Admin from the Users table
const DeleteAdmin = async (req, res) => {
    const { id } = req.params; // Get the Admin ID from request parameters

    try {
        // Check if the user exists and is an Admin or SuperAdmin
        const user = await Users.findOne({
            where: { Id: id, Role: ['Admin', 'SuperAdmin'] }
        });

        // If user not found, return 404
        if (!user) {
            return res.status(404).json({ success: false, message: 'Admin not found.' });
        }

        // Delete the admin record from the database
        await Users.destroy({
            where: { Id: id }
        });

        // Return success message
        return res.status(200).json({
            success: true,
            message: 'Admin deleted successfully.'
        });
    } catch (error) {
        console.error('Error deleting admin:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

module.exports = {
    DeleteAdmin
};
