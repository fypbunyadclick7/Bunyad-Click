const axios = require('axios'); // Import axios for HTTP requests
const Jobs = require('../models/Jobs'); // Import the Jobs model
const JobSkills = require('../models/JobSkills'); // Import the JobSkills model
const Bids = require('../models/Bids'); // Import the Bids model
const BidAttachments = require('../models/BidAttachments'); // Import the BidAttachments model
const Categories = require('../models/Category'); // Import the Categories model
const Subcategories = require('../models/SubCategory'); // Import the Subcategories model

// Controller to get details of a specific job
const GetJob = async (req, res) => {
    const { jobId } = req.params; // Get jobId from URL parameters
    const { userId } = req.query; // Get userId from query parameters

    try {
        // Fetch user details from the external service
        const authServiceUrl = `${process.env.GATEWAY_URI}/api/v1/auth/isUser/${userId}`;
        const userResponse = await axios.get(authServiceUrl, {
            headers: {
                'api-key': `${process.env.GATEWAY_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        // Check if the user exists
        if (!userResponse.data.success) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Fetch job details along with associated data
        const job = await Jobs.findOne({
            where: { Id: jobId, UserId: userId },
            include: [
                {
                    model: JobSkills,
                    as: 'Skills',
                    attributes: ['Title'],
                },
                {
                    model: Bids,
                    as: 'Bids',
                    include: [
                        {
                            model: BidAttachments,
                            as: 'Attachments',
                            attributes: ['Id', 'FileUrl'],
                        },
                    ],
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

        // If the job is not found, return a message
        if (!job) {
            return res.status(404).json({ message: 'Job not found.' });
        }

        // Fetch user details for all bids from the external service
        for (const bid of job.Bids) {
            const bidderResponse = await axios.get(
                `${process.env.GATEWAY_URI}/api/v1/auth/isUser/${bid.UserId}`,
                {
                    headers: {
                        'api-key': `${process.env.GATEWAY_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (bidderResponse.data.success) {
                bid.User = {
                    Name: bidderResponse.data.user.Name,
                    Image: bidderResponse.data.user.Image,
                };
            } else {
                bid.User = null; // If user details cannot be fetched
            }
        }

        // Format and return the job details
        const formattedJob = {
            Id: job.Id,
            UserId: job.UserId,
            Title: job.Title,
            Timeline: job.Timeline,
            Budget: job.Budget,
            Description: job.Description,
            Status: job.Status,
            CategoryId: job.CategoryId,
            SubCategoryId: job.SubCategoryId,
            createdAt: job.CreatedAt,
            updatedAt: job.UpdatedAt,
            JobSkills: job.Skills,
            Bids: job.Bids.map((bid) => ({
                Id: bid.Id,
                UserId: bid.UserId,
                JobId: bid.JobId,
                Price: bid.Price,
                Duration: bid.Duration,
                CoverLetter: bid.CoverLetter,
                Status: bid.Status,
                createdAt: bid.createdAt,
                updatedAt: bid.updatedAt,
                User: bid.User,
                BidAttachments: bid.BidAttachments,
            })),
            Category: job.Category,
            SubCategory: job.SubCategory,
        };

        return res.status(200).json({ job: formattedJob });
    } catch (error) {
        console.error('Error fetching job details:', error);

        // Differentiate between user service error and general errors
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ message: 'User service error: User not found.' });
        }

        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    GetJob,
};
