import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ExclamationCircleIcon, 
  CheckCircleIcon, 
  InformationCircleIcon 
} from '@heroicons/react/24/outline';

interface AgentLogsProps {
  selectedAgent: {
    id: number;
    name: string;
  } | null;
}

interface Log {
  id: number;
  timestamp: string;
  type: 'error' | 'success' | 'info';
  message: string;
  details?: string;
}

export function AgentLogs({ selectedAgent }: AgentLogsProps) {
  const [filter, setFilter] = useState<'all' | 'error' | 'success' | 'info'>('all');

  // Mock data - would come from API
  const logs: Log[] = [
    {
      id: 1,
      timestamp: '2024-03-28T14:30:00Z',
      type: 'success',
      message: 'Successfully processed request',
      details: 'Request completed in 245ms with 200 status code',
    },
    {
      id: 2,
      timestamp: '2024-03-28T14:29:00Z',
      type: 'error',
      message: 'Failed to connect to external API',
      details: 'Connection timeout after 5000ms',
    },
    {
      id: 3,
      timestamp: '2024-03-28T14:28:00Z',
      type: 'info',
      message: 'Agent configuration updated',
      details: 'Memory allocation increased to 512MB',
    },
    // Add more mock logs...
  ];

  const getIcon = (type: Log['type']) => {
    switch (type) {
      case 'error':
        return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'info':
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const filteredLogs = logs.filter(
    log => filter === 'all' || log.type === filter
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {selectedAgent ? `Logs: ${selectedAgent.name}` : 'All Agent Logs'}
        </h2>
        <div className="flex space-x-2">
          {(['all', 'error', 'success', 'info'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1 rounded-md text-sm font-medium
                ${filter === type
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredLogs.map((log) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border dark:border-gray-700 rounded-lg p-4"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                {getIcon(log.type)}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    {log.message}
                  </p>
                  <span className="text-xs text-gray-500">
                    {formatDate(log.timestamp)}
                  </span>
                </div>
                {log.details && (
                  <p className="mt-1 text-sm text-gray-500">
                    {log.details}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 