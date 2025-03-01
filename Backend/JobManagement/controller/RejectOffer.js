const Offer = require('../models/Offers'); // Import the Offer model

// Controller to reject an offer
exports.RejectOffer = async (req, res) => {
  const { id } = req.params; // Get the Offer ID from the request parameters

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

    // Update the status of the offer to "Rejected"
    offer.Status = 'Rejected';
    await offer.save();

    // Return the updated offer
    res.status(200).json({
      success: true,
      message: 'Offer rejected successfully',
      data: offer,
    });
  } catch (error) {
    console.error('Error rejecting offer:', error);

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};
