import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaRegStar, FaPaperPlane, FaTimesCircle } from 'react-icons/fa';

// Setup API instance (assuming this structure is consistent across your app)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const FeedbackPage = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null); // { type: 'success' | 'error', text: string }
  const navigate = useNavigate();
  
  // Array for star rating display
  const stars = [1, 2, 3, 4, 5];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment) {
        setSubmitMessage({ type: 'error', text: 'Please provide a rating and a comment.' });
        return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    const feedbackData = {
      rating,
      comment,
      name,
      email,
      // You might add a userId here if logged in
    };

    try {
      // 🚨 REPLACE THIS URL with your actual feedback submission endpoint
      const response = await api.post('/feedback', feedbackData); 
      
      if (response.data.success) {
        setSubmitMessage({ type: 'success', text: 'Thank you! Your feedback has been successfully submitted.' });
        // Optionally clear form after a delay or redirect
        setTimeout(() => {
            setRating(0);
            setComment('');
            setName('');
            setEmail('');
            setIsSubmitting(false);
            // navigate('/'); 
        }, 3000);
      } else {
        throw new Error(response.data.message || 'Submission failed.');
      }

    } catch (error) {
      console.error("Feedback submission error:", error);
      setIsSubmitting(false);
      setSubmitMessage({ type: 'error', text: error.message || 'An error occurred while submitting your feedback. Please try again later.' });
    }
  };

  const MessageDisplay = ({ message }) => {
    if (!message) return null;
    const isSuccess = message.type === 'success';
    const bgColor = isSuccess ? 'bg-green-600/90' : 'bg-red-600/90';
    const Icon = isSuccess ? FaPaperPlane : FaTimesCircle;

    return (
      <div className={`flex items-center p-4 rounded-lg text-white font-medium mb-6 ${bgColor} transition-all duration-300`}>
        <Icon className="w-5 h-5 mr-3" />
        {message.text}
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-gray-800 p-8 md:p-12 rounded-xl shadow-2xl border border-gray-700">
        
        <h2 className="text-4xl font-bold text-white mb-3 text-center">
          Share Your <span className="text-red-500">Feedback</span>
        </h2>
        <p className="text-gray-400 mb-8 text-center max-w-md mx-auto">
          We constantly strive for perfection. Let us know about your experience!
        </p>

        <MessageDisplay message={submitMessage} />

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Rating Section */}
          <div>
            <label className="block text-lg font-medium text-white mb-3">
              Your Experience Rating: <span className="text-red-500">*</span>
            </label>
            <div className="flex justify-center space-x-2">
              {stars.map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`transition-colors duration-200 ${
                    star <= rating ? 'text-yellow-500' : 'text-gray-600 hover:text-yellow-500/70'
                  }`}
                  aria-label={`Rate ${star} stars`}
                >
                  {star <= rating ? <FaStar className="w-10 h-10" /> : <FaRegStar className="w-10 h-10" />}
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-gray-400 mt-2">
                {rating > 0 ? `You rated: ${rating} out of 5` : 'Click a star to rate'}
            </p>
          </div>
          
          {/* Comment Field */}
          <div>
            <label htmlFor="comment" className="block text-lg font-medium text-white mb-2">
              Comments / Suggestions: <span className="text-red-500">*</span>
            </label>
            <textarea
              id="comment"
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us what you loved or how we can improve..."
              required
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-red-500 focus:border-red-500 transition-all"
            ></textarea>
          </div>

          {/* Optional Contact Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-700">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
                Name (Optional)
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-red-500 focus:border-red-500 transition-all"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                Email (Optional)
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-red-500 focus:border-red-500 transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-lg font-semibold rounded-lg shadow-md 
                       bg-red-600 text-white hover:bg-red-700 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
                <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                </>
            ) : (
                <>
                    Submit Feedback
                    <FaPaperPlane className="w-4 h-4" />
                </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackPage;