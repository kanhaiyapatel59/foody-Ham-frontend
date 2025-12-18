import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaHome, FaReceipt } from 'react-icons/fa';

function PaymentSuccessPage() {
  const location = useLocation();
  const { orderId, amount, paymentMethod } = location.state || {};

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-6" />
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {paymentMethod === 'cash' ? 'Order Placed Successfully!' : 'Payment Successful!'}
        </h1>
        
        <p className="text-gray-600 mb-6">
          {paymentMethod === 'cash' 
            ? 'Thank you for your order. Please have cash ready when your order arrives.' 
            : 'Thank you for your order. Your payment has been processed successfully.'}
        </p>

        {orderId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FaReceipt className="text-gray-600" />
              <span className="font-semibold">Order Details</span>
            </div>
            <p className="text-sm text-gray-600">Order ID: {orderId}</p>
            {amount && <p className="text-sm text-gray-600">Amount: ${amount.toFixed(2)}</p>}
          </div>
        )}

        <div className="space-y-3">
          <Link
            to="/"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 flex items-center justify-center gap-2"
          >
            <FaHome />
            Back to Home
          </Link>
          
          <Link
            to="/menu"
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition duration-300"
          >
            Continue Shopping
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          You will receive an order confirmation email shortly.
        </p>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;