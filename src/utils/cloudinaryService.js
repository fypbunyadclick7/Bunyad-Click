import axios from 'axios';

// Function to upload image to Cloudinary
export const uploadToCloudinary = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', 'BunyadClick_images'); // Replace with your Cloudinary upload preset

    const response = await axios.post(
      'https://api.cloudinary.com/v1_1/dp2uikrdw/image/upload', // Replace 'your_cloud_name' with actual Cloudinary cloud name
      formData
    );

    // Return the secure URL of the uploaded image
    return response.data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};
