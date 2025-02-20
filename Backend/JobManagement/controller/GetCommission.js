const Commission = require('../models/Commission'); // Import the Commission model

// Controller to get the commission percentage by role
exports.GetCommission = async (req, res) => {
  const { role } = req.params;  // Extract the role from the URL parameters

  try {
    // Fetch commission record for the given role
    const commission = await Commission.findOne({ Role: role });

    if (!commission) {
      return res.status(404).json({ message: `Commission not found for role: ${role}` });
    }

    // Return the commission percentage
    res.status(200).json({
      success: true,
      role: commission.Role,
      percent: commission.Percent,
    });
  } catch (error) {
    console.error('Error fetching commission:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};
