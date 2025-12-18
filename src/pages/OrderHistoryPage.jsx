import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { X, RotateCcw } from 'lucide-react';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/orders`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(response.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-blue-100 text-blue-800',
      ready: 'bg-green-100 text-green-800',
      delivered: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const canCancelOrder = (status) => {
    return ['pending', 'confirmed'].includes(status);
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? The amount will be refunded to your wallet.')) {
      return;
    }

    setActionLoading(orderId);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/orders/${orderId}/cancel`,
        { reason: 'Cancelled by user' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        alert('Order cancelled successfully. Refund added to your wallet.');
        fetchOrders(); // Refresh orders
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setActionLoading(null);
    }
  };

  const handleOrderAgain = async (orderId) => {
    setActionLoading(orderId);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/orders/${orderId}/items`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const { availableItems, unavailableItems } = response.data.data;
      
      // Add available items to cart
      for (const item of availableItems) {
        await addToCart(item, item.quantity);
      }
      
      let message = `${availableItems.length} items added to cart!`;
      if (unavailableItems.length > 0) {
        message += `\n\n${unavailableItems.length} items were unavailable:`;
        unavailableItems.forEach(item => {
          message += `\n- ${item.name} (${item.reason})`;
        });
      }
      
      alert(message);
    } catch (error) {
      console.error('Error reordering:', error);
      alert(error.response?.data?.message || 'Failed to add items to cart');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading orders...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No orders found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Order #{order._id.slice(-8)}</h3>
                  <p className="text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                </span>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Items:</h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.name} x {item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold">Total: ${order.totalPrice.toFixed(2)}</span>
                  <span className="text-sm text-gray-600">Payment: {order.paymentMethod}</span>
                </div>
                
                <div className="flex gap-3">
                  {canCancelOrder(order.status) && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={actionLoading === order._id}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <X className="w-4 h-4" />
                      <span>{actionLoading === order._id ? 'Cancelling...' : 'Cancel Order'}</span>
                    </button>
                  )}
                  
                  {['delivered', 'cancelled'].includes(order.status) && (
                    <button
                      onClick={() => handleOrderAgain(order._id)}
                      disabled={actionLoading === order._id}
                      className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>{actionLoading === order._id ? 'Adding...' : 'Order Again'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;