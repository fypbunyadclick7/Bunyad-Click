import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast'; // Importing toast and Toaster
import Spinner from '../spinner'; // Import Spinner component
import Cookies from 'js-cookie';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // State for loading spinner
  const navigate = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Attempting to login with email:', email);
    console.log('Attempting to login with password:', password);

    setLoading(true); // Show spinner

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/auth/login`,
        {
          email, // Sending email and password as data
          password
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'api-key': process.env.REACT_APP_API_KEY
          }
        }
      );

      console.log('Response:', response); // Log the response to see the status and data

      if (response.status === 200) {
        const data = response.data;
        console.log('Login successful:', data);

        // Store userId in cookies
        Cookies.set('userId', data.user.id);

        // Display success toast notification
        toast.success('Successfully signed in!', { position: 'top-center' });

        // Check the role and navigate accordingly
        if (data.user.role === 'Buyer') {
          navigate.push('/profile'); // Redirect to buyer profile
        } else if (data.user.role === 'Seller') {
          navigate.push('/sellerhome'); // Redirect to seller home
        } else {
          toast.error('Invalid role. Please contact support.', { position: 'top-center' });
        }
      } else {
        // Display error toast notification
        toast.error(response.data.message || 'Failed to sign in', { position: 'top-center' });
      }
    } catch (error) {
      console.error('Error during login:', error.response?.data || error.message);

      // Display error toast notification
      toast.error('An error occurred. Please try again.', { position: 'top-center' });
    } finally {
      setLoading(false); // Hide spinner after request completes
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
          Sign in to your account
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
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
          <div>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="custom-input block w-full"
            />
          </div>
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500"
              disabled={loading} // Disable button while loading
            >
              {loading ? <Spinner /> : 'Sign in'} {/* Show spinner or "Sign in" */}
            </button>
          </div>

          {/* Forgot Password link */}
          <div className="text-sm text-center">
            <Link to="/forgotpassword" className="font-medium text-indigo-600 hover:text-indigo-500">
              Forgot your password?
            </Link>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" className="h-5 w-5" alt="Google" />
              <span className="ml-2">Google</span>
            </button>

            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" className="h-5 w-5" alt="GitHub" />
              <span className="ml-2">GitHub</span>
            </button>
          </div>
        </div>
        
        <p className="mt-10 text-center text-sm text-gray-500">
          Not a member?{' '}
          <Link to="/" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
            Register your account
          </Link>
        </p>
      </div>
    </div>
  );
}
