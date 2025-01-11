const axios = require('axios'); // Import axios for HTTP requests
const EmploymentHistory = require('../models/EmploymentHistory'); // Import the EmploymentHistory model

// Controller to add employment history
const AddEmploymentHistory = async (req, res) => {
    const { userId } = req.params; // Get User ID from request parameters
    const { title, company, country, city, startDate, endDate, description } = req.body;

    if (!userId || !title || !company) {
        return res.status(400).json({ message: 'UserId, Title, and Company are required.' });
    }

    try {
        // Make a request to the Auth service to check if the user exists
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

        // Create the new employment history
        const newEmploymentHistory = await EmploymentHistory.create({
            UserId: userId,
            Title: title,
            Company: company,
            Country: country,
            City: city,
            StartDate: startDate,
            EndDate: endDate,
            Description: description,
        });

        return res.status(201).json({
            message: 'Employment history added successfully.',
            employmentHistory: newEmploymentHistory,
        });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ message: 'User not found.' });
        }
        console.error('Error adding employment history:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    AddEmploymentHistory,
};
