const axios = require('axios'); // Import axios for HTTP requests
const Language = require('../models/Languages'); // Adjust the path as necessary

// Controller to add a language
const AddLanguage = async (req, res) => {
    const { userId } = req.params; // Get User ID from request parameters
    const { title, progress } = req.body;

    // Validate input
    if (!userId || !title || progress === undefined) {
        return res.status(400).json({ message: 'User ID, title, and progress are required.' });
    }

    try {
        // Check if the user exists via the Auth service
        const authServiceUrl = `${process.env.GATEWAY_URI}/api/v1/auth/isUser/${userId}`;
        const response = await axios.get(authServiceUrl, {
            headers: {
                'api-key': `${process.env.GATEWAY_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        // If the user does not exist
        if (!response.data.success) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Create the new language entry
        const newLanguage = await Language.create({
            UserId: userId,
            Title: title,
            Progress: progress,
        });

        // Return success response
        return res.status(201).json({
            message: 'Language added successfully.',
            language: newLanguage,
        });

    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ message: 'User not found.' });
        }
        console.error('Error adding language:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = { AddLanguage };
