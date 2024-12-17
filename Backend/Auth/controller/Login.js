const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/Users'); // Assuming the User model is in the models folder

// Secret key for JWT signing (use a secure key and store it in environment variables)
const JWT_SECRET = process.env.JWT_SECRET;

// Login Controller
async function Login(req, res) {
    const { email, password } = req.body; // Email and password from the request body

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // Check if the user exists in the database
        const user = await User.findOne({ where: { Email: email } });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check if the user is active
        if (!user.Active) {
            return res.status(403).json({ message: 'Your account is not active. Please verify your email or contact support.' });
        }

        // Hash the provided password with sha256
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        // Compare the hashed password with the stored hashed password
        if (hashedPassword !== user.Password) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: user.Id,
                name: user.Name,
                email: user.Email,
                role: user.Role,
                image: user.Image // Assuming Image field exists in your User model
            },
            JWT_SECRET,
            { expiresIn: '1h' } // Token valid for 1 hour
        );

        // Return success response with user details and token
        return res.status(200).json({
            message: 'Login Successfully',
            user: {
                id: user.Id,
                name: user.Name,
                email: user.Email,
                role: user.Role,
                image: user.Image
            },
            token: token // JSON Web Token
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

module.exports = {
    Login,
};
