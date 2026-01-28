import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaTimes, FaCheck } from 'react-icons/fa';

const EmailNotification = ({ show, onClose, orderData }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  if (!show) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-4 max-w-sm">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
              <FaEnvelope className="text-green-600 dark:text-green-400 w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                Email Sent!
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Order confirmation
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <FaCheck className="text-green-500 w-3 h-3" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Confirmation sent to:
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 font-mono">
            {orderData?.userEmail || 'your-email@example.com'}
          </p>
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <p>📧 Order details and tracking info included</p>
          <p>⏰ Estimated delivery: 30-45 minutes</p>
        </div>
      </div>
    </div>
  );
};

export default EmailNotification;