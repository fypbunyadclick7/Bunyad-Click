const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversationSchema = new Schema(
    {
        participants: [
            {
                type: String,
                required: true,
            },
        ],
        lastMessage: {
            type: String,
            default: null,
        },
        lastMessageTime: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true } // Automatically add createdAt and updatedAt fields
);

const Conversation = mongoose.model('Conversation', conversationSchema);
module.exports = Conversation;
