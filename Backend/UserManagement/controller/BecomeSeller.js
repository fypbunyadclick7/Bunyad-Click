const { sequelize } = require('../utils/database');
const { Kafka } = require("kafkajs"); // Kafka client for publishing messages
const Profile = require('../models/Profile');
const Skills = require('../models/Skills');
const axios = require('axios'); // For communicating with the Auth Service

// Kafka configuration
const kafka = new Kafka({
  clientId: "user-service",
  brokers: [process.env.KAFKA_URI], // Replace with actual Kafka brokers
});
const producer = kafka.producer();

async function BecomeSeller(req, res) {
  const { userId, title, description, skills } = req.body;

  // Input validation
  if (!userId || !title || !description || !skills || skills.length < 5 || skills.length > 15) {
    return res.status(400).json({ message: 'Invalid input. Please ensure all fields are correct.' });
  }

  // Check if the user is already a seller
  try {
    const existingProfile = await Profile.findOne({ where: { UserId: userId } });
    if (existingProfile) {
      return res.status(409).json({ message: 'User is already a seller.' });
    }
  } catch (error) {
    console.error('Error checking for existing profile:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }

  // Begin a transaction to ensure atomic operations
  const transaction = await sequelize.transaction();

  try {
    // Call Auth Service to update user role to seller
    const authResponse = await axios.put(
      `${process.env.GATEWAY_URI}/api/v1/auth/updateUserToSeller`,
      {
        userId,
        image: req.body.image, // Assuming image is part of the request
      },
      {
        headers: {
          'api-key': `${process.env.GATEWAY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(authResponse.data)

    if (authResponse.status !== 200) {
      throw new Error('Failed to update user in Auth Service');
    }

    // Create profile
    const profile = await Profile.create(
      {
        UserId: userId,
        Title: title,
        Description: description,
        Visibility: 'Public',
      },
      { transaction }
    );

    // Add skills
    const skillsData = skills.map(skill => ({
      UserId: userId,
      Title: skill,
    }));

    await Skills.bulkCreate(skillsData, { transaction });

    // Publish the message to Kafka for the notification service
    await producer.connect();
    await producer.send({
      topic: "become-seller-notification", // Kafka topic name
      messages: [
        {
          value: JSON.stringify({
            email: authResponse.data.email, // Adjust if `authResponse` has `data`
            name: authResponse.data.name,
          }),
        },
      ],
    });

    // Commit the transaction if everything is successful
    await transaction.commit();

    return res.status(201).json({ message: 'Profile and skills added successfully.' });
  } catch (error) {
    console.error('Error adding profile and skills:', error);

    // Rollback the transaction in case of error
    await transaction.rollback();

    return res.status(500).json({ message: 'Internal server error.' });
  }
}

module.exports = {
  BecomeSeller,
};
