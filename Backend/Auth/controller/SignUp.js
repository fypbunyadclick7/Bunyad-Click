const { Kafka } = require("kafkajs"); // Kafka client for publishing messages
const User = require("../models/Users"); // User model
const crypto = require("crypto"); // For hashing
const { Sequelize } = require("sequelize"); // Sequelize to handle transactions

// Kafka configuration
const kafka = new Kafka({
  clientId: "auth-service",
  brokers: [process.env.KAFKA_URI], // Replace with actual Kafka brokers
}); 
const producer = kafka.producer();

async function SignUp(req, res) {
  const { name, email, password, phonenumber, country, state, city, role } =
    req.body;

  if (
    !name ||
    !email ||
    !password ||
    !phonenumber ||
    !country ||
    !state ||
    !city ||
    !role
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const transaction = await User.sequelize.transaction(); // Start transaction

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ where: { Email: email }, transaction });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    // Hash the password using SHA256
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create the new user
    const newUser = await User.create(
      {
        Name: name,
        Email: email,
        Password: hashedPassword,
        PhoneNumber: phonenumber,
        Country: country,
        State: state,
        City: city,
        Role: role,
        Active: false,
      },
      { transaction }
    );

    // Publish the message to Kafka for the notification service
    await producer.connect();
    await producer.send({
      topic: "notification-topic", // Kafka topic name
      messages: [
        {
          value: JSON.stringify({
            email: email,
            name: name,
            otp: otp,
          }),
        },
      ],
    });

    // Commit the transaction if all operations succeed
    await transaction.commit();

    // Send response
    return res.status(201).json({
      message: "User registered successfully. Please verify your email.",
      user: {
        id: newUser.Id,
        name: newUser.Name,
        email: newUser.Email,
        role: newUser.Role,
        active: newUser.Active,
      },
    });
  } catch (error) {
    // Rollback transaction if an error occurs
    await transaction.rollback();

    console.error("Error during signup:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

module.exports = {
  SignUp,
};
