import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const RecentlyViewedContext = createContext();

export const useRecentlyViewed = () => useContext(RecentlyViewedContext);

export const RecentlyViewedProvider = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Load recently viewed from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('foodyham_recently_viewed');
    if (saved) {
      try {
        setRecentlyViewed(JSON.parse(saved));
      } catch (error) {
        console.error('Error parsing recently viewed:', error);
        setRecentlyViewed([]);
      }
    }
  }, []);

  const addToRecentlyViewed = useCallback((product) => {
    setRecentlyViewed(prevItems => {
      // Remove if already exists
      const filtered = prevItems.filter(item => 
        (item._id || item.id) !== (product._id || product.id)
      );
      
      // Add to beginning
      const newItems = [product, ...filtered];
      
      // Keep only last 10 items
      const limited = newItems.slice(0, 10);
      
      // Save to localStorage
      localStorage.setItem('foodyham_recently_viewed', JSON.stringify(limited));
      
      return limited;
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
    localStorage.removeItem('foodyham_recently_viewed');
  }, []);

  const value = {
    recentlyViewed,
    addToRecentlyViewed,
    clearRecentlyViewed
  };

  return (
    <RecentlyViewedContext.Provider value={value}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};