import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const GroupOrdersPage = () => {
  const [groupOrders, setGroupOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupOrder, setNewGroupOrder] = useState({
    name: '',
    description: '',
    orderDeadline: '',
    deliveryAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });

  useEffect(() => {
    fetchGroupOrders();
  }, []);

  const fetchGroupOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/group-orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGroupOrders(response.data.data);
    } catch (error) {
      console.error('Error fetching group orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const createGroupOrder = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/group-orders`, newGroupOrder, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowCreateModal(false);
      setNewGroupOrder({
        name: '',
        description: '',
        orderDeadline: '',
        deliveryAddress: { street: '', city: '', state: '', zipCode: '' }
      });
      fetchGroupOrders();
    } catch (error) {
      console.error('Error creating group order:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      voting: 'bg-yellow-100 text-yellow-800',
      finalized: 'bg-blue-100 text-blue-800',
      ordered: 'bg-purple-100 text-purple-800',
      completed: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Group Orders</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Create Group Order
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groupOrders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow-md p-6 border">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-800">{order.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{order.description}</p>
            
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <p><span className="font-medium">Participants:</span> {order.participants.length}</p>
              <p><span className="font-medium">Total Amount:</span> ${order.totalAmount.toFixed(2)}</p>
              <p><span className="font-medium">Deadline:</span> {new Date(order.orderDeadline).toLocaleDateString()}</p>
            </div>

            <Link
              to={`/group-orders/${order._id}`}
              className="block w-full text-center bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>

      {groupOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No group orders found</p>
          <p className="text-gray-400">Create your first group order to get started!</p>
        </div>
      )}

      {/* Create Group Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold mb-4">Create Group Order</h2>
            <form onSubmit={createGroupOrder}>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Group Order Name"
                  value={newGroupOrder.name}
                  onChange={(e) => setNewGroupOrder({...newGroupOrder, name: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={newGroupOrder.description}
                  onChange={(e) => setNewGroupOrder({...newGroupOrder, description: e.target.value})}
                  className="w-full p-3 border rounded-lg h-20"
                />
                <input
                  type="datetime-local"
                  value={newGroupOrder.orderDeadline}
                  onChange={(e) => setNewGroupOrder({...newGroupOrder, orderDeadline: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Street Address"
                  value={newGroupOrder.deliveryAddress.street}
                  onChange={(e) => setNewGroupOrder({
                    ...newGroupOrder,
                    deliveryAddress: {...newGroupOrder.deliveryAddress, street: e.target.value}
                  })}
                  className="w-full p-3 border rounded-lg"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="City"
                    value={newGroupOrder.deliveryAddress.city}
                    onChange={(e) => setNewGroupOrder({
                      ...newGroupOrder,
                      deliveryAddress: {...newGroupOrder.deliveryAddress, city: e.target.value}
                    })}
                    className="p-3 border rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="ZIP Code"
                    value={newGroupOrder.deliveryAddress.zipCode}
                    onChange={(e) => setNewGroupOrder({
                      ...newGroupOrder,
                      deliveryAddress: {...newGroupOrder.deliveryAddress, zipCode: e.target.value}
                    })}
                    className="p-3 border rounded-lg"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupOrdersPage;