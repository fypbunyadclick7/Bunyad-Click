const Profile = require('../models/Profile'); // Update the path as needed

const AddSellerProfile = async (req, res) => {
  const { userId} = req.params;

  try {
    // Validate required fields
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'UserId is required.',
      });
    }

    // Create a new profile
    const newProfile = await Profile.create({
      UserId: userId
    });

    return res.status(201).json({
      success: true,
      message: 'Seller profile created successfully.',
      data: newProfile,
    });
  } catch (error) {
    console.error('Error creating seller profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create seller profile.',
      error: error.message,
    });
  }
};

module.exports = {
    AddSellerProfile,
};
