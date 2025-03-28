'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  BoltIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';

type AgentType = 'development' | 'analysis' | 'assistant' | 'research' | 'automation';
type AgentStatus = 'active' | 'paused' | 'error' | 'maintenance';
type TimeRange = '24h' | '7d' | '30d' | '90d';

interface Agent {
  id: number;
  name: string;
  status: AgentStatus;
  type: AgentType;
  requests: number;
  uptime: number;
  lastActive: string;
  performance: number;
  description: string;
  costPerRequest: number;
  totalCost: number;
}

// Mock data - would come from API
const myAgents: Agent[] = [
  {
    id: 1,
    name: 'Code Review Assistant',
    status: 'active',
    type: 'development',
    requests: 1205,
    uptime: 99.9,
    lastActive: '2 minutes ago',
    performance: 98.5,
    description: 'AI-powered code review and suggestions',
    costPerRequest: 0.02,
    totalCost: 24.10,
  },
  {
    id: 2,
    name: 'Data Analysis Engine',
    status: 'active',
    type: 'analysis',
    requests: 3420,
    uptime: 99.7,
    lastActive: '5 minutes ago',
    performance: 97.8,
    description: 'Advanced data analysis and visualization',
    costPerRequest: 0.05,
    totalCost: 171.00,
  },
  {
    id: 3,
    name: 'Customer Support Bot',
    status: 'paused',
    type: 'assistant',
    requests: 8750,
    uptime: 98.5,
    lastActive: '1 hour ago',
    performance: 94.2,
    description: '24/7 customer support automation',
    costPerRequest: 0.01,
    totalCost: 87.50,
  },
  {
    id: 4,
    name: 'Research Assistant',
    status: 'active',
    type: 'research',
    requests: 642,
    uptime: 99.8,
    lastActive: '15 minutes ago',
    performance: 99.1,
    description: 'Academic research and paper analysis',
    costPerRequest: 0.08,
    totalCost: 51.36,
  },
  {
    id: 5,
    name: 'Workflow Automator',
    status: 'error',
    type: 'automation',
    requests: 2890,
    uptime: 95.5,
    lastActive: '35 minutes ago',
    performance: 89.7,
    description: 'Business process automation',
    costPerRequest: 0.03,
    totalCost: 86.70,
  }
];

