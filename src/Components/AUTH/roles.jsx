import {
} from 'react-country-state-city';
import 'react-country-state-city/dist/react-country-state-city.css';
import React from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import js-cookie
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

export default function Role() {
  const navigate = useHistory(); // Initialize useHistory for navigation

  // Function to handle role selection and store it in cookies
  const handleRoleSelection = (role) => {
    Cookies.set('Role', role, { expires: 7 }); // Set cookie with 7-day expiration
    navigate.push('/signup'); // Navigate to the signup page
  };

  // Keyframe styles for the border animation
  const animatedBorderStyle = {
    animation: 'borderAnimation 2s linear infinite',
  };

  // Dynamically inject keyframes into the document
  const keyframes = `
   @keyframes borderAnimation {
  0% {
    border-width: 4px 0 0 0;
    border-color: indigo transparent transparent transparent;
  }
  25% {
    border-width: 4px 4px 0 0;
    border-color: var(--avatar-bg-color) indigo transparent transparent;
  }
  50% {
    border-width: 0 4px 4px 0;
    border-color: transparent var(--avatar-bg-color) indigo transparent;
  }
  75% {
    border-width: 0 0 4px 4px;
    border-color: transparent transparent var(--avatar-bg-color) indigo;
  }
  100% {
    border-width: 4px 0 0 0;
    border-color: var(--avatar-bg-color) transparent transparent transparent;
  }
}

  `;

  // Add keyframes to the document's <style> element
  if (!document.getElementById('animated-border-keyframes')) {
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.id = 'animated-border-keyframes';
    styleSheet.innerText = keyframes;
    document.head.appendChild(styleSheet);
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col items-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="./assets/logo.png"
          className="mx-auto h-24 w-auto"
        />
        <h2 className="mt-4 text-center text-3xl leading-9 tracking-tight text-gray-900">
          Join as a Buyer or Seller
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="mt-6">
          <div className="mt-2 grid grid-cols-2 gap-4">
            {/* Buyer Button */}
            <button
              type="button"
              onClick={() => handleRoleSelection('Buyer')} // Handle buyer click
              style={{
                ...animatedBorderStyle,
                borderWidth: '4px',
                borderStyle: 'solid',
                borderColor: 'indigo transparent transparent transparent',
                borderRadius: '8px',
                padding: '48px 16px',
                backgroundColor: 'white',
                color: 'gray',
                fontSize: '20px',
                textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
            >
              I’m a Buyer, hiring for a project
            </button>

            {/* Seller Button */}
            <button
              type="button"
              onClick={() => handleRoleSelection('Seller')} // Handle seller click
              style={{
                ...animatedBorderStyle,
                borderWidth: '4px',
                borderStyle: 'solid',
                borderColor: 'indigo transparent transparent transparent',
                borderRadius: '8px',
                padding: '48px 16px',
                backgroundColor: 'white',
                color: 'gray',
                fontSize: '20px',
                textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
            >
              I’m a Seller, looking for work
            </button>
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link
            to="/signin"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
