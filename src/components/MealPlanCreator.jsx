import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Calendar, Clock, MapPin, CreditCard, X, Plus, Minus } from 'lucide-react';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const MealPlanCreator = ({ onClose, onSuccess }) => {
  const { formatCurrency } = useLanguage();
  const [step, setStep] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [planData, setPlanData] = useState({
    planName: '',
    planType: 'weekly',
    deliveryTime: '12:00',
    deliveryAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    paymentMethod: 'credit_card',
    items: []
  });

  const daysOfWeek = [
    'monday', 'tuesday', 'wednesday', 'thursday', 
    'friday', 'saturday', 'sunday'
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products?limit=20');
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItemToPlan = (product, day) => {
    const newItem = {
      id: Date.now(),
      product: product._id,
      productData: product,
      quantity: 1,
      dayOfWeek: day
    };
    
    setPlanData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItemFromPlan = (itemId) => {
    setPlanData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const updateItemQuantity = (itemId, quantity) => {
    if (quantity < 1) return;
    setPlanData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    }));
  };

  const calculateTotal = () => {
    const subtotal = planData.items.reduce((sum, item) => 
      sum + (item.productData.price * item.quantity), 0
    );
    const discount = planData.planType === 'weekly' ? 0.1 : 0.15;
    return subtotal * (1 - discount);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Validate required fields
      if (!planData.planName || !planData.deliveryAddress.street || planData.items.length === 0) {
        alert('Please fill in all required fields and add at least one meal.');
        return;
      }
      
      const subscriptionData = {
        planType: planData.planType,
        planName: planData.planName,
        items: planData.items.map(item => ({
          product: item.product,
          quantity: item.quantity,
          dayOfWeek: item.dayOfWeek
        })),
        deliveryAddress: planData.deliveryAddress,
        deliveryTime: planData.deliveryTime,
        paymentMethod: planData.paymentMethod
      };
      
      console.log('Sending subscription data:', subscriptionData);
      
      const response = await api.post('/subscriptions', subscriptionData);
      if (response.data.success) {
        onSuccess();
        alert('Meal plan created successfully!');
      }
    } catch (error) {
      console.error('Error creating meal plan:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create meal plan. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <h2 className="text-2xl font-semibold dark:text-white">
            Create Meal Plan - Step {step} of 3
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {step === 1 && (
          /* Step 1: Plan Details */
          <div className="p-6">
            <h3 className="text-lg font-medium dark:text-white mb-4">Plan Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-white">Plan Name</label>
                <input
                  type="text"
                  value={planData.planName}
                  onChange={(e) => setPlanData(prev => ({ ...prev, planName: e.target.value }))}
                  placeholder="My Weekly Meal Plan"
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-white">Plan Type</label>
                <select
                  value={planData.planType}
                  onChange={(e) => setPlanData(prev => ({ ...prev, planType: e.target.value }))}
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="weekly">Weekly (10% discount)</option>
                  <option value="monthly">Monthly (15% discount)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-white">Delivery Time</label>
                <input
                  type="time"
                  value={planData.deliveryTime}
                  onChange={(e) => setPlanData(prev => ({ ...prev, deliveryTime: e.target.value }))}
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-white">Payment Method</label>
                <select
                  value={planData.paymentMethod}
                  onChange={(e) => setPlanData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 dark:text-white">Delivery Address</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Street Address"
                  value={planData.deliveryAddress.street}
                  onChange={(e) => setPlanData(prev => ({
                    ...prev,
                    deliveryAddress: { ...prev.deliveryAddress, street: e.target.value }
                  }))}
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={planData.deliveryAddress.city}
                  onChange={(e) => setPlanData(prev => ({
                    ...prev,
                    deliveryAddress: { ...prev.deliveryAddress, city: e.target.value }
                  }))}
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={planData.deliveryAddress.state}
                  onChange={(e) => setPlanData(prev => ({
                    ...prev,
                    deliveryAddress: { ...prev.deliveryAddress, state: e.target.value }
                  }))}
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={planData.deliveryAddress.zipCode}
                  onChange={(e) => setPlanData(prev => ({
                    ...prev,
                    deliveryAddress: { ...prev.deliveryAddress, zipCode: e.target.value }
                  }))}
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!planData.planName || !planData.deliveryAddress.street}
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 disabled:opacity-50"
            >
              Next: Select Meals
            </button>
          </div>
        )}

        {step === 2 && (
          /* Step 2: Select Meals */
          <div className="p-6">
            <h3 className="text-lg font-medium dark:text-white mb-4">Select Meals by Day</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Days and Selected Items */}
              <div>
                <h4 className="font-medium dark:text-white mb-3">Weekly Schedule</h4>
                {daysOfWeek.map(day => (
                  <div key={day} className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h5 className="font-medium capitalize dark:text-white mb-2">{day}</h5>
                    <div className="space-y-2">
                      {planData.items.filter(item => item.dayOfWeek === day).map(item => (
                        <div key={item.id} className="flex items-center justify-between bg-white dark:bg-gray-600 p-2 rounded">
                          <span className="text-sm dark:text-white">{item.productData.name}</span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-gray-500 rounded"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-gray-500 rounded"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => removeItemFromPlan(item.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Available Products */}
              <div>
                <h4 className="font-medium dark:text-white mb-3">Available Meals</h4>
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {products.map(product => (
                    <div key={product._id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium dark:text-white">{product.name}</h5>
                        <span className="text-orange-500 font-bold">
                          {formatCurrency(product.price)}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {daysOfWeek.map(day => (
                          <button
                            key={day}
                            onClick={() => addItemToPlan(product, day)}
                            className="px-2 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600"
                          >
                            {day.slice(0, 3)}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setStep(1)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={planData.items.length === 0}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
              >
                Review Plan
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          /* Step 3: Review and Confirm */
          <div className="p-6">
            <h3 className="text-lg font-medium dark:text-white mb-4">Review Your Plan</h3>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
              <h4 className="font-medium dark:text-white mb-2">{planData.planName}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {planData.planType} plan • {planData.items.length} items • Delivery at {planData.deliveryTime}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {planData.deliveryAddress.street}, {planData.deliveryAddress.city}
              </p>
            </div>

            <div className="mb-6">
              <h4 className="font-medium dark:text-white mb-3">Order Summary</h4>
              <div className="space-y-2">
                {planData.items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="dark:text-white">
                      {item.productData.name} x{item.quantity} ({item.dayOfWeek})
                    </span>
                    <span className="dark:text-white">
                      {formatCurrency(item.productData.price * item.quantity)}
                    </span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-medium">
                    <span className="dark:text-white">
                      Total ({planData.planType === 'weekly' ? '10%' : '15%'} discount applied)
                    </span>
                    <span className="text-orange-500 text-lg">
                      {formatCurrency(calculateTotal())}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Meal Plan'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealPlanCreator;