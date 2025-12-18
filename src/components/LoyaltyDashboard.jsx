import React, { useState, useEffect } from 'react';
import { Star, Gift, Trophy, Coins } from 'lucide-react';

const LoyaltyDashboard = () => {
  const [loyalty, setLoyalty] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoyaltyData();
    fetchRewards();
  }, []);

  const fetchLoyaltyData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3005/api/loyalty', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setLoyalty(data);
    } catch (error) {
      console.error('Error fetching loyalty data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRewards = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3005/api/loyalty/rewards', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setRewards(data);
    } catch (error) {
      console.error('Error fetching rewards:', error);
    }
  };

  const redeemReward = async (reward) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3005/api/loyalty/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          points: reward.points,
          reason: `Redeemed: ${reward.name}`
        })
      });

      if (response.ok) {
        alert(`Successfully redeemed ${reward.name}!`);
        fetchLoyaltyData();
      } else {
        alert('Insufficient points or redemption failed');
      }
    } catch (error) {
      console.error('Error redeeming reward:', error);
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Bronze': return 'text-amber-600';
      case 'Silver': return 'text-gray-500';
      case 'Gold': return 'text-yellow-500';
      case 'Platinum': return 'text-purple-600';
      default: return 'text-gray-500';
    }
  };

  if (loading) {
    return <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg p-6 h-64"></div>;
  }

  return (
    <div className="space-y-6">
      {/* Points Overview */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Loyalty Points</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Coins className="w-5 h-5 mr-2" />
                <span className="text-xl font-semibold">{loyalty?.availablePoints || 0}</span>
              </div>
              <div className={`flex items-center ${getLevelColor(loyalty?.level)}`}>
                <Trophy className="w-5 h-5 mr-2" />
                <span className="font-semibold">{loyalty?.level || 'Bronze'}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">Total Earned</div>
            <div className="text-xl font-bold">{loyalty?.totalPoints || 0}</div>
          </div>
        </div>
      </div>

      {/* Badges */}
      {loyalty?.badges && loyalty.badges.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Your Badges</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {loyalty.badges.map((badge, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-3xl mb-2">{badge.icon}</div>
                <div className="text-sm font-medium dark:text-white">{badge.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rewards Catalog */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 dark:text-white flex items-center">
          <Gift className="w-5 h-5 mr-2" />
          Redeem Rewards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rewards.map((reward) => (
            <div key={reward.id} className="border dark:border-gray-600 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium dark:text-white">{reward.name}</h4>
                  <div className="flex items-center text-orange-500 text-sm">
                    <Coins className="w-4 h-4 mr-1" />
                    {reward.points} points
                  </div>
                </div>
              </div>
              <button
                onClick={() => redeemReward(reward)}
                disabled={!loyalty || loyalty.availablePoints < reward.points}
                className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loyalty && loyalty.availablePoints >= reward.points ? 'Redeem' : 'Insufficient Points'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      {loyalty?.transactions && loyalty.transactions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Recent Activity</h3>
          <div className="space-y-3">
            {loyalty.transactions.slice(-5).reverse().map((transaction, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b dark:border-gray-600 last:border-b-0">
                <div>
                  <div className="font-medium dark:text-white">{transaction.reason}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className={`font-semibold ${transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.type === 'earned' ? '+' : ''}{transaction.points}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoyaltyDashboard;