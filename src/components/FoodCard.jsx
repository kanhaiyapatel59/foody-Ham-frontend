import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../context/AuthContext';
import { FaHeart, FaRegHeart, FaSpinner, FaStar, FaShoppingCart, FaEye, FaTag, FaFire, FaShare } from 'react-icons/fa';
import WishlistButton from './WishlistButton';
import StarRating from './StarRating';
import SocialShare from './SocialShare';
import CartAnimation from './CartAnimation';
import LazyImage from './LazyImage';

function FoodCard({ 
  id, 
  name, 
  image, 
  description, 
  price, 
  isFeatured: initialIsFeatured, 
  category,
  rating,
  averageRating,
  totalReviews,
  nutritionalInfo,
  className = ''
}) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate(); 
  
  const [isFeatured, setIsFeatured] = useState(initialIsFeatured || false);
  const [loadingFeature, setLoadingFeature] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationStart, setAnimationStart] = useState({ x: 0, y: 0 });

  const product = { 
    id, 
    name, 
    image, 
    description, 
    price: parseFloat(price),
    category,
    isFeatured,
    rating,
    nutritionalInfo
  };
  
  const handleAddToCart = (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }
    
    const rect = e.currentTarget.getBoundingClientRect();
    setAnimationStart({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
    setShowAnimation(true);
    
    addToCart(product, 1);
    
    const cartIcon = document.querySelector('[data-cart-icon]');
    if (cartIcon) {
      cartIcon.classList.add('animate-bounce');
      setTimeout(() => cartIcon.classList.remove('animate-bounce'), 1000);
    }
  };

  const handleToggleFeature = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user || !user.isAdmin) return;

    setLoadingFeature(true);
    const newFeaturedStatus = !isFeatured;

    try {
      const res = await api.put(`/products/feature/${id}`, { 
        isFeatured: newFeaturedStatus 
      });

      if (res.data.success) {
        setIsFeatured(newFeaturedStatus);
      } else {
        alert('Failed to update featured status.');
      }
    } catch (error) {
      console.error("Error toggling feature status:", error);
      alert('Error communicating with server to update feature status.');
    } finally {
      setLoadingFeature(false);
    }
  };
  
  const handleViewDetails = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${id}`);
  }

  return (
    // --------------------------------------------------------------------------------------------------
    // 🛑 FIX START: Replaced the entire wrapping <Link> with a <div>.
    // The link functionality is now provided ONLY by the parent <Link> in MenuPage.jsx.
    // --------------------------------------------------------------------------------------------------
    <div 
      className={`
        group relative h-full flex flex-col rounded-2xl overflow-hidden 
        transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2
        bg-gradient-to-br from-white to-gray-50 border border-gray-200/50
        shadow-lg hover:shadow-2xl
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      {/* 🛑 CONTENT WRAPPER: This was the redundant Link that caused the error. Now it's a simple <div>.
          The classes needed for styling are kept.
      */}
      <div 
        className="block h-full flex flex-col" // Keeping the original styling classes
      >

        {/* Featured Badge - Top Left */}
        {isFeatured && (
          <div className="absolute top-4 left-4 z-20">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xl flex items-center gap-1.5">
              <FaFire className="w-3 h-3" />
              <span>FEATURED</span>
            </div>
          </div>
        )}
        
        {/* New Badge - Top Left (if not featured) */}
        {!isFeatured && Math.random() > 0.7 && (
          <div className="absolute top-4 left-4 z-20">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xl animate-pulse">
              NEW
            </div>
          </div>
        )}

        {/* Sale Badge - Top Right Corner */}
        {Math.random() > 0.6 && (
          <div className="absolute top-4 right-4 z-20">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-xs font-black px-3 py-1.5 rounded-lg shadow-xl transform rotate-3">
              {Math.floor(Math.random() * 30) + 10}% OFF
            </div>
          </div>
        )}
        
        {/* Wishlist Button - Top Right (below sale badge) */}
        <div className="absolute top-16 right-4 z-20">
          <WishlistButton product={product} className="shadow-lg" />
        </div>

        {/* ADMIN FEATURE TOGGLE BUTTON - Must use a <button> and stop propagation */}
        {user && user.isAdmin && (
          <button
            onClick={handleToggleFeature}
            className={`absolute top-16 right-4 z-20 p-2.5 rounded-full shadow-xl
                       ${isFeatured ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white/90 text-gray-700 hover:bg-white'} 
                       transition-all duration-300 disabled:opacity-50 backdrop-blur-sm
                       hover:scale-110`}
            disabled={loadingFeature}
            title={isFeatured ? "Remove from Featured" : "Add to Featured"}
          >
            {loadingFeature ? (
              <FaSpinner className="animate-spin w-4 h-4" />
            ) : isFeatured ? (
              <FaHeart className="w-4 h-4" />
            ) : (
              <FaRegHeart className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Image Container */}
        <div className="relative h-48 md:h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
          )}
          
          {/* Product Image with Lazy Loading */}
          <LazyImage 
            src={image} 
            alt={name} 
            className="w-full h-full transition-all duration-700 group-hover:scale-110"
          />
          
          {/* Hover Overlay with Quick Actions */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center pb-8 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="bg-white text-gray-800 p-3.5 rounded-full hover:bg-green-500 hover:text-white transition-all duration-300 transform hover:scale-110 shadow-lg"
                title="Add to cart"
              >
                <FaShoppingCart className="w-5 h-5" />
              </button>
              
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowShare(true);
                }}
                className="bg-white text-gray-800 p-3.5 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300 transform hover:scale-110 shadow-lg"
                title="Share this item"
              >
                <FaShare className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col p-3">
          <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-orange-600 transition-colors duration-300 line-clamp-1 tracking-tight">
            {name}
          </h3>
          
          {/* Price Section */}
          <div className="mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900 tracking-tight">
                ${typeof price === 'number' ? price.toFixed(2) : price}
              </span>
            </div>
          </div>

          {(averageRating > 0 || rating > 0) && (
            <div className="mb-3">
              <StarRating 
                rating={averageRating || rating || 0} 
                totalReviews={totalReviews || 0} 
                size="sm" 
              />
            </div>
          )}
          
          <div className="mb-2 flex items-center justify-between gap-2">
            {category && (
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {Math.floor(Math.random() * 15) + 20}-{Math.floor(Math.random() * 15) + 35}m
            </span>
          </div>
        </div>
      </div> 
      {/* 🛑 CONTENT WRAPPER closes here (It is now a div, not a Link) */}
      
      {/* FINAL Action Buttons - These buttons are correctly placed outside the wrapper. */}
      <div className="p-3 pt-0 flex gap-2 mt-auto"> 
        
        <button
          onClick={handleViewDetails} 
          className="flex-1 bg-gradient-to-r from-gray-400 to-gray-800 text-white px-3 py-2.5 rounded-lg hover:from-gray-900 hover:to-black transition-all duration-300 font-medium text-center group/view shadow-md text-sm"
        >
          <span className="flex items-center justify-center gap-1.5">
            <FaEye className="w-3.5 h-3.5" />
            View Details
          </span>
        </button>
        
        <button
          onClick={handleAddToCart}
          className={`flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-2.5 rounded-lg font-bold transition-all duration-300 text-sm
                    ${!user ? 'opacity-70 cursor-not-allowed bg-gray-400' : 'hover:shadow-xl hover:shadow-red-500/30 hover:from-red-600 hover:to-red-700'} 
                    group/cart flex items-center justify-center gap-1.5 shadow-lg`}
          title={!user ? "Login to add to cart" : "Add to cart"}
        >
          <FaShoppingCart className="w-3.5 h-3.5" />
          {!user ? 'Login to Add' : 'Add to Cart'}
        </button>
      </div>

      {/* Social Share Modal */}
      {showShare && (
        <SocialShare 
          product={product} 
          onClose={() => setShowShare(false)} 
        />
      )}

      {/* Flying Cart Animation */}
      {showAnimation && (
        <CartAnimation
          startPosition={animationStart}
          onComplete={() => setShowAnimation(false)}
        />
      )}

    </div>
  );
}

export default FoodCard;