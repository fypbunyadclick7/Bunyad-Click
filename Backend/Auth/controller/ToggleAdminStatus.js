const User = require('../models/Users'); // Adjust path based on your project structure

// Controller to toggle the active status of an admin
async function ToggleAdminStatus(req, res) {
    const { id } = req.params; // Get the admin's ID from the request parameters

    try {
        // Find the admin by ID
        const admin = await User.findOne({
            where: {
                Id: id,
                Role: 'Admin' // Ensure the user is an admin
            }
        });

        // Check if the admin exists
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found.' });
        }

        // Toggle the Active status
        admin.Active = !admin.Active;
        await admin.save();

        // Respond with success
        return res.status(200).json({
            message: `Admin has been ${admin.Active ? 'activated' : 'deactivated'} successfully.`,
            admin: {
                id: admin.Id,
                name: admin.Name,
                email: admin.Email,
                role: admin.Role,
                active: admin.Active
            }
        });
    } catch (error) {
        console.error('Error toggling admin status:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

module.exports = {
    ToggleAdminStatus
};
