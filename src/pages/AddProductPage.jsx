import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  FaPlusCircle, 
  FaTimesCircle, 
  FaCheckCircle, 
  FaUserShield, 
  FaImage, 
  FaTag, 
  FaDollarSign, 
  FaAlignLeft, 
  FaListAlt, 
  FaFire, 
  FaLeaf, 
  FaChartBar,
  FaEye,
  FaClock,
  FaStar
} from 'react-icons/fa';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3004/api',
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

function AddProductPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State for form inputs
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    ingredients: '',
    fullDescription: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    category: 'burgers',
    isFeatured: false,
    preparationTime: '30',
    stock: '50',
    lowStockThreshold: '10'
  });

  // State for added products
  const [addedProducts, setAddedProducts] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('basic');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    setError('');
  };

  // Fetch recently added products
  const fetchRecentProducts = async () => {
    try {
      // Note: Assuming the backend handles limit and sort correctly
      const response = await api.get('/products?limit=6&sort=-createdAt');
      
      if (response.data.success) {
        setAddedProducts(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      const savedProducts = JSON.parse(localStorage.getItem('customProducts') || '[]');
      setAddedProducts(savedProducts.slice(0, 6));
    }
  };

  useEffect(() => {
    fetchRecentProducts();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please login to add products');
      navigate('/login', { state: { from: '/add-product' } });
      return;
    }

    if (!user.isAdmin) {
      setError('Only administrators can add products');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        throw new Error('Price must be a valid positive number.');
      }


      const productData = {
        name: formData.name,
        description: formData.description,
        price: price,
        // Use default image if none provided
        image: formData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop',
        // Split ingredients string into an array
        ingredients: formData.ingredients 
          ? formData.ingredients.split(',').map(item => item.trim()).filter(item => item !== '')
          : [],
        fullDescription: formData.fullDescription,
        // Parse nutritional info
        nutritionalInfo: {
          calories: parseInt(formData.calories) || 0,
          protein: formData.protein || "0g",
          carbs: formData.carbs || "0g",
          fat: formData.fat || "0g"
        },
        category: formData.category,
        isFeatured: formData.isFeatured,
        preparationTime: parseInt(formData.preparationTime) || 30,
        stock: parseInt(formData.stock) || 0,
        lowStockThreshold: parseInt(formData.lowStockThreshold) || 5
      };

      const response = await api.post('/products', productData);

      if (response.data.success) {
        const newProduct = response.data.data;
        
        setAddedProducts(prev => [newProduct, ...prev.slice(0, 5)]);
        
        setShowSuccessMessage(true);
        
        // Reset form
        setFormData({
          name: '',
          description: '',
          price: '',
          image: '',
          ingredients: '',
          fullDescription: '',
          calories: '',
          protein: '',
          carbs: '',
          fat: '',
          category: 'burgers',
          isFeatured: false,
          preparationTime: '30',
          stock: '50',
          lowStockThreshold: '10'
        });

        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
      } else {
        // Fallback for custom non-400 server errors
        throw new Error(response.data.message || 'Failed to add product');
      }
    } catch (err) {
      setLoading(false);
      console.error('Error adding product:', err); 
      
      // 🚨 FIX: Improved Error Handling for Axios/Server Responses (400 Bad Request) 🚨
      let errorMessage = 'Failed to add product. Please check your network connection.';

      if (err.response && err.response.data && err.response.data.message) {
        // Case 1: Server-side validation error (400)
        // This displays the detailed Mongoose validation message (e.g., "Path `category` is required.")
        errorMessage = err.response.data.message;
      } else if (err.message) {
        // Case 2: Client-side error (from the `throw new Error()` checks above) 
        // or a general network failure message
        errorMessage = err.message;
      }
      
      // Display the most specific error message to the user
      setError(errorMessage); 
    } finally {
      setLoading(false);
    }
  };

  const viewProductDetails = (product) => {
    navigate(`/product/${product._id || product.id}`, { state: { product } });
  };

  // Check if user is admin
  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="relative inline-block mb-6">
            <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <FaUserShield className="text-6xl text-red-500" />
            </div>
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <FaTimesCircle className="text-white text-xl" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Access Restricted</h1>
          <p className="text-lg text-gray-600 mb-8">
            This page is accessible only to <span className="font-bold text-red-500">administrators</span>.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-gray-800 to-black text-white px-8 py-3 rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/20 py-12 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-2xl mb-6">
            <FaPlusCircle className="text-white text-3xl" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-3">
            Add New <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Product</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fill in the details below to add a new culinary masterpiece to our menu
          </p>
        </div>

        {/* Notifications */}
        <div className="max-w-4xl mx-auto mb-8">
          {error && (
            <div className="backdrop-blur-xl bg-red-900/10 border border-red-500/20 rounded-2xl p-6 mb-4 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FaTimesCircle className="text-white text-xl" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-red-700 mb-1">Error Occurred</h3>
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
            </div>
          )}

          {showSuccessMessage && (
            <div className="backdrop-blur-xl bg-green-900/10 border border-green-500/20 rounded-2xl p-6 mb-4 shadow-lg animate-fade-in">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FaCheckCircle className="text-white text-xl" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-green-700 mb-1">Success!</h3>
                  <p className="text-green-600">Product has been added to the menu successfully.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
              {/* Form Tabs */}
              <div className="border-b border-gray-100">
                <div className="flex overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => setActiveSection('basic')}
                    className={`flex-1 px-6 py-4 font-semibold transition-all duration-300 ${activeSection === 'basic' ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50/50' : 'text-gray-600 hover:text-orange-500'}`}
                  >
                    <FaTag className="inline mr-2" /> Basic Info
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSection('details')}
                    className={`flex-1 px-6 py-4 font-semibold transition-all duration-300 ${activeSection === 'details' ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50/50' : 'text-gray-600 hover:text-orange-500'}`}
                  >
                    <FaAlignLeft className="inline mr-2" /> Details
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSection('nutrition')}
                    className={`flex-1 px-6 py-4 font-semibold transition-all duration-300 ${activeSection === 'nutrition' ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50/50' : 'text-gray-600 hover:text-orange-500'}`}
                  >
                    <FaChartBar className="inline mr-2" /> Nutrition
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-8">
                {/* Basic Info Section */}
                <div className={`space-y-6 ${activeSection === 'basic' ? 'block' : 'hidden'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-800 font-semibold mb-3">
                        <FaTag className="inline mr-2 text-orange-500" /> Product Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-5 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                        required
                        disabled={loading}
                        placeholder="e.g., Gourmet Burger Deluxe"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-800 font-semibold mb-3">
                        <FaTag className="inline mr-2 text-orange-500" /> Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-5 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 appearance-none"
                        disabled={loading}
                      >
                        <option value="">Select Category</option>
                        <option value="burgers" className="py-2">🍔 Burgers</option>
                        <option value="pizza" className="py-2">🍕 Pizza</option>
                        <option value="salads" className="py-2">🥗 Salads</option>
                        <option value="desserts" className="py-2">🍰 Desserts</option>
                        <option value="drinks" className="py-2">🥤 Drinks</option>
                        <option value="appetizers" className="py-2">🍤 Appetizers</option>
                        <option value="mains" className="py-2">🍖 Main Courses</option>
                        <option value="sides" className="py-2">🍟 Side Dishes</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-800 font-semibold mb-3">
                        <FaDollarSign className="inline mr-2 text-green-500" /> Price ($) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full px-5 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                        required
                        disabled={loading}
                        placeholder="24.99"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-800 font-semibold mb-3">
                        <FaClock className="inline mr-2 text-blue-500" /> Prep Time (min)
                      </label>
                      <input
                        type="number"
                        min="1"
                        name="preparationTime"
                        value={formData.preparationTime}
                        onChange={handleChange}
                        className="w-full px-5 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-800 font-semibold mb-3">
                      <FaAlignLeft className="inline mr-2 text-purple-500" /> Short Description *
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                      required
                      disabled={loading}
                      placeholder="A brief, appealing summary of the item"
                    />
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleChange}
                      className="w-5 h-5 text-orange-500 rounded focus:ring-orange-400"
                      disabled={loading}
                    />
                    <label htmlFor="isFeatured" className="flex items-center gap-2 text-gray-800 font-medium">
                      <FaFire className="text-orange-500" />
                      Mark as Featured Product (Shows on homepage)
                    </label>
                  </div>
                </div>

                {/* Details Section */}
                <div className={`space-y-6 ${activeSection === 'details' ? 'block' : 'hidden'}`}>
                  <div>
                    <label className="block text-gray-800 font-semibold mb-3">
                      <FaAlignLeft className="inline mr-2 text-purple-500" /> Full Description *
                    </label>
                    <textarea
                      name="fullDescription"
                      value={formData.fullDescription}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                      rows="5"
                      disabled={loading}
                      placeholder="Detailed description, serving size, preparation method..."
                    />
                  </div>

                  <div>
                    <label className="block text-gray-800 font-semibold mb-3">
                      <FaListAlt className="inline mr-2 text-green-500" /> Ingredients (comma separated)
                    </label>
                    <textarea
                      name="ingredients"
                      value={formData.ingredients}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                      rows="3"
                      disabled={loading}
                      placeholder="beef patty, cheese, lettuce, tomato, special sauce..."
                    />
                  </div>

                  <div>
                    <label className="block text-gray-800 font-semibold mb-3">
                      <FaImage className="inline mr-2 text-blue-500" /> Image URL (Optional)
                    </label>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                      disabled={loading}
                      placeholder="https://images.unsplash.com/photo-..."
                    />
                    <p className="text-sm text-gray-500 mt-2">Leave empty for default food image</p>
                  </div>
                </div>

                {/* Nutrition Section */}
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${activeSection === 'nutrition' ? 'block' : 'hidden'}`}>
                  <div>
                    <label className="block text-gray-800 font-semibold mb-3">
                      <FaFire className="inline mr-2 text-red-500" /> Calories (kcal)
                    </label>
                    <input
                      type="number"
                      name="calories"
                      value={formData.calories}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-800 font-semibold mb-3">
                      <FaLeaf className="inline mr-2 text-green-500" /> Protein (e.g., 20g)
                    </label>
                    <input
                      type="text"
                      name="protein"
                      value={formData.protein}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-800 font-semibold mb-3">
                      <FaChartBar className="inline mr-2 text-yellow-500" /> Carbs (e.g., 45g)
                    </label>
                    <input
                      type="text"
                      name="carbs"
                      value={formData.carbs}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-800 font-semibold mb-3">
                      <FaChartBar className="inline mr-2 text-orange-500" /> Fat (e.g., 15g)
                    </label>
                    <input
                      type="text"
                      name="fat"
                      value={formData.fat}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Stock Management Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200">
                  <div>
                    <label className="block text-gray-800 font-semibold mb-3">
                      📦 Stock Quantity
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                      disabled={loading}
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-800 font-semibold mb-3">
                      ⚠️ Low Stock Alert (Threshold)
                    </label>
                    <input
                      type="number"
                      name="lowStockThreshold"
                      value={formData.lowStockThreshold}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                      disabled={loading}
                      min="1"
                    />
                  </div>
                </div>

                {/* Form Navigation */}
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                  <div className="space-x-3">
                    <button
                      type="button"
                      onClick={() => setActiveSection('basic')}
                      className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${activeSection === 'basic' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      Basic
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSection('details')}
                      className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${activeSection === 'details' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      Details
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSection('nutrition')}
                      className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${activeSection === 'nutrition' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      Nutrition
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-3.5 rounded-xl font-semibold hover:shadow-2xl hover:shadow-orange-500/25 hover:from-orange-600 hover:to-amber-600 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none flex items-center gap-3"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Adding Product...
                      </>
                    ) : (
                      <>
                        <FaPlusCircle /> Add Product to Menu
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Recent Products Sidebar */}
          <div>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-6 sticky top-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <FaClock className="text-white text-lg" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Recently Added</h2>
              </div>

              {loading && addedProducts.length === 0 ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-100 rounded-xl p-4 animate-pulse">
                      <div className="flex gap-3">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : addedProducts.length === 0 ? (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 text-center border-2 border-dashed border-gray-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaPlusCircle className="text-gray-400 text-2xl" />
                  </div>
                  <p className="text-gray-700 font-medium mb-2">Menu is Empty!</p>
                  <p className="text-gray-500 text-sm">Add your first product using the form</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {addedProducts.map((product, index) => (
                    <div 
                      key={product._id || product.id || index} 
                      className="group bg-gradient-to-r from-white to-gray-50 rounded-2xl p-4 border border-gray-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
                      onClick={() => viewProductDetails(product)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="relative flex-shrink-0">
                          <img 
                            src={product.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop'} 
                            alt={product.name} 
                            className="w-16 h-16 object-cover rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-300"
                          />
                          {product.isFeatured && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                              <FaStar className="text-white text-xs" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 truncate mb-1 group-hover:text-orange-600 transition-colors">
                            {product.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            <p className="text-lg font-bold text-orange-500">
                              ${product.price?.toFixed(2) || '0.00'}
                            </p>
                            {product.category && (
                              <span className="px-2.5 py-1 text-xs font-semibold bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 rounded-full">
                                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <button className="text-sm text-gray-600 hover:text-orange-500 transition-colors flex items-center gap-2 group/view">
                          <FaEye /> View Details
                        </button>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          {product.nutritionalInfo?.calories > 0 && (
                            <span>{product.nutritionalInfo.calories} kcal</span>
                          )}
                          {product.stock !== undefined && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              (product.stock || 0) <= (product.lowStockThreshold || 5) 
                                ? 'bg-red-100 text-red-600' 
                                : 'bg-green-100 text-green-600'
                            }`}>
                              Stock: {product.stock || 0}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-3">View complete menu</p>
                  <button
                    onClick={() => navigate('/menu')}
                    className="w-full bg-gradient-to-r from-gray-800 to-black text-white py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
                  >
                    Browse Full Menu
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProductPage;