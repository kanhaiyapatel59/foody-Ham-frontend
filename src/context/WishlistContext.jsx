import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { api } from './AuthContext';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Load wishlist from backend or localStorage
  useEffect(() => {
    const loadWishlist = async () => {
      if (user) {
        try {
          const response = await api.get('/wishlist');
          setWishlistItems(response.data.data.items || []);
        } catch (error) {
          console.error('Error loading wishlist:', error);
          loadFromLocalStorage();
        }
      } else {
        loadFromLocalStorage();
      }
    };

    const loadFromLocalStorage = () => {
      const savedWishlist = localStorage.getItem('foodyham_wishlist');
      if (savedWishlist) {
        try {
          setWishlistItems(JSON.parse(savedWishlist));
        } catch (error) {
          console.error('Error parsing wishlist from localStorage:', error);
          setWishlistItems([]);
        }
      }
    };

    loadWishlist();
  }, [user]);

  const addToWishlist = useCallback(async (product) => {
    if (user) {
      try {
        const response = await api.post('/wishlist', {
          productId: product._id || product.id
        });
        setWishlistItems(response.data.data.items || []);
      } catch (error) {
        console.error('Error adding to wishlist:', error);
        // Fallback to localStorage
        updateLocalStorageWishlist(product, 'add');
      }
    } else {
      updateLocalStorageWishlist(product, 'add');
    }
  }, [user]);

  const removeFromWishlist = useCallback(async (productId) => {
    if (user) {
      try {
        const response = await api.delete(`/wishlist/${productId}`);
        setWishlistItems(response.data.data.items || []);
      } catch (error) {
        console.error('Error removing from wishlist:', error);
        // Fallback to localStorage
        updateLocalStorageWishlist(productId, 'remove');
      }
    } else {
      updateLocalStorageWishlist(productId, 'remove');
    }
  }, [user]);

  const updateLocalStorageWishlist = (product, action) => {
    setWishlistItems(prevItems => {
      let newItems;
      if (action === 'add') {
        const exists = prevItems.find(item => 
          (item.product?._id || item.product?.id) === (product._id || product.id)
        );
        if (!exists) {
          newItems = [...prevItems, { product, addedAt: new Date() }];
        } else {
          newItems = prevItems;
        }
      } else {
        const productId = product._id || product.id || product;
        newItems = prevItems.filter(item => 
          (item.product?._id || item.product?.id) !== productId
        );
      }
      
      localStorage.setItem('foodyham_wishlist', JSON.stringify(newItems));
      return newItems;
    });
  };

  const isInWishlist = useCallback((productId) => {
    return wishlistItems.some(item => 
      (item.product?._id || item.product?.id) === productId
    );
  }, [wishlistItems]);

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    loading
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};