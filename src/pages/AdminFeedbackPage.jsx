import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaStar, 
  FaCommentDots, 
  FaEnvelope, 
  FaUser, 
  FaCalendarAlt, 
  FaChartLine, 
  FaSpinner 
} from 'react-icons/fa';

// Create axios instance (make sure this is correctly configured with your base URL and credentials)
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Adjust if your backend is running on a different port/host
  withCredentials: true,
});

// Interceptor for attaching the token
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

function AdminFeedbackPage() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    setLoading(true);
    setError('');
    try {
      // Endpoint is /api/feedback/admin
      const res = await api.get('/feedback/admin');
      
      if (res.data.success) {
        setFeedbackList(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching feedback:', err);
      // Handle 401/403 (unauthorized/forbidden) separately
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        setError('Access Denied: You must be logged in as an administrator.');
        // Optional: Redirect to login or admin panel
        // navigate('/admin/dashboard'); 
      } else {
        setError(err.response?.data?.message || 'Failed to load feedback data.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  // Helper function to calculate the average rating
  const getAverageRating = () => {
    if (feedbackList.length === 0) return 'N/A';
    const totalRating = feedbackList.reduce((acc, item) => acc + item.rating, 0);
    return (totalRating / feedbackList.length).toFixed(2);
  };

  // Helper function to render stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar 
          key={i} 
          className={`h-4 w-4 ${i <= rating ? 'text-amber-500' : 'text-gray-300'}`}
        />
      );
    }
    return <div className="flex space-x-0.5">{stars}</div>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <FaSpinner className="animate-spin text-4xl text-orange-500 mr-3" />
        <span className="text-xl text-gray-700">Loading Feedback...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
          <FaCommentDots className="text-orange-500" /> User Feedback Management
        </h1>
        <button
            onClick={() => navigate('/admin/dashboard')}
            className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
        >
          Go to Dashboard
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Analytics Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-orange-500">
          <div className="flex items-center">
            <FaChartLine className="text-3xl text-orange-500 mr-4" />
            <div>
              <p className="text-sm font-medium text-gray-500">Total Submissions</p>
              <p className="text-3xl font-bold text-gray-900">{feedbackList.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-amber-500">
          <div className="flex items-center">
            <FaStar className="text-3xl text-amber-500 mr-4" />
            <div>
              <p className="text-sm font-medium text-gray-500">Average Rating</p>
              <p className="text-3xl font-bold text-gray-900">{getAverageRating()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-500">
          <div className="flex items-center">
            <FaCalendarAlt className="text-3xl text-blue-500 mr-4" />
            <div>
              <p className="text-sm font-medium text-gray-500">Last Submission</p>
              <p className="text-xl font-bold text-gray-900">
                {feedbackList.length > 0 ? formatDate(feedbackList[0].submissionDate) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Feedback Table */}
      <div className="bg-white shadow-xl rounded-xl overflow-hidden">
        {feedbackList.length === 0 ? (
          <div className="p-10 text-center text-gray-500">No feedback submitted yet.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {feedbackList.map((feedback) => (
                <tr key={feedback._id} className="hover:bg-orange-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStars(feedback.rating)}
                    <span className="text-sm text-gray-600 mt-1 block">({feedback.rating}/5)</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-lg truncate hover:whitespace-normal hover:overflow-visible">
                    {feedback.comment}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaUser className="text-gray-400 mr-2 text-sm" />
                      <span className="text-sm font-medium text-gray-900">{feedback.name || 'Anonymous'}</span>
                    </div>
                    {feedback.email && (
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <FaEnvelope className="mr-2" />
                        <span>{feedback.email}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(feedback.submissionDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminFeedbackPage;