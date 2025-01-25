const Skill = require('../models/Skills'); // Assuming Skills model is defined in the models folder

// Controller to delete a skill for a user
const DeleteSkill = async (req, res) => {
    const { id } = req.params; // Get User ID and Skill ID from request parameters

    try {
        // Check if the skill exists for the user
        const skill = await Skill.findOne({
            where: {
                Id: id
            }
        });

        // If the skill does not exist, return a 404 error
        if (!skill) {
            return res.status(404).json({ message: 'Skill not found or does not belong to this user.' });
        }

        // Delete the skill
        await skill.destroy();

        // Return success response
        return res.status(200).json({
            message: 'Skill deleted successfully.'
        });
    } catch (error) {
        console.error('Error deleting skill:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    DeleteSkill,
};
