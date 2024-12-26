const User = require('../models/Users'); // Path to your User model

// Controller to check if a user exists by ID and return full details
const IsUser = async (req, res) => {
  const { id } = req.params; // Get the ID from the route parameter

  try {
    // Check if a user with the given ID exists
    const user = await User.findOne({
      where: { Id: id },
      attributes: { exclude: ['Password'] }, // Exclude the password field
    });

    if (user) {
      return res.status(200).json({
        success: true,
        message: 'User exists',
        user: user, // Return the user object without the password
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'User does not exist',
      });
    }
  } catch (error) {
    console.error('Error checking user existence:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while checking user existence',
    });
  }
};

module.exports = { IsUser };
