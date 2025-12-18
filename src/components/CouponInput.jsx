import React, { useState } from 'react';
import axios from 'axios';

const CouponInput = ({ orderAmount, onCouponApplied, appliedCoupon }) => {
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/coupons/validate`,
        { code: couponCode, orderAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        onCouponApplied(response.data.coupon);
        setCouponCode('');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid coupon code');
    } finally {
      setLoading(false);
    }
  };

  const removeCoupon = () => {
    onCouponApplied(null);
    setError('');
  };

  if (appliedCoupon) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-green-800 font-medium">Coupon Applied: {appliedCoupon.code}</span>
            <p className="text-green-600 text-sm">Discount: ${appliedCoupon.discountAmount.toFixed(2)}</p>
          </div>
          <button
            onClick={removeCoupon}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="font-medium mb-3">Have a coupon code?</h3>
      <div className="flex gap-2">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          placeholder="Enter coupon code"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          onClick={validateCoupon}
          disabled={loading || !couponCode.trim()}
          className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Apply'}
        </button>
      </div>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default CouponInput;