const Language = require('../models/Languages'); // Adjust the path as necessary

// Controller to update language progress
const UpdateLanguage = async (req, res) => {
    const { id } = req.params; // Get language ID from request params
    const { progress } = req.body; // Get new progress from request body

    // Validate input
    if (progress === undefined) {
        return res.status(400).json({ message: 'Progress is required.' });
    }

    // Check that progress is a valid number
    if (typeof progress !== 'number' || progress < 0 || progress > 100) {
        return res.status(400).json({ message: 'Progress must be a number between 0 and 100.' });
    }

    try {
        // Find the language by ID
        const language = await Language.findOne({ where: { Id: id } });
        
        // If the language is not found
        if (!language) {
            return res.status(404).json({ message: 'Language not found.' });
        }

        // Update the progress
        language.Progress = progress;
        await language.save();

        // Return success response
        return res.status(200).json({
            message: 'Language progress updated successfully.',
            language,
        });

    } catch (error) {
        console.error('Error updating language progress:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = { UpdateLanguage };
