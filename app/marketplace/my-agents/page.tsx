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
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { AgentCard } from './components/AgentCard';
import { UsageMetrics } from './components/UsageMetrics';
import { PerformanceGraph } from './components/PerformanceGraph';
import { AgentLogs } from './components/AgentLogs';
import { QuickActions } from './components/QuickActions';
import { AgentSettings } from './components/AgentSettings';

export default function MyAgentsPage() {
  const [selectedView, setSelectedView] = useState('grid');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [timeRange, setTimeRange] = useState('24h');

  // Mock data - would come from API
  const myAgents = [
    {
      id: 1,
      name: 'Code Review Assistant',
      status: 'active',
      type: 'development',
      requests: 1205,
      uptime: 99.9,
      lastActive: '2 minutes ago',
      performance: 98.5,
    },
    // Add more mock agents...
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Agents
          </h1>
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
              <h3 className="text-lg font-semibold">Total Agents</h3>
              <BoltIcon className="h-6 w-6 text-blue-500" />
            </div>
            <p className="text-3xl font-bold mt-2">{myAgents.length}</p>
            <p className="text-sm text-gray-500 mt-1">Active and Deployed</p>
          </motion.div>
          
          {/* Add more stat cards */}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Agent List */}
          <div className="col-span-12 lg:col-span-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Deployed Agents</h2>
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
              
              <div className={`grid ${selectedView === 'grid' ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                {myAgents.map((agent) => (
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