const axios = require("axios"); // Import axios for HTTP requests
const Profile = require("../models/Profile");

// Controller to update profile data
const UpdateProfile = async (req, res) => {
  const { id } = req.params; // Get user ID from request parameters
  const {
    Name,
    PhoneNumber,
    Country,
    State,
    City,
    AboutMe,
    Title,
    Description,
    Image,
  } = req.body; // Get data from the request body

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
    if (Image) userUpdateData.AboutMe = Image;

    // Send request to Auth service to update user data
    const authServiceUrl = `${process.env.GATEWAY_URI}/api/v1/auth/updateUser/${id}`;
    const response = await axios.put(authServiceUrl, userUpdateData, {
      headers: {
        "api-key": `${process.env.GATEWAY_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    // If the user update fails in Auth service
    if (!response.data.success) {
      return res
        .status(400)
        .json({ message: "Failed to update user data in Auth service." });
    }

    // Prepare the data to update for the profile table
    const profileUpdateData = {};

    // Update only the fields that are present in the request body
    if (Title) profileUpdateData.Title = Title;
    if (Description) profileUpdateData.Description = Description;

    // Update the profile data in the Profile table
    const profile = await Profile.findOne({ where: { UserId: id } });

    // If no profile is found, return an error
    if (!profile) {
      return res.status(404).json({ message: "Profile not found." });
    }

    // Update the profile data
    await profile.update(profileUpdateData);

    // Return a success message
    return res
      .status(200)
      .json({ message: "Profile and user data updated successfully." });
  } catch (error) {
    console.error("Error updating profile and user data:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  UpdateProfile,
};
