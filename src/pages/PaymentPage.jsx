import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FaCreditCard, FaPaypal, FaLock, FaArrowLeft } from 'react-icons/fa';
import CouponInput from '../components/CouponInput';
import axios from 'axios';

function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();
  const { user } = useAuth();
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });

  // Get order data from location state
  const orderData = location.state?.orderData;
  
  if (!orderData) {
    navigate('/cart');
    return null;
  }

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Apply coupon if used
      if (appliedCoupon) {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/coupons/apply`,
          { code: appliedCoupon.code },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
      }

      // Create order
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3003/api'}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...orderData,
          shippingAddress,
          paymentMethod,
          paymentStatus: paymentMethod === 'cash' ? 'pending' : 'completed',
          coupon: appliedCoupon ? {
            code: appliedCoupon.code,
            discountAmount: appliedCoupon.discountAmount
          } : undefined
        })
      });

      console.log('Order response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Order creation failed:', errorText);
        throw new Error(`Order creation failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('Order response data:', data);
      
      if (data.success) {
        clearCart();
        navigate('/payment-success', { 
          state: { 
            orderId: data.data?._id || 'ORDER_' + Date.now(),
            amount: orderData.totalAmount - (appliedCoupon?.discountAmount || 0),
            paymentMethod: paymentMethod
          }
        });
      } else {
        throw new Error(data.message || 'Order creation failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate('/cart')}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <FaArrowLeft /> Back to Cart
      </button>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
          
          {/* Payment Method Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
            <div className="space-y-3">
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <FaCreditCard className="mr-2 text-blue-600" />
                Credit/Debit Card
              </label>
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <FaPaypal className="mr-2 text-blue-600" />
                PayPal
              </label>
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                💰 Cash on Delivery
              </label>
            </div>
          </div>

          {/* Shipping Address Form */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Street Address"
                value={shippingAddress.address}
                onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                className="w-full p-3 border rounded-lg"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Postal Code"
                  value={shippingAddress.postalCode}
                  onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Country"
                value={shippingAddress.country}
                onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
          </div>

          {/* Card Details Form */}
          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  maxLength="19"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                    maxLength="5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                    maxLength="3"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
            </div>
          )}

          {paymentMethod === 'paypal' && (
            <div className="text-center py-8">
              <FaPaypal className="text-6xl text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">You will be redirected to PayPal to complete your payment</p>
            </div>
          )}

          {paymentMethod === 'cash' && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">💰</div>
              <p className="text-gray-600">Pay with cash when your order is delivered</p>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-6">
            {orderData.items.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Coupon Input */}
          <div className="mb-6">
            <CouponInput
              orderAmount={orderData.totalAmount}
              onCouponApplied={setAppliedCoupon}
              appliedCoupon={appliedCoupon}
            />
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${(orderData.totalAmount - 5 - (orderData.totalAmount - 5) * 0.08).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>$5.00</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${((orderData.totalAmount - 5) * 0.08).toFixed(2)}</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({appliedCoupon.code})</span>
                <span>-${appliedCoupon.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold border-t pt-2">
              <span>Total</span>
              <span>${(orderData.totalAmount - (appliedCoupon?.discountAmount || 0)).toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition duration-300 mt-6 flex items-center justify-center gap-2"
          >
            <FaLock />
            {loading ? 'Processing...' : 
             paymentMethod === 'cash' ? 'Place Order' : `Pay $${(orderData.totalAmount - (appliedCoupon?.discountAmount || 0)).toFixed(2)}`}
          </button>

          <div className="text-center mt-4 text-sm text-gray-500">
            <FaLock className="inline mr-1" />
            Your payment information is secure and encrypted
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;