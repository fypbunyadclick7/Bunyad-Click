const Jobs = require('../models/Jobs'); // Assuming you have the Jobs model set up
const { Op } = require('sequelize');

// Controller to change the status of a job (Activate or Pause)
const UpdateJobStatus = async (req, res) => {
    const { jobId } = req.params; // Get jobId from URL parameters
    const { status } = req.body; // Get the new status (Active or Pause) from the request body

    // Check if the status provided is valid (either 'Active' or 'Pause')
    if (!['Active', 'Pause'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status. Only Active or Pause are allowed.' });
    }
    
    try {
        // Find the job by its Id
        const job = await Jobs.findOne({ where: { Id: jobId } });

        // If the job does not exist, return a 404 error
        if (!job) {
            return res.status(404).json({ message: 'Job not found.' });
        }

        // Update the job status
        await job.update({ Status: status });

        // Return a success response
        return res.status(200).json({ message: `Job status updated to ${status}.` });
    } catch (error) {
        console.error('Error updating job status:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    UpdateJobStatus
};
