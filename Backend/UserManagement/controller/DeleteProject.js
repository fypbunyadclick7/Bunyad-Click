const Project = require('../models/Projects'); // Import the Project model

// Controller to delete a project
const DeleteProject = async (req, res) => {
    const { id } = req.params; // Get project ID from request parameters

    try {
        // Find the project by ID
        const project = await Project.findByPk(id);
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        // Delete the project
        await project.destroy();

        return res.status(200).json({
            message: 'Project deleted successfully.',
        });
    } catch (error) {
        console.error('Error deleting project:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    DeleteProject
};
