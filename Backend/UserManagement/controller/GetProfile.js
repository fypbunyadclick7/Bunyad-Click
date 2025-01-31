const axios = require('axios'); // Import axios for HTTP requests
const Profile = require('../models/Profile');
const Skills = require('../models/Skills');
const Language = require('../models/Languages');
const Education = require('../models/Education');
const EmploymentHistory = require('../models/EmploymentHistory');
const Project = require('../models/Projects');

// Controller to get profile details
const GetProfile = async (req, res) => {
    const { id } = req.params; // Get user ID from request parameters

    try {
        // Check if the user exists via the Auth service
        const authServiceUrl = `${process.env.GATEWAY_URI}/api/v1/auth/isUser/${id}`;
        const response = await axios.get(authServiceUrl, {
            headers: {
                'api-key': `${process.env.GATEWAY_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        // If the user does not exist
        if (!response.data.success) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Fetch profile data
        const profileData = await Profile.findOne({
            where: { UserId: id },
            attributes: ['Id', 'Title', 'Description', 'Visibility'],
        });

        // Fetch skills data
        const skillsData = await Skills.findAll({
            where: { UserId: id },
            attributes: ['Id', 'Title'],
        });

        // Fetch languages data
        const languagesData = await Language.findAll({
            where: { UserId: id },
            attributes: ['Id', 'Title', 'Progress'],
        });

        // Fetch education data
        const educationData = await Education.findAll({
            where: { UserId: id },
            attributes: ['Id', 'Title', 'Description', 'StartDate', 'EndDate', 'SchoolName'],
        });

        // Fetch employment history data
        const employmentHistoryData = await EmploymentHistory.findAll({
            where: { UserId: id },
            attributes: ['Id', 'Title', 'Company', 'Country', 'City', 'StartDate', 'EndDate', 'Description'],
        });

        // Fetch project data
        const projectData = await Project.findAll({
            where: { UserId: id },
            attributes: ['Id', 'Title', 'Description', 'Image1', 'Image2', 'Image3', 'Status', 'CreatedAt', 'UpdatedAt'],
        });

        // Combine all the fetched data into a single object to send as a response
        const userProfile = {
            Id: response.data.user.Id, // Include user data here
            Name: response.data.user.Name, // Include user data here
            Email: response.data.user.Email, // Include user data here
            PhoneNumber: response.data.user.PhoneNumber, // Include user data here
            Country: response.data.user.Country, // Include user data here
            State: response.data.user.State, // Include user data here
            City: response.data.user.City, // Include user data here
            AboutMe: response.data.user.AboutMe, // Include user data here
            Image: response.data.user.Image, // Include user data here
            Profile: profileData,
            Skills: skillsData,
            Languages: languagesData,
            Education: educationData,
            EmploymentHistories: employmentHistoryData,
            Projects: projectData,
        };

        // Return the combined data as the response
        return res.status(200).json(userProfile);
    } catch (error) {
        console.error('Error fetching profile details:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    GetProfile
};
