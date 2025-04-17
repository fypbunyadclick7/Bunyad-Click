const axios = require('axios');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { getIO } = require('../utils/socket'); // Import Socket.IO instance

// Fetches all messages for a specific conversation and marks them as read by the user
exports.GetMessages = async (req, res) => {
  const { userId, conversationId } = req.params;

  try {
    // Fetch the conversation by conversationId
    const conversation = await Conversation.findById(conversationId).lean();

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Exclude the current userId to get the other participant(s)
    const otherParticipants = conversation.participants.filter(participant => participant.toString() !== userId);

    if (otherParticipants.length === 0) {
      return res.status(404).json({ message: 'No other participant found' });
    }

    // Assuming there is only one other participant (1:1 conversation)
    const otherUserId = otherParticipants[0];

    // Fetch details of the other participant
    const otherUserAuthServiceUrl = `${process.env.GATEWAY_URI}/api/v1/auth/isUser/${otherUserId}`;
    const otherUserResponse = await axios.get(otherUserAuthServiceUrl, {
      headers: {
        'api-key': `${process.env.GATEWAY_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const otherUser = otherUserResponse.data.user;

    // Mark all messages as read by the current user
    await Message.updateMany(
      { conversationId, readBy: { $nin: [userId] } }, // Only update if the user hasn't read the message
      { $push: { readBy: userId } } // Add the userId to the readBy field
    );

    // Fetch all messages for the conversation
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 }) // Sort by creation time (ascending)
      .lean();

    // Fetch offer details for messages with an offerId
    const messagesWithOffers = await Promise.all(
      messages.map(async (message) => {
        if (message.offerId) {
          try {
            const authServiceUrl = `${process.env.GATEWAY_URI}/api/v1/job/getOffer/${message.offerId}`;
            const response = await axios.get(authServiceUrl, {
              headers: {
                'api-key': `${process.env.GATEWAY_API_KEY}`,
                'Content-Type': 'application/json',
              },
            });

            // Add offer details to the message
            return {
              ...message,
              offerDetails: response.data.success ? response.data.data : null,
              title: message.sender.toString() === userId ? 'You' : otherUser.Name,
            };
          } catch (offerError) {
            console.error(`Error fetching offer details for offerId ${message.offerId}:`, offerError);
            return {
              ...message,
              offerDetails: null, // If the API call fails, set offerDetails to null
              title: message.sender.toString() === userId ? 'You' : otherUser.Name,
            };
          }
        }

        // For messages without offerId, return as is
        return {
          ...message,
          title: message.sender.toString() === userId ? 'You' : otherUser.Name,
        };
      })
    );

    // Emit an event via Socket.IO to notify the user that the conversation has been opened
    getIO().to(userId).emit('conversationOpened', {
      success: true,
      conversationId,
      messages: messagesWithOffers,
    });

    // Return the formatted messages along with the other participant details
    res.status(200).json({
      success: true,
      conversationId,
      otherParticipant: {
        name: otherUser.Name,
        profilePic: otherUser.Image,
      },
      messages: messagesWithOffers,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};
