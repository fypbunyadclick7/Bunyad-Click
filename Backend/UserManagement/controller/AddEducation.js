const axios = require('axios'); // Import axios
const Education = require('../models/Education'); // Import the Education model

// Controller to add education
const AddEducation = async (req, res) => {
    const { userId } = req.params; // Get User ID from request parameters
    const { title, description, startDate, endDate, schoolName } = req.body;

    // Check for required fields
    if (!userId || !title || !schoolName) {
        return res.status(400).json({ message: 'UserId, Title, and SchoolName are required.' });
    }

    try {
        // Make a request to the Auth service to check if the user exists
        const authServiceUrl = `${process.env.GATEWAY_URI}/api/v1/auth/isUser/${userId}`;
        const userResponse = await axios.get(authServiceUrl, {
            headers: {
                'api-key': `${process.env.GATEWAY_API_KEY}`, // Send API key in headers
                'Content-Type': 'application/json',
            },
        });

        // If the user does not exist
        if (!userResponse.data.success) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Create the new education record
        const newEducation = await Education.create({
            UserId: userId,
            Title: title,
            Description: description,
            StartDate: startDate,
            EndDate: endDate,
            SchoolName: schoolName,
        });

        return res.status(201).json({
            message: 'Education added successfully.',
            education: newEducation,
        });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ message: 'User not found.' });
        }
        console.error('Error adding education:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    AddEducation,
};
