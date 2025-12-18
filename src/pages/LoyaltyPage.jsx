import React from 'react';
import LoyaltyDashboard from '../components/LoyaltyDashboard';
import { Award, Star, Gift } from 'lucide-react';

const LoyaltyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Loyalty Rewards
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Earn points with every order and unlock exclusive rewards, badges, and special offers!
          </p>
        </div>

        {/* How it Works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
            <div className="bg-orange-100 dark:bg-orange-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Earn Points</h3>
            <p className="text-gray-600 dark:text-gray-300">Get 10 points for every $1 spent on orders</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
            <div className="bg-orange-100 dark:bg-orange-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Unlock Badges</h3>
            <p className="text-gray-600 dark:text-gray-300">Achieve milestones and earn special badges</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
            <div className="bg-orange-100 dark:bg-orange-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Redeem Rewards</h3>
            <p className="text-gray-600 dark:text-gray-300">Use points for discounts and free items</p>
          </div>
        </div>

        <LoyaltyDashboard />
      </div>
    </div>
  );
};

export default LoyaltyPage;