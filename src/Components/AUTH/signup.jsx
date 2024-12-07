import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { CitySelect, CountrySelect, StateSelect } from 'react-country-state-city';
import { Link, useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';
import Spinner from '../spinner'; // Importing Spinner component
import Skills from '../skills'; // Importing Skills component
import { uploadToCloudinary } from '../../utils/cloudinaryService'; // Assuming you have an image upload utility

export default function SignUp() {
  const [loading, setLoading] = useState(false); // Loading state for button spinner
  const [countryid, setCountryid] = useState(0);
  const [stateid, setStateid] = useState(0);
  const [cityid, setCityid] = useState(0);
  const [additionalScreenshot, setAdditionalScreenshot] = useState(null); // For seller profile image
  const [skills, setSkills] = useState([]); // For seller skills
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phonenumber: '',
    country: '',
    state: '',
    city: '',
    role: '', // Role will be set based on cookies
    title: '', // Added title for seller
    description: '' // Added description for seller
  });
  
  const navigate = useHistory();

  // Set default role from cookie or 'Buyer'
  useEffect(() => {
    const roleFromCookie = Cookies.get('Role');
    setFormData((prevFormData) => ({
      ...prevFormData,
      role: roleFromCookie || 'Buyer'
    }));
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleCountryChange = (e) => {
    setCountryid({ name: e.name, id: e.id });
    setFormData({ ...formData, country: e.name });
  };

  const handleStateChange = (e) => {
    setStateid({ name: e.name, id: e.id });
    setFormData({ ...formData, state: e.name });
  };

  const handleCityChange = (e) => {
    setCityid(e.name);
    setFormData({ ...formData, city: e.name });
  };

  const handleFileChange = (setter) => (event) => {
    setter(event.target.files[0]); // Set profile image for seller
  };

  const handleSkillsChange = (newSkills) => {
    setSkills(newSkills); // Update skills for seller
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", { ...formData, skills });
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match', { position: 'top-center' });
      return;
    }

    // Validate common fields
    if (!formData.name || !formData.email || !formData.password || !formData.phonenumber || !formData.country || !formData.state || !formData.city) {
      toast.error('All fields are required', { position: 'top-center' });
      return;
    }

    // Additional validation for Seller role
    if (formData.role === 'Seller') {
      if (!formData.title || !formData.description || !skills.length || !additionalScreenshot) {
        toast.error('All seller fields are required, including profile image and skills.', { position: 'top-center' });
        return;
      }
    }

    setLoading(true); // Show spinner while loading

    try {
      toast('Signing up, please wait...', { position: 'top-center' });

      const headers = {
        'Content-Type': 'application/json',
        'api-key': process.env.REACT_APP_API_KEY
      };

      // If role is Seller, upload the profile image and then send seller sign-up request
      if (formData.role === 'Seller') {
        // Upload image to Cloudinary (assuming this is the utility for image upload)
        const imageUrl = await uploadToCloudinary(additionalScreenshot);

        // Make the seller sign-up request
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/v1/auth/sellerSignUp`,
          {
            ...formData,
            image: imageUrl, // Uploaded image URL
            skills // Seller skills array
          },
          { headers }
        );

        if (response.status === 201) {
          toast.success('Seller registered successfully. Please verify your email.', { position: 'top-center' });
          Cookies.set('userId', response.data.user.id, { expires: 1 });
          Cookies.set('hashedOTP', response.data.hashedOtp, { expires: 1 });
          navigate.push(`/verifyotp`);
        }
      } else {
        // If role is not Seller, use the standard sign-up process for Buyers
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/v1/auth/signUp`,
          {
            ...formData
          },
          { headers }
        );

        if (response.status === 201) {
          toast.success('User registered successfully. Please verify your email.', { position: 'top-center' });
          Cookies.set('userId', response.data.user.id, { expires: 1 });
          Cookies.set('hashedOTP', response.data.hashedOtp, { expires: 1 });
          navigate.push(`/verifyotp`);
        }
      }
    } catch (error) {
      console.error('Signup Error:', error);
      toast.error(error.response?.data?.message || 'Internal server error.', { position: 'top-center' });
    } finally {
      setLoading(false); // Hide spinner after request completes
    }
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8">
      <Toaster position="top-center" reverseOrder={false} /> {/* Include Toaster to display toast notifications */}

      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img alt="Your Company" src="./assets/logo.png" className="mx-auto h-24 w-auto" />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign Up for an Account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Common form fields for both Seller and Buyer */}
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="custom-input block w-full"
            placeholder="Enter your name"
          />
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="custom-input block w-full"
            placeholder="Enter your email"
          />
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="custom-input block w-full"
            placeholder="Enter your password"
          />
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
            className="custom-input block w-full"
            placeholder="Confirm your password"
          />
          <input
            id="phonenumber"
            name="phonenumber"
            type="text"
            value={formData.phonenumber}
            onChange={handleInputChange}
            required
            className="custom-input block w-full"
            placeholder="Enter your phone number"
          />

          {/* Seller-specific fields */}
          {formData.role === 'Seller' && (
            <>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title} // Added value
                onChange={handleInputChange} // Added onChange
                className="custom-input block w-full"
                placeholder="Enter a title"
                required
              />
              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description} // Added value
                onChange={handleInputChange} // Added onChange
                required
                placeholder="Enter description"
                className="custom-input block w-full"
              />
              <div>
                <input
                  type="file"
                  id="additionalScreenshot"
                  style={{ display: 'none' }}
                  onChange={handleFileChange(setAdditionalScreenshot)}
                  required
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('additionalScreenshot').click()}
                  className="w-full bg-gray-200 p-2 rounded-md"
                >
                  {additionalScreenshot ? additionalScreenshot.name : 'Profile Image'}
                </button>
              </div>
              <Skills onChange={handleSkillsChange} skills={skills} /> 
            </>
          )}

          {/* Country, State, City Selectors */}
          <CountrySelect
            id="country"
            onChange={handleCountryChange}
            placeHolder="Select Country"
            className="custom-input block w-full"
            required
          />
          <StateSelect
            id="state"
            countryid={countryid.id}
            onChange={handleStateChange}
            placeHolder="Select State"
            className="custom-input block w-full"
            required
          />
          <CitySelect
            id="city"
            countryid={countryid.id}
            stateid={stateid.id}
            onChange={handleCityChange}
            placeHolder="Select City"
            className="custom-input block w-full"
            required
          />
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500"
          >
            {loading ? <Spinner /> : 'Sign Up'}
          </button>

          <div className="flex flex-col justify-center items-center mt-3">
            <p className="text-sm text-center text-gray-500">
              Already have an account?{' '}
              <Link to="/signin" className="font-semibold leading-6 text-blue-600 hover:text-blue-500">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
