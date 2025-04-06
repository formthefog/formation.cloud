import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChartBarIcon } from '@heroicons/react/24/outline';

interface UsageMetricsProps {
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
}

export function UsageMetrics({ timeRange, onTimeRangeChange }: UsageMetricsProps) {
  const timeRanges = ['24h', '7d', '30d', '90d'];
  
  // Mock data - would come from API
  const metrics = {
    totalRequests: 15234,
    averageResponseTime: 245, // ms
    successRate: 99.2,
    costSavings: 1205.50,
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Usage Metrics</h2>
        <div className="flex space-x-2">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => onTimeRangeChange(range)}
              className={`px-3 py-1 rounded-md text-sm font-medium
                ${timeRange === range
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Requests
            </h3>
            <ChartBarIcon className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold mt-2">
            {metrics.totalRequests.toLocaleString()}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Avg Response Time
            </h3>
            <ChartBarIcon className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold mt-2">
            {metrics.averageResponseTime}ms
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Success Rate
            </h3>
            <ChartBarIcon className="h-5 w-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold mt-2">
            {metrics.successRate}%
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Cost Savings
            </h3>
            <ChartBarIcon className="h-5 w-5 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold mt-2">
            ${metrics.costSavings.toLocaleString()}
          </p>
        </motion.div>
      </div>
    </div>
  );
} 