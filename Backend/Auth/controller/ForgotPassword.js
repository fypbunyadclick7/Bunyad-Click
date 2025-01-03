const crypto = require('crypto'); // For generating OTP
const  User  = require('../models/Users'); // Import your User model
const { Kafka } = require('kafkajs');

// Kafka Producer Setup
const kafka = new Kafka({
    clientId: 'auth-service',
    brokers: [process.env.KAFKA_URI], // Your Kafka broker URL
});

const producer = kafka.producer();


// Controller for forgot password
const ForgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return res.status(404).json({ message: 'Email not found' });
        }

        // Check if the user is active
        if (!user.Active) {
            return res.status(403).json({ message: 'Your account is not active. Please verify your email or contact support.' });
        }

        // Generate OTP (6-digit numeric)
        const otp = crypto.randomInt(100000, 999999).toString();
        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex'); // Hash the OTP using SHA-256

        // Publish the message to Kafka for the notification service
        await producer.connect();
        await producer.send({
        topic: "forgot-password-notification", // Kafka topic name
        messages: [
            {
            value: JSON.stringify({
                email: user.Email,
                name: user.Name,
                otp: otp,
            }),
            },
        ],
        });

        // Return the response with the hashed OTP and user ID
        return res.status(200).json({
            message: 'OTP sent to your email. Please check your inbox.',
            userId: user.Id,
            hashedOtp: hashedOtp // Send hashed OTP to client
        });

    } catch (error) {
        console.error('Error in forgot password:', error);
        return res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

module.exports = { ForgotPassword };
