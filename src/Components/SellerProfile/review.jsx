import React from 'react';
import '../../App.css'; // Importing the separate CSS file

const Review = ({ name, country, date, reviewText }) => {
  return (
    <div className="review-container">
      <div className="user-info">
        <div className="avatar">
          <span className="initial">{name[0]}</span>
        </div>
        <div>
          <p className="user-name">{name}</p>
          <p className="user-location"> {country}</p>
        </div>
      </div>
      <div className="review-content">
        <div className="review-header">
          <span className="star-rating">★★★★★</span>
          <span className="review-date">{date}</span>
        </div>
        <p className="review-text">{reviewText}</p>
      </div>
    </div>
  );
};

const ReviewsList = () => {
  const reviews = [
    {
      name: 'Nazir',
      country: 'United States',
      date: '1 week ago',
      reviewText: 'Working with Muhammad has been a very pleasant experience. We use him often and will continue doing so.'
    },
    {
      name: 'Nazir',
      country: 'United States',
      date: '1 month ago',
      reviewText: 'Muhammad continues to be a great person to work with. We will continue to work with him on many projects ahead.'
    }
  ];

  return (
    <div>
      {reviews.map((review, index) => (
        <Review
          key={index}
          name={review.name}
          country={review.country}
          date={review.date}
          reviewText={review.reviewText}
        />
      ))}
    </div>
  );
};

export default ReviewsList;
