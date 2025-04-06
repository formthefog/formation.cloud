'use client';

import './styles.css';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChartBarIcon, 
  CogIcon,
  BoltIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  ClipboardDocumentIcon,
  MagnifyingGlassIcon,
  RocketLaunchIcon,
  CommandLineIcon,
  BeakerIcon,
  ClockIcon,
  CpuChipIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  DocumentMagnifyingGlassIcon,
  CircleStackIcon,
  CloudIcon,
  ShieldCheckIcon,
  PresentationChartLineIcon,
  DocumentDuplicateIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface HiredAgent {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  type: 'code' | 'research' | 'assistant' | 'analysis' | 'security' | 'data' | 'cloud' | 'nlp';
  status: 'active' | 'idle' | 'busy';
  requests: number;
  successRate: number;
  lastActive: string;
  avgResponseTime: string;
  costPerRequest: number;
  totalCost: number;
  recentActivity: string;
  load: number; // CPU/Memory load percentage
}

export default function MyAgentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<HiredAgent['type'] | 'all'>('all');

  // Expanded example agents
  const hiredAgents: HiredAgent[] = [
    {
      id: 'agent_123',
      name: 'Code Review Pro',
      description: 'Advanced code review and suggestions',
      endpoint: '/v1/agents/code-review-pro/analyze',
      type: 'code',
      status: 'active',
      requests: 1205,
      successRate: 99.8,
      lastActive: 'Just now',
      avgResponseTime: '1.2s',
      costPerRequest: 0.001,
      totalCost: 1.21,
      recentActivity: 'Analyzing pull request #234',
      load: 65
    },
    {
      id: 'agent_456',
      name: 'Research Assistant',
      description: 'Academic research and paper analysis',
      endpoint: '/v1/agents/research-assistant/search',
      type: 'research',
      status: 'busy',
      requests: 892,
      successRate: 99.5,
      lastActive: '2m ago',
      avgResponseTime: '2.5s',
      costPerRequest: 0.002,
      totalCost: 1.78,
      recentActivity: 'Summarizing research papers on AI',
      load: 85
    },
    {
      id: 'agent_789',
      name: 'Data Analyzer',
      description: 'Statistical analysis and visualization',
      endpoint: '/v1/agents/data-analyzer/process',
      type: 'analysis',
      status: 'idle',
      requests: 567,
      successRate: 100,
      lastActive: '15m ago',
      avgResponseTime: '1.8s',
      costPerRequest: 0.0015,
      totalCost: 0.85,
      recentActivity: 'Generated quarterly report',
      load: 20
    },
    {
      id: 'agent_234',
      name: 'Security Scanner',
      description: 'Continuous security monitoring',
      endpoint: '/v1/agents/security-scanner/scan',
      type: 'security',
      status: 'active',
      requests: 3102,
      successRate: 99.9,
      lastActive: '1m ago',
      avgResponseTime: '0.8s',
      costPerRequest: 0.001,
      totalCost: 3.10,
      recentActivity: 'Scanning network endpoints',
      load: 75
    },
    {
      id: 'agent_567',
      name: 'Data Pipeline Manager',
      description: 'ETL and data pipeline automation',
      endpoint: '/v1/agents/data-pipeline/manage',
      type: 'data',
      status: 'active',
      requests: 1567,
      successRate: 99.7,
      lastActive: '30s ago',
      avgResponseTime: '1.5s',
      costPerRequest: 0.002,
      totalCost: 3.13,
      recentActivity: 'Processing daily data imports',
      load: 90
    },
    {
      id: 'agent_890',
      name: 'Cloud Optimizer',
      description: 'Infrastructure optimization',
      endpoint: '/v1/agents/cloud-optimizer/analyze',
      type: 'cloud',
      status: 'active',
      requests: 456,
      successRate: 99.6,
      lastActive: '5m ago',
      avgResponseTime: '3.2s',
      costPerRequest: 0.003,
      totalCost: 1.37,
      recentActivity: 'Optimizing container resources',
      load: 45
    },
    {
      id: 'agent_345',
      name: 'NLP Processor',
      description: 'Natural language processing',
      endpoint: '/v1/agents/nlp-processor/analyze',
      type: 'nlp',
      status: 'busy',
      requests: 2345,
      successRate: 99.4,
      lastActive: 'Just now',
      avgResponseTime: '1.1s',
      costPerRequest: 0.001,
      totalCost: 2.35,
      recentActivity: 'Processing customer feedback',
      load: 95
    },
    {
      id: 'agent_678',
      name: 'Bug Hunter',
      description: 'Automated bug detection',
      endpoint: '/v1/agents/bug-hunter/scan',
      type: 'code',
      status: 'active',
      requests: 789,
      successRate: 99.8,
      lastActive: '3m ago',
      avgResponseTime: '2.1s',
      costPerRequest: 0.002,
      totalCost: 1.58,
      recentActivity: 'Analyzing error logs',
      load: 70
    },
    {
      id: 'agent_901',
      name: 'Market Researcher',
      description: 'Market trend analysis',
      endpoint: '/v1/agents/market-research/analyze',
      type: 'research',
      status: 'active',
      requests: 678,
      successRate: 99.5,
      lastActive: '8m ago',
      avgResponseTime: '2.8s',
      costPerRequest: 0.003,
      totalCost: 2.03,
      recentActivity: 'Analyzing competitor data',
      load: 60
    },
    {
      id: 'agent_432',
      name: 'Performance Analyzer',
      description: 'System performance optimization',
      endpoint: '/v1/agents/perf-analyzer/monitor',
      type: 'analysis',
      status: 'active',
      requests: 1234,
      successRate: 99.9,
      lastActive: '1m ago',
      avgResponseTime: '1.5s',
      costPerRequest: 0.001,
      totalCost: 1.23,
      recentActivity: 'Monitoring system metrics',
      load: 80
    },
    {
      id: 'agent_765',
      name: 'Threat Detective',
      description: 'Security threat detection',
      endpoint: '/v1/agents/threat-detective/scan',
      type: 'security',
      status: 'busy',
      requests: 2456,
      successRate: 99.9,
      lastActive: 'Just now',
      avgResponseTime: '0.9s',
      costPerRequest: 0.002,
      totalCost: 4.91,
      recentActivity: 'Investigating suspicious activity',
      load: 100
    },
    {
      id: 'agent_098',
      name: 'Data Cleaner',
      description: 'Data cleaning and preparation',
      endpoint: '/v1/agents/data-cleaner/process',
      type: 'data',
      status: 'idle',
      requests: 890,
      successRate: 99.7,
      lastActive: '12m ago',
      avgResponseTime: '1.7s',
      costPerRequest: 0.001,
      totalCost: 0.89,
      recentActivity: 'Cleaned customer dataset',
      load: 15
    },
    {
      id: 'agent_321',
      name: 'Cloud Monitor',
      description: 'Cloud resource monitoring',
      endpoint: '/v1/agents/cloud-monitor/check',
      type: 'cloud',
      status: 'active',
      requests: 3456,
      successRate: 99.8,
      lastActive: '2m ago',
      avgResponseTime: '1.0s',
      costPerRequest: 0.001,
      totalCost: 3.46,
      recentActivity: 'Monitoring AWS resources',
      load: 85
    },
    {
      id: 'agent_654',
      name: 'Sentiment Analyzer',
      description: 'Text sentiment analysis',
      endpoint: '/v1/agents/sentiment/analyze',
      type: 'nlp',
      status: 'active',
      requests: 1789,
      successRate: 99.6,
      lastActive: '4m ago',
      avgResponseTime: '1.3s',
      costPerRequest: 0.001,
      totalCost: 1.79,
      recentActivity: 'Analyzing social media feed',
      load: 55
    },
    {
      id: 'agent_987',
      name: 'Code Generator',
      description: 'Automated code generation',
      endpoint: '/v1/agents/code-gen/create',
      type: 'code',
      status: 'busy',
      requests: 567,
      successRate: 99.5,
      lastActive: 'Just now',
      avgResponseTime: '2.4s',
      costPerRequest: 0.002,
      totalCost: 1.13,
      recentActivity: 'Generating API endpoints',
      load: 95
    },
    {
      id: 'agent_210',
      name: 'Patent Researcher',
      description: 'Patent analysis and search',
      endpoint: '/v1/agents/patent-research/search',
      type: 'research',
      status: 'active',
      requests: 345,
      successRate: 99.7,
      lastActive: '7m ago',
      avgResponseTime: '3.5s',
      costPerRequest: 0.004,
      totalCost: 1.38,
      recentActivity: 'Searching patent database',
      load: 40
    }
  ];

  const getAgentIcon = (type: HiredAgent['type']) => {
    switch (type) {
      case 'code':
        return <CommandLineIcon className="w-6 h-6" />;
      case 'research':
        return <DocumentMagnifyingGlassIcon className="w-6 h-6" />;
      case 'assistant':
        return <ChatBubbleLeftRightIcon className="w-6 h-6" />;
      case 'analysis':
        return <PresentationChartLineIcon className="w-6 h-6" />;
      case 'security':
        return <ShieldCheckIcon className="w-6 h-6" />;
      case 'data':
        return <CircleStackIcon className="w-6 h-6" />;
      case 'cloud':
        return <CloudIcon className="w-6 h-6" />;
      case 'nlp':
        return <DocumentDuplicateIcon className="w-6 h-6" />;
      default:
        return <CogIcon className="w-6 h-6" />;
    }
  };

  const getStatusColor = (status: HiredAgent['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'busy':
        return 'bg-yellow-500';
      case 'idle':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getLoadColor = (load: number) => {
    if (load >= 90) return 'text-red-500';
    if (load >= 70) return 'text-yellow-500';
    return 'text-green-500';
  };

  const filteredAgents = hiredAgents.filter(agent =>
    (selectedType === 'all' || agent.type === selectedType) &&
    (agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const stats = {
    activeAgents: hiredAgents.filter(a => a.status === 'active').length,
    totalRequests: hiredAgents.reduce((sum, a) => sum + a.requests, 0),
    avgSuccessRate: Math.round(hiredAgents.reduce((sum, a) => sum + a.successRate, 0) / hiredAgents.length * 10) / 10,
    totalCost: hiredAgents.reduce((sum, a) => sum + a.totalCost, 0),
    busyAgents: hiredAgents.filter(a => a.status === 'busy').length,
    avgLoad: Math.round(hiredAgents.reduce((sum, a) => sum + a.load, 0) / hiredAgents.length)
  };

  const agentTypes: HiredAgent['type'][] = ['code', 'research', 'analysis', 'security', 'data', 'cloud', 'nlp'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              Command Center
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Monitoring {hiredAgents.length} AI agents • {stats.activeAgents} active • {stats.busyAgents} busy • System load: {stats.avgLoad}%
            </p>
          </div>
          <Link href="/marketplace/browse">
            <Button className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2">
              <RocketLaunchIcon className="w-5 h-5" />
              Hire More Agents
            </Button>
          </Link>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Active Agents</h3>
              <BoltIcon className="h-6 w-6 text-green-500" />
            </div>
            <p className="text-3xl font-bold mt-2">{stats.activeAgents}</p>
            <p className="text-sm text-gray-500 mt-1">of {hiredAgents.length} total</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Busy Agents</h3>
              <CpuChipIcon className="h-6 w-6 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold mt-2">{stats.busyAgents}</p>
            <p className="text-sm text-gray-500 mt-1">processing tasks</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">System Load</h3>
              <ArrowPathIcon className={`h-6 w-6 ${getLoadColor(stats.avgLoad)}`} />
            </div>
            <p className="text-3xl font-bold mt-2">{stats.avgLoad}%</p>
            <p className="text-sm text-gray-500 mt-1">average load</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Total Tasks</h3>
              <ChartBarIcon className="h-6 w-6 text-blue-500" />
            </div>
            <p className="text-3xl font-bold mt-2">{stats.totalRequests.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">tasks completed</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Success Rate</h3>
              <SparklesIcon className="h-6 w-6 text-purple-500" />
            </div>
            <p className="text-3xl font-bold mt-2">{stats.avgSuccessRate}%</p>
            <p className="text-sm text-gray-500 mt-1">completion rate</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Total Cost</h3>
              <DocumentTextIcon className="h-6 w-6 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold mt-2">${stats.totalCost.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-1">this month</p>
          </motion.div>
        </div>

        {/* Agent Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-grow max-w-md">
              <input
                type="text"
                placeholder="Search agents..."
                className="pl-10 pr-4 py-2 w-full border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={selectedType === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedType('all')}
              >
                All Types
              </Button>
              {agentTypes.map(type => (
                <Button
                  key={type}
                  size="sm"
                  variant={selectedType === type ? 'default' : 'outline'}
                  onClick={() => setSelectedType(type)}
                  className="flex items-center gap-2"
                >
                  {getAgentIcon(type)}
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Agent Grid */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {filteredAgents.map((agent) => (
                <motion.div
                  key={agent.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ scale: 1.02 }}
                  className="border dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 bg-purple-100 dark:bg-purple-900 rounded-lg ${agent.status === 'busy' ? 'animate-pulse' : ''}`}>
                      {getAgentIcon(agent.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-lg truncate">{agent.name}</h3>
                        <div className={`h-2.5 w-2.5 rounded-full ${getStatusColor(agent.status)}`} />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        {agent.description}
                      </p>
                      
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Success Rate</span>
                          <span className="font-medium">{agent.successRate}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Response Time</span>
                          <span className="font-medium">{agent.avgResponseTime}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">System Load</span>
                          <span className={`font-medium ${getLoadColor(agent.load)}`}>{agent.load}%</span>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t dark:border-gray-700">
                        <div className="flex items-center gap-2 text-sm">
                          <ClockIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-500">{agent.lastActive}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                          {agent.recentActivity}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded truncate max-w-[150px]">
                          {agent.endpoint}
                        </code>
                        <Button size="sm" variant="outline" className="flex items-center gap-1">
                          <CogIcon className="h-4 w-4" />
                          Configure
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
} 