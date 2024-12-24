import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import '../../App.css';
import toast, { Toaster } from 'react-hot-toast'; // Import toast and Toaster
import Cookies from 'js-cookie';
import Spinner from '../spinner'; // Import Spinner component

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false); // Spinner state
  const navigate = useHistory(); // For redirection

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start spinner

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/auth/forgotPassword`,
        {
          email: email
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'api-key': process.env.REACT_APP_API_KEY
          }
        }
      );

      console.log('Response:', response.data);

      if (response.status === 200) {
        const { hashedOtp, message } = response.data;

        // Store hashed OTP in cookies (for later use during OTP verification)
        Cookies.set('hashedOTP', hashedOtp, { expires: 1 }); // Expire after 1 day

        // Display success toast notification
        toast.success('OTP sent successfully!', { position: 'top-center' });

        // Redirect to the OTP verification page
        navigate.push('/verifyotps');

        console.log(message);
      }
    } catch (error) {
      console.error('Error sending OTP:', error.response?.data || error.message);

      // Display error toast notification
      toast.error('Failed to send OTP. Please try again.', { position: 'top-center' });
    } finally {
      setLoading(false); // Stop spinner
    }
  };

  return (
    <>
      {/* Toaster placement for displaying toast messages */}
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="./assets/logo.png"
          className="mx-auto h-24 w-auto"
        />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address, and we'll send you an OTP to reset your password.
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="custom-input block w-full"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading} // Disable button while loading
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {loading ? ( // Show spinner during loading
                  <Spinner /> // Use the Spinner component
                ) : (
                  'Send OTP'
                )}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Remember your password?{' '}
            <Link to="/signin" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
