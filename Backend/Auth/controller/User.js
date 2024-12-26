const User = require("../models/Users"); // Import the User model
const { Op } = require("sequelize");

// Get all users
const GetUsers = async (req, res) => {
  try {
    // Fetch users with role 'Seller' or 'Buyer'
    const users = await User.findAll({
      where: {
        Role: {
          // Sequelize Op.in is used to match one of the values
          [Op.in]: ["Seller", "Buyer"],
        },
      },
      attributes: [
        "Id",
        "Name",
        "Email",
        "PhoneNumber",
        "Country",
        "State",
        "City",
        "Role",
        "Active",
        "Image",
        "AboutMe",
      ],
    });

    // Check if users exist
    if (!users || users.length === 0) {
      return res
        .status(404)
        .json({ message: "No users found with role Seller or Buyer." });
    }

    // Return the users
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Toggle user status (Active/Inactive)
const ToggleStatus = async (req, res) => {
  const { id } = req.params; // Get user ID from request parameters

  try {
    // Fetch user by ID
    const user = await User.findOne({ where: { Id: id } });

    // If user not found
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Toggle the Active status (from true to false or false to true)
    const updatedStatus = user.Active ? false : true;
    user.Active = updatedStatus;

    // Save the updated status to the database
    await user.save();

    // Return success message
    return res.status(200).json({
      message: `User status updated to ${
        updatedStatus ? "Active" : "Inactive"
      }.`,
      data: { Id: user.Id, Active: user.Active },
    });
  } catch (error) {
    console.error("Error toggling user status:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  GetUsers,
  ToggleStatus,
};
