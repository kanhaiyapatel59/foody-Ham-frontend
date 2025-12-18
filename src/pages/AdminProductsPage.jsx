import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaExclamationTriangle, FaBox, FaSave, FaTimes } from 'react-icons/fa';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function AdminProductsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
      return;
    }
    fetchProducts();
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      if (response.data.success) {
        setProducts(response.data.data);
        // Filter low stock products
        const lowStock = response.data.data.filter(product => 
          (product.stock || 0) <= (product.lowStockThreshold || 5)
        );
        setLowStockProducts(lowStock);
      }
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (productId, newStock) => {
    try {
      const response = await api.put(`/products/${productId}`, { stock: newStock });
      if (response.data.success) {
        fetchProducts(); // Refresh the list
      }
    } catch (err) {
      console.error('Error updating stock:', err);
      alert('Failed to update stock');
    }
  };

  const deleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await api.delete(`/products/${productId}`);
        if (response.data.success) {
          fetchProducts(); // Refresh the list
        }
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Failed to delete product');
      }
    }
  };

  const startEditing = (product) => {
    setEditingProduct(product._id);
    setEditForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      image: product.image || '',
      ingredients: Array.isArray(product.ingredients) ? product.ingredients.join(', ') : '',
      fullDescription: product.fullDescription || '',
      calories: product.nutritionalInfo?.calories || '',
      protein: product.nutritionalInfo?.protein || '',
      carbs: product.nutritionalInfo?.carbs || '',
      fat: product.nutritionalInfo?.fat || '',
      category: product.category || 'burgers',
      stock: product.stock || 0,
      lowStockThreshold: product.lowStockThreshold || 5,
      isFeatured: product.isFeatured || false,
      preparationTime: product.preparationTime || 30
    });
    setShowEditModal(true);
  };

  const cancelEditing = () => {
    setEditingProduct(null);
    setEditForm({});
    setShowEditModal(false);
  };

  const saveProduct = async (productId) => {
    try {
      const productData = {
        ...editForm,
        price: parseFloat(editForm.price),
        stock: parseInt(editForm.stock),
        lowStockThreshold: parseInt(editForm.lowStockThreshold),
        preparationTime: parseInt(editForm.preparationTime),
        ingredients: editForm.ingredients ? editForm.ingredients.split(',').map(item => item.trim()) : [],
        nutritionalInfo: {
          calories: parseInt(editForm.calories) || 0,
          protein: editForm.protein || '0g',
          carbs: editForm.carbs || '0g',
          fat: editForm.fat || '0g'
        }
      };
      
      const response = await api.put(`/products/${productId}`, productData);
      if (response.data.success) {
        setEditingProduct(null);
        setEditForm({});
        setShowEditModal(false);
        fetchProducts(); // Refresh the list
      }
    } catch (err) {
      console.error('Error updating product:', err);
      alert('Failed to update product');
    }
  };

  const handleEditChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStockStatus = (product) => {
    const stock = product.stock || 0;
    const threshold = product.lowStockThreshold || 5;
    
    if (stock === 0) {
      return { status: 'out', color: 'bg-red-500', text: 'Out of Stock' };
    } else if (stock <= threshold) {
      return { status: 'low', color: 'bg-yellow-500', text: 'Low Stock' };
    } else {
      return { status: 'good', color: 'bg-green-500', text: 'In Stock' };
    }
  };

  if (!user?.isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-600 mt-2">Manage your restaurant's menu items and stock levels</p>
          </div>
          <button
            onClick={() => navigate('/add-product')}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
          >
            <FaPlus /> Add New Product
          </button>
        </div>

        {/* Stock Alerts */}
        {lowStockProducts.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FaExclamationTriangle className="text-yellow-600 text-xl" />
              <h3 className="font-semibold text-yellow-800 text-lg">Stock Alerts</h3>
            </div>
            <p className="text-yellow-700 mb-4">
              {lowStockProducts.length} products need immediate attention:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {lowStockProducts.map(product => (
                <div key={product._id} className="bg-white p-3 rounded border border-yellow-300">
                  <div className="flex items-center gap-2">
                    <img 
                      src={product.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop'} 
                      alt={product.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-red-600">
                        Stock: {product.stock || 0} (Threshold: {product.lowStockThreshold || 5})
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => {
                  const stockStatus = getStockStatus(product);
                  
                  return (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="h-12 w-12 rounded-lg object-cover"
                            src={product.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop'}
                            alt={product.name}
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${product.price?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={product.stock || 0}
                            onChange={(e) => updateStock(product._id, parseInt(e.target.value))}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                            min="0"
                          />
                          <FaBox className="text-gray-400" />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${stockStatus.color}`}>
                          {stockStatus.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEditing(product)}
                            className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded"
                            title="Edit product"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => deleteProduct(product._id)}
                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded"
                            title="Delete product"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <FaBox className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first product.</p>
            <button
              onClick={() => navigate('/add-product')}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Add Product
            </button>
          </div>
        )}

        {/* Edit Product Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
                  <button
                    onClick={cancelEditing}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); saveProduct(editingProduct); }} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => handleEditChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={editForm.category}
                        onChange={(e) => handleEditChange('category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="burgers">Burgers</option>
                        <option value="pizza">Pizza</option>
                        <option value="salads">Salads</option>
                        <option value="desserts">Desserts</option>
                        <option value="drinks">Drinks</option>
                        <option value="appetizers">Appetizers</option>
                        <option value="mains">Main Courses</option>
                        <option value="sides">Side Dishes</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editForm.price}
                        onChange={(e) => handleEditChange('price', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preparation Time (min)</label>
                      <input
                        type="number"
                        value={editForm.preparationTime}
                        onChange={(e) => handleEditChange('preparationTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
                    <input
                      type="text"
                      value={editForm.description}
                      onChange={(e) => handleEditChange('description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Description</label>
                    <textarea
                      value={editForm.fullDescription}
                      onChange={(e) => handleEditChange('fullDescription', e.target.value)}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                    <input
                      type="url"
                      value={editForm.image}
                      onChange={(e) => handleEditChange('image', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients (comma separated)</label>
                    <textarea
                      value={editForm.ingredients}
                      onChange={(e) => handleEditChange('ingredients', e.target.value)}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="ingredient1, ingredient2, ingredient3"
                    />
                  </div>

                  {/* Nutritional Information */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Nutritional Information</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Calories</label>
                        <input
                          type="number"
                          value={editForm.calories}
                          onChange={(e) => handleEditChange('calories', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Protein</label>
                        <input
                          type="text"
                          value={editForm.protein}
                          onChange={(e) => handleEditChange('protein', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="20g"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Carbs</label>
                        <input
                          type="text"
                          value={editForm.carbs}
                          onChange={(e) => handleEditChange('carbs', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="45g"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Fat</label>
                        <input
                          type="text"
                          value={editForm.fat}
                          onChange={(e) => handleEditChange('fat', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="15g"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stock Management */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Stock Management</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                        <input
                          type="number"
                          value={editForm.stock}
                          onChange={(e) => handleEditChange('stock', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Low Stock Threshold</label>
                        <input
                          type="number"
                          value={editForm.lowStockThreshold}
                          onChange={(e) => handleEditChange('lowStockThreshold', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          min="1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Featured Product */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={editForm.isFeatured}
                      onChange={(e) => handleEditChange('isFeatured', e.target.checked)}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">
                      Mark as Featured Product
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProductsPage;