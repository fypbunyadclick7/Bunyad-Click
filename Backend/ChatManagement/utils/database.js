const mongoose = require('mongoose'); // Import mongoose

// MongoDB connection URI
const mongoURI = process.env.MONGODB_URI; // Ensure this environment variable is set in your .env file

// Connect to MongoDB
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,      // Use the new MongoDB connection string parser
    useUnifiedTopology: true,   // Use the new topology engine for better performance
  })
  .then(() => {
    console.log('Connected to MongoDB database!');
  })
  .catch((err) => {
    console.error('Unable to connect to the MongoDB database:', err);
  });

module.exports = { mongoose };
