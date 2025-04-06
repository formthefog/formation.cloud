import { motion } from 'framer-motion';
import { 
  PlusIcon,
  ArrowPathIcon,
  PauseIcon,
  PlayIcon,
  CogIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';

interface QuickAction {
  id: string;
  name: string;
  description: string;
  icon: typeof PlusIcon;
  action: () => void;
}

export function QuickActions() {
  const actions: QuickAction[] = [
    {
      id: 'create',
      name: 'Create Agent',
      description: 'Deploy a new agent from scratch',
      icon: PlusIcon,
      action: () => console.log('Create agent'),
    },
    {
      id: 'restart',
      name: 'Restart All',
      description: 'Restart all paused agents',
      icon: ArrowPathIcon,
      action: () => console.log('Restart all'),
    },
    {
      id: 'pause',
      name: 'Pause All',
      description: 'Pause all running agents',
      icon: PauseIcon,
      action: () => console.log('Pause all'),
    },
    {
      id: 'resume',
      name: 'Resume All',
      description: 'Resume all paused agents',
      icon: PlayIcon,
      action: () => console.log('Resume all'),
    },
    {
      id: 'settings',
      name: 'Bulk Settings',
      description: 'Modify settings for multiple agents',
      icon: CogIcon,
      action: () => console.log('Bulk settings'),
    },
    {
      id: 'duplicate',
      name: 'Clone Agent',
      description: 'Create a copy of an existing agent',
      icon: DocumentDuplicateIcon,
      action: () => console.log('Clone agent'),
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => (
          <motion.button
            key={action.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.action}
            className="flex flex-col items-center justify-center p-4 rounded-lg
              bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600
              transition-colors duration-200"
          >
            <action.icon className="h-6 w-6 text-blue-500 mb-2" />
            <span className="text-sm font-medium">{action.name}</span>
            <span className="text-xs text-gray-500 text-center mt-1">
              {action.description}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
} 