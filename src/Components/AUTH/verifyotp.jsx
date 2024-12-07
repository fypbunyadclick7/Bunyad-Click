import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { useHistory, Link } from 'react-router-dom';
import Spinner from '../spinner'; // Import Spinner component

export default function VerifyOTP() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for button spinner
  const history = useHistory();

  const userId = Cookies.get('userId'); // Get the user ID from cookies
  console.log('User ID retrieved from cookies:', userId); // Log the retrieved userId

  const handleInputChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error('User ID is missing. Please sign up again.', { position: 'top-center' });
      return;
    }

    setLoading(true); // Show spinner while loading

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/v1/auth/verifyOtp/${userId}`,
        {
          hashedOtp: Cookies.get('hashedOTP'), // Get the updated hashed OTP from cookies
          userOtp: otp // Send the original OTP entered by the user
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'api-key': process.env.REACT_APP_API_KEY
          }
        }
      );

      if (response.status === 200) {
        toast.success('OTP verified successfully!', { position: 'top-center' });
        history.push('/signin');
      }
    } catch (error) {
      console.error('Verification Error:', error);
      toast.error(error.response?.data?.message || 'Verification failed. Please try again.', { position: 'top-center' });
    } finally {
      setLoading(false); // Hide spinner after request completes
    }
  };

  // Function to handle Resend OTP
  const handleResendOtp = async () => {
    if (!userId) {
      toast.error('User ID is missing. Please sign up again.', { position: 'top-center' });
      return;
    }

    setLoading(true); // Show spinner while loading

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/auth/resendOtp/${userId}`, // Use POST
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'api-key': process.env.REACT_APP_API_KEY
          }
        }
      );

      if (response.status === 200) {
        toast.success('OTP has been resent successfully.', { position: 'top-center' });
        // Set the new hashed OTP in cookies
        Cookies.set('hashedOTP', response.data.newHashedOtp); // Update this line
      }
    } catch (error) {
      console.error('Resend OTP Error:', error);
      toast.error(error.response?.data?.message || 'Failed to resend OTP. Please try again.', { position: 'top-center' });
    } finally {
      setLoading(false); // Hide spinner after request completes
    }
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      {/* Include Toaster to display toast notifications */}
      <Toaster position="top-center" reverseOrder={false} />

      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <img
          alt="Your Company"
          src="./assets/logo.png"
          className="mx-auto h-24 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Verify Your OTP
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              id="otp"
              name="otp"
              type="text"
              value={otp}
              onChange={handleInputChange}
              required
              className="custom-input block w-full"
              placeholder="Enter OTP"
            />
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500"
              disabled={loading} // Disable button while loading
            >
              {loading ? <Spinner /> : 'Verify OTP'} {/* Display Spinner if loading */}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Didn’t receive the OTP?{' '}
          <button
            onClick={handleResendOtp}
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            disabled={loading} // Disable button while loading
          >
            {loading ? <Spinner /> : 'Resend OTP'} {/* Display Spinner if loading */}
          </button>
        </p>
      </div>
    </div>
  );
}
