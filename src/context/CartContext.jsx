
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { api } from './AuthContext';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      
      if (user) {

        try {
          const response = await api.get('/cart');
          const backendCart = response.data.data.items || [];
          setCartItems(backendCart);
        } catch (error) {
          console.error('Error loading cart from backend:', error);

          loadFromLocalStorage();
        }
      } else {

        loadFromLocalStorage();
      }
      
      setLoading(false);
    };

    const loadFromLocalStorage = () => {
      const savedCart = localStorage.getItem('foodyham_cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          const cartWithNumberPrices = parsedCart.map(item => ({
            ...item,
            price: typeof item.price === 'string' ? parseFloat(item.price) : item.price
          }));
          setCartItems(cartWithNumberPrices);
        } catch (error) {
          console.error('Error parsing cart from localStorage:', error);
          setCartItems([]);
        }
      }
    };

    loadCart();
  }, [user]);


  useEffect(() => {
    const syncCartOnLogin = async () => {
      if (user && cartItems.length > 0) {
        try {

          const response = await api.get('/cart');
          const backendItems = response.data.data.items || [];
          
          if (backendItems.length === 0) {
            for (const item of cartItems) {
              await api.post('/cart', {
                productId: item._id || item.id,
                quantity: item.quantity
              });
            }
            const updatedResponse = await api.get('/cart');
            setCartItems(updatedResponse.data.data.items || []);
          }
        } catch (error) {
          console.error('Error syncing cart on login:', error);
        }
      }
    };

    syncCartOnLogin();
  }, [user]);

  const addToCart = useCallback(async (product, quantity = 1) => {
    const productWithNumberPrice = {
      ...product,
      price: typeof product.price === 'string' ? parseFloat(product.price) : product.price
    };

    // Check current quantity in cart
    const existingItem = cartItems.find(item => (item.id || item._id || item.product) === (product.id || product._id));
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    const newQuantity = currentQuantity + quantity;

    if (newQuantity > 10) {
      alert('⚠️ Maximum quantity limit reached! You can only add up to 10 items of this product.');
      return;
    }

    if (user) {
      try {
        const response = await api.post('/cart', {
          productId: product._id || product.id,
          quantity
        });
        
        if (response.data.success) {
          setCartItems(response.data.data.items || []);
        } else {
          throw new Error(response.data.message || 'Failed to add to cart');
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        if (error.response?.data?.message) {
          alert(error.response.data.message);
        } else {
          alert('Added to cart locally. Please refresh to sync with server.');
          updateLocalStorage(productWithNumberPrice, quantity);
        }
      }
    } else {
      updateLocalStorage(productWithNumberPrice, quantity);
      alert('Item added to cart! Please login to save your cart.');
    }
  }, [user, cartItems]);

  const updateLocalStorage = (product, quantity) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => (item.id || item._id) === (product.id || product._id));
      
      let newItems;
      if (existingItem) {
        const newQuantity = Math.min(existingItem.quantity + quantity, 10);
        newItems = prevItems.map(item =>
          (item.id || item._id) === (product.id || product._id)
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        newItems = [...prevItems, { ...product, quantity: Math.min(quantity, 10) }];
      }
      
      localStorage.setItem('foodyham_cart', JSON.stringify(newItems));
      return newItems;
    });
  };

  const removeFromCart = useCallback(async (productId) => {
    if (user) {
      try {
        const response = await api.delete(`/cart/${productId}`);
        setCartItems(response.data.data.items || []);
      } catch (error) {
        console.error('Error removing from cart:', error);

        setCartItems(prevItems => {
          const newItems = prevItems.filter(item => (item.id || item._id) !== productId);
          localStorage.setItem('foodyham_cart', JSON.stringify(newItems));
          return newItems;
        });
      }
    } else {
      setCartItems(prevItems => {
        const newItems = prevItems.filter(item => (item.id || item._id) !== productId);
        localStorage.setItem('foodyham_cart', JSON.stringify(newItems));
        return newItems;
      });
    }
  }, [user]);

  const updateQuantity = useCallback(async (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    if (quantity > 10) {
      alert('⚠️ Maximum quantity limit is 10 items per product.');
      return;
    }
    
    if (user) {
      try {
        const response = await api.put(`/cart/${productId}`, {
          quantity
        });
        setCartItems(response.data.data.items || []);
      } catch (error) {
        console.error('Error updating quantity:', error);
        if (error.response?.data?.message) {
          alert(error.response.data.message);
        } else {
          setCartItems(prevItems => {
            const newItems = prevItems.map(item =>
              (item.id || item._id) === productId ? { ...item, quantity: Math.min(quantity, 10) } : item
            );
            localStorage.setItem('foodyham_cart', JSON.stringify(newItems));
            return newItems;
          });
        }
      }
    } else {
      setCartItems(prevItems => {
        const newItems = prevItems.map(item =>
          (item.id || item._id) === productId ? { ...item, quantity: Math.min(quantity, 10) } : item
        );
        localStorage.setItem('foodyham_cart', JSON.stringify(newItems));
        return newItems;
      });
    }
  }, [user, removeFromCart]);

  const clearCart = useCallback(async () => {
    if (user) {
      try {
        await api.delete('/cart/clear');
        setCartItems([]);
      } catch (error) {
        console.error('Error clearing cart:', error);
        setCartItems([]);
        localStorage.removeItem('foodyham_cart');
      }
    } else {
      setCartItems([]);
      localStorage.removeItem('foodyham_cart');
    }
  }, [user]);

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => {
      const price = typeof item.price === 'string' ? parseFloat(item.price) : (item.price || 0);
      const quantity = item.quantity || 0;
      return total + (price * quantity);
    }, 0);
  }, [cartItems]);

  const getCartCount = useCallback(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  const reorderItems = useCallback(async (orderItems) => {
    try {
      setLoading(true);
      let successCount = 0;
      
      for (const item of orderItems) {
        try {
          await addToCart({
            _id: item.product,
            id: item.product,
            name: item.name,
            price: item.price,
            image: item.image
          }, item.quantity);
          successCount++;
        } catch (error) {
          console.error(`Failed to add ${item.name} to cart:`, error);
        }
      }
      
      return { success: true, addedItems: successCount, totalItems: orderItems.length };
    } catch (error) {
      console.error('Reorder failed:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [addToCart]);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    reorderItems,
    loading
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
