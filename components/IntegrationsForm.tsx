'use client';

import { useState } from 'react';
import { Integration, IntegrationType } from '../app/marketplace/create-agent/types';
import {
  PuzzlePieceIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

interface IntegrationsFormProps {
  data: Integration[];
  onUpdate: (data: Integration[]) => void;
}

const integrationTypes: Record<IntegrationType, { name: string; description: string; fields: string[] }> = {
  github: {
    name: 'GitHub',
    description: 'Connect to repositories and handle webhooks',
    fields: ['repository', 'branch', 'accessToken'],
  },
  gitlab: {
    name: 'GitLab',
    description: 'Integrate with GitLab projects and CI/CD',
    fields: ['projectUrl', 'accessToken'],
  },
  bitbucket: {
    name: 'Bitbucket',
    description: 'Link with Bitbucket repositories',
    fields: ['workspace', 'repository', 'accessToken'],
  },
  zapier: {
    name: 'Zapier',
    description: 'Automate workflows with Zapier',
    fields: ['apiKey', 'webhookUrl'],
  },
  slack: {
    name: 'Slack',
    description: 'Send notifications and interact via Slack',
    fields: ['workspace', 'channel', 'botToken'],
  },
  discord: {
    name: 'Discord',
    description: 'Bot integration and notifications',
    fields: ['serverId', 'channelId', 'botToken'],
  },
  custom: {
    name: 'Custom',
    description: 'Configure a custom integration',
    fields: ['endpoint', 'authType', 'credentials'],
  },
};

export default function IntegrationsForm({ data, onUpdate }: IntegrationsFormProps) {
  const [selectedType, setSelectedType] = useState<IntegrationType | null>(null);
  const [configValues, setConfigValues] = useState<Record<string, string>>({});

  const handleIntegrationToggle = (type: IntegrationType) => {
    const existingIndex = data.findIndex(i => i.type === type);
    if (existingIndex >= 0) {
      onUpdate(data.filter(i => i.type !== type));
    } else {
      setSelectedType(type);
      setConfigValues({});
    }
  };

  const handleConfigSave = () => {
    if (!selectedType) return;

    const newIntegration: Integration = {
      type: selectedType,
      config: configValues,
      isEnabled: true,
    };

    onUpdate([...data, newIntegration]);
    setSelectedType(null);
    setConfigValues({});
  };

  const isIntegrationEnabled = (type: IntegrationType) => {
    return data.some(i => i.type === type);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Integrations</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Connect your agent with external services and tools.
        </p>
      </div>

      {/* Integration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(integrationTypes).map(([type, info]) => (
          <div
            key={type}
            className={`p-4 rounded-lg border-2 transition-all
              ${isIntegrationEnabled(type as IntegrationType)
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800'
              }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <PuzzlePieceIcon className="h-5 w-5 text-blue-500" />
                  <h3 className="font-medium">{info.name}</h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {info.description}
                </p>
              </div>
              <button
                onClick={() => handleIntegrationToggle(type as IntegrationType)}
                className="flex-shrink-0"
              >
                {isIntegrationEnabled(type as IntegrationType) ? (
                  <CheckCircleIcon className="h-6 w-6 text-green-500" />
                ) : (
                  <PuzzlePieceIcon className="h-6 w-6 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Configuration Modal */}
      {selectedType && (
        <div className="mt-6 border dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">
              Configure {integrationTypes[selectedType].name}
            </h3>
            <button
              onClick={() => setSelectedType(null)}
              className="text-gray-400 hover:text-gray-500"
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4">
            {integrationTypes[selectedType].fields.map(field => (
              <div key={field}>
                <label className="block text-sm font-medium mb-2">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={field.toLowerCase().includes('token') ? 'password' : 'text'}
                  value={configValues[field] || ''}
                  onChange={(e) => setConfigValues(prev => ({
                    ...prev,
                    [field]: e.target.value
                  }))}
                  className="input-field"
                  placeholder={`Enter ${field}`}
                />
              </div>
            ))}

            <button
              onClick={handleConfigSave}
              className="w-full mt-4 btn-primary"
            >
              Save Configuration
            </button>
          </div>
        </div>
      )}

      {/* Active Integrations */}
      {data.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">Active Integrations</h3>
          <div className="space-y-4">
            {data.map((integration, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <PuzzlePieceIcon className="h-6 w-6 text-green-500" />
                  <div>
                    <h4 className="font-medium">
                      {integrationTypes[integration.type].name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {Object.keys(integration.config).length} fields configured
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedType(integration.type);
                      setConfigValues(integration.config);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-500"
                  >
                    <ArrowPathIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleIntegrationToggle(integration.type)}
                    className="p-2 text-red-400 hover:text-red-500"
                  >
                    <XCircleIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 