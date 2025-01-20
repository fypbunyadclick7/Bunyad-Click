const Language = require('../models/Languages'); // Adjust the path as necessary

// Controller to delete a language
const DeleteLanguage = async (req, res) => {
    const { id } = req.params; // Get user ID from request params
    const { title } = req.body; // Get language title from request body

    console.log(id, title)

    try {
        // Find the language by title and user ID
        const language = await Language.findOne({ where: { Title: title, UserId: id } });

        // If the language is not found
        if (!language) {
            return res.status(404).json({ message: 'Language not found.' });
        }

        // Delete the language
        await Language.destroy({ where: { Id: language.Id } });

        // Return success response
        return res.status(200).json({
            message: 'Language deleted successfully.',
        });

    } catch (error) {
        console.error('Error deleting language:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = { DeleteLanguage };


module.exports = { DeleteLanguage };
