'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon,
  CurrencyDollarIcon,
  UsersIcon,
  StarIcon,
  TrophyIcon,
  RocketLaunchIcon,
  HeartIcon,
  GlobeAltIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  FireIcon
} from '@heroicons/react/24/outline';

type AgentType = 'development' | 'analysis' | 'assistant' | 'research' | 'automation';
type AgentStatus = 'published' | 'featured' | 'trending' | 'new';
type TimeRange = '24h' | '7d' | '30d' | '90d' | 'all';

interface Review {
  id: number;
  rating: number;
  comment: string;
  user: string;
  date: string;
}

interface PublishedAgent {
  id: number;
  name: string;
  status: AgentStatus;
  type: AgentType;
  description: string;
  totalEarnings: number;
  monthlyEarnings: number;
  totalUsers: number;
  activeUsers: number;
  rating: number;
  reviews: Review[];
  totalRequests: number;
  successRate: number;
  averageResponseTime: number;
  publishDate: string;
  version: string;
  pricePerRequest: number;
  geography: Record<string, number>;
  trending: boolean;
  featured: boolean;
}

// Mock data for published agents
const publishedAgents: PublishedAgent[] = [
  {
    id: 1,
    name: 'Code Review Pro',
    status: 'featured',
    type: 'development',
    description: 'Advanced AI-powered code review and suggestions',
    totalEarnings: 12580.50,
    monthlyEarnings: 2450.75,
    totalUsers: 1250,
    activeUsers: 890,
    rating: 4.8,
    reviews: [
      {
        id: 1,
        rating: 5,
        comment: 'Incredible accuracy and helpful suggestions!',
        user: 'TechLead123',
        date: '2024-03-27'
      },
      // Add more reviews...
    ],
    totalRequests: 45280,
    successRate: 99.2,
    averageResponseTime: 245,
    publishDate: '2023-12-01',
    version: '2.1.0',
    pricePerRequest: 0.02,
    geography: {
      'North America': 45,
      'Europe': 30,
      'Asia': 15,
      'Others': 10
    },
    trending: true,
    featured: true
  },
  {
    id: 2,
    name: 'Data Insights Engine',
    status: 'trending',
    type: 'analysis',
    description: 'Enterprise-grade data analysis and visualization',
    totalEarnings: 28950.75,
    monthlyEarnings: 4850.25,
    totalUsers: 780,
    activeUsers: 650,
    rating: 4.9,
    reviews: [
      {
        id: 1,
        rating: 5,
        comment: 'Transformed our data analysis workflow!',
        user: 'DataScientist42',
        date: '2024-03-26'
      }
    ],
    totalRequests: 89750,
    successRate: 99.8,
    averageResponseTime: 180,
    publishDate: '2023-11-15',
    version: '3.0.1',
    pricePerRequest: 0.05,
    geography: {
      'North America': 40,
      'Europe': 35,
      'Asia': 20,
      'Others': 5
    },
    trending: true,
    featured: true
  },
  {
    id: 3,
    name: 'Support Genius',
    status: 'published',
    type: 'assistant',
    description: 'AI-powered customer support automation',
    totalEarnings: 8750.25,
    monthlyEarnings: 1250.50,
    totalUsers: 320,
    activeUsers: 280,
    rating: 4.7,
    reviews: [
      {
        id: 1,
        rating: 5,
        comment: 'Reduced our support response time by 70%!',
        user: 'SupportManager',
        date: '2024-03-25'
      }
    ],
    totalRequests: 125890,
    successRate: 98.5,
    averageResponseTime: 150,
    publishDate: '2024-01-10',
    version: '1.5.0',
    pricePerRequest: 0.01,
    geography: {
      'North America': 35,
      'Europe': 40,
      'Asia': 20,
      'Others': 5
    },
    trending: false,
    featured: false
  },
  {
    id: 4,
    name: 'Research Assistant Pro',
    status: 'new',
    type: 'research',
    description: 'Academic research and paper analysis assistant',
    totalEarnings: 5280.90,
    monthlyEarnings: 1890.30,
    totalUsers: 150,
    activeUsers: 120,
    rating: 4.9,
    reviews: [
      {
        id: 1,
        rating: 5,
        comment: 'A game-changer for academic research!',
        user: 'Professor_Smith',
        date: '2024-03-24'
      }
    ],
    totalRequests: 15780,
    successRate: 99.5,
    averageResponseTime: 320,
    publishDate: '2024-02-20',
    version: '1.0.2',
    pricePerRequest: 0.08,
    geography: {
      'North America': 30,
      'Europe': 45,
      'Asia': 20,
      'Others': 5
    },
    trending: true,
    featured: false
  }
];

