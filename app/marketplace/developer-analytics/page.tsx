'use client';

import { useState } from 'react';
import { 
  SparklesIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon, 
  UserGroupIcon,
  RocketLaunchIcon,
  ArrowTrendingUpIcon,
  StarIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

// Mock data - would come from API in production
const analyticsData = {
  totalEarnings: 12450,
  creditsEarned: 24900,
  activeUsers: 1289,
  totalRequests: 145290,
  successRate: 99.8,
  avgResponseTime: 120,
  popularAgents: [
    { name: 'Code Review Pro', earnings: 4500, users: 450 },
    { name: 'SQL Assistant', earnings: 3200, users: 320 },
    { name: 'DevOps Helper', earnings: 2800, users: 280 }
  ],
  recentMilestones: [
    '🎉 Reached 1,000 active users!',
    '⭐ Featured on Formation homepage',
    '🚀 100,000 successful requests processed',
    '💎 Earned 20,000 credits milestone'
  ]
};

export default function DeveloperAnalytics() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');

  const StatCard = ({ icon: Icon, title, value, subtext, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{subtext}</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <Icon className="h-6 w-6 text-blue-500" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Developer Analytics
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Track your success and earnings across the Formation marketplace
          </p>
        </div>
        <div className="flex space-x-2">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="input-field"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={CurrencyDollarIcon}
          title="Total Earnings"
          value={`${analyticsData.creditsEarned.toLocaleString()} Credits`}
          subtext={`$${analyticsData.totalEarnings.toLocaleString()} USD equivalent`}
          delay={0.1}
        />
        <StatCard
          icon={UserGroupIcon}
          title="Active Users"
          value={analyticsData.activeUsers.toLocaleString()}
          subtext="Across all your agents"
          delay={0.2}
        />
        <StatCard
          icon={BoltIcon}
          title="Total Requests"
          value={analyticsData.totalRequests.toLocaleString()}
          subtext={`${analyticsData.successRate}% success rate`}
          delay={0.3}
        />
        <StatCard
          icon={RocketLaunchIcon}
          title="Avg Response Time"
          value={`${analyticsData.avgResponseTime}ms`}
          subtext="Faster than 95% of agents"
          delay={0.4}
        />
      </div>

      {/* Popular Agents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center space-x-2 mb-6">
            <StarIcon className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Performing Agents</h3>
          </div>
          <div className="space-y-4">
            {analyticsData.popularAgents.map((agent, index) => (
              <div key={agent.name} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{agent.name}</p>
                  <p className="text-sm text-gray-500">{agent.users} active users</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-500">{agent.earnings.toLocaleString()} Credits</p>
                  <p className="text-sm text-gray-500">This month</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Milestones */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center space-x-2 mb-6">
            <SparklesIcon className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Achievements</h3>
          </div>
          <div className="space-y-4">
            {analyticsData.recentMilestones.map((milestone, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <p className="text-gray-800 dark:text-gray-200">{milestone}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Growth Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white"
      >
        <div className="flex items-center space-x-2 mb-4">
          <ArrowTrendingUpIcon className="h-6 w-6" />
          <h3 className="text-xl font-semibold">Growth Insights</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-blue-100 mb-1">User Growth</p>
            <p className="text-2xl font-bold">+127%</p>
            <p className="text-sm text-blue-100">vs. last month</p>
          </div>
          <div>
            <p className="text-blue-100 mb-1">Revenue Growth</p>
            <p className="text-2xl font-bold">+85%</p>
            <p className="text-sm text-blue-100">vs. last month</p>
          </div>
          <div>
            <p className="text-blue-100 mb-1">Market Position</p>
            <p className="text-2xl font-bold">Top 5%</p>
            <p className="text-sm text-blue-100">of all agents</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 