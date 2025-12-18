import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

function StarRating({ rating, totalReviews, size = 'md', showCount = true }) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FaStar key={`full-${i}`} className="text-yellow-500" />
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <FaStarHalfAlt key="half" className="text-yellow-500" />
      );
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FaRegStar key={`empty-${i}`} className="text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <div className={`flex items-center gap-1 ${sizeClasses[size]}`}>
      <div className="flex items-center">
        {renderStars()}
      </div>
      {showCount && totalReviews > 0 && (
        <span className="text-gray-600 text-sm ml-1">
          ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
        </span>
      )}
      {rating > 0 && (
        <span className="text-gray-600 text-sm ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

export default StarRating;