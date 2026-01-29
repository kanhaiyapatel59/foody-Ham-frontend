import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Calendar, Clock, MapPin, CreditCard, Play, Pause, X } from 'lucide-react';
import MealPlanCreator from '../components/MealPlanCreator';
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

const SubscriptionsPage = () => {
  const { user } = useAuth();
  const { formatCurrency } = useLanguage();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await api.get('/subscriptions');
      if (response.data.success) {
        setSubscriptions(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSubscriptionStatus = async (id, status) => {
    try {
      const response = await api.patch(`/subscriptions/${id}/status`, { status });
      if (response.data.success) {
        fetchSubscriptions();
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading subscriptions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Meal Subscriptions</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your recurring meal deliveries
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Create New Plan
          </button>
        </div>

        {subscriptions.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-12 shadow-sm">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Subscriptions Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Create your first meal plan to enjoy regular deliveries with exclusive discounts!
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {subscriptions.map((subscription) => (
              <div key={subscription._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {subscription.planName}
                    </h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusColor(subscription.status)}`}>
                      {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-500">
                      {formatCurrency(subscription.totalPrice)}
                    </div>
                    <div className="text-sm text-gray-500">
                      per {subscription.planType}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>Next delivery: {formatDate(subscription.nextDelivery)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{subscription.deliveryTime}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{subscription.deliveryAddress.street}, {subscription.deliveryAddress.city}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <CreditCard className="w-4 h-4" />
                    <span>{subscription.paymentMethod}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Weekly Menu</h4>
                  <div className="grid gap-2">
                    {subscription.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded">
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {item.product.name}
                            </span>
                            <div className="text-sm text-gray-500 capitalize">
                              {item.dayOfWeek} • Qty: {item.quantity}
                            </div>
                          </div>
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3">
                  {subscription.status === 'active' && (
                    <button
                      onClick={() => updateSubscriptionStatus(subscription._id, 'paused')}
                      className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                    >
                      <Pause className="w-4 h-4" />
                      <span>Pause</span>
                    </button>
                  )}
                  {subscription.status === 'paused' && (
                    <button
                      onClick={() => updateSubscriptionStatus(subscription._id, 'active')}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      <span>Resume</span>
                    </button>
                  )}
                  {subscription.status !== 'cancelled' && (
                    <button
                      onClick={() => updateSubscriptionStatus(subscription._id, 'cancelled')}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {showCreateForm && (
          <MealPlanCreator
            onClose={() => setShowCreateForm(false)}
            onSuccess={() => {
              setShowCreateForm(false);
              fetchSubscriptions();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SubscriptionsPage;