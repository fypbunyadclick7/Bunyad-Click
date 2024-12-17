const { sequelize } = require('../../utils/database'); // Database connection
const User = require('../models/Users'); // User model
const Profile = require('../../models/Profile'); // Profile model
const Skills = require('../../models/Skills'); // Skills model
const crypto = require('crypto'); // For password and OTP hashing
const { transporter } = require('../../utils/nodemailer'); // Nodemailer configuration
const { Op } = require('sequelize');

async function SellerSignUp(req, res) {
    const { 
        name, 
        email, 
        password, 
        phonenumber, 
        country, 
        state, 
        city, 
        role, 
        image, 
        title, 
        description, 
        skills // Expecting an array of skills
    } = req.body;

    // Validate input (this can be expanded as per your needs)
    if (!name || !email || !password || !phonenumber || !country || !state || !city || !role || !title || !description || !image) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Validate skills length (must be between 5 and 15)
    if (!skills || skills.length < 5 || skills.length > 15) {
        return res.status(400).json({ message: 'You must provide between 5 and 15 skills.' });
    }

    // Start a transaction to ensure data integrity
    const transaction = await sequelize.transaction();

    try {
        // Check if the email already exists
        const existingUser = await User.findOne({ where: { Email: email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered.' });
        }

        // Hash the password using SHA256
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash the OTP using SHA256
        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

        // Create the new user with hashed password and other required fields
        const newUser = await User.create({
            Name: name,
            Email: email,
            Password: hashedPassword,
            PhoneNumber: phonenumber,
            Country: country,
            State: state,
            City: city,
            Role: role,
            Active: false, // Set to false until email is verified
            Image: image
        }, { transaction });

        // Create the user's profile
        const newProfile = await Profile.create({
            UserId: newUser.Id,
            Title: title,
            Description: description,
            Visibility: 'Public' // Default visibility
        }, { transaction });

        // Create user's skills (bulk insert)
        const skillsData = skills.map(skill => ({
            UserId: newUser.Id,
            Title: skill
        }));

        await Skills.bulkCreate(skillsData, { transaction });

        // Send the verification email with the OTP
        const mailOptions = {
            from: 'Bunyad Click Revolutionizing Construction Procurement',
            to: email,
            subject: 'Welcome to Bunyad Click!',
            text: `
                Dear ${name},

                We are pleased to inform you that your registration with Bunyad Click has been successfully completed. 
                To verify your email address, please use the verification code below:

                Verification Code: ${otp}

                Thank you for being a part of Bunyad Click. We look forward to serving you!

                Best regards,
                Bunyad Click Team
            `,
        };

        await transporter.sendMail(mailOptions);

        // Commit the transaction if everything was successful
        await transaction.commit();

        // Send success response with the hashed OTP (do not send plain OTP)
        return res.status(201).json({ 
            message: 'User registered successfully. Please verify your email.',
            hashedOtp: hashedOtp, // Hashed OTP to store on client-side for verification
            user: {
                id: newUser.Id,
                name: newUser.Name,
                email: newUser.Email,
                role: newUser.Role,
                active: newUser.Active
            }
        });
    } catch (error) {
        console.error('Error creating user:', error);

        // Rollback the transaction in case of error
        await transaction.rollback();

        return res.status(500).json({ message: 'Internal server error.' });
    }
}

module.exports = {
    SellerSignUp,
};
