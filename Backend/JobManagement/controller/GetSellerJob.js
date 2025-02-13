const { Op } = require('sequelize'); // Import Sequelize operators
const axios = require('axios'); // Import Axios for external API calls
const Jobs = require('../models/Jobs'); // Import the Jobs model
const JobSkills = require('../models/JobSkills'); // Import the JobSkills model
const Bids = require('../models/Bids'); // Import the Bids model
const Categories = require('../models/Category'); // Import the Categories model
const Subcategories = require('../models/SubCategory'); // Import the Subcategories model
const moment = require('moment'); // Import Moment.js for date formatting

// Controller to get job details and check if the user has bid on it
const GetSellerJob = async (req, res) => {
    const { jobId } = req.params; 
    const { userId } = req.query; 

    try {
        // Fetch job details
        const job = await Jobs.findOne({
            where: { Id: jobId, Status: 'Active' },
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
        });

        if (!job) {
            return res.status(404).json({ message: 'Job not found.' });
        }

        // Fetch user details from the external service
        const authServiceUrl = `${process.env.GATEWAY_URI}/api/v1/auth/isUser/${job.UserId}`;
        const userResponse = await axios.get(authServiceUrl, {
            headers: {
                'api-key': `${process.env.GATEWAY_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        if (!userResponse.data.success) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const user = userResponse.data.user; // Extract user data

        // Count total bids on this job
        const totalBids = await Bids.count({ where: { JobId: jobId } });
        const bidRange = getBidRange(totalBids);

        // Get total jobs posted by the user who created this job
        const userJobsCount = await Jobs.count({ where: { UserId: job.UserId } });

        let userBidStatus = null;
        if (userId) {
            const userBid = await Bids.findOne({
                where: {
                    UserId: userId,
                    JobId: jobId
                }
            });
            userBidStatus = !!userBid; 
        }

        const formattedCreatedAt = moment(job.createdAt).format('MMMM DD, YYYY'); // Format createdAt
        const timeAgo = formatTimeAgo(new Date(job.CreatedAt));

        return res.status(200).json({
            job: {
                ...job.toJSON(),
                User: {
                    Id: user.Id,
                    Name: user.Name,
                    Country: user.Country,
                    CreatedAt: user.createdAt,
                },
            },
            userBidStatus,
            bidRange,
            totalJobsPostedByUser: userJobsCount,
            createdAt: formattedCreatedAt,
            timeAgo,
        });
    } catch (error) {
        console.error('Error fetching job details:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

// Helper function to calculate bid range
const getBidRange = (totalBids) => {
    if (totalBids < 10) return '0 to 10';
    const lowerBound = Math.floor(totalBids / 10) * 10;
    const upperBound = lowerBound + 10;
    return `${lowerBound} to ${upperBound}`;
};

// Helper function to format timeAgo
const formatTimeAgo = (createdAt) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - createdAt) / 1000);

    if (diffInSeconds < 60) {
        return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minutes ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hours ago`;
    } else if (diffInSeconds < 2592000) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} days ago`;
    } else {
        const months = Math.floor(diffInSeconds / 2592000);
        return `${months} months ago`;
    }
};

module.exports = {
    GetSellerJob,
};
