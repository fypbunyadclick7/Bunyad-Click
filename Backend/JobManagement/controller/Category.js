const Category = require('../models/Category'); // Adjust path if needed

const AddCategory = async (req, res) => {
    const { Title} = req.body; // Get the title and status from the request body

    try {
        // Create a new category entry in the database
        const category = await Category.create({
            Title
        });

        return res.status(201).json({
            success: true,
            message: 'Category added successfully.',
            data: category
        });
    } catch (error) {
        console.error('Error adding category:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

const UpdateCategory = async (req, res) => {
    const { id } = req.params; // Get category ID from request parameters
    const { Title } = req.body; // Get updated title and status from the request body

    try {
        // Find the category to update
        const category = await Category.findOne({ where: { Id: id } });

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found.' });
        }

        // Update category details
        category.Title = Title || category.Title;

        // Save the updated category
        await category.save();

        return res.status(200).json({
            success: true,
            message: 'Category updated successfully.',
            data: category
        });
    } catch (error) {
        console.error('Error updating category:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

const ToggleStatus = async (req, res) => {
    const { id } = req.params; // Get category ID from request parameters

    try {
        // Find the category by ID
        const category = await Category.findOne({ where: { Id: id } });

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found.' });
        }

        // Toggle the category status
        category.Status = category.Status === 'Active' ? 'Inactive' : 'Active';

        // Save the updated category status
        await category.save();

        return res.status(200).json({
            success: true,
            message: `Category status updated to ${category.Status}.`,
            data: category
        });
    } catch (error) {
        console.error('Error toggling category status:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};


module.exports = {
    AddCategory,
    UpdateCategory,
    ToggleStatus
};
