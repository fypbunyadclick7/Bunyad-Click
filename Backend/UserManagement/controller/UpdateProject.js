const Project = require('../models/Projects'); // Import the Project model

// Controller to update a project
const UpdateProject = async (req, res) => {
    const { id } = req.params; // Get project ID from request parameters
    const { title, description, image1, image2, image3 } = req.body;

    try {
        // Find the project by ID
        const project = await Project.findByPk(id);
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        // Update only the fields that are provided
        project.Title = title !== undefined ? title : project.Title;
        project.Description = description !== undefined ? description : project.Description;
        project.Image1 = image1 !== undefined ? image1 : project.Image1;
        project.Image2 = image2 !== undefined ? image2 : project.Image2;
        project.Image3 = image3 !== undefined ? image3 : project.Image3;

        // Save the updated project
        await project.save();

        return res.status(200).json({
            message: 'Project updated successfully.',
            project,
        });
    } catch (error) {
        console.error('Error updating project:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    UpdateProject
};
