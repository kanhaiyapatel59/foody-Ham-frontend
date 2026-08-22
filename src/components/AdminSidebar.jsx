import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaPlus, FaUser, FaSignOutAlt, FaTimes, FaChartBar, FaTicketAlt, FaBox, FaUtensils, FaGift, FaCog, FaHistory, FaCrown, FaThumbtack } from 'react-icons/fa';

function AdminSidebar({ isOpen, onClose, user, onLogout, onMouseEnter, onMouseLeave, isPinned }) {
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
            <div className="relative">
              <div className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-md ring-2 ring-white/30">
                <FaUser className="text-white text-xl" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center ring-2 ring-orange-500">
                <FaCrown className="text-orange-950 text-[9px]" />
              </div>
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-2">
                <p className="font-extrabold text-white text-base truncate">{user?.name || 'Admin'}</p>
                {isPinned && (
                  <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded-full flex items-center gap-1 font-semibold" title="Pinned Open">
                    <FaThumbtack className="rotate-45 text-[8px]" />
                  </span>
                )}
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-100 bg-black/15 px-2 py-0.5 rounded-md">
                <FaCrown className="text-amber-300 text-[10px]" /> Administrator
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
          
          {/* Group 1: Admin Management */}
          <div>
            <p className="px-3 text-[11px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
              Admin Control Panel
            </p>
            <div className="space-y-1">
              <Link
                to="/admin/products"
                onClick={onClose}
                className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 group ${
                  isActive('/admin/products')
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-md shadow-orange-500/20'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800/60 hover:text-orange-600 dark:hover:text-orange-400'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                  isActive('/admin/products') ? 'bg-white/20 text-white' : 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                }`}>
                  <FaPlus size={15} />
                </div>
                <span className="text-sm">Manage Products</span>
              </Link>

              <Link
                to="/admin/analytics"
                onClick={onClose}
                className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 group ${
                  isActive('/admin/analytics')
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-md shadow-orange-500/20'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800/60 hover:text-orange-600 dark:hover:text-orange-400'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                  isActive('/admin/analytics') ? 'bg-white/20 text-white' : 'bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400'
                }`}>
                  <FaChartBar size={16} />
                </div>
                <span className="text-sm">Analytics</span>
              </Link>

              <Link
                to="/admin/coupons"
                onClick={onClose}
                className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 group ${
                  isActive('/admin/coupons')
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-md shadow-orange-500/20'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800/60 hover:text-orange-600 dark:hover:text-orange-400'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                  isActive('/admin/coupons') ? 'bg-white/20 text-white' : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                }`}>
                  <FaTicketAlt size={15} />
                </div>
                <span className="text-sm">Coupons</span>
              </Link>

              <Link
                to="/admin/orders"
                onClick={onClose}
                className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 group ${
                  isActive('/admin/orders')
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-md shadow-orange-500/20'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800/60 hover:text-orange-600 dark:hover:text-orange-400'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                  isActive('/admin/orders') ? 'bg-white/20 text-white' : 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                }`}>
                  <FaBox size={15} />
                </div>
                <span className="text-sm">Orders</span>
              </Link>

              <Link
                to="/admin/reservations"
                onClick={onClose}
                className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 group ${
                  isActive('/admin/reservations')
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-md shadow-orange-500/20'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800/60 hover:text-orange-600 dark:hover:text-orange-400'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                  isActive('/admin/reservations') ? 'bg-white/20 text-white' : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                }`}>
                  <FaUtensils size={15} />
                </div>
                <span className="text-sm">Reservations</span>
              </Link>

              <Link
                to="/admin/promotions"
                onClick={onClose}
                className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 group ${
                  isActive('/admin/promotions')
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-md shadow-orange-500/20'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800/60 hover:text-orange-600 dark:hover:text-orange-400'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                  isActive('/admin/promotions') ? 'bg-white/20 text-white' : 'bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400'
                }`}>
                  <FaGift size={15} />
                </div>
                <span className="text-sm">Promotions</span>
              </Link>

              <Link
                to="/admin/spin"
                onClick={onClose}
                className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 group ${
                  isActive('/admin/spin')
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-md shadow-orange-500/20'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800/60 hover:text-orange-600 dark:hover:text-orange-400'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                  isActive('/admin/spin') ? 'bg-white/20 text-white' : 'bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400'
                }`}>
                  <FaCog size={15} />
                </div>
                <span className="text-sm">Spin & Win Config</span>
              </Link>
            </div>
          </div>

          {/* Group 2: Personal Profile & Orders */}
          <div>
            <p className="px-3 text-[11px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
              My Account
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
                  isActive('/orders') ? 'bg-white/20 text-white' : 'bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400'
                }`}>
                  <FaHistory size={15} />
                </div>
                <span className="text-sm">My Orders</span>
              </Link>
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

export default AdminSidebar;
