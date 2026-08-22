import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { X, RotateCcw, ShoppingCart, Navigation } from 'lucide-react';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const { reorderItems } = useCart();

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
        fetchOrders();
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReorder = async (order) => {
    setActionLoading(order._id);
    try {
      const result = await reorderItems(order.items);
      if (result.success) {
        alert(`✅ ${result.addedItems} items added to cart!`);
      } else {
        alert(result.message || 'Failed to add items to cart');
      }
    } catch (error) {
      console.error('Error reordering:', error);
      alert('Failed to reorder items');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
        <p className="text-gray-600">Loading order history...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Order History</h1>

        <Link
          to="/orders/demo/track"
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold rounded-2xl shadow-lg shadow-orange-500/20 hover:scale-105 transition-all text-xs"
        >
          <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
          <Navigation size={14} />
          <span>🛵 Live Delivery GPS Tracker Demo</span>
        </Link>
      </div>
      
      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800">
          <p className="text-gray-600 dark:text-gray-400 mb-4">You haven't placed any orders yet.</p>
          <div className="flex justify-center gap-4">
            <Link to="/menu" className="inline-block bg-orange-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition-colors">
              Browse Menu
            </Link>
            <Link to="/orders/demo/track" className="inline-block bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-colors">
              🛵 Demo Live GPS Tracking
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">Order #{order._id?.slice(-8).toUpperCase()}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                  {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                </span>
              </div>
              
              <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-2">Items:</h4>
                <div className="space-y-2">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{item.name} x {item.quantity}</span>
                      <span className="font-bold text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-black text-base text-gray-900 dark:text-white">Total: ${order.totalPrice?.toFixed(2)}</span>
                  <span className="text-xs font-semibold text-gray-500">Payment: {order.paymentMethod}</span>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Link
                    to={`/orders/${order._id}/track`}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-xs rounded-xl shadow-md shadow-orange-500/20 hover:scale-105 transition-transform"
                  >
                    <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                    <Navigation size={14} />
                    <span>Track Live GPS</span>
                  </Link>

                  {canCancelOrder(order.status) && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={actionLoading === order._id}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white text-xs font-bold rounded-xl hover:bg-red-600 disabled:opacity-50 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>{actionLoading === order._id ? 'Cancelling...' : 'Cancel Order'}</span>
                    </button>
                  )}
                  
                  {['delivered', 'cancelled'].includes(order.status) && (
                    <button
                      onClick={() => handleReorder(order)}
                      disabled={actionLoading === order._id}
                      className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>{actionLoading === order._id ? 'Adding...' : 'Reorder'}</span>
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