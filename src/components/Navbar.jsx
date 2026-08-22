import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaPlus, FaSignOutAlt, FaBars, FaTimes, FaSpinner, FaHome, FaUtensils, FaInfoCircle, FaEnvelope, FaCrown, FaHeart, FaMoon, FaSun } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useDarkMode } from '../context/DarkModeContext';
import AdminSidebar from './AdminSidebar';
import UserSidebar from './UserSidebar';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  // Ensure useAuth has been imported correctly (it is)
  const { user, logout, loading: authLoading } = useAuth();
  const { getCartCount, loading: cartLoading } = useCart();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAdminSidebar, setShowAdminSidebar] = useState(false);
  const [showUserSidebar, setShowUserSidebar] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll for navbar effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => {
    return location.pathname === path 
      ? 'text-orange-500 font-semibold border-b-2 border-orange-500' 
      : 'text-gray-700 hover:text-orange-500 transition-colors duration-300';
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowAdminSidebar(false);
    setShowUserSidebar(false);
    setIsMenuOpen(false);
  };

  // Get cart count or show loading
  const cartCount = getCartCount();
  const showCartBadge = cartCount > 0;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-2xl py-2 border-b border-gray-100 dark:border-gray-800' 
        : 'py-4 shadow-[0_15px_50px_-12px_rgba(249,115,22,0.5)] dark:shadow-[0_15px_50px_-12px_rgba(0,0,0,0.7)]'
    }`}>
      {/* 3D Background Layer */}
      {!scrolled && (
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {/* Base gradient layer */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
          {/* Mesh pattern overlay */}
          <div className="absolute inset-0 opacity-30" style={{backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(249,115,22,0.15) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(251,146,60,0.15) 2%, transparent 0%)', backgroundSize: '100px 100px'}}></div>
          {/* Radial glow spots */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(251,146,60,0.3),transparent_40%)] dark:bg-[radial-gradient(circle_at_20%_30%,rgba(249,115,22,0.15),transparent_40%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,rgba(245,158,11,0.25),transparent_40%)] dark:bg-[radial-gradient(circle_at_80%_60%,rgba(249,115,22,0.1),transparent_40%)]"></div>
          {/* Top shine effect */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-orange-300 to-transparent dark:via-orange-700"></div>
          {/* Bottom 3D border */}
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-orange-300 via-amber-400 to-orange-300 dark:from-orange-800 dark:via-orange-700 dark:to-orange-800 shadow-[0_2px_10px_rgba(249,115,22,0.4)]"></div>
        </div>
      )}
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo with Enhanced Design */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-500 rounded-2xl flex items-center justify-center shadow-[0_8px_16px_rgba(249,115,22,0.4)] group-hover:shadow-[0_12px_24px_rgba(249,115,22,0.5)] transition-all duration-300 transform group-hover:scale-105 group-hover:rotate-3">
                <span className="text-white font-bold text-xl drop-shadow-lg">FH</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-red-500 to-red-600 rounded-full animate-pulse shadow-lg"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 bg-clip-text text-transparent drop-shadow-sm">
                Foody-Ham
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-semibold tracking-wide">Savor the Excellence</span>
            </div>
          </Link>

          {/* Desktop Navigation with Enhanced Design */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link 
              to="/" 
              className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 hover:bg-gradient-to-br hover:from-orange-50 hover:to-amber-50 dark:hover:bg-gray-800 hover:shadow-[0_4px_12px_rgba(249,115,22,0.2)] active:scale-95 ${isActive('/')}`}
            >
              <FaHome className="text-lg" />
              <span className="font-medium">Home</span>
            </Link>
            
            <Link 
              to="/menu" 
              className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 hover:bg-gradient-to-br hover:from-orange-50 hover:to-amber-50 dark:hover:bg-gray-800 hover:shadow-[0_4px_12px_rgba(249,115,22,0.2)] active:scale-95 ${isActive('/menu')}`}
            >
              <FaUtensils className="text-lg" />
              <span className="font-medium">Menu</span>
            </Link>
            
            {user?.isAdmin && (
              <Link 
                to="/add-product" 
                className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 hover:bg-gradient-to-br hover:from-orange-50 hover:to-amber-50 dark:hover:bg-gray-800 hover:shadow-[0_4px_12px_rgba(249,115,22,0.2)] active:scale-95 ${isActive('/add-product')}`}
              >
                <FaPlus className="text-lg" />
                <span className="font-medium">Add Product</span>
              </Link>
            )}
            
            <Link 
              to="/about" 
              className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 hover:bg-gradient-to-br hover:from-orange-50 hover:to-amber-50 dark:hover:bg-gray-800 hover:shadow-[0_4px_12px_rgba(249,115,22,0.2)] active:scale-95 ${isActive('/about')}`}
            >
              <FaInfoCircle className="text-lg" />
              <span className="font-medium">About</span>
            </Link>

            <Link 
              to="/contact" 
              className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 hover:bg-gradient-to-br hover:from-orange-50 hover:to-amber-50 dark:hover:bg-gray-800 hover:shadow-[0_4px_12px_rgba(249,115,22,0.2)] active:scale-95 ${isActive('/contact')}`}
            >
              <FaEnvelope className="text-lg" />
              <span className="font-medium">Contact</span>
            </Link>
          </div>

          {/* User Actions with Enhanced Design */}
          <div className="flex items-center space-x-4 lg:space-x-6">
            {/* Dark Mode Toggle */}
            <button
              onClick={(e) => {
                e.preventDefault();
                console.log('Button clicked, current mode:', isDarkMode);
                toggleDarkMode();
              }}
              className="p-2.5 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.4)] transition-all duration-300 hover:scale-110 border border-gray-100 dark:border-gray-600"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <FaSun className="text-xl text-yellow-500" />
              ) : (
                <FaMoon className="text-xl text-gray-600 dark:text-gray-300" />
              )}
            </button>
            {/* Wishlist Icon */}
            <Link to="/wishlist" className="relative group">
              <div className="p-2.5 bg-gradient-to-br from-white to-orange-50 dark:from-gray-700 dark:to-gray-800 rounded-xl shadow-[0_4px_12px_rgba(249,115,22,0.15)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.3)] transition-all duration-300 hover:scale-110 active:scale-95 border border-orange-100 dark:border-gray-600">
                <FaHeart className={`text-xl transition-colors duration-300 ${
                  location.pathname === '/wishlist' ? 'text-red-500' : 'text-gray-600 group-hover:text-red-500'
                }`} />
              </div>
            </Link>

            {/* Cart Icon with Enhanced Badge */}
            <Link to="/cart" className="relative group" data-cart-icon>
              <div className="p-2.5 bg-gradient-to-br from-white to-orange-50 dark:from-gray-700 dark:to-gray-800 rounded-xl shadow-[0_4px_12px_rgba(249,115,22,0.15)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.3)] transition-all duration-300 hover:scale-110 border border-orange-100 dark:border-gray-600">
                <FaShoppingCart className={`text-xl transition-colors duration-300 ${
                  location.pathname === '/cart' ? 'text-orange-500' : 'text-gray-600 group-hover:text-orange-500'
                }`} />
              </div>
              
              {/* Enhanced Cart Badge */}
              {cartLoading ? (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                  <FaSpinner className="animate-spin" size={10} />
                </span>
              ) : showCartBadge ? (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-pulse">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              ) : null}
            </Link>

            {/* Enhanced User Dropdown */}
            {authLoading ? (
              <div className="p-2.5 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-md border border-gray-100">
                <FaSpinner className="animate-spin text-gray-400" size={20} />
              </div>
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => user.isAdmin ? setShowAdminSidebar(!showAdminSidebar) : setShowUserSidebar(!showUserSidebar)}
                  className="flex items-center gap-3 group"
                  disabled={authLoading}
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(249,115,22,0.3)] group-hover:shadow-[0_6px_16px_rgba(249,115,22,0.5)] transition-all duration-300 transform group-hover:scale-110">
                      <FaUser className="text-white text-lg" />
                    </div>
                    {user.isAdmin && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center justify-center">
                        <FaCrown className="text-white text-xs" />
                      </div>
                    )}
                  </div>
                  
                  <div className="hidden lg:flex flex-col items-start">
                    <span className="font-semibold text-gray-800 dark:text-gray-100">{user.name}</span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      {user.isAdmin ? (
                        <>
                          <FaCrown className="text-amber-500" />
                          Administrator
                        </>
                      ) : (
                        'Member'
                      )}
                    </span>
                  </div>
                </button>


              </div>
            ) : (
              <Link
                to="/login"
                className="hidden lg:inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-xl hover:shadow-orange-500/25 hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-md"
              >
                Login
              </Link>
            )}

            {/* Enhanced Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-2.5 rounded-xl transition-all duration-300 ${
                isMenuOpen 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white' 
                  : 'bg-gradient-to-br from-gray-50 to-white shadow-md hover:shadow-lg'
              }`}
              disabled={authLoading}
            >
              {isMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-6 pt-4 border-t border-gray-200/50">
            <div className="grid gap-1">
              <Link 
                to="/" 
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${isActive('/')}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <FaHome className="text-lg" />
                <span className="font-medium">Home</span>
              </Link>
              
              <Link 
                to="/menu" 
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${isActive('/menu')}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <FaUtensils className="text-lg" />
                <span className="font-medium">Menu</span>
              </Link>
              
              {user?.isAdmin && (
                <Link 
                  to="/add-product" 
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${isActive('/add-product')}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaPlus className="text-lg" />
                  <span className="font-medium">Add Product</span>
                </Link>
              )}
              
              <Link 
                to="/about" 
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${isActive('/about')}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <FaInfoCircle className="text-lg" />
                <span className="font-medium">About</span>
              </Link>

              <Link 
                to="/contact" 
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${isActive('/contact')}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <FaEnvelope className="text-lg" />
                <span className="font-medium">Contact</span>
              </Link>
              
              <Link 
                to="/wishlist" 
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${isActive('/wishlist')}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <FaHeart className="text-lg" />
                <span className="font-medium">Wishlist</span>
              </Link>
              
              <Link 
                to="/cart" 
                className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-gradient-to-r from-gray-50 to-white shadow-inner border border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <FaShoppingCart className="text-lg text-gray-600" />
                  <span className="font-medium">Cart</span>
                </div>
                {!cartLoading && cartCount > 0 && (
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
                {cartLoading && <FaSpinner className="animate-spin" size={16} />}
              </Link>
              
              {!user && !authLoading && (
                <Link 
                  to="/login" 
                  className="mt-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-3.5 rounded-xl font-semibold text-center hover:shadow-lg transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
              
              {authLoading && (
                <div className="px-4 py-3.5 text-gray-500 flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin" /> Loading...
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Admin Sidebar */}
      <AdminSidebar 
        isOpen={showAdminSidebar}
        onClose={() => setShowAdminSidebar(false)}
        user={user}
        onLogout={handleLogout}
      />
      
      {/* User Sidebar */}
      <UserSidebar 
        isOpen={showUserSidebar}
        onClose={() => setShowUserSidebar(false)}
        user={user}
        onLogout={handleLogout}
      />
    </nav>
  );
}

export default Navbar;