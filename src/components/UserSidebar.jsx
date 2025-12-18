import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaTimes } from 'react-icons/fa';

function UserSidebar({ isOpen, onClose, user, onLogout }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" 
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 border-l-4 border-orange-500">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-900">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
              <FaUser className="text-white text-xl" />
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-gray-100">{user?.name}</p>
              <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Member</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <FaTimes className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-120px)]">
          <Link
            to="/profile"
            className="flex items-center gap-3 p-4 hover:bg-orange-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-300 group transform hover:scale-105 hover:shadow-lg"
            onClick={onClose}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-xl transition-shadow">
              <FaUser className="text-white" />
            </div>
            <span className="font-medium text-gray-700 dark:text-gray-300">My Profile</span>
          </Link>
          
          <Link
            to="/orders"
            className="flex items-center gap-3 p-4 hover:bg-orange-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-300 group transform hover:scale-105 hover:shadow-lg"
            onClick={onClose}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-xl transition-shadow">
              <span className="text-white text-lg">📋</span>
            </div>
            <span className="font-medium text-gray-700 dark:text-gray-300">My Orders</span>
          </Link>
          
          <Link
            to="/group-orders"
            className="flex items-center gap-3 p-4 hover:bg-orange-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-300 group transform hover:scale-105 hover:shadow-lg"
            onClick={onClose}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-xl transition-shadow">
              <span className="text-white text-lg">👥</span>
            </div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Group Orders</span>
          </Link>
          
          <Link
            to="/reservations"
            className="flex items-center gap-3 p-4 hover:bg-orange-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-300 group transform hover:scale-105 hover:shadow-lg"
            onClick={onClose}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-xl transition-shadow">
              <span className="text-white text-lg">🍽️</span>
            </div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Table Reservations</span>
          </Link>
          
          <Link
            to="/food-diary"
            className="flex items-center gap-3 p-4 hover:bg-orange-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-300 group transform hover:scale-105 hover:shadow-lg"
            onClick={onClose}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-xl transition-shadow">
              <span className="text-white text-lg">📊</span>
            </div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Food Diary</span>
          </Link>
          
          <Link
            to="/loyalty"
            className="flex items-center gap-3 p-4 hover:bg-orange-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-300 group transform hover:scale-105 hover:shadow-lg"
            onClick={onClose}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-xl transition-shadow">
              <span className="text-white text-lg">🏆</span>
            </div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Loyalty Rewards</span>
          </Link>
          
          <button
            onClick={() => {
              onClose();
              window.dispatchEvent(new CustomEvent('openSpin'));
            }}
            className="w-full flex items-center gap-3 p-4 hover:bg-orange-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-300 group transform hover:scale-105 hover:shadow-lg text-left"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-xl transition-shadow">
              <span className="text-white text-lg">🎰</span>
            </div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Spin & Win</span>
          </button>
          
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full flex items-center gap-3 p-4 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300 group text-left transform hover:scale-105 hover:shadow-lg"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-xl transition-shadow">
              <FaSignOutAlt className="text-white" />
            </div>
            <span className="font-medium text-red-600 dark:text-red-400">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default UserSidebar;
