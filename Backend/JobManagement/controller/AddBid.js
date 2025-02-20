// controller/AddBid.js
const BidAttachments = require('../models/BidAttachments'); 
const Bids = require('../models/Bids'); 
const Jobs = require('../models/Jobs'); 

// Controller to add a bid
const AddBid = async (req, res) => {
    const { UserId, JobId, Price, Duration, CoverLetter, Attachments } = req.body; // Get data from request body

    const transaction = await Bids.sequelize.transaction(); // Start a new transaction

    try {
        // Check if the job exists
        const job = await Jobs.findOne({ where: { Id: JobId } }, { transaction });
        if (!job) {
            await transaction.rollback(); // Rollback transaction if job not found
            return res.status(404).json({ message: 'Job not found.' });
        }

        // Create a new bid
        const bid = await Bids.create({
            UserId,
            JobId,
            Price,
            Duration,
            CoverLetter,
        }, { transaction });

        // If there are attachments, handle them
        if (Attachments && Attachments.length > 0) {
            const bidAttachments = Attachments.map(fileUrl => ({
                BidId: bid.Id,
                FileUrl: fileUrl,
            }));
            await BidAttachments.bulkCreate(bidAttachments, { transaction });
        }

        // Commit the transaction
        await transaction.commit();

        // Return success response
        return res.status(201).json({
            message: 'Bid added successfully.',
            bid,
        });
    } catch (error) {
        await transaction.rollback(); // Rollback transaction on error
        console.error('Error adding bid:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};


module.exports = {
    AddBid,
};
