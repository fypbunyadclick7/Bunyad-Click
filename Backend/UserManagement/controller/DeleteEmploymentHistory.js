const EmploymentHistory = require('../models/EmploymentHistory'); // Import the EmploymentHistory model

// Controller to delete employment history
const DeleteEmploymentHistory = async (req, res) => {
    const { id } = req.params; // Get employment history ID from request params

    try {
        const employmentHistory = await EmploymentHistory.findByPk(id);
        
        if (!employmentHistory) {
            return res.status(404).json({ message: 'Employment history record not found.' });
        }

        await employmentHistory.destroy(); // Delete the record

        return res.status(200).json({
            message: 'Employment history deleted successfully.'
        });
    } catch (error) {
        console.error('Error deleting employment history:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    DeleteEmploymentHistory
};
