import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import Spinner from '../spinner'; // Import the Spinner component
import 'react-toastify/dist/ReactToastify.css';

export default function VerifyOTPs() {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state for spinner
  const history = useHistory();

  // Get the user ID and hashed OTP from cookies
  const userId = Cookies.get('userId');
  const hashedOtp = Cookies.get('hashedOTP');

  console.log('User ID retrieved from cookies:', userId);
  console.log('Hashed OTP retrieved from cookies:', hashedOtp); // Log the retrieved hashed OTP

  const handleInputChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId || !hashedOtp) {
      toast.error('Required information is missing. Please try again.');
      return;
    }

    setIsLoading(true); // Show spinner when form is being submitted

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/auth/forgotPasswordVerifyOTP`, // Corrected endpoint
        {
          hashedOtp, // Send the hashed OTP from cookies
          userOtp: otp // Send the OTP from user input
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'api-key': process.env.REACT_APP_API_KEY
          }
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message || 'OTP verified successfully!');
        history.push('/updatepassword'); // Redirect to the update password page
      } else {
        toast.error(response.data.message || 'OTP verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Verification Error:', error);
      toast.error('Verification failed. Please try again.');
    } finally {
      setIsLoading(false); // Hide spinner when request is done
    }
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      {/* Toaster placement for displaying toast messages */}
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
              disabled={isLoading} // Disable button when loading
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500"
            >
              {isLoading ? (
                <Spinner /> // Use the Spinner component
              ) : (
                'Verify OTP'
              )}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Didn’t receive the OTP?{' '}
          <Link to="/resendotp" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
            Resend OTP
          </Link>
        </p>
      </div>
    </div>
  );
}
