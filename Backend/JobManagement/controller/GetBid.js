const Jobs = require('../models/Jobs'); // Import the Jobs model
const JobSkills = require('../models/JobSkills'); // Import the JobSkills model
const Bids = require('../models/Bids'); // Import the Bids model
const BidAttachments = require('../models/BidAttachments'); // Import the BidAttachments model
const Categories = require('../models/Category'); // Import the Categories model
const Subcategories = require('../models/SubCategory'); // Import the Subcategories model

// Controller to get bids of a specific user along with job details
const GetBid = async (req, res) => {
    const { userId } = req.params; // Get userId from URL parameters
    const { bidId } = req.query; // Get userId from URL parameters

    try {
        // Fetch bids for the specific user along with job details
        const bids = await Bids.findOne({
            where: { UserId: userId, Id: bidId }, // Filter bids by userId
            include: [
                {
                    model: Jobs,
                    as: 'Job',
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
                },
                {
                    model: BidAttachments,
                    as: 'Attachments',
                    attributes: ['Id', 'FileUrl'], // Get the attachment URL and description
                },
            ],
        });

        // If no bids are found, return a message
        if (bids.length === 0) {
            return res.status(404).json({ message: 'No bids found for this user.' });
        }

        // Return the bids along with job details
        return res.status(200).json({ bids });
    } catch (error) {
        console.error('Error fetching user bids:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    GetBid,
};
