import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaTimes, FaHistory, FaUsers, FaUtensils, FaChartBar, FaTrophy, FaCalendarAlt, FaGamepad, FaThumbtack } from 'react-icons/fa';

function UserSidebar({ isOpen, onClose, user, onLogout, onMouseEnter, onMouseLeave, isPinned }) {
  const location = useLocation();

  if (!isOpen) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity duration-300" 
        onClick={onClose}
      />
      
      {/* Meroshare-Style Responsive Sidebar Container */}
      <div 
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="fixed top-0 left-0 bottom-0 h-screen w-80 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 shadow-2xl z-50 transform transition-all duration-300 border-r border-gray-200 dark:border-gray-800 flex flex-col font-sans"
      >
        {/* Header - Brand & Profile */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-md ring-2 ring-white/30">
              <FaUser className="text-white text-xl" />
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-2">
                <p className="font-extrabold text-white text-base truncate">{user?.name || 'Member'}</p>
                {isPinned && (
                  <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded-full flex items-center gap-1 font-semibold" title="Pinned Open">
                    <FaThumbtack className="rotate-45 text-[8px]" />
                  </span>
                )}
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-100 bg-black/15 px-2 py-0.5 rounded-md">
                Foody-Ham Member
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-colors flex items-center justify-center"
            title="Close Sidebar"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-6">
          
          {/* Group 1: User Services */}
          <div>
            <p className="px-3 text-[11px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
              My Dashboard
            </p>
            <div className="space-y-1">
              <Link
                to="/profile"
                onClick={onClose}
                className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 group ${
                  isActive('/profile')
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-md shadow-orange-500/20'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800/60 hover:text-orange-600 dark:hover:text-orange-400'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                  isActive('/profile') ? 'bg-white/20 text-white' : 'bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400'
                }`}>
                  <FaUser size={15} />
                </div>
                <span className="text-sm">My Profile</span>
              </Link>

              <Link
                to="/orders"
                onClick={onClose}
                className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 group ${
                  isActive('/orders')
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-md shadow-orange-500/20'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800/60 hover:text-orange-600 dark:hover:text-orange-400'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                  isActive('/orders') ? 'bg-white/20 text-white' : 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                }`}>
                  <FaHistory size={15} />
                </div>
                <span className="text-sm">My Orders</span>
              </Link>

              <Link
                to="/group-orders"
                onClick={onClose}
                className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 group ${
                  isActive('/group-orders')
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-md shadow-orange-500/20'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800/60 hover:text-orange-600 dark:hover:text-orange-400'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                  isActive('/group-orders') ? 'bg-white/20 text-white' : 'bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400'
                }`}>
                  <FaUsers size={15} />
                </div>
                <span className="text-sm">Group Orders</span>
              </Link>

              <Link
                to="/reservations"
                onClick={onClose}
                className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 group ${
                  isActive('/reservations')
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-md shadow-orange-500/20'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800/60 hover:text-orange-600 dark:hover:text-orange-400'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                  isActive('/reservations') ? 'bg-white/20 text-white' : 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                }`}>
                  <FaUtensils size={15} />
                </div>
                <span className="text-sm">Table Reservations</span>
              </Link>

              <Link
                to="/food-diary"
                onClick={onClose}
                className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 group ${
                  isActive('/food-diary')
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-md shadow-orange-500/20'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800/60 hover:text-orange-600 dark:hover:text-orange-400'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                  isActive('/food-diary') ? 'bg-white/20 text-white' : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                }`}>
                  <FaChartBar size={15} />
                </div>
                <span className="text-sm">Food Diary</span>
              </Link>

              <Link
                to="/loyalty"
                onClick={onClose}
                className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 group ${
                  isActive('/loyalty')
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-md shadow-orange-500/20'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800/60 hover:text-orange-600 dark:hover:text-orange-400'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                  isActive('/loyalty') ? 'bg-white/20 text-white' : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                }`}>
                  <FaTrophy size={15} />
                </div>
                <span className="text-sm">Loyalty Rewards</span>
              </Link>

              <Link
                to="/subscriptions"
                onClick={onClose}
                className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 group ${
                  isActive('/subscriptions')
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-md shadow-orange-500/20'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800/60 hover:text-orange-600 dark:hover:text-orange-400'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                  isActive('/subscriptions') ? 'bg-white/20 text-white' : 'bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400'
                }`}>
                  <FaCalendarAlt size={15} />
                </div>
                <span className="text-sm">Meal Plans</span>
              </Link>

              <button
                onClick={() => {
                  onClose();
                  window.dispatchEvent(new CustomEvent('openSpin'));
                }}
                className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800/60 hover:text-orange-600 dark:hover:text-orange-400 text-left group"
              >
                <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                  <FaGamepad size={15} />
                </div>
                <span className="text-sm">Spin & Win</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer Logout Button */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 font-bold text-sm transition-all duration-200 shadow-sm group border border-red-100 dark:border-red-900/30"
          >
            <FaSignOutAlt className="group-hover:-translate-x-0.5 transition-transform" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default UserSidebar;
