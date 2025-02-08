const Jobs = require('../models/Jobs'); // Assuming you have the Jobs model set up
const { Op } = require('sequelize');

// Controller to change the status of a job (Activate or Pause)
const DeleteJob = async (req, res) => {
    const { jobId } = req.params; // Get jobId from URL parameters

    try {
        // Find the job by its Id
        const job = await Jobs.findOne({ where: { Id: jobId } });

        // If the job does not exist, return a 404 error
        if (!job) {
            return res.status(404).json({ message: 'Job not found.' });
        }

        // Update the job status
        await job.update({ Status: 'InActive' });

        // Return a success response
        return res.status(200).json({ message: `Job Deleted.` });
    } catch (error) {
        console.error('Error updating job status:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    DeleteJob
};
