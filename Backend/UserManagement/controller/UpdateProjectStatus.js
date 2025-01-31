const Project = require('../models/Projects'); // Import the Project model

// Controller to update project status
const UpdateProjectStatus = async (req, res) => {
    const { id } = req.params; // Get project ID from request parameters
    const { status } = req.body; // Get status from request body

    // Validate the status input
    if (!status || (status !== 'Active' && status !== 'Pause')) {
        return res.status(400).json({ message: 'Status must be either Active or Pause.' });
    }

    try {
        // Find the project by ID
        const project = await Project.findByPk(id);
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        // Update the project status
        project.Status = status;

        // Save the updated project
        await project.save();

        return res.status(200).json({
            message: 'Project status updated successfully.',
            project,
        });
    } catch (error) {
        console.error('Error updating project status:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    UpdateProjectStatus
};
