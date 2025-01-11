const Education = require('../models/Education'); // Import the Education model

// Controller to delete education
const DeleteEducation = async (req, res) => {
    const { id } = req.params; // Get education ID from request params

    try {
        const education = await Education.findByPk(id);
        
        if (!education) {
            return res.status(404).json({ message: 'Education record not found.' });
        }

        await education.destroy();

        return res.status(200).json({
            message: 'Education deleted successfully.',
        });
    } catch (error) {
        console.error('Error deleting education:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    DeleteEducation
}