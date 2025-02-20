const Jobs = require('../models/Jobs'); // Import the Jobs model
const Bids = require('../models/Bids'); // Import the Bids model

// Controller to get bids of a specific user along with job details
const GetBids = async (req, res) => {
    const { userId } = req.params; // Get userId from URL parameters

    try {
        // Fetch bids for the specific user along with job details
        const bids = await Bids.findAll({
            where: { UserId: userId }, // Filter bids by userId
            include: [
                {
                    model: Jobs,
                    as: 'Job',
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
    GetBids,
};
