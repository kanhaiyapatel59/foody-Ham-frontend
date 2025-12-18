import React, { useState, useEffect } from 'react';
import { Gift, RotateCcw, Clock } from 'lucide-react';

const SpinWheel = ({ onClose }) => {
  const [canSpin, setCanSpin] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    checkCanSpin();
  }, []);

  const checkCanSpin = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3005/api/spin/can-spin', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setCanSpin(data.canSpin);
    } catch (error) {
      console.error('Error checking spin status:', error);
    }
  };

  const handleSpin = async () => {
    if (!canSpin || spinning) return;

    setSpinning(true);
    const spinRotation = rotation + 1440 + Math.random() * 360; // At least 4 full rotations
    setRotation(spinRotation);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3005/api/spin/spin', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      setTimeout(() => {
        setResult(data);
        setSpinning(false);
        setCanSpin(false);
      }, 3000);
    } catch (error) {
      console.error('Error spinning wheel:', error);
      setSpinning(false);
    }
  };

  const wheelSegments = [
    { label: 'Free Delivery', color: 'bg-blue-500' },
    { label: '10% Off', color: 'bg-green-500' },
    { label: 'Free Item', color: 'bg-purple-500' },
    { label: '20% Off', color: 'bg-yellow-500' },
    { label: '30% Off', color: 'bg-red-500' },
    { label: 'Free Delivery', color: 'bg-blue-500' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold dark:text-white">Spin & Win!</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
          </div>

          {result ? (
            <div className="text-center">
              <Gift className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold dark:text-white mb-2">Congratulations!</h3>
              <p className="text-lg text-green-600 dark:text-green-400 mb-4">{result.reward}</p>
              {result.couponCode && (
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4">
                  <p className="text-sm dark:text-white">Your coupon code:</p>
                  <p className="font-mono font-bold text-lg dark:text-white">{result.couponCode}</p>
                </div>
              )}
              <button
                onClick={onClose}
                className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600"
              >
                Claim Reward
              </button>
            </div>
          ) : (
            <div>
              {/* Spin Wheel */}
              <div className="relative w-64 h-64 mx-auto mb-6">
                <div 
                  className="w-full h-full rounded-full border-8 border-gray-300 relative overflow-hidden transition-transform duration-3000 ease-out"
                  style={{ transform: `rotate(${rotation}deg)` }}
                >
                  {wheelSegments.map((segment, index) => (
                    <div
                      key={index}
                      className={`absolute w-1/2 h-1/2 ${segment.color} flex items-center justify-center text-white text-xs font-bold`}
                      style={{
                        transformOrigin: 'right bottom',
                        transform: `rotate(${index * 60}deg)`,
                        clipPath: 'polygon(0 0, 100% 0, 50% 100%)'
                      }}
                    >
                      <span className="transform -rotate-30 text-center">{segment.label}</span>
                    </div>
                  ))}
                </div>
                
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                  <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-gray-800"></div>
                </div>
              </div>

              {canSpin ? (
                <button
                  onClick={handleSpin}
                  disabled={spinning}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-bold text-lg hover:from-orange-600 hover:to-red-600 disabled:opacity-50"
                >
                  {spinning ? 'Spinning...' : 'SPIN NOW!'}
                </button>
              ) : (
                <div className="text-center">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    You've already spun today!
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Come back tomorrow for another chance to win!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpinWheel;