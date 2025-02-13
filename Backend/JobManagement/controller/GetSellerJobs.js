const Jobs = require('../models/Jobs'); // Import the Jobs model
const JobSkills = require('../models/JobSkills'); // Import the JobSkills model
const Categories = require('../models/Category'); // Import the Categories model
const Subcategories = require('../models/SubCategory'); // Import the Subcategories model
const { Op } = require('sequelize');

// Controller to get jobs
const GetSellerJobs = async (req, res) => {
    try {
        const jobs = await Jobs.findAll({
            where: { Status: 'Active' },
            include: [
                {
                    model: JobSkills,
                    as: 'Skills',
                    attributes: ['Title'], // Get only the Title of the skills
                },
                {
                    model: Categories, // Include Category model
                    as: 'Category',
                    attributes: ['Title'], // Get only the Title of the category
                },
                {
                    model: Subcategories, // Include Subcategory model
                    as: 'SubCategory',
                    attributes: ['Title'], // Get only the Title of the subcategory
                },
            ],
            order: [['createdAt', 'DESC']] // Order by createdAt in descending order
        });

        // If no jobs are found for the user, return a message
        if (jobs.length === 0) {
            return res.status(404).json({ message: 'No jobs found for this user.' });
        }

        // Return the jobs with their skills
        return res.status(200).json({ jobs });
    } catch (error) {
        console.error('Error fetching user jobs:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    GetSellerJobs,
};
