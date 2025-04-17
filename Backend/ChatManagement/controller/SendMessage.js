const mongoose = require('mongoose');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const { getIO } = require('../utils/socket'); // Import the socket instance

exports.SendMessage = async (req, res) => {
  const { conversationId, sender, content, attachment } = req.body;

  // Validate input
  if (!conversationId || !sender || (!content && !attachment)) {
    return res
      .status(400)
      .json({ message: 'Conversation ID, sender, and either content or attachment are required.' });
  }

  try {
    // Create the new message object with the additional fields
    const messageData = { conversationId, sender, content };

    // Include attachment if provided
    if (attachment) {
      messageData.attachment = attachment;
    }

    // Initialize the readBy field as an array with the sender (the sender has read the message)
    messageData.readBy = [sender];

    // Create and save the new message
    const message = new Message(messageData);
    await message.save();

    // Update the conversation's last message and timestamp
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: content,
      lastMessageTime: message.createdAt,
    });

    // Emit the new message to all connected clients in the conversation's room
    const io = getIO();
    io.to(conversationId).emit('newMessage', {
      conversationId,
      sender,
      content,
      attachment: message.attachment || null, // Include attachment in the event data
      createdAt: message.createdAt,
    });

    res.status(201).json({ message: 'Message sent successfully.', data: message });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};
