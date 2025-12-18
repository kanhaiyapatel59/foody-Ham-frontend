import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useWishlist } from '../context/WishlistContext';

function WishlistButton({ product, className = '' }) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product._id || product.id);

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWishlist) {
      removeFromWishlist(product._id || product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-full transition-all duration-300 ${
        inWishlist 
          ? 'text-red-500 bg-red-50 hover:bg-red-100' 
          : 'text-gray-400 bg-gray-50 hover:bg-gray-100 hover:text-red-500'
      } ${className}`}
      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {inWishlist ? <FaHeart /> : <FaRegHeart />}
    </button>
  );
}

export default WishlistButton;