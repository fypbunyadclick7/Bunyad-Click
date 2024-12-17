const { Kafka } = require('kafkajs');
const crypto = require('crypto');
const User = require('../models/Users'); // Assuming User model is defined in models folder

// Kafka Producer Setup
const kafka = new Kafka({
    clientId: 'auth-service',
    brokers: [process.env.KAFKA_URI], // Your Kafka broker URL
});

const producer = kafka.producer();

// Function to send OTP message to Kafka
async function sendOtpToKafka(userEmail, userName, otp) {
    await producer.connect();
    await producer.send({
        topic: 'otp-notification', // Kafka topic
        messages: [
            {
                value: JSON.stringify({
                    userEmail,
                    userName,
                    otp
                })
            }
        ]
    });
}

// Function to resend OTP
async function ResendOtp(req, res) {
    const { id } = req.params; // Get user ID from params

    try {
        // Find the user by ID
        const user = await User.findOne({ where: { Id: id } });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Generate a new 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash the OTP using SHA-256
        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

        // Save the hashed OTP in the database
        user.HashedOtp = hashedOtp;
        await user.save();

        // Send OTP email message to Kafka
        await sendOtpToKafka(user.Email, user.Name, otp);

        // Return success response with the new hashed OTP
        return res.status(200).json({
            message: 'OTP has been resent successfully.',
            newHashedOtp: hashedOtp, // Send the new hashed OTP back
        });
    } catch (error) {
        console.error('Error resending OTP:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

// Export the AuthController functions
module.exports = {
    ResendOtp,
};
