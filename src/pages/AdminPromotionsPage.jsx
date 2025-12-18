import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPromotionsPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPromotion, setNewPromotion] = useState({
    name: '',
    description: '',
    type: 'percentage',
    value: 0,
    applicableProducts: [],
    applicableCategories: [],
    minimumOrderAmount: 0,
    startDate: '',
    endDate: '',
    usageLimit: '',
    bannerText: '',
    bannerColor: '#ff6b35'
  });

  const promotionTypes = [
    { value: 'percentage', label: 'Percentage Discount' },
    { value: 'fixed_amount', label: 'Fixed Amount Off' },
    { value: 'bogo', label: 'Buy One Get One' },
    { value: 'flash_sale', label: 'Flash Sale' }
  ];

  const categories = ['burgers', 'pizza', 'pasta', 'salads', 'desserts', 'chicken', 'steaks', 'sandwiches', 'soups', 'breakfast'];

  useEffect(() => {
    fetchPromotions();
    fetchProducts();
  }, []);

  const fetchPromotions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/promotions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPromotions(response.data.data);
    } catch (error) {
      console.error('Error fetching promotions:', error);
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

  const createPromotion = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const promotionData = {
        ...newPromotion,
        usageLimit: newPromotion.usageLimit ? parseInt(newPromotion.usageLimit) : null
      };
      
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/promotions`, promotionData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setShowCreateModal(false);
      setNewPromotion({
        name: '', description: '', type: 'percentage', value: 0, applicableProducts: [],
        applicableCategories: [], minimumOrderAmount: 0, startDate: '', endDate: '',
        usageLimit: '', bannerText: '', bannerColor: '#ff6b35'
      });
      fetchPromotions();
    } catch (error) {
      console.error('Error creating promotion:', error);
      alert('Failed to create promotion');
    }
  };

  const togglePromotionStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/promotions/${id}`, 
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPromotions();
    } catch (error) {
      console.error('Error updating promotion:', error);
    }
  };

  const deletePromotion = async (id) => {
    if (!confirm('Are you sure you want to delete this promotion?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/promotions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPromotions();
    } catch (error) {
      console.error('Error deleting promotion:', error);
    }
  };

  const getStatusColor = (promotion) => {
    const now = new Date();
    const start = new Date(promotion.startDate);
    const end = new Date(promotion.endDate);
    
    if (!promotion.isActive) return 'bg-gray-100 text-gray-800';
    if (now < start) return 'bg-blue-100 text-blue-800';
    if (now > end) return 'bg-red-100 text-red-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (promotion) => {
    const now = new Date();
    const start = new Date(promotion.startDate);
    const end = new Date(promotion.endDate);
    
    if (!promotion.isActive) return 'Inactive';
    if (now < start) return 'Scheduled';
    if (now > end) return 'Expired';
    return 'Active';
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Promotional Campaigns</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Create Campaign
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campaign</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {promotions.map((promotion) => (
              <tr key={promotion._id}>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">{promotion.name}</div>
                    <div className="text-sm text-gray-500">{promotion.description}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 capitalize">
                  {promotion.type.replace('_', ' ')}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {promotion.type === 'percentage' ? `${promotion.value}%` : 
                   promotion.type === 'fixed_amount' ? `$${promotion.value}` : 
                   promotion.type === 'bogo' ? 'BOGO' : `${promotion.value}%`}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div>{new Date(promotion.startDate).toLocaleDateString()}</div>
                  <div className="text-gray-500">to {new Date(promotion.endDate).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {promotion.usageCount} / {promotion.usageLimit || '∞'}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(promotion)}`}>
                    {getStatusText(promotion)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => togglePromotionStatus(promotion._id, promotion.isActive)}
                      className={`px-3 py-1 text-xs rounded ${
                        promotion.isActive 
                          ? 'bg-red-500 text-white hover:bg-red-600' 
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {promotion.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => deletePromotion(promotion._id)}
                      className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {promotions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No promotions found</p>
          <p className="text-gray-400">Create your first promotional campaign!</p>
        </div>
      )}

      {/* Create Promotion Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Create Promotional Campaign</h2>
            <form onSubmit={createPromotion}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Campaign Name</label>
                  <input
                    type="text"
                    value={newPromotion.name}
                    onChange={(e) => setNewPromotion({...newPromotion, name: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={newPromotion.description}
                    onChange={(e) => setNewPromotion({...newPromotion, description: e.target.value})}
                    className="w-full p-3 border rounded-lg h-20"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Promotion Type</label>
                  <select
                    value={newPromotion.type}
                    onChange={(e) => setNewPromotion({...newPromotion, type: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                  >
                    {promotionTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {newPromotion.type === 'fixed_amount' ? 'Discount Amount ($)' : 'Discount Percentage (%)'}
                  </label>
                  <input
                    type="number"
                    value={newPromotion.value}
                    onChange={(e) => setNewPromotion({...newPromotion, value: parseFloat(e.target.value)})}
                    className="w-full p-3 border rounded-lg"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Start Date</label>
                  <input
                    type="datetime-local"
                    value={newPromotion.startDate}
                    onChange={(e) => setNewPromotion({...newPromotion, startDate: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">End Date</label>
                  <input
                    type="datetime-local"
                    value={newPromotion.endDate}
                    onChange={(e) => setNewPromotion({...newPromotion, endDate: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Minimum Order Amount ($)</label>
                  <input
                    type="number"
                    value={newPromotion.minimumOrderAmount}
                    onChange={(e) => setNewPromotion({...newPromotion, minimumOrderAmount: parseFloat(e.target.value)})}
                    className="w-full p-3 border rounded-lg"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Usage Limit (Optional)</label>
                  <input
                    type="number"
                    value={newPromotion.usageLimit}
                    onChange={(e) => setNewPromotion({...newPromotion, usageLimit: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                    min="1"
                    placeholder="Unlimited"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Banner Text</label>
                  <input
                    type="text"
                    value={newPromotion.bannerText}
                    onChange={(e) => setNewPromotion({...newPromotion, bannerText: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                    placeholder="🔥 Limited Time Offer!"
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
                  Create Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPromotionsPage;