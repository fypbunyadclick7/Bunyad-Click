const { getIO } = require('../utils/socket'); // Import getIO for Socket.IO instance
const Conversation = require('../models/Conversation');
const axios = require('axios');

exports.StartConversation = async (req, res) => {
  const { participants } = req.body;

  // Validate input
  if (!participants || participants.length < 2) {
    return res.status(400).json({ message: 'A conversation must have at least two participants.' });
  }

  try {
    // Check if all participants exist using the Auth service
    for (const id of participants) {
      const authServiceUrl = `${process.env.GATEWAY_URI}/api/v1/auth/isUser/${id}`;
      const response = await axios.get(authServiceUrl, {
        headers: {
          'api-key': `${process.env.GATEWAY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.data.success) {
        return res.status(404).json({ message: `User with ID ${id} not found.` });
      }
    }

    // Check if a conversation with the same participants already exists
    const existingConversation = await Conversation.findOne({
      participants: { $all: participants, $size: participants.length },
    });

    if (existingConversation) {
      return res.status(200).json({
        message: 'Conversation already exists.',
        conversation: existingConversation,
      });
    }

    // Create a new conversation
    const newConversation = new Conversation({
      participants,
    });

    await newConversation.save();

    // Emit 'joinRoom' event to each participant using Socket.IO
    const io = getIO();
    participants.forEach((userId) => {
      io.to(userId).emit('joinRoom', {
        conversationId: newConversation._id,
      });
    });

    return res.status(201).json({
      message: 'Conversation started successfully.',
      conversation: newConversation,
    });
  } catch (err) {
    console.error('Error starting conversation:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
