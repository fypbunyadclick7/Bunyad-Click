const { sequelize, Op } = require('../utils/database');  // Import Op from the database.js file
const Bids = require('../models/Bids');  // Import the Bids model
const Jobs = require('../models/Jobs');  // Import the Jobs model

// Controller to get jobs based on buyerId and sellerId
exports.GetJobsForOffer = async (req, res) => {
  const { buyerId, sellerId } = req.params;  // Extract buyerId and sellerId from URL params

  try {
    // Fetch all bids made by the seller for jobs the buyer has bid on
    const bids = await Bids.findAll({
      where: {
        UserId: sellerId,  // Filter bids made by the seller
        JobId: {
          [Op.in]: sequelize.literal(`(
            SELECT JobId FROM Bids WHERE UserId = '${sellerId} and Status = Active'
          )`)  // Fetch jobs where the buyer has placed a bid
        },
      },
      raw: true,  // Returns plain data (not sequelize model instances)
    });

    if (bids.length === 0) {
      return res.status(404).json({ message: 'No matching bids found for this buyer and seller' });
    }

    // Extract the JobIds from the bids
    const jobIds = bids.map(bid => bid.JobId);

    // Fetch the corresponding job details
    const jobs = await Jobs.findAll({
      where: {
        Id: {
          [Op.in]: jobIds,  // Filter jobs by the jobIds from the bids
        },
        UserId: buyerId,
        Status: 'Active'
      },
      attributes: ['Id', 'Title', 'Description'],  // Select only the required fields
      raw: true,
    });

    // If no jobs are found
    if (jobs.length === 0) {
      return res.status(404).json({ message: 'No jobs found for the provided buyer and seller' });
    }

    // Return the jobs with their details
    res.status(200).json({
      success: true,
      jobs: jobs,
    });
  } catch (error) {
    console.error('Error fetching jobs by buyer and seller:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};
