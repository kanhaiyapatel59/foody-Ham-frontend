import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaCreditCard, FaSpinner } from 'react-icons/fa';

function CartPage() {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal 
  } = useCart();
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleCheckout = () => {
    if (!user) {
      alert('Please login to checkout');
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    // Prepare order data
    const orderData = {
      items: cartItems.map(item => ({
        product: item.id || item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      totalAmount: totalAmount,
      shippingAddress: user.address || ''
    };

    // Navigate to payment page with order data
    navigate('/payment', { state: { orderData } });
  };



  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center dark:bg-gray-950 min-h-screen">
        <div className="max-w-md mx-auto">
          <FaShoppingCart className="text-6xl text-gray-300 dark:text-gray-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Add some delicious items from our menu!</p>
          <Link
            to="/menu"
            className="bg-orange-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-orange-600 transition duration-300 inline-block"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  const shippingFee = 5.00;
  const taxRate = 0.08;
  const taxAmount = getCartTotal() * taxRate;
  const totalAmount = getCartTotal() + shippingFee + taxAmount;

  return (
    <div className="container mx-auto px-4 py-12 dark:bg-gray-950 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">Shopping Cart</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cartItems.map(item => (
            <div key={`${item.product || item._id || item.id}-${item.name}`} className="bg-white dark:bg-gray-900 rounded-lg shadow-md dark:shadow-gray-800 p-6 mb-4 dark:border dark:border-gray-800">
              <div className="flex items-start space-x-4">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{item.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-1">{item.description}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product || item._id || item.id)}
                      className="text-red-500 hover:text-red-600 ml-2"
                      title="Remove item"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.product || item._id || item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 dark:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 dark:border dark:border-gray-700"
                        title="Decrease quantity"
                        disabled={item.quantity <= 1}
                      >
                        <FaMinus />
                      </button>
                      <span className="text-lg font-semibold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product || item._id || item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 dark:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 dark:border dark:border-gray-700"
                        title="Increase quantity"
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-500">
                        ${((item.price || 0) * item.quantity).toFixed(2)}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 text-sm">
                        ${(item.price || 0).toFixed(2)} each
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-600 flex items-center gap-2 mt-4"
          >
            <FaTrash /> Clear Cart
          </button>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md dark:shadow-gray-800 p-6 sticky top-24 dark:border dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span className="font-semibold">${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                <span className="font-semibold">${shippingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tax (8%)</span>
                <span className="font-semibold">${taxAmount.toFixed(2)}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-orange-500">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={!user}
              className="w-full bg-orange-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-orange-600 transition duration-300 mb-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaCreditCard /> {!user ? 'Login to Checkout' : 'Proceed to Checkout'}
            </button>

            <Link
              to="/menu"
              className="w-full text-center block bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300 disabled:opacity-50 dark:border dark:border-gray-700"
            >
              Continue Shopping
            </Link>
            
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              <p className="mb-1">• Free delivery on orders over $50</p>
              <p className="mb-1">• Estimated delivery: 30-45 minutes</p>
              <p>• Secure payment processing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;