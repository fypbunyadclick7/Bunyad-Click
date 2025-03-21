const { Kafka } = require("kafkajs");
const { transporter } = require("../utils/nodemailer");

const kafka = new Kafka({
  clientId: "email-service",
  brokers: ["localhost:9092"],
});
const consumer = kafka.consumer({ groupId: "email-group" });

async function genericEmailService() {
  await consumer.connect();
  await consumer.subscribe({
    topic: "generic-email-notification",
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const data = JSON.parse(message.value.toString());

        // Destructure data to extract dynamic fields
        const { to, subject, body } = data;

        const mailOptions = {
          from: `BunyadClick <${process.env.EMAIL}>`, // Ensure this is your email user
          to, // Recipient's email address
          subject, // Dynamic email subject
          text: body, // Dynamic email body
        };

        // Send email using nodemailer transporter
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to} with subject: ${subject}`);
      } catch (error) {
        console.error("Error sending email notification:", error);
      }
    },
  });
}

// Start the generic email service
genericEmailService().catch(console.error);