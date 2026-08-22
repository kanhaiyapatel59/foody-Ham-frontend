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
  FaShieldAlt,
  FaArrowLeft
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center py-8 px-4 relative overflow-hidden">
      {/* 3D Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Food Icons */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 text-6xl opacity-20"
        >
          🍕
        </motion.div>
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
          className="absolute top-40 right-20 text-5xl opacity-20"
        >
          🍔
        </motion.div>
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, 10, 0]
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-32 left-20 text-5xl opacity-20"
        >
          🍜
        </motion.div>
        <motion.div
          animate={{
            y: [0, 25, 0],
            rotate: [0, -8, 0]
          }}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
          className="absolute bottom-20 right-10 text-6xl opacity-20"
        >
          🍰
        </motion.div>
        <motion.div
          animate={{
            y: [0, -18, 0],
            rotate: [0, 6, 0]
          }}
          transition={{
            duration: 4.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-1/2 left-5 text-5xl opacity-20"
        >
          🥗
        </motion.div>
        <motion.div
          animate={{
            y: [0, 22, 0],
            rotate: [0, -7, 0]
          }}
          transition={{
            duration: 5.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2.5
          }}
          className="absolute top-1/3 right-5 text-5xl opacity-20"
        >
          🍱
        </motion.div>

        {/* Gradient Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-10 right-1/4 w-64 h-64 bg-orange-300 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-20 left-1/4 w-72 h-72 bg-amber-300 rounded-full blur-3xl"
        />
      </div>

      {/* Back to Home Button */}
      <Link
        to="/"
        className="fixed top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 z-50"
      >
        <FaArrowLeft />
        <span className="font-medium">Back to Home</span>
      </Link>

      {/* 🚨 CHANGE 1: Centered Layout */}
      <div className="max-w-md w-full relative z-10"> 
        <motion.div
            key={isLogin ? 'login' : 'signup'}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{ transformStyle: "preserve-3d" }}
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

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
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

            {/* Toggle Login/Register */}
            <div className="text-center pt-6 mt-8 border-t border-gray-100">
              <p className="text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  disabled={loading}
                  className="ml-2 text-orange-600 font-semibold hover:text-orange-700 transition-colors disabled:opacity-50"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default LoginPage;