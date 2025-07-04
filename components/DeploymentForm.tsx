'use client';

import { DeploymentConfig, DeploymentType, RuntimeEnvironment } from '../app/marketplace/create-agent/types';
import {
  ServerStackIcon,
  CpuChipIcon,
  ClockIcon,
  ScaleIcon,
} from '@heroicons/react/24/outline';

interface DeploymentFormProps {
  data: DeploymentConfig;
  onUpdate: (data: Partial<DeploymentConfig>) => void;
}

const deploymentTypes: Record<DeploymentType, { name: string; description: string }> = {
  serverless: {
    name: 'Serverless',
    description: 'Auto-scaling with zero management',
  },
  dedicated: {
    name: 'Dedicated',
    description: 'Reserved resources for consistent performance',
  },
  enterprise: {
    name: 'Enterprise',
    description: 'Custom deployment with advanced features',
  },
};

const runtimes: Record<RuntimeEnvironment, string> = {
  node18: 'Node.js 18',
  python39: 'Python 3.9',
  python310: 'Python 3.10',
  custom: 'Custom Runtime',
};

export default function DeploymentForm({ data, onUpdate }: DeploymentFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Deployment Configuration</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Configure how your agent will be deployed and scaled.
        </p>
      </div>

      {/* Deployment Type */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(deploymentTypes).map(([type, info]) => (
          <button
            key={type}
            onClick={() => onUpdate({ type: type as DeploymentType })}
            className={`p-4 rounded-lg border-2 text-left transition-all
              ${data.type === type
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800'
              }`}
          >
            <ServerStackIcon className="h-6 w-6 text-blue-500 mb-2" />
            <h3 className="font-medium">{info.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {info.description}
            </p>
          </button>
        ))}
      </div>

      {/* Runtime Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Runtime Environment
        </label>
        <select
          value={data.runtime}
          onChange={(e) => onUpdate({ runtime: e.target.value as RuntimeEnvironment })}
          className="input-field"
        >
          {Object.entries(runtimes).map(([runtime, name]) => (
            <option key={runtime} value={runtime}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Resource Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Memory (MB)
          </label>
          <input
            type="number"
            value={data.memory}
            onChange={(e) => onUpdate({ memory: parseInt(e.target.value) })}
            className="input-field"
            min="128"
            max="4096"
            step="128"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Timeout (seconds)
          </label>
          <input
            type="number"
            value={data.timeout}
            onChange={(e) => onUpdate({ timeout: parseInt(e.target.value) })}
            className="input-field"
            min="1"
            max="900"
          />
        </div>
      </div>

      {/* Scaling Configuration */}
      <div className="border dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <ScaleIcon className="h-5 w-5 text-blue-500" />
          <h3 className="font-medium">Auto-scaling Configuration</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Min Instances
            </label>
            <input
              type="number"
              value={data.scaling?.minInstances}
              onChange={(e) => onUpdate({
                scaling: {
                  ...data.scaling,
                  minInstances: parseInt(e.target.value)
                }
              })}
              className="input-field"
              min="0"
              max="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Max Instances
            </label>
            <input
              type="number"
              value={data.scaling?.maxInstances}
              onChange={(e) => onUpdate({
                scaling: {
                  ...data.scaling,
                  maxInstances: parseInt(e.target.value)
                }
              })}
              className="input-field"
              min="1"
              max="1000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Target Concurrency
            </label>
            <input
              type="number"
              value={data.scaling?.targetConcurrency}
              onChange={(e) => onUpdate({
                scaling: {
                  ...data.scaling,
                  targetConcurrency: parseInt(e.target.value)
                }
              })}
              className="input-field"
              min="1"
              max="1000"
            />
          </div>
        </div>
      </div>

      {/* Performance Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <CpuChipIcon className="h-5 w-5 text-blue-500" />
            <h4 className="font-medium">Resource Optimization</h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Adjust memory and timeout based on your agent's workload
          </p>
        </div>

        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <ClockIcon className="h-5 w-5 text-green-500" />
            <h4 className="font-medium">Response Time</h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Higher concurrency may impact response times
          </p>
        </div>
      </div>
    </div>
  );
} 