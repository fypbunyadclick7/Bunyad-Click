const Jobs = require('../models/Jobs'); // Import the Jobs model
const JobSkills = require('../models/JobSkills'); // Import the JobSkills model
const { Op } = require('sequelize'); // Import Sequelize operators
const Categories = require('../models/Category'); // Import the Categories model
const Subcategories = require('../models/SubCategory'); // Import the Subcategories model

// Controller to get jobs with filtering options
const GetFilteredSellerJobs = async (req, res) => {
    const { minPrice, maxPrice, duration, categoryId, subcategoryId } = req.query; // Get filter criteria from query parameters

    try {
        // Build the filters object
        const filters = {
            Status: 'Active', // Ensure the job is active
        };

        // Add filters based on the provided query parameters
        if (minPrice) {
            filters.Budget = { [Op.gte]: Number(minPrice) }; // Greater than or equal to minPrice
        }

        if (maxPrice) {
            filters.Budget = {
                ...filters.Budget,
                [Op.lte]: Number(maxPrice) // Less than or equal to maxPrice
            };
        }

        if (duration) {
            filters.Timeline = { [Op.lte]: Number(duration) }; 
        }

        // Filter by category if provided
        if (categoryId) {
            // Split the comma-separated values into an array and parse to numbers
            const categoryIds = categoryId.split(',').map(id => Number(id.trim()));
            filters.CategoryId = { [Op.in]: categoryIds }; // Filter by multiple category IDs
        }

        // Filter by subcategory if provided
        if (subcategoryId) {
            // Split the comma-separated values into an array and parse to numbers
            const subcategoryIds = subcategoryId.split(',').map(id => Number(id.trim()));
            filters.SubcategoryId = { [Op.in]: subcategoryIds }; // Filter by multiple subcategory IDs
        }

        // Fetch jobs with the applied filters
        const jobs = await Jobs.findAll({
            where: filters,
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

        // If no jobs are found, return a message
        if (jobs.length === 0) {
            return res.status(404).json({ message: 'No jobs found matching the criteria.' });
        }

        // Return the jobs with their skills
        return res.status(200).json({ jobs });
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    GetFilteredSellerJobs,
};
