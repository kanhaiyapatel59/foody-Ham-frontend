import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import AnimatedCounter from '../components/AnimatedCounter';
import FadeInAnimation from '../components/FadeInAnimation';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [period, setPeriod] = useState('30');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/analytics/sales?period=${period}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading analytics...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 dark:bg-gray-950 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">Sales Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Comprehensive insights into your business performance</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-orange-500"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      {/* Enhanced Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <FadeInAnimation delay={0}>
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold opacity-90">Total Sales</h3>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-2xl">
                💰
              </div>
            </div>
            <p className="text-3xl font-bold mb-2">
              $<AnimatedCounter end={analytics?.totalSales || 0} duration={2000} />
            </p>
            <p className="text-green-100 text-sm">+15% from last period</p>
          </div>
        </FadeInAnimation>
        
        <FadeInAnimation delay={200}>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold opacity-90">Total Orders</h3>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-2xl">
                📦
              </div>
            </div>
            <p className="text-3xl font-bold mb-2">
              <AnimatedCounter end={analytics?.totalOrders || 0} duration={2000} />
            </p>
            <p className="text-blue-100 text-sm">+8% from last period</p>
          </div>
        </FadeInAnimation>
        
        <FadeInAnimation delay={400}>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold opacity-90">New Users</h3>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-2xl">
                👥
              </div>
            </div>
            <p className="text-3xl font-bold mb-2">
              <AnimatedCounter end={analytics?.newUsers || 0} duration={2000} />
            </p>
            <p className="text-purple-100 text-sm">+22% from last period</p>
          </div>
        </FadeInAnimation>
        
        <FadeInAnimation delay={600}>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold opacity-90">Avg Order Value</h3>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-2xl">
                📊
              </div>
            </div>
            <p className="text-3xl font-bold mb-2">
              $<AnimatedCounter end={analytics?.totalOrders ? (analytics.totalSales / analytics.totalOrders) : 0} duration={2000} />
            </p>
            <p className="text-orange-100 text-sm">+5% from last period</p>
          </div>
        </FadeInAnimation>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
          <div className="space-y-3">
            {analytics?.topProducts?.map((product, index) => (
              <div key={product._id} className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{index + 1}. {product.name}</span>
                  <p className="text-sm text-gray-500">Sold: {product.totalSold} units</p>
                </div>
                <span className="font-semibold text-green-600">${product.revenue.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
          <div className="space-y-3">
            {analytics?.paymentMethods?.map((method) => (
              <div key={method._id} className="flex justify-between items-center">
                <span className="capitalize">{method._id}</span>
                <span className="font-semibold">{method.count} orders</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Chart */}
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Sales Trend</h3>
          <div className="h-80">
            <Line
              data={{
                labels: analytics?.dailySales?.map(day => day._id) || [],
                datasets: [
                  {
                    label: 'Daily Sales ($)',
                    data: analytics?.dailySales?.map(day => day.sales) || [],
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Daily Sales Performance',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return '$' + value;
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Order Volume</h3>
          <div className="h-80">
            <Bar
              data={{
                labels: analytics?.dailySales?.map(day => day._id) || [],
                datasets: [
                  {
                    label: 'Daily Orders',
                    data: analytics?.dailySales?.map(day => day.orders) || [],
                    backgroundColor: 'rgba(34, 197, 94, 0.8)',
                    borderColor: 'rgb(34, 197, 94)',
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Daily Order Count',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Payment Methods Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Payment Methods Distribution</h3>
          <div className="h-80">
            <Doughnut
              data={{
                labels: analytics?.paymentMethods?.map(method => method._id) || [],
                datasets: [
                  {
                    data: analytics?.paymentMethods?.map(method => method.count) || [],
                    backgroundColor: [
                      'rgba(59, 130, 246, 0.8)',
                      'rgba(34, 197, 94, 0.8)',
                      'rgba(251, 191, 36, 0.8)',
                      'rgba(239, 68, 68, 0.8)',
                    ],
                    borderColor: [
                      'rgb(59, 130, 246)',
                      'rgb(34, 197, 94)',
                      'rgb(251, 191, 36)',
                      'rgb(239, 68, 68)',
                    ],
                    borderWidth: 2,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Coupon Usage */}
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Top Coupons</h3>
          <div className="space-y-3">
            {analytics?.couponUsage?.map((coupon) => (
              <div key={coupon._id} className="flex justify-between items-center">
                <span className="font-medium">{coupon.code}</span>
                <span className="text-sm text-gray-500">Used {coupon.usedCount} times</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;