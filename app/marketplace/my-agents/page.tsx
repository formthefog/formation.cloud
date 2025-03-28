'use client';

import './styles.css';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  CogIcon, 
  ClockIcon,
  BoltIcon,
  BeakerIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
  CpuChipIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';
import { AgentCard } from './components/AgentCard';
import { UsageMetrics } from './components/UsageMetrics';
import { PerformanceGraph } from './components/PerformanceGraph';
import { AgentLogs } from './components/AgentLogs';
import { QuickActions } from './components/QuickActions';
import { AgentSettings } from './components/AgentSettings';

type AgentType = 'development' | 'analysis' | 'assistant' | 'research' | 'automation';
type AgentStatus = 'active' | 'paused' | 'error' | 'maintenance';

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

export default function MyAgentsPage() {
  const [selectedView, setSelectedView] = useState<'grid' | 'list'>('grid');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [filterType, setFilterType] = useState<AgentType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<AgentStatus | 'all'>('all');

  // Enhanced mock data with various agent types
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

  const filteredAgents = myAgents.filter(agent => 
    (filterType === 'all' || agent.type === filterType) &&
    (filterStatus === 'all' || agent.status === filterStatus)
  );

  const stats = {
    totalRequests: myAgents.reduce((sum, agent) => sum + agent.requests, 0),
    averagePerformance: Math.round(myAgents.reduce((sum, agent) => sum + agent.performance, 0) / myAgents.length * 10) / 10,
    totalCost: myAgents.reduce((sum, agent) => sum + agent.totalCost, 0),
    activeAgents: myAgents.filter(agent => agent.status === 'active').length,
  };

  const agentTypes: AgentType[] = ['development', 'analysis', 'assistant', 'research', 'automation'];
  const agentStatuses: AgentStatus[] = ['active', 'paused', 'error', 'maintenance'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Agents
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Managing {myAgents.length} AI agents across {agentTypes.length} categories
            </p>
          </div>
          <div className="flex space-x-4">
            <button className="btn-primary">
              Create New Agent
            </button>
            <button className="btn-secondary">
              Import Agent
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Active Agents</h3>
              <BoltIcon className="h-6 w-6 text-green-500" />
            </div>
            <p className="text-3xl font-bold mt-2">{stats.activeAgents}</p>
            <p className="text-sm text-gray-500 mt-1">of {myAgents.length} Total Agents</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Total Requests</h3>
              <ChartBarIcon className="h-6 w-6 text-blue-500" />
            </div>
            <p className="text-3xl font-bold mt-2">{stats.totalRequests.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">Across All Agents</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Avg Performance</h3>
              <CpuChipIcon className="h-6 w-6 text-purple-500" />
            </div>
            <p className="text-3xl font-bold mt-2">{stats.averagePerformance}%</p>
            <p className="text-sm text-gray-500 mt-1">Success Rate</p>
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
            <p className="text-sm text-gray-500 mt-1">This Period</p>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as AgentType | 'all')}
                className="input-field"
              >
                <option value="all">All Types</option>
                {agentTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as AgentStatus | 'all')}
                className="input-field"
              >
                <option value="all">All Statuses</option>
                {agentStatuses.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1" />
            <div className="flex items-end">
              <div className="flex space-x-2">
                <button 
                  className={`view-toggle-btn ${selectedView === 'grid' ? 'active' : ''}`}
                  onClick={() => setSelectedView('grid')}
                >
                  Grid
                </button>
                <button 
                  className={`view-toggle-btn ${selectedView === 'list' ? 'active' : ''}`}
                  onClick={() => setSelectedView('list')}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Agent List */}
          <div className="col-span-12 lg:col-span-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {filteredAgents.length} {filterType !== 'all' ? filterType : ''} Agents
                  {filterStatus !== 'all' ? ` (${filterStatus})` : ''}
                </h2>
              </div>
              
              <div className={`grid ${selectedView === 'grid' ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                {filteredAgents.map((agent) => (
                  <AgentCard 
                    key={agent.id}
                    agent={agent}
                    view={selectedView}
                    onSelect={() => setSelectedAgent(agent)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Metrics & Quick Actions */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <QuickActions />
            <UsageMetrics timeRange={timeRange} onTimeRangeChange={setTimeRange} />
          </div>

          {/* Full Width Sections */}
          <div className="col-span-12">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Performance Analytics</h2>
              <PerformanceGraph timeRange={timeRange} />
            </div>
          </div>

          <div className="col-span-12">
            <AgentLogs selectedAgent={selectedAgent} />
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {selectedAgent && (
        <AgentSettings 
          agent={selectedAgent} 
          onClose={() => setSelectedAgent(null)} 
        />
      )}
    </div>
  );
} 