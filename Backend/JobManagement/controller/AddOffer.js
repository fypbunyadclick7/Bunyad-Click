const Offer = require('../models/Offers');  // Import the Offer model

// Controller to add a new offer
exports.AddOffer = async (req, res) => {
  const { JobId, Description, DeliveryDays, Price, Revisions, ExpiryDays } = req.body;

  try {
    // Create a new offer in the database
    const offer = await Offer.create({
      JobId,
      Description,
      DeliveryDays,
      Price,
      Revisions,
      ExpiryDays,
    });

    // Return the created offer as a response
    res.status(201).json({
      success: true,
      message: 'Offer created successfully!',
      offer: offer,
    });
  } catch (error) {
    console.error('Error adding offer:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};
