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
  FireIcon,
  KeyIcon,
  ShieldCheckIcon,
  BoltIcon,
  CommandLineIcon,
  ArrowRightIcon,
  UserGroupIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useIsLoggedIn } from '@dynamic-labs/sdk-react-core';
import { AuthButton } from '@/components/AuthButton';

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
  const isLoggedIn = useIsLoggedIn();
  const [showAuthFlow, setShowAuthFlow] = useState(false);
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
      {isLoggedIn ? (
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Published Agents
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Create and publish your AI agents to the Formation marketplace.
              </p>
            </div>
            <Link href="/marketplace/create-agent">
              <Button className="bg-[#0A84FF] hover:bg-[#0A84FF]/90 flex items-center gap-2">
                <RocketLaunchIcon className="w-5 h-5" />
                Create Your First Agent
              </Button>
            </Link>
          </div>

          {/* Empty State */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="mb-6 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A84FF]/10 to-blue-500/10 blur-3xl" />
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#0A84FF]/10 to-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-200/20">
                    <SparklesIcon className="w-8 h-8 text-[#0A84FF]" />
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#0A84FF] to-blue-600">
                Start Building Your AI Agent Portfolio
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                Share your expertise with the world by creating and publishing AI agents. Build once, earn continuously.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 rounded-xl bg-gradient-to-r from-[#0A84FF]/5 to-blue-500/5 border border-blue-200/10">
                  <CommandLineIcon className="w-8 h-8 text-[#0A84FF] mb-3" />
                  <h3 className="font-semibold mb-2">Easy Development</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Build agents with our intuitive SDK and tools.
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-gradient-to-r from-[#0A84FF]/5 to-blue-500/5 border border-blue-200/10">
                  <ChartBarIcon className="w-8 h-8 text-[#0A84FF] mb-3" />
                  <h3 className="font-semibold mb-2">Usage Analytics</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Track your agents' performance and adoption.
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-gradient-to-r from-[#0A84FF]/5 to-blue-500/5 border border-blue-200/10">
                  <CurrencyDollarIcon className="w-8 h-8 text-[#0A84FF] mb-3" />
                  <h3 className="font-semibold mb-2">Revenue Share</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Earn from every deployment of your agents.
                  </p>
                </div>
              </div>
              <Link href="/marketplace/create-agent">
                <Button size="lg" className="bg-[#0A84FF] hover:bg-[#0A84FF]/90">
                  Start Building
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="marketing-hero rounded-3xl p-8"
            >
              <div className="inline-block mb-3 px-4 py-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-300 text-sm font-medium">
                <span className="flex items-center gap-2">
                  <KeyIcon className="w-4 h-4" />
                  Developer Program Now Open
                </span>
              </div>
              <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-6">
                Build Once, Earn Continuously
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                Join our community of AI developers and monetize your expertise by publishing agents on Formation's marketplace.
              </p>
              <div className="flex items-center justify-center">
                <AuthButton />
              </div>
            </motion.div>
          </div>

          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            <div className="marketing-card">
              <div className="text-purple-600 mb-4">
                <GlobeAltIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Global Reach</h3>
              <p className="text-gray-600">
                Access a worldwide audience of businesses seeking AI solutions.
              </p>
            </div>
            <div className="marketing-card">
              <div className="text-blue-600 mb-4">
                <BeakerIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Developer Tools</h3>
              <p className="text-gray-600">
                Comprehensive SDK and documentation to build powerful agents.
              </p>
            </div>
            <div className="marketing-card">
              <div className="text-green-600 mb-4">
                <UserGroupIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-gray-600">
                Join a network of developers shaping the future of AI.
              </p>
            </div>
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-xl p-8 mb-16"
          >
            <div className="text-center mb-8">
              <div className="inline-block mb-3 px-4 py-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-300 text-sm font-medium">
                <span className="flex items-center gap-2">
                  <SparklesIcon className="w-4 h-4" />
                  Developer Benefits
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Everything You Need to Succeed
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We provide the tools and platform, you bring the innovation.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <div className="marketing-card group">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <CommandLineIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Developer SDK</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Comprehensive tools and libraries for agent development.
                    </p>
                  </div>
                </div>
              </div>
              <div className="marketing-card group">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <ChartBarIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Analytics Dashboard</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Monitor your agents' performance and usage metrics.
                    </p>
                  </div>
                </div>
              </div>
              <div className="marketing-card group">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <CurrencyDollarIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Revenue Sharing</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Fair and transparent revenue sharing model.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-xl p-12 text-white"
          >
            <h2 className="text-3xl font-bold mb-6">
              Start Building Today
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join the growing community of AI developers on Formation.
            </p>
            <AuthButton />
          </motion.div>
        </div>
      )}
    </div>
  );
} 