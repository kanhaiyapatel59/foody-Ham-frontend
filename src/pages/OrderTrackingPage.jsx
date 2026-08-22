import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaUtensils, FaMotorcycle, FaHome, FaArrowLeft, FaClock, FaReceipt, FaMapMarkerAlt } from 'react-icons/fa';
import DeliveryMap from '../components/DeliveryMap';

function OrderTrackingPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [simulatedStatus, setSimulatedStatus] = useState('Out for Delivery');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005/api';

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token && orderId && orderId !== 'demo') {
          const res = await axios.get(`${API_BASE_URL}/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.data?.success && res.data?.data) {
            setOrder(res.data.data);
            setSimulatedStatus(res.data.data.status || 'Out for Delivery');
          }
        }
      } catch (err) {
        console.warn("Using live demo order telemetry:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const activeOrder = order || {
    _id: orderId || 'FH-89421',
    createdAt: new Date().toISOString(),
    status: simulatedStatus,
    totalAmount: 34.97,
    paymentMethod: 'Cash on Delivery',
    shippingAddress: { address: '45 Green Park, Block B', city: 'Kathmandu / Mumbai' },
    items: [
      { name: 'Margherita Pizza', quantity: 1, price: 14.99, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300' },
      { name: 'Classic Beef Burger', quantity: 1, price: 12.99, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300' },
      { name: 'Chocolate Cake', quantity: 1, price: 6.99, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300' }
    ]
  };

  const currentStatus = simulatedStatus || activeOrder.status || 'Out for Delivery';

  const steps = [
    { key: 'Pending', label: 'Order Placed', icon: FaCheckCircle, desc: 'We received your order' },
    { key: 'Preparing', label: 'In Kitchen', icon: FaUtensils, desc: 'Chef is crafting your food' },
    { key: 'Out for Delivery', label: 'On the Way', icon: FaMotorcycle, desc: 'Ramesh is delivering your food' },
    { key: 'Delivered', label: 'Delivered', icon: FaHome, desc: 'Food delivered to your door' }
  ];

  const getStepStatus = (stepKey) => {
    const orderRank = { 'Pending': 1, 'Preparing': 2, 'Out for Delivery': 3, 'Delivered': 4 };
    const currentRank = orderRank[currentStatus] || 3;
    const targetRank = orderRank[stepKey] || 1;

    if (currentRank > targetRank) return 'completed';
    if (currentRank === targetRank) return 'active';
    return 'upcoming';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <Link
              to="/orders"
              className="p-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-2xl hover:bg-orange-50 hover:text-orange-500 transition-colors"
            >
              <FaArrowLeft size={18} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-xl sm:text-2xl text-gray-900 dark:text-white">
                  Order #{activeOrder._id.slice(-8).toUpperCase()}
                </h1>
                <span className="text-xs bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold px-2.5 py-1 rounded-full border border-orange-500/20">
                  Live GPS Tracker
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                <FaClock size={12} className="text-orange-500" /> Placed on {new Date(activeOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800/80 p-1.5 rounded-2xl border border-gray-200 dark:border-gray-700">
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 px-2">Stage Test:</span>
            {['Preparing', 'Out for Delivery', 'Delivered'].map((st) => (
              <button
                key={st}
                onClick={() => setSimulatedStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentStatus === st
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {st === 'Out for Delivery' ? '🛵 Delivery' : st === 'Preparing' ? '🍳 Kitchen' : '✅ Delivered'}
              </button>
            ))}
          </div>
        </div>

        {/* Stepper Timeline */}
        <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-extrabold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping"></span>
            Delivery Progression
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => {
              const status = getStepStatus(step.key);
              const StepIcon = step.icon;

              return (
                <div 
                  key={step.key} 
                  className={`flex items-start gap-4 p-4 rounded-2xl transition-all ${
                    status === 'active'
                      ? 'bg-gradient-to-br from-orange-500/10 to-amber-500/10 border-2 border-orange-500 shadow-md ring-2 ring-orange-500/20'
                      : status === 'completed'
                      ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/30'
                      : 'bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 opacity-60'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                    status === 'active'
                      ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white scale-110 animate-pulse'
                      : status === 'completed'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-400'
                  }`}>
                    <StepIcon size={22} />
                  </div>

                  <div className="overflow-hidden">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Step {idx + 1}</span>
                    <p className={`font-extrabold text-sm ${status === 'active' ? 'text-orange-600 dark:text-orange-400' : 'text-gray-900 dark:text-white'}`}>
                      {step.label}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Map and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <DeliveryMap 
              orderStatus={currentStatus}
              driverName="Ramesh Patel"
              etaMinutes={15}
            />

            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                <FaMapMarkerAlt size={22} />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-gray-900 dark:text-white">Delivery Destination</h4>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-1">
                  {activeOrder.shippingAddress?.address || '45 Green Park, Block B'}, {activeOrder.shippingAddress?.city || 'Kathmandu'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 h-fit">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
              <h3 className="font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
                <FaReceipt className="text-orange-500" /> Order Summary
              </h3>
            </div>

            <div className="space-y-4 max-h-[280px] overflow-y-auto">
              {activeOrder.items?.map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-3 p-2 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <p className="font-bold text-sm text-gray-900 dark:text-gray-100">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-black text-sm text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between text-base font-black text-gray-900 dark:text-white">
              <span>Total Paid</span>
              <span className="text-orange-500">${activeOrder.totalAmount?.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default OrderTrackingPage;
