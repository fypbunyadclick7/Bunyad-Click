const axios = require('axios'); // Import axios for HTTP requests

// Controller to get profile details with jobs
const GetBuyerProfileWithJobs = async (req, res) => {
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

        

        // Fetch jobs (completed jobs, assigned jobs, bids placed) from the jobs service
        const jobServiceUrl = `${process.env.GATEWAY_URI}/api/v1/job/getBuyerProfileJobs/${id}`;
        const jobResponse = await axios.get(jobServiceUrl, {
            headers: {
                'api-key': `${process.env.GATEWAY_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        // If the job data is not found
        if (!jobResponse.data.success) {
            return res.status(404).json({ message: 'Jobs data not found.' });
        }

        // Prepare the final response
        const userProfile = {
            Id: response.data.user.Id,
            Name: response.data.user.Name,
            Email: response.data.user.Email,
            PhoneNumber: response.data.user.PhoneNumber,
            Country: response.data.user.Country,
            State: response.data.user.State,
            City: response.data.user.City,
            AboutMe: response.data.user.AboutMe,
            Image: response.data.user.Image,
            Jobs: {
                CompletedJobs: jobResponse.data.CompletedJobs || [],
                AssignedJobs: jobResponse.data.AssignedJobs || [],
                ActiveJobs: jobResponse.data.ActiveJobs || [],
            },
        };

        // Return the combined data as the response
        return res.status(200).json(userProfile);
    } catch (error) {
        console.error('Error fetching profile details with jobs:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    GetBuyerProfileWithJobs
};