export default function MyPublishedAgentsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [selectedAgent, setSelectedAgent] = useState<PublishedAgent | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<'earnings' | 'users' | 'performance'>('earnings');

  const timeRanges: TimeRange[] = ['24h', '7d', '30d', '90d', 'all'];

  const stats = useMemo(() => ({
    totalEarnings: publishedAgents.reduce((sum, agent) => sum + agent.totalEarnings, 0),
    monthlyEarnings: publishedAgents.reduce((sum, agent) => sum + agent.monthlyEarnings, 0),
    totalUsers: publishedAgents.reduce((sum, agent) => sum + agent.totalUsers, 0),
    activeUsers: publishedAgents.reduce((sum, agent) => sum + agent.activeUsers, 0),
    averageRating: Math.round(publishedAgents.reduce((sum, agent) => sum + agent.rating, 0) / publishedAgents.length * 10) / 10,
    totalRequests: publishedAgents.reduce((sum, agent) => sum + agent.totalRequests, 0),
    featuredAgents: publishedAgents.filter(agent => agent.featured).length,
    trendingAgents: publishedAgents.filter(agent => agent.trending).length,
  }), []);

  // Mock trend data
  const trends = {
    earnings: {
      value: 28.5,
      positive: true,
    },
    users: {
      value: 15.8,
      positive: true,
    },
    rating: {
      value: 0.3,
      positive: true,
    },
    requests: {
      value: 22.4,
      positive: true,
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Success Banner */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  My Published Agents
                </h1>
                <p className="mt-2 text-blue-100">
                  {publishedAgents.length} agents published · {stats.featuredAgents} featured · {stats.trendingAgents} trending
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-blue-100">Total Earnings</p>
                  <p className="text-2xl font-bold text-white">
                    ${stats.totalEarnings.toLocaleString()}
                  </p>
                </div>
                <TrophyIcon className="h-12 w-12 text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex justify-end space-x-2">
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

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Monthly Revenue</h3>
              <CurrencyDollarIcon className="h-6 w-6 text-green-500" />
            </div>
            <p className="text-3xl font-bold">${stats.monthlyEarnings.toLocaleString()}</p>
            <div className="flex items-center mt-2 text-sm">
              <div className={`flex items-center ${trends.earnings.positive ? 'text-green-500' : 'text-red-500'}`}>
                {trends.earnings.positive ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                )}
                {trends.earnings.value}%
              </div>
              <span className="text-gray-500 ml-2">vs. last month</span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Active Users</h3>
              <UsersIcon className="h-6 w-6 text-blue-500" />
            </div>
            <p className="text-3xl font-bold">{stats.activeUsers.toLocaleString()}</p>
            <div className="flex items-center mt-2 text-sm">
              <div className={`flex items-center ${trends.users.positive ? 'text-green-500' : 'text-red-500'}`}>
                {trends.users.positive ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                )}
                {trends.users.value}%
              </div>
              <span className="text-gray-500 ml-2">user growth</span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Average Rating</h3>
              <StarIcon className="h-6 w-6 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold">{stats.averageRating}</p>
            <div className="flex items-center mt-2 text-sm">
              <div className={`flex items-center ${trends.rating.positive ? 'text-green-500' : 'text-red-500'}`}>
                {trends.rating.positive ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                )}
                {trends.rating.value}
              </div>
              <span className="text-gray-500 ml-2">rating increase</span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Total Requests</h3>
              <RocketLaunchIcon className="h-6 w-6 text-purple-500" />
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
              <span className="text-gray-500 ml-2">request growth</span>
            </div>
          </motion.div>
        </div>

        {/* Agent Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {publishedAgents.map((agent) => (
            <motion.div
              key={agent.id}
              whileHover={{ scale: 1.01 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-semibold">{agent.name}</h3>
                      {agent.featured && (
                        <CheckBadgeIcon className="h-5 w-5 text-blue-500" />
                      )}
                      {agent.trending && (
                        <FireIcon className="h-5 w-5 text-orange-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{agent.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium
                    ${agent.status === 'featured' ? 'bg-blue-100 text-blue-800' :
                      agent.status === 'trending' ? 'bg-orange-100 text-orange-800' :
                      agent.status === 'new' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'}`}>
                    {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Monthly Revenue</span>
                      <span className="font-medium">${agent.monthlyEarnings.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Active Users</span>
                      <span className="font-medium">{agent.activeUsers.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Success Rate</span>
                      <span className="font-medium">{agent.successRate}%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Rating</span>
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="font-medium">{agent.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Response Time</span>
                      <span className="font-medium">{agent.averageResponseTime}ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Version</span>
                      <span className="font-medium">{agent.version}</span>
                    </div>
                  </div>
                </div>

                {/* Mini Geography Chart */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-2">Geographic Distribution</h4>
                  <div className="flex items-center space-x-1">
                    {Object.entries(agent.geography).map(([region, percentage]) => (
                      <div
                        key={region}
                        className="h-2 rounded-full"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: region === 'North America' ? '#3B82F6' :
                                         region === 'Europe' ? '#10B981' :
                                         region === 'Asia' ? '#6366F1' :
                                         '#9CA3AF'
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>NA {agent.geography['North America']}%</span>
                    <span>EU {agent.geography['Europe']}%</span>
                    <span>AS {agent.geography['Asia']}%</span>
                    <span>Other {agent.geography['Others']}%</span>
                  </div>
                </div>

                {/* Recent Review */}
                {agent.reviews.length > 0 && (
                  <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400 mt-1" />
                      <div>
                        <div className="flex items-center">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`h-4 w-4 ${
                                  i < agent.reviews[0].rating
                                    ? 'text-yellow-500'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500 ml-2">
                            {agent.reviews[0].user}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{agent.reviews[0].comment}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Footer */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button className="btn-primary">
                      View Analytics
                    </button>
                    <button className="btn-secondary">
                      Update Agent
                    </button>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <GlobeAltIcon className="h-4 w-4" />
                    <span>Published {new Date(agent.publishDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Achievement Badges */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Developer Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <TrophyIcon className="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <div>
                <p className="font-medium">Top Earner</p>
                <p className="text-sm text-gray-500">Top 5% of developers</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <SparklesIcon className="h-6 w-6 text-purple-500" />
                </div>
              </div>
              <div>
                <p className="font-medium">Innovation Star</p>
                <p className="text-sm text-gray-500">2 Featured Agents</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <HeartIcon className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <div>
                <p className="font-medium">User Favorite</p>
                <p className="text-sm text-gray-500">4.8+ Avg Rating</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                  <RocketLaunchIcon className="h-6 w-6 text-orange-500" />
                </div>
              </div>
              <div>
                <p className="font-medium">Fast Growing</p>
                <p className="text-sm text-gray-500">+200% Monthly Growth</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips for Success */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Tips for Success</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <SparklesIcon className="h-6 w-6 text-yellow-400" />
                <h3 className="text-lg font-medium text-white">Optimize Performance</h3>
              </div>
              <p className="mt-2 text-blue-100">
                Reduce response times and improve accuracy to boost your agent's ranking.
              </p>
            </div>

            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <UsersIcon className="h-6 w-6 text-yellow-400" />
                <h3 className="text-lg font-medium text-white">Engage Users</h3>
              </div>
              <p className="mt-2 text-blue-100">
                Respond to reviews and keep your agent documentation up to date.
              </p>
            </div>

            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <RocketLaunchIcon className="h-6 w-6 text-yellow-400" />
                <h3 className="text-lg font-medium text-white">Regular Updates</h3>
              </div>
              <p className="mt-2 text-blue-100">
                Keep your agents current with new features and improvements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 