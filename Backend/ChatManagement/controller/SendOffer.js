const axios = require('axios');
const Message = require('../models/Message'); // Import the Message model
const { getIO } = require('../utils/socket'); // Import the Socket.IO instance

// Controller to send an offer
exports.SendOffer = async (req, res) => {
  const {
    JobId,
    Description,
    DeliveryDays,
    Price,
    Revisions,
    ExpiryDays,
    conversationId,
    sender,
  } = req.body;

  try {
    // Call the addOffer endpoint to create the offer
    const authServiceUrl = `${process.env.GATEWAY_URI}/api/v1/job/addOffer`;

    const offerResponse = await axios.post(
      authServiceUrl,
      {
        JobId,
        Description,
        DeliveryDays,
        Price,
        Revisions,
        ExpiryDays,
      },
      {
        headers: {
          'api-key': `${process.env.GATEWAY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Extract the created offer's ID from the response
    const { offer } = offerResponse.data;
    const offerId = offer.Id;

    // Create a new message with the offerId and add sender to readBy
    const newMessage = new Message({
      conversationId,
      sender,
      offerId: offerId.toString(), // Ensure it's stored as a string
      readBy: [sender], // Add sender to the readBy array
    });

    // Save the message to the database
    await newMessage.save();

    // Emit the new message to the client via socket.io
    const io = getIO(); // Get the Socket.IO instance
    io.to(conversationId).emit('newOffer', {
      message: 'A new offer has been sent',
      data: {
        offer,
        message: newMessage,
      },
    });

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Offer sent and message created successfully!',
      data: {
        offer,
        newMessage,
      },
    });
  } catch (error) {
    console.error('Error sending offer:', error);

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};
