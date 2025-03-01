const SubCategory = require('../models/SubCategory'); // Import SubCategory model

const AddSubCategory = async (req, res) => {
    const { CategoryId, Title } = req.body; // Get CategoryId, Title, and Status from the request body

    try {
        // Create a new subcategory entry in the database
        const subCategory = await SubCategory.create({
            CategoryId,
            Title
        });

        return res.status(201).json({
            success: true,
            message: 'SubCategory added successfully.',
            data: subCategory
        });
    } catch (error) {
        console.error('Error adding subcategory:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

const UpdateSubCategory = async (req, res) => {
    const { id } = req.params; // Get SubCategory ID from request parameters
    const { Title } = req.body; // Get updated Title and Status from the request body

    try {
        // Find the subcategory by ID
        const subCategory = await SubCategory.findOne({ where: { Id: id } });

        if (!subCategory) {
            return res.status(404).json({ success: false, message: 'SubCategory not found.' });
        }

        // Update subcategory details
        subCategory.Title = Title || subCategory.Title;

        // Save the updated subcategory
        await subCategory.save();

        return res.status(200).json({
            success: true,
            message: 'SubCategory updated successfully.',
            data: subCategory
        });
    } catch (error) {
        console.error('Error updating subcategory:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

const ToggleStatus = async (req, res) => {
    const { id } = req.params; // Get SubCategory ID from request parameters

    try {
        // Find the subcategory by ID
        const subCategory = await SubCategory.findOne({ where: { Id: id } });

        if (!subCategory) {
            return res.status(404).json({ success: false, message: 'SubCategory not found.' });
        }

        // Toggle the subcategory status
        subCategory.Status = subCategory.Status === 'Active' ? 'Inactive' : 'Active';

        // Save the updated subcategory status
        await subCategory.save();

        return res.status(200).json({
            success: true,
            message: `SubCategory status updated to ${subCategory.Status}.`,
            data: subCategory
        });
    } catch (error) {
        console.error('Error toggling subcategory status:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};


module.exports = {
    AddSubCategory,
    UpdateSubCategory,
    ToggleStatus
};
