'use client';

import { AgentConfiguration } from '../app/marketplace/create-agent/types';
import {
  CpuChipIcon,
  ServerIcon,
  KeyIcon,
  BellIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

interface PreviewCardProps {
  config: AgentConfiguration;
}

export default function PreviewCard({ config }: PreviewCardProps) {
  const getCompletionPercentage = () => {
    let completed = 0;
    let total = 0;

    // Basic Info
    total += 5; // name, description, type, version, repository
    if (config.basicInfo.name) completed++;
    if (config.basicInfo.description) completed++;
    if (config.basicInfo.type) completed++;
    if (config.basicInfo.version) completed++;
    if (config.basicInfo.repository) completed++;

    // Model Settings
    total += 4; // model, temperature, maxTokens, systemPrompt
    if (config.modelSettings.model) completed++;
    if (config.modelSettings.temperature !== undefined) completed++;
    if (config.modelSettings.maxTokens) completed++;
    if (config.modelSettings.systemPrompt) completed++;

    // Deployment Settings
    total += 4; // type, runtime, memory, scaling
    if (config.deploymentSettings.type) completed++;
    if (config.deploymentSettings.runtime) completed++;
    if (config.deploymentSettings.memory) completed++;
    if (config.deploymentSettings.scaling.minInstances) completed++;

    // Security Settings
    total += 3; // authMethod, rateLimit, ipWhitelist
    if (config.securitySettings.authMethod) completed++;
    if (config.securitySettings.rateLimit.enabled !== undefined) completed++;
    if (config.securitySettings.ipWhitelistEnabled !== undefined) completed++;

    // Monitoring Settings
    total += 3; // logLevel, metrics, alerts
    if (config.monitoringSettings.logLevel) completed++;
    if (config.monitoringSettings.enablePerformanceMetrics !== undefined) completed++;
    if (config.monitoringSettings.alerts.length > 0) completed++;

    // Pricing Settings
    total += 2; // billingType, tiers
    if (config.pricingSettings.billingType) completed++;
    if (config.pricingSettings.tiers.length > 0) completed++;

    return Math.round((completed / total) * 100);
  };

  const completionPercentage = getCompletionPercentage();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Agent Preview</h2>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Completion</span>
            <span className="text-sm font-medium">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Basic Info */}
        <div className="border-t dark:border-gray-700 pt-4">
          <h3 className="font-medium mb-2">Basic Info</h3>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="text-gray-500">Name:</span>{' '}
              {config.basicInfo.name || 'Not set'}
            </p>
            <p className="text-sm">
              <span className="text-gray-500">Type:</span>{' '}
              {config.basicInfo.type || 'Not set'}
            </p>
            <p className="text-sm">
              <span className="text-gray-500">Version:</span>{' '}
              {config.basicInfo.version || 'Not set'}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex items-center space-x-2">
            <CpuChipIcon className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500">Model</p>
              <p className="text-sm font-medium">{config.modelSettings.model}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ServerIcon className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-xs text-gray-500">Deployment</p>
              <p className="text-sm font-medium">
                {config.deploymentSettings.type}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <KeyIcon className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="text-xs text-gray-500">Auth</p>
              <p className="text-sm font-medium">
                {config.securitySettings.authMethod}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <BellIcon className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-xs text-gray-500">Alerts</p>
              <p className="text-sm font-medium">
                {config.monitoringSettings.alerts.length} set
              </p>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="border-t dark:border-gray-700 pt-4 mt-4">
          <div className="flex items-center space-x-2 mb-2">
            <CurrencyDollarIcon className="h-5 w-5 text-blue-500" />
            <h3 className="font-medium">Pricing</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="text-gray-500">Type:</span>{' '}
              {config.pricingSettings.billingType}
            </p>
            <p className="text-sm">
              <span className="text-gray-500">Tiers:</span>{' '}
              {config.pricingSettings.tiers.length}
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="border-t dark:border-gray-700 pt-4 mt-4">
          <h3 className="font-medium mb-2">Features</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              {config.securitySettings.rateLimit.enabled ? (
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
              ) : (
                <XCircleIcon className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm">Rate Limiting</span>
            </div>
            <div className="flex items-center space-x-2">
              {config.monitoringSettings.enablePerformanceMetrics ? (
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
              ) : (
                <XCircleIcon className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm">Performance Metrics</span>
            </div>
            <div className="flex items-center space-x-2">
              {config.modelSettings.enableFineTuning ? (
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
              ) : (
                <XCircleIcon className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm">Model Fine-tuning</span>
            </div>
            <div className="flex items-center space-x-2">
              {config.pricingSettings.offerTrial ? (
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
              ) : (
                <XCircleIcon className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm">Free Trial</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 