const axios = require('axios');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { getIO } = require('../utils/socket'); // Import Socket.IO instance

// Fetches all conversations for a specific user and includes unread message counts and other participant info
exports.GetConversations = async (req, res) => {
  const userId = req.params.userId.toString();  // Convert userId to string
  const searchQuery = req.query.search ? req.query.search.trim().toLowerCase() : '';   // Get search query parameter (default to empty string if not provided)

  try {
    // Fetch conversations where the user is a participant
    const conversations = await Conversation.find({
      participants: userId,
    })
      .sort({ lastMessageTime: -1 }) // Sort by lastMessageTime, descending
      .lean(); // Using lean to get plain JavaScript objects instead of Mongoose documents

    // For each conversation, fetch the unread message count and other participant details
    const conversationsWithDetails = await Promise.all(conversations.map(async (conversation) => {
      // Exclude the current userId to get the other participant(s)
      const otherParticipants = conversation.participants.filter(participant => participant.toString() !== userId);

      // Assuming there is only one other participant (if it's a 1:1 conversation)
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

      // If a search query is provided, filter based on the other participant's name
      if (searchQuery && !otherUser.Name.toLowerCase().includes(searchQuery)) {
        return null; // Skip this conversation if the other participant's name doesn't match the search query
      }

      // Fetch unread message count for this conversation
      const unreadCount = await Message.countDocuments({
        conversationId: conversation._id,
        readBy: { $nin: [userId] }, // Messages that the user has not read
      });

      return {
        ...conversation,
        unreadCount,
        otherParticipant: {
          name: otherUser.Name,
          profilePic: otherUser.Image,
        },
      };
    }));

    // Remove null conversations (those that don't match the search query)
    const filteredConversations = conversationsWithDetails.filter(conversation => conversation !== null);

    // Emit event via Socket.IO to the user that the conversations were fetched
    getIO().to(userId).emit('conversationsFetched', {
      success: true,
      conversations: filteredConversations,
    });

    // Return the conversations with user details and unread counts
    res.status(200).json({
      success: true,
      conversations: filteredConversations,
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};
