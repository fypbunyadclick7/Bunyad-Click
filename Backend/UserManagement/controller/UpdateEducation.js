const Education = require('../models/Education'); // Import the Education model

// Controller to update education
const UpdateEducation = async (req, res) => {
    const { id } = req.params; // Get education ID from request params
    const { title, description, startDate, endDate, schoolName } = req.body;

    try {
        const education = await Education.findByPk(id);
        
        if (!education) {
            return res.status(404).json({ message: 'Education record not found.' });
        }

        // Update only the fields that are provided
        education.Title = title !== undefined ? title : education.Title;
        education.Description = description !== undefined ? description : education.Description;
        education.StartDate = startDate !== undefined ? startDate : education.StartDate;
        education.EndDate = endDate !== undefined ? endDate : education.EndDate;
        education.SchoolName = schoolName !== undefined ? schoolName : education.SchoolName;

        await education.save();

        return res.status(200).json({
            message: 'Education updated successfully.',
            education,
        });
    } catch (error) {
        console.error('Error updating education:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    UpdateEducation
}