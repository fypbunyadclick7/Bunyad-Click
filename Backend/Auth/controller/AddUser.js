const User = require("../models/Users"); // Adjust the path as needed
const axios = require("axios");
const crypto = require("crypto");
const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "user-service",
  brokers: [process.env.KAFKA_URI],
});
const producer = kafka.producer();

const generateRandomPassword = () => {
  return crypto.randomBytes(12).toString("base64"); // Generates a 16-character strong password
};

const hashPassword = (password) => {
  return crypto.createHash("sha256").update(password).digest("hex"); // SHA-256 hash
};

const AddUser = async (req, res) => {
  const {
    name,
    email,
    phoneNumber,
    country,
    state,
    city,
    role,
    aboutMe,
    image,
  } = req.body;

  try {
    // Validate required fields
    if (!name || !email || !phoneNumber || !country || !state || !city) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided.",
      });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ where: { Email: email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists.",
      });
    }

    // Generate a random password and hash it
    const randomPassword = generateRandomPassword();
    const hashedPassword = hashPassword(randomPassword);

    // Create the user
    const newUser = await User.create({
      Name: name,
      Email: email,
      Password: hashedPassword,
      PhoneNumber: phoneNumber,
      Country: country,
      State: state,
      City: city,
      Role: role || "Buyer",
      AboutMe: aboutMe || null,
      Image: image || null,
    });

    console.log(process.env.GATEWAY_URI, process.env.GATEWAY_API_KEY);

    // If the user is a Seller, add a seller profile
    if (role === "Seller") {
      const authServiceUrl = `${process.env.GATEWAY_URI}/api/v1/user/addSellerProfile/${newUser.Id}`;
      await axios.post(
        authServiceUrl,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": `${process.env.GATEWAY_API_KEY}`,
          },
        }
      );
    }

    // Send a congratulatory email with Kafka
    await producer.connect();
    await producer.send({
      topic: "generic-email-notification",
      messages: [
        {
          value: JSON.stringify({
            to: email,
            subject: "Welcome to Bunyad Click!",
            body: `Dear ${name},\n\nWe are excited to welcome you to Bunyad Click!\n\nHere is your temporary password: ${randomPassword}\n\nPlease log in and change your password as soon as possible.\n\nThank you for joining us!\n\nBest regards,\nThe Bunyad Click Team`,
          }),
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      data: { Id: newUser.Id },
    });
  } catch (error) {
    console.error("Error adding user:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the user.",
    });
  } finally {
    await producer.disconnect();
  }
};

module.exports = { AddUser };
