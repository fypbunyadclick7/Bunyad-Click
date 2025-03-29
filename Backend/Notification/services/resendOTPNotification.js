const { Kafka } = require('kafkajs');
const { transporter } = require("../utils/nodemailer"); // Nodemailer configuration

// Kafka Consumer Setup
const kafka = new Kafka({
    clientId: 'notification-service',
    brokers: ['localhost:9092'], // Your Kafka broker URL
});

const consumer = kafka.consumer({ groupId: 'notification-group' });

// Function to start the consumer
async function resendOTPNotification() {
    await consumer.connect();
    await consumer.subscribe({ topic: 'otp-notification', fromBeginning: true, });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            // Parse the Kafka message
            const { userEmail, userName, otp } = JSON.parse(message.value.toString());

            try {
                // Set up the mail options
                const mailOptions = {
                    from: `BunyadClick <${process.env.EMAIL}>`, 
                    to: userEmail,
                    subject: 'Your New OTP Code',
                    text: `Dear ${userName},\n\nYour new OTP code is: ${otp}\n\nThank you.`,
                };
        
                // Send the OTP email
                await transporter.sendMail(mailOptions);
                console.log(`OTP email sent to ${userEmail}`);
            } catch (error) {
                console.error('Error sending OTP email:', error);
                throw new Error('Error sending OTP email');
            }
        }
    });
}

// Start the Kafka consumer when the server starts
resendOTPNotification().catch(console.error);
