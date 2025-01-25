const axios = require('axios'); // Import axios for HTTP requests
const Skill = require('../models/Skills'); // Assuming Skills model is defined in the models folder

// Controller to add a skill for a user
const AddSkill = async (req, res) => {
    const { id } = req.params; // Get User ID from request parameters
    const { title } = req.body; // Skill title from request body

    // Validate input
    if (!title || title.trim() === '') {
        return res.status(400).json({ message: 'Skill title is required.' });
    }

    try {
        // Check if the user exists via the Auth service
        const authServiceUrl = `${process.env.GATEWAY_URI}/api/v1/auth/isUser/${id}`;
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

        // Count how many skills the user already has
        const skillCount = await Skill.count({ where: { UserId: id } });

        // Check if the user already has 15 skills
        if (skillCount >= 15) {
            return res.status(400).json({ message: 'You cannot add more than 15 skills.' });
        }

        // Add the new skill for the user
        const newSkill = await Skill.create({
            UserId: id,
            Title: title,
        });

        // Return success response
        return res.status(201).json({
            message: 'Skill added successfully.',
            skill: {
                id: newSkill.Id,
                userId: newSkill.UserId,
                title: newSkill.Title,
            },
        });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ message: 'User not found.' });
        }
        console.error('Error adding skill:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    AddSkill,
};
