const axios = require('axios'); // Import axios for HTTP requests
const Project = require('../models/Projects'); // Import the Project model

// Controller to add a project
const AddProject = async (req, res) => {
    const { userId } = req.params; // Get User ID from request parameters
    const { title, description, image1, image2, image3 } = req.body;

    // Validate input
    if (!userId || !title) {
        return res.status(400).json({ message: 'UserId and Title are required.' });
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

        // Create the new project
        const newProject = await Project.create({
            UserId: userId,
            Title: title,
            Description: description,
            Image1: image1,
            Image2: image2,
            Image3: image3,
            Status: 'Active', // Default to 'Active' if not provided
        });

        return res.status(201).json({
            message: 'Project added successfully.',
            project: newProject,
        });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ message: 'User not found.' });
        }
        console.error('Error adding project:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = { AddProject };
