import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, Calendar } from 'lucide-react';

const ReviewList = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:3005/api/reviews/product/${productId}`);
      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const markHelpful = async (reviewId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3005/api/reviews/${reviewId}/helpful`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        fetchReviews(); // Refresh reviews
      }
    } catch (error) {
      console.error('Error marking helpful:', error);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg p-4 h-32"></div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No reviews yet. Be the first to review this dish!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review._id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border dark:border-gray-700">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium dark:text-white">{review.user?.name || 'Anonymous'}</span>
                {review.verified && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Verified Purchase
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex">{renderStars(review.rating)}</div>
                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-4">{review.comment}</p>

          {review.photos && review.photos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              {review.photos.map((photo, index) => (
                <img
                  key={index}
                  src={`http://localhost:3005${photo.url}`}
                  alt="Review photo"
                  className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-80"
                  onClick={() => window.open(`http://localhost:3005${photo.url}`, '_blank')}
                />
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              onClick={() => markHelpful(review._id)}
              className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>Helpful ({review.helpful?.length || 0})</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;