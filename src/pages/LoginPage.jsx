import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaUser, 
  FaLock, 
  FaEnvelope, 
  FaExclamationTriangle, 
  FaSignInAlt, 
  FaUserPlus, 
  FaGoogle, 
  FaApple, 
  FaFacebook,
  FaCheck,
  FaLeaf,
  FaShoppingBag,
  FaStar,
  FaTruck,
  FaShieldAlt
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [localError, setLocalError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { login, register, error: authError, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    // Clear form on toggle
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setLocalError('');
    clearError();
  }, [isLogin, clearError]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setLocalError('');
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    clearError();
    setLoading(true);

    try {
      if (isLogin) {
        if (!formData.email || !formData.password) {
          throw new Error('Email and password are required.');
        }
        await login(formData.email, formData.password);
        navigate(from, { replace: true });
      } else {
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
          throw new Error('All fields are required for registration.');
        }
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        await register(formData.name, formData.email, formData.password);
        navigate(from, { replace: true });
      }
    } catch (err) {
      setLocalError(err.message || 'Something went wrong during authentication.');
    } finally {
      setLoading(false);
    }
  };



  const displayError = localError || authError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center py-8 px-4">
      {/* 🚨 CHANGE 1: Centered Layout */}
      <div className="max-w-md w-full"> 
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 lg:p-12 border border-gray-100">
            
            {/* Header with Animation */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-lg mb-6">
                {isLogin ? (
                  <FaSignInAlt className="text-white text-3xl" />
                ) : (
                  <FaUserPlus className="text-white text-3xl" />
                )}
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                {isLogin ? 'Welcome Back!' : 'Create Account'}
              </h2>
              <p className="text-gray-600 mt-3">
                {isLogin ? 'Sign in to continue your culinary journey' : 'Join us for exceptional dining experiences'}
              </p>
            </motion.div>

            {/* Error Display */}
            <AnimatePresence>
              {displayError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6"
                >
                  <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-xl flex items-center gap-4">
                    <FaExclamationTriangle className="text-xl flex-shrink-0" />
                    <span className="font-medium">{displayError}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    key="name-field"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="relative">
                      <FaUser className="absolute left-4 top-4 text-gray-400 z-10" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-12 px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all duration-300 text-lg"
                        required={!isLogin}
                        disabled={loading}
                        placeholder="Full Name"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative">
                <FaEnvelope className="absolute left-4 top-4 text-gray-400 z-10" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all duration-300 text-lg"
                  required
                  disabled={loading}
                  placeholder="Email Address"
                />
              </div>

              {/* 🚨 CHANGE 4 & 5: Password Fields in same row + Requirements */}
              <div className={!isLogin ? "grid grid-cols-1 md:grid-cols-2 gap-4" : ""}>
                <div className="relative">
                  <FaLock className="absolute left-4 top-4 text-gray-400 z-10" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all duration-300 text-lg"
                    required
                    disabled={loading}
                    placeholder="Password"
                  />
                </div>

                <AnimatePresence mode="wait">
                  {!isLogin && (
                    <motion.div
                      key="confirm-password"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="relative">
                        <FaLock className="absolute left-4 top-4 text-gray-400 z-10" />
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full pl-12 px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all duration-300 text-lg"
                          required={!isLogin}
                          disabled={loading}
                          placeholder="Confirm Password"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Password Requirements (Register Only, placed after password fields) */}
              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    key="password-reqs"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-2"
                  >
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li className="flex items-center gap-2">
                          <FaCheck className="text-green-500" />
                          At least 6 characters
                        </li>
                        <li className="flex items-center gap-2">
                          <FaCheck className="text-green-500" />
                          Contains letters and numbers
                        </li>
                        <li className="flex items-center gap-2">
                          <FaCheck className="text-green-500" />
                          Passwords must match
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || googleLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-orange-500/25 hover:from-orange-600 hover:to-amber-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </>
                )}
              </motion.button>
            </form>

            {/* 🚨 CHANGE 2: Social Login Buttons moved to the bottom */}
            <div className="mt-8">
              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-1 gap-4">
                {/* Google Button - Coming Soon */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setLocalError('Google authentication coming soon!')}
                  disabled={true}
                  className="w-full bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 opacity-70 cursor-not-allowed shadow-sm"
                >
                  <FaGoogle className="text-red-500 text-xl" />
                  <span>Google Auth (Coming Soon)</span>
                </motion.button>
              </div>
            </div>

            {/* Toggle Login/Register */}
            <div className="text-center pt-6 mt-8 border-t border-gray-100">
              <p className="text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  disabled={loading || googleLoading}
                  className="ml-2 text-orange-600 font-semibold hover:text-orange-700 transition-colors disabled:opacity-50"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
            
            {/* 🚨 CHANGE 3: Removed Demo Accounts Section */}

            {/* Terms & Privacy */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                By continuing, you agree to our{' '}
                <a href="#" className="text-orange-500 hover:text-orange-600 font-medium">Terms</a>
                {' '}and{' '}
                <a href="#" className="text-orange-500 hover:text-orange-600 font-medium">Privacy Policy</a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default LoginPage;