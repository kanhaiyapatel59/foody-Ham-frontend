import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const GroupOrderDetailPage = () => {
  const { id } = useParams();
  const [groupOrder, setGroupOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showVoting, setShowVoting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchGroupOrder();
    fetchProducts();
  }, [id]);

  const fetchGroupOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/group-orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGroupOrder(response.data.data);
    } catch (error) {
      console.error('Error fetching group order:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products`);
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const joinGroupOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/group-orders/${id}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchGroupOrder();
    } catch (error) {
      console.error('Error joining group order:', error);
    }
  };

  const addItemToOrder = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/group-orders/${id}/items`, {
        productId: selectedProduct,
        quantity: parseInt(quantity)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowAddItem(false);
      setSelectedProduct('');
      setQuantity(1);
      fetchGroupOrder();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const addVotingItem = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/group-orders/${id}/voting`, {
        productId: selectedProduct
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowVoting(false);
      setSelectedProduct('');
      fetchGroupOrder();
    } catch (error) {
      console.error('Error adding voting item:', error);
    }
  };

  const vote = async (votingItemId, voteValue) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/group-orders/${id}/voting/${votingItemId}/vote`, {
        vote: voteValue
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchGroupOrder();
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const getCurrentUser = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  };

  const currentUser = getCurrentUser();
  const isParticipant = groupOrder?.participants.some(p => p.user._id === currentUser?.id);

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>;
  }

  if (!groupOrder) {
    return <div className="text-center py-12">
      <p className="text-gray-500 text-lg">Group order not found</p>
    </div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{groupOrder.name}</h1>
            <p className="text-gray-600 mt-2">{groupOrder.description}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            groupOrder.status === 'active' ? 'bg-green-100 text-green-800' :
            groupOrder.status === 'voting' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {groupOrder.status}
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-500">{groupOrder.participants.length}</p>
            <p className="text-gray-600">Participants</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-500">${groupOrder.totalAmount.toFixed(2)}</p>
            <p className="text-gray-600">Total Amount</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-bold text-orange-500">
              {new Date(groupOrder.orderDeadline).toLocaleDateString()}
            </p>
            <p className="text-gray-600">Deadline</p>
          </div>
        </div>

        {!isParticipant && (
          <button
            onClick={joinGroupOrder}
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors mb-6"
          >
            Join Group Order
          </button>
        )}

        {isParticipant && (
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setShowAddItem(true)}
              className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Add Item
            </button>
            <button
              onClick={() => setShowVoting(true)}
              className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Suggest Item for Voting
            </button>
          </div>
        )}
      </div>

      {/* Participants Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Participants & Orders</h2>
        <div className="space-y-4">
          {groupOrder.participants.map((participant) => (
            <div key={participant._id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{participant.name}</h3>
                <span className="text-orange-500 font-bold">${participant.totalAmount.toFixed(2)}</span>
              </div>
              {participant.items.length > 0 ? (
                <div className="space-y-2">
                  {participant.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm text-gray-600">
                      <span>{item.product.name} x{item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No items added yet</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Voting Section */}
      {groupOrder.votingItems.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Voting Items</h2>
          <div className="space-y-4">
            {groupOrder.votingItems.map((item) => {
              const yesVotes = item.votes.filter(v => v.vote === 'yes').length;
              const noVotes = item.votes.filter(v => v.vote === 'no').length;
              const userVote = item.votes.find(v => v.user === currentUser?.id)?.vote;

              return (
                <div key={item._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">{item.product.name}</h3>
                      <p className="text-sm text-gray-600">Suggested by {item.addedBy.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-600">Yes: {yesVotes}</p>
                      <p className="text-sm text-red-600">No: {noVotes}</p>
                    </div>
                  </div>
                  {isParticipant && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => vote(item._id, 'yes')}
                        className={`px-4 py-2 rounded ${
                          userVote === 'yes' 
                            ? 'bg-green-500 text-white' 
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => vote(item._id, 'no')}
                        className={`px-4 py-2 rounded ${
                          userVote === 'no' 
                            ? 'bg-red-500 text-white' 
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold mb-4">Add Item to Order</h2>
            <form onSubmit={addItemToOrder}>
              <div className="space-y-4">
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  required
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name} - ${product.price}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Quantity"
                  required
                />
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddItem(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Voting Item Modal */}
      {showVoting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold mb-4">Suggest Item for Voting</h2>
            <form onSubmit={addVotingItem}>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full p-3 border rounded-lg mb-4"
                required
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name} - ${product.price}
                  </option>
                ))}
              </select>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowVoting(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add for Voting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupOrderDetailPage;