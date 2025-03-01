const Offer = require('../models/Offers'); // Import the Offer model

// Controller to fetch an offer by its ID
exports.GetOffer = async (req, res) => {
  const { id } = req.params; // Get the ID from the request parameters

  try {
    // Find the offer by its ID
    const offer = await Offer.findByPk(id);

    // Check if the offer exists
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found',
      });
    }

    // Return the offer details
    res.status(200).json({
      success: true,
      message: 'Offer retrieved successfully',
      data: offer,
    });
  } catch (error) {
    console.error('Error fetching offer:', error);

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};
