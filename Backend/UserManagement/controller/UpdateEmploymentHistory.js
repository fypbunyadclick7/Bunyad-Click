const EmploymentHistory = require('../models/EmploymentHistory'); // Import the EmploymentHistory model

// Controller to update employment history
const UpdateEmploymentHistory = async (req, res) => {
    const { id } = req.params; // Get employment history ID from request params
    const { title, company, country, city, startDate, endDate, description } = req.body;

    try {
        const employmentHistory = await EmploymentHistory.findByPk(id);
        
        if (!employmentHistory) {
            return res.status(404).json({ message: 'Employment history record not found.' });
        }

        // Update only the fields that are provided
        employmentHistory.Title = title !== undefined ? title : employmentHistory.Title;
        employmentHistory.Company = company !== undefined ? company : employmentHistory.Company;
        employmentHistory.Country = country !== undefined ? country : employmentHistory.Country;
        employmentHistory.City = city !== undefined ? city : employmentHistory.City;
        employmentHistory.StartDate = startDate !== undefined ? startDate : employmentHistory.StartDate;
        employmentHistory.EndDate = endDate !== undefined ? endDate : employmentHistory.EndDate;
        employmentHistory.Description = description !== undefined ? description : employmentHistory.Description;

        await employmentHistory.save();

        return res.status(200).json({
            message: 'Employment history updated successfully.',
            employmentHistory,
        });
    } catch (error) {
        console.error('Error updating employment history:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    UpdateEmploymentHistory
};
