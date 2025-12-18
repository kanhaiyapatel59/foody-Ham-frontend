import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { FaHeart, FaShoppingCart, FaTrash } from 'react-icons/fa';

function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product.product || product, 1);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center dark:bg-gray-950 min-h-screen">
        <div className="max-w-md mx-auto">
          <FaHeart className="text-6xl text-gray-300 dark:text-gray-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Your wishlist is empty</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Save your favorite items for later!</p>
          <Link
            to="/menu"
            className="bg-red-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-red-600 transition duration-300 inline-block"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 dark:bg-gray-950 min-h-screen transition-colors duration-300">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 flex items-center gap-3">
        <FaHeart className="text-red-500" />
        My Wishlist ({wishlistItems.length})
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map(item => {
          const product = item.product || item;
          return (
            <div key={product._id || product.id} className="bg-white dark:bg-gray-900 rounded-lg shadow-md dark:shadow-gray-800 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 transform dark:border dark:border-gray-800">
              <Link to={`/product/${product._id || product.id}`}>
                <img 
                  src={product.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop'} 
                  alt={product.name} 
                  className="w-full h-48 object-cover"
                />
              </Link>
              
              <div className="p-4">
                <Link to={`/product/${product._id || product.id}`}>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-red-500">
                    ${product.price?.toFixed(2)}
                  </span>
                  {product.averageRating > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {product.averageRating} ({product.totalReviews})
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300 flex items-center justify-center gap-2"
                  >
                    <FaShoppingCart className="text-sm" />
                    Add to Cart
                  </button>
                  
                  <button
                    onClick={() => removeFromWishlist(product._id || product.id)}
                    className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-200 py-2 px-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition duration-300 dark:border dark:border-gray-700"
                    title="Remove from wishlist"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WishlistPage;