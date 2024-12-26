const Users = require('../models/Users');  // Import the Users model

// Controller to update user data directly in the Users table
const UpdateUser = async (req, res) => {
    const { id } = req.params; // Get user ID from request parameters
    const { Name, PhoneNumber, Country, State, City, AboutMe, Image } = req.body;

    try {
        // Prepare the data to update for the user table
        const userUpdateData = {};

        // Update only the fields that are present in the request body
        if (Name) userUpdateData.Name = Name;
        if (PhoneNumber) userUpdateData.PhoneNumber = PhoneNumber;
        if (Country) userUpdateData.Country = Country;
        if (State) userUpdateData.State = State;
        if (City) userUpdateData.City = City;
        if (AboutMe) userUpdateData.AboutMe = AboutMe;
        if (Image) userUpdateData.Image = Image;

        // Find and update the user record directly in the database using Sequelize
        const [updatedRows] = await Users.update(userUpdateData, {
            where: { Id: id }, // Update where the user ID matches
        });

        // If no rows are updated, the user was not found
        // if (updatedRows === 0) {
        //     return res.status(404).json({ success: false, message: 'User not found.' });
        // }

        // Return a success message
        return res.status(200).json({ success: true, message: 'User data updated successfully.' });
    } catch (error) {
        console.error('Error updating user data in the database:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

module.exports = {
    UpdateUser
};
