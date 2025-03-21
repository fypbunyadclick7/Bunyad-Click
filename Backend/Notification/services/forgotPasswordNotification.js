const { Kafka } = require("kafkajs");
const { transporter } = require("../utils/nodemailer");

const kafka = new Kafka({
  clientId: "notification-service",
  brokers: ["localhost:9092"],
});
const consumer = kafka.consumer({ groupId: "notification-group" });

async function startNotificationService() {
  await consumer.connect();
  await consumer.subscribe({
    topic: "forgot-password-notification",
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const data = JSON.parse(message.value.toString());

        const mailOptions = {
          from: `BunyadClick <${process.env.EMAIL}>`, // Ensure this is your email user
          to: data.email,
          subject: 'Password Reset Request - Bunyad Click',
            html: `
                <p>Dear ${data.name},</p>
                <p>We received a request to reset the password for your account associated with this email address on <b>Bunyad Click</b>.</p>
                <p>To proceed with resetting your password, please use the following One-Time Password (OTP):</p>
                <h2>${data.otp}</h2>
                <p>This OTP is valid for the next 10 minutes. If you did not request a password reset, please ignore this email. Your account remains secure, and no changes have been made.</p>
                <p>If you encounter any issues or require further assistance, please feel free to contact our support team.</p>
                <br>
                <p>Best regards,</p>
                <p><b>Bunyad Click Support Team</b></p>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Forgot Notification sent to ${data.email}`);
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    },
  });
}

startNotificationService().catch(console.error);
