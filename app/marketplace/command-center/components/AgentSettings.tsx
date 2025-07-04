import { useState } from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface AgentSettingsProps {
  agent: {
    id: number;
    name: string;
  };
  onClose: () => void;
}

export function AgentSettings({ agent, onClose }: AgentSettingsProps) {
  const [settings, setSettings] = useState({
    name: agent.name,
    memory: '512',
    timeout: '30',
    maxRetries: '3',
    logLevel: 'info',
    autoRestart: true,
    notifications: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle settings update
    console.log('Updated settings:', settings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Agent Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Agent Name
              </label>
              <input
                type="text"
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Memory Allocation (MB)
              </label>
              <input
                type="number"
                value={settings.memory}
                onChange={(e) => setSettings({ ...settings, memory: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Timeout (seconds)
              </label>
              <input
                type="number"
                value={settings.timeout}
                onChange={(e) => setSettings({ ...settings, timeout: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Max Retries
              </label>
              <input
                type="number"
                value={settings.maxRetries}
                onChange={(e) => setSettings({ ...settings, maxRetries: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Log Level
              </label>
              <select
                value={settings.logLevel}
                onChange={(e) => setSettings({ ...settings, logLevel: e.target.value })}
                className="input-field"
              >
                <option value="debug">Debug</option>
                <option value="info">Info</option>
                <option value="warn">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoRestart"
                  checked={settings.autoRestart}
                  onChange={(e) => setSettings({ ...settings, autoRestart: e.target.checked })}
                  className="h-4 w-4 text-blue-500 rounded border-gray-300"
                />
                <label htmlFor="autoRestart" className="ml-2 text-sm">
                  Auto-restart on failure
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notifications"
                  checked={settings.notifications}
                  onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                  className="h-4 w-4 text-blue-500 rounded border-gray-300"
                />
                <label htmlFor="notifications" className="ml-2 text-sm">
                  Enable notifications
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
} 