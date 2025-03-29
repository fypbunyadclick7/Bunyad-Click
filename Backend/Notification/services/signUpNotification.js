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
    topic: "notification-topic",
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const data = JSON.parse(message.value.toString());

        const mailOptions = {
          from: `BunyadClick <${process.env.EMAIL}>`, // Ensure this is your email user
          to: data.email,
          subject: "Welcome to Bunyad Click!",
          text: `
          Dear ${data.name},

          We are pleased to inform you that your registration with Bunyad Click has been successfully completed. Thank you for choosing us!

          Verification Code: ${data.otp}

          Thank you for being a part of the Bunyad Click community. We look forward to serving you!

          Best regards,
          Bunyad Click
                    `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Notification sent to ${data.email}`);
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    },
  });
}

startNotificationService().catch(console.error);
