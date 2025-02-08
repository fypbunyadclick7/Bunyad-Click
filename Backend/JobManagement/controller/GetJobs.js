const axios = require('axios'); // Import Axios for HTTP requests
const Jobs = require('../models/Jobs'); // Import the Jobs model
const JobSkills = require('../models/JobSkills'); // Import the JobSkills model
const Categories = require('../models/Category'); // Import the Categories model
const Subcategories = require('../models/SubCategory'); // Import the Subcategories model

// Controller to get jobs for a specific userId
const GetJobs = async (req, res) => {
    const { userId } = req.params;

    try {
        const authServiceUrl = `${process.env.GATEWAY_URI}/api/v1/auth/isUser/${userId}`;
        const response = await axios.get(authServiceUrl, {
            headers: {
                'api-key': `${process.env.GATEWAY_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.data.success) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const jobs = await Jobs.findAll({
            where: { UserId: userId },
            include: [
                {
                    model: JobSkills,
                    as: 'Skills',
                    attributes: ['Title'],
                },
                {
                    model: Categories,
                    as: 'Category',
                    attributes: ['Title'],
                },
                {
                    model: Subcategories,
                    as: 'SubCategory',
                    attributes: ['Title'],
                },
                
            ],
            order: [['CreatedAt', 'DESC']],
        });

        if (jobs.length === 0) {
            return res.status(404).json({ message: 'No jobs found for this user.' });
        }

        return res.status(200).json({ jobs });
    } catch (error) {
        console.error('Error fetching user jobs:', error);

        if (error.response) {
            return res
                .status(error.response.status || 500)
                .json({ message: error.response.data.message || 'Error communicating with Auth service.' });
        }

        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    GetJobs,
};