export default function UsageAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [selectedMetric, setSelectedMetric] = useState<'requests' | 'cost' | 'performance'>('requests');
  const [selectedType, setSelectedType] = useState<AgentType | 'all'>('all');

  const timeRanges: TimeRange[] = ['24h', '7d', '30d', '90d'];
  const agentTypes: AgentType[] = ['development', 'analysis', 'assistant', 'research', 'automation'];

  const filteredAgents = useMemo(() => 
    selectedType === 'all' ? myAgents : myAgents.filter(agent => agent.type === selectedType),
    [selectedType]
  );

  const stats = useMemo(() => ({
    totalRequests: filteredAgents.reduce((sum, agent) => sum + agent.requests, 0),
    totalCost: filteredAgents.reduce((sum, agent) => sum + agent.totalCost, 0),
    averagePerformance: Math.round(filteredAgents.reduce((sum, agent) => sum + agent.performance, 0) / filteredAgents.length * 10) / 10,
    averageUptime: Math.round(filteredAgents.reduce((sum, agent) => sum + agent.uptime, 0) / filteredAgents.length * 10) / 10,
    costPerRequest: filteredAgents.reduce((sum, agent) => sum + agent.totalCost, 0) / 
                   filteredAgents.reduce((sum, agent) => sum + agent.requests, 0),
    activeAgents: filteredAgents.filter(agent => agent.status === 'active').length,
    errorRate: Math.round((filteredAgents.reduce((sum, agent) => sum + (100 - agent.performance), 0) / filteredAgents.length) * 10) / 10,
  }), [filteredAgents]);

  // Mock trend data (would come from API)
  const trends = {
    requests: {
      value: 15.3,
      positive: true,
    },
    cost: {
      value: 8.7,
      positive: false,
    },
    performance: {
      value: 2.1,
      positive: true,
    },
    uptime: {
      value: 0.5,
      positive: true,
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Usage Analytics
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Comprehensive analytics for {filteredAgents.length} agents
            </p>
          </div>

          {/* Time Range Selector */}
          <div className="flex space-x-2">
            {timeRanges.map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
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

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Total Requests</h3>
              <BoltIcon className="h-6 w-6 text-blue-500" />
            </div>
            <p className="text-3xl font-bold">{stats.totalRequests.toLocaleString()}</p>
            <div className="flex items-center mt-2 text-sm">
              <div className={`flex items-center ${trends.requests.positive ? 'text-green-500' : 'text-red-500'}`}>
                {trends.requests.positive ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                )}
                {trends.requests.value}%
              </div>
              <span className="text-gray-500 ml-2">vs. last period</span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Total Cost</h3>
              <CurrencyDollarIcon className="h-6 w-6 text-green-500" />
            </div>
            <p className="text-3xl font-bold">${stats.totalCost.toFixed(2)}</p>
            <div className="flex items-center mt-2 text-sm">
              <div className={`flex items-center ${!trends.cost.positive ? 'text-green-500' : 'text-red-500'}`}>
                {!trends.cost.positive ? (
                  <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                )}
                {trends.cost.value}%
              </div>
              <span className="text-gray-500 ml-2">vs. last period</span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Performance</h3>
              <ChartBarIcon className="h-6 w-6 text-purple-500" />
            </div>
            <p className="text-3xl font-bold">{stats.averagePerformance}%</p>
            <div className="flex items-center mt-2 text-sm">
              <div className={`flex items-center ${trends.performance.positive ? 'text-green-500' : 'text-red-500'}`}>
                {trends.performance.positive ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                )}
                {trends.performance.value}%
              </div>
              <span className="text-gray-500 ml-2">vs. last period</span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Uptime</h3>
              <ClockIcon className="h-6 w-6 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold">{stats.averageUptime}%</p>
            <div className="flex items-center mt-2 text-sm">
              <div className={`flex items-center ${trends.uptime.positive ? 'text-green-500' : 'text-red-500'}`}>
                {trends.uptime.positive ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                )}
                {trends.uptime.value}%
              </div>
              <span className="text-gray-500 ml-2">vs. last period</span>
            </div>
          </motion.div>
        </div>

        {/* Filters and Secondary Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Detailed Metrics</h2>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as AgentType | 'all')}
                className="input-field max-w-[200px]"
              >
                <option value="all">All Agent Types</option>
                {agentTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Cost per Request</span>
                  <CurrencyDollarIcon className="h-5 w-5 text-green-500" />
                </div>
                <p className="text-2xl font-bold mt-2">
                  ${stats.costPerRequest.toFixed(3)}
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Error Rate</span>
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                </div>
                <p className="text-2xl font-bold mt-2">
                  {stats.errorRate}%
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Active Agents</span>
                  <CheckCircleIcon className="h-5 w-5 text-blue-500" />
                </div>
                <p className="text-2xl font-bold mt-2">
                  {stats.activeAgents} / {filteredAgents.length}
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Avg Response Time</span>
                  <CpuChipIcon className="h-5 w-5 text-purple-500" />
                </div>
                <p className="text-2xl font-bold mt-2">
                  245ms
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Top Performers</h2>
            <div className="space-y-4">
              {filteredAgents
                .sort((a, b) => b.performance - a.performance)
                .slice(0, 3)
                .map((agent) => (
                  <div key={agent.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{agent.name}</p>
                      <p className="text-sm text-gray-500">{agent.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{agent.performance}%</p>
                      <p className="text-sm text-gray-500">
                        {agent.requests.toLocaleString()} requests
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Usage Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Usage by Type</h2>
            <div className="space-y-4">
              {Object.entries(
                filteredAgents.reduce((acc, agent) => {
                  acc[agent.type] = (acc[agent.type] || 0) + agent.requests;
                  return acc;
                }, {} as Record<AgentType, number>)
              ).sort(([, a], [, b]) => b - a).map(([type, requests]) => (
                <div key={type} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {requests.toLocaleString()} requests
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded">
                    <div
                      className="h-full bg-blue-500 rounded"
                      style={{
                        width: `${(requests / stats.totalRequests) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Cost Distribution</h2>
            <div className="space-y-4">
              {Object.entries(
                filteredAgents.reduce((acc, agent) => {
                  acc[agent.type] = (acc[agent.type] || 0) + agent.totalCost;
                  return acc;
                }, {} as Record<AgentType, number>)
              ).sort(([, a], [, b]) => b - a).map(([type, cost]) => (
                <div key={type} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      ${cost.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded">
                    <div
                      className="h-full bg-green-500 rounded"
                      style={{
                        width: `${(cost / stats.totalCost) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Agent Performance Matrix</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedMetric('requests')}
                  className={`px-3 py-1 rounded-md text-sm font-medium
                    ${selectedMetric === 'requests'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                  Requests
                </button>
                <button
                  onClick={() => setSelectedMetric('cost')}
                  className={`px-3 py-1 rounded-md text-sm font-medium
                    ${selectedMetric === 'cost'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                  Cost
                </button>
                <button
                  onClick={() => setSelectedMetric('performance')}
                  className={`px-3 py-1 rounded-md text-sm font-medium
                    ${selectedMetric === 'performance'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                  Performance
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Agent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {selectedMetric === 'requests' ? 'Requests' :
                       selectedMetric === 'cost' ? 'Cost' : 'Performance'}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trend
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredAgents.map((agent) => (
                    <tr key={agent.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">{agent.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm">{agent.type}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${agent.status === 'active' ? 'bg-green-100 text-green-800' :
                            agent.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                            agent.status === 'error' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'}`}>
                          {agent.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {selectedMetric === 'requests' ? agent.requests.toLocaleString() :
                         selectedMetric === 'cost' ? `$${agent.totalCost.toFixed(2)}` :
                         `${agent.performance}%`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className={`inline-flex items-center ${
                          Math.random() > 0.5 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {Math.random() > 0.5 ? (
                            <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                          ) : (
                            <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                          )}
                          {(Math.random() * 10).toFixed(1)}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 