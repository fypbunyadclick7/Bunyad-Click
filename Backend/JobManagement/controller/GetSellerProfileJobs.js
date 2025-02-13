const Jobs = require('../models/Jobs'); // Import Jobs model
const Bids = require('../models/Bids'); // Import Bids model
const BidAttachments = require('../models/BidAttachments'); // Import BidAttachments model
const { Op } = require('sequelize');

const GetSellerProfileJobs = async (req, res) => {
    const { userId } = req.params; // Extract userId from params (assuming it's passed in the URL)

    try {
        // Fetch Completed Jobs where the user is assigned to the job and its status is 'Completed'
        const completedJobs = await Jobs.findAll({
            where: {
                AssignedTo: userId,
                Status: 'Completed'
            },
            include: [
                {
                    model: Bids,
                    as: 'Bids',
                    where: { UserId: userId }, // Filter bids by UserId
                    include: [
                        {
                            model: BidAttachments,
                            as: 'Attachments',
                            attributes: ['Id', 'FileUrl']
                        }
                    ],
                    attributes: ['Id', 'Price', 'Duration', 'CoverLetter', 'Status']
                }
            ],
            attributes: ['Id', 'Title', 'Description', 'CategoryId', 'SubCategoryId', 'Status'],
            order: [['CreatedAt', 'DESC']]
        });

        // Fetch Assigned Jobs where the user is assigned and its status is 'Assigned'
        const assignedJobs = await Jobs.findAll({
            where: {
                AssignedTo: userId,
                Status: 'Assigned'
            },
            include: [
                {
                    model: Bids,
                    as: 'Bids',
                    where: { UserId: userId },
                    include: [
                        {
                            model: BidAttachments,
                            as: 'Attachments',
                            attributes: ['Id', 'FileUrl']
                        }
                    ],
                    attributes: ['Id', 'Price', 'Duration', 'CoverLetter', 'Status']
                }
            ],
            attributes: ['Id', 'Title', 'Description', 'CategoryId', 'SubCategoryId', 'Status'],
            order: [['CreatedAt', 'DESC']]
        });

        // Fetch Bids placed by the user on jobs (regardless of status)
        const placedBids = await Bids.findAll({
            where: { UserId: userId },
            include: [
                {
                    model: Jobs,
                    as: 'Job',
                    attributes: ['Id', 'Title', 'Description']
                },
                {
                    model: BidAttachments,
                    as: 'Attachments',
                    attributes: ['Id', 'FileUrl']
                }
            ],
            attributes: ['Id', 'Price', 'Duration', 'CoverLetter', 'Status'],
            order: [['CreatedAt', 'DESC']]
        });

        // Return the jobs and bids, including attachments, in the response
        return res.status(200).json({
            success: true,
            CompletedJobs: completedJobs.length > 0 ? completedJobs : [],
            AssignedJobs: assignedJobs.length > 0 ? assignedJobs : [],
            PlacedBids: placedBids.length > 0 ? placedBids : []
        });
    } catch (error) {
        console.error('Error fetching seller profile jobs:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    GetSellerProfileJobs
};
