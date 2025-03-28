import { motion } from 'framer-motion';
import { BoltIcon, ClockIcon, ChartBarIcon } from '@heroicons/react/24/outline';

interface AgentCardProps {
  agent: {
    id: number;
    name: string;
    status: string;
    type: string;
    requests: number;
    uptime: number;
    lastActive: string;
    performance: number;
  };
  view: 'grid' | 'list';
  onSelect: () => void;
}

export function AgentCard({ agent, view, onSelect }: AgentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500';
      case 'paused':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 cursor-pointer
        ${view === 'list' ? 'flex justify-between items-center' : 'block'}`}
      onClick={onSelect}
    >
      <div className={view === 'list' ? 'flex items-center space-x-4 flex-1' : ''}>
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {agent.name}
            </h3>
            <span className={`inline-block w-3 h-3 rounded-full ${getStatusColor(agent.status)}`} />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Type: {agent.type}
          </p>
        </div>

        <div className={`grid ${view === 'list' ? 'grid-cols-4 gap-8' : 'grid-cols-2 gap-4'} mt-4`}>
          <div className="flex items-center space-x-2">
            <BoltIcon className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium">{agent.requests}</p>
              <p className="text-xs text-gray-500">Requests</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <ChartBarIcon className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm font-medium">{agent.uptime}%</p>
              <p className="text-xs text-gray-500">Uptime</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <ClockIcon className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-sm font-medium">{agent.lastActive}</p>
              <p className="text-xs text-gray-500">Last Active</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative w-full h-2 bg-gray-200 rounded">
              <div 
                className="absolute top-0 left-0 h-full bg-blue-500 rounded"
                style={{ width: `${agent.performance}%` }}
              />
            </div>
            <span className="text-sm font-medium">{agent.performance}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 