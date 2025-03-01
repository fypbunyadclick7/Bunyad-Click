const Category = require('../models/Category');  // Import the Category model
const SubCategory = require('../models/SubCategory');  // Import the SubCategory model

const GetCategories = async (req, res) => {
    try {
        // Fetch all categories along with their associated subcategories where Status is Active
        const categories = await Category.findAll({
            include: [{
                model: SubCategory,
                as: 'SubCategories', // Use the alias defined in the association
                // where: { Status: 'Active' }, // Filter subcategories by 'Active' status
                attributes: ['Id', 'Title', 'CreatedAt', 'UpdatedAt', 'Status']
            }],
            attributes: ['Id', 'Title', 'CreatedAt', 'UpdatedAt', 'Status']
            // ,where: { Status: 'Active' } // Filter categories by 'Active' status
        });

        // Check if categories exist
        if (!categories || categories.length === 0) {
            return res.status(404).json({ message: 'No active categories or subcategories found.' });
        }

        // Return the categories along with their active subcategories
        return res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching active categories with active subcategories:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    GetCategories
};
