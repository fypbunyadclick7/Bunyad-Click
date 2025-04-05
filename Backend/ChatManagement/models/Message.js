const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema(
    {
        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Conversation', // Reference to the Conversation model
            required: true,
        },
        sender: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: false,
        },
        attachment: {
            type: String, // URL or file path for the attachment
            required: false, // Optional field
        },
        readBy: [
            {
                type: String,
            },
        ],
        offerId: {
            type: String, // External identifier from another service
            required: false,
        },
    },
    { timestamps: true } // Automatically add createdAt and updatedAt fields
);

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
