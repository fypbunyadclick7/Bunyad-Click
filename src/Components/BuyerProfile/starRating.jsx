import React from 'react';

const StarRating = ({ rating }) => {
  const totalStars = 5; // Total number of stars

  // Inline styles
  const starStyle = {
    fontSize: '1.5rem', // Adjust size as needed
    color: 'lightgray', // Default color
    transition: 'color 0.2s',
    cursor: 'pointer',
  };

  const filledStarStyle = {
    ...starStyle,
    color: '#f5a623', // Color for filled stars
  };

  const halfFilledStarStyle = {
    ...starStyle,
    background: 'linear-gradient(to right, #f5a623 50%, lightgray 50%)', // Half filled effect
    WebkitBackgroundClip: 'text',
    color: 'transparent',
  };

  return (
    <div>
      {[...Array(totalStars)].map((_, index) => {
        if (index < Math.floor(rating)) {
          return <span key={index} style={filledStarStyle}>★</span>; // Full star
        } else if (index === Math.floor(rating) && rating % 1 >= 0.5) {
          return <span key={index} style={halfFilledStarStyle}>★</span>; // Half star
        } else {
          return <span key={index} style={starStyle}>★</span>; // Empty star
        }
      })}
    </div>
  );
};

export default StarRating;
