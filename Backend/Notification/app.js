const express = require('express');
const { startSignUpNotification } = require('./services/signUpNotification');
const { resendOTPNotification } = require('./services/resendOTPNotification');
const { forgotPasswordNotification } = require('./services/forgotPasswordNotification');
const { becomeSellerNotification } = require('./services/becomeSellerNotification');
const { genericEmailService } = require('./services/genericEmailService');
require("dotenv").config();

const app = express();

// Middleware setup
app.use(express.json());

// Export the app for external usage
module.exports = app;

// Start notification service when the app runs independently
if (require.main === module) {
    const PORT = process.env.PORT || 4002;

    app.listen(PORT, async () => {
        console.log(`Server running on port ${PORT}`);
        
        // Start the notification service
        try {
            await startSignUpNotification();
            await resendOTPNotification();
            await forgotPasswordNotification();
            await becomeSellerNotification();
            await genericEmailService();
            console.log('Notification service started successfully');
        } catch (error) {
            console.error('Error starting notification service:', error);
        }
    });
}
