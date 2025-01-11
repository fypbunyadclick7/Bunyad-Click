const Profile = require('../models/Profile'); // Assuming Profile model is defined in models folder

// Controller to change visibility of a user
const ChangeVisibility = async (req, res) => {
    const { id } = req.params; // User ID from request parameters
    const { visibility } = req.body; // Visibility status from request body

    // Validate the visibility value
    if (!visibility || !['Public', 'Private'].includes(visibility)) {
        return res.status(400).json({ message: 'Invalid visibility. Choose either "Public" or "Private".' });
    }

    try {
        // Update visibility in the Profile table for the given user ID
        const updatedProfile = await Profile.update(
            { Visibility: visibility }, 
            { where: { UserId: id } }
        );

        // Check if the profile was updated
        if (!updatedProfile[0]) {
            return res.status(404).json({ message: 'Profile not found for the given user.' });
        }

        // Return success response
        return res.status(200).json({
            message: 'Profile visibility updated successfully.',
            visibility: visibility
        });

    } catch (error) {
        console.error('Error updating visibility:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    ChangeVisibility,
};
