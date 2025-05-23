'use client';

import { useState } from 'react';
import { MonitoringSettings, Alert } from '../app/marketplace/create-agent/types';
import {
  ChartBarIcon,
  BellIcon,
  DocumentTextIcon,
  PlusIcon,
  TrashIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface MonitoringFormProps {
  data: MonitoringSettings;
  onUpdate: (data: MonitoringSettings) => void;
}

export default function MonitoringForm({ data, onUpdate }: MonitoringFormProps) {
  const [newAlert, setNewAlert] = useState<Omit<Alert, 'threshold'> & { threshold: string }>({
    metric: '',
    threshold: '',
    duration: 5,
    condition: 'above'
  });

  const handleUpdateField = <K extends keyof MonitoringSettings>(
    field: K,
    value: MonitoringSettings[K]
  ) => {
    onUpdate({
      ...data,
      [field]: value,
    });
  };

  const handleAddAlert = () => {
    if (!newAlert.metric || !newAlert.threshold) return;
    const alert: Alert = {
      metric: newAlert.metric,
      threshold: parseFloat(newAlert.threshold),
      duration: newAlert.duration,
      condition: newAlert.condition
    };
    handleUpdateField('alerts', [...data.alerts, alert]);
    setNewAlert({
      metric: '',
      threshold: '',
      duration: 5,
      condition: 'above'
    });
  };

  const handleRemoveAlert = (index: number) => {
    handleUpdateField(
      'alerts',
      data.alerts.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Monitoring & Logging</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Configure monitoring, logging, and alert settings for your agent.
        </p>
      </div>

      {/* Logging Configuration */}
      <div className="border dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <DocumentTextIcon className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-medium">Logging Configuration</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Log Level</label>
            <select
              value={data.logLevel}
              onChange={(e) => handleUpdateField('logLevel', e.target.value as 'error' | 'warn' | 'info' | 'debug' | 'trace')}
              className="input-field"
            >
              <option value="error">Error</option>
              <option value="warn">Warning</option>
              <option value="info">Info</option>
              <option value="debug">Debug</option>
              <option value="trace">Trace</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="enableDetailedLogs"
              checked={data.enableDetailedLogs}
              onChange={(e) =>
                handleUpdateField('enableDetailedLogs', e.target.checked)
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="enableDetailedLogs" className="text-sm">
              Enable detailed logging (includes request/response bodies)
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="enablePerformanceMetrics"
              checked={data.enablePerformanceMetrics}
              onChange={(e) =>
                handleUpdateField('enablePerformanceMetrics', e.target.checked)
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="enablePerformanceMetrics" className="text-sm">
              Collect performance metrics
            </label>
          </div>
        </div>
      </div>

      {/* Metrics Configuration */}
      <div className="border dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <ChartBarIcon className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-medium">Metrics Configuration</h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Metrics Interval (seconds)
              </label>
              <input
                type="number"
                min="1"
                value={data.metricsInterval}
                onChange={(e) =>
                  handleUpdateField('metricsInterval', parseInt(e.target.value))
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Retention Period (days)
              </label>
              <input
                type="number"
                min="1"
                value={data.retentionPeriod}
                onChange={(e) =>
                  handleUpdateField('retentionPeriod', parseInt(e.target.value))
                }
                className="input-field"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="enableCustomMetrics"
              checked={data.enableCustomMetrics}
              onChange={(e) =>
                handleUpdateField('enableCustomMetrics', e.target.checked)
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="enableCustomMetrics" className="text-sm">
              Enable custom metrics collection
            </label>
          </div>
        </div>
      </div>

      {/* Alerts Configuration */}
      <div className="border dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <BellIcon className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-medium">Alert Configuration</h3>
        </div>

        <div className="space-y-4">
          {/* Add New Alert */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Metric</label>
              <input
                type="text"
                value={newAlert.metric}
                onChange={(e) =>
                  setNewAlert((prev) => ({ ...prev, metric: e.target.value }))
                }
                placeholder="e.g., cpu_usage"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Condition</label>
              <select
                value={newAlert.condition}
                onChange={(e) =>
                  setNewAlert((prev) => ({
                    ...prev,
                    condition: e.target.value as 'above' | 'below' | 'equal',
                  }))
                }
                className="input-field"
              >
                <option value="above">Above</option>
                <option value="below">Below</option>
                <option value="equal">Equal to</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Threshold</label>
              <input
                type="text"
                value={newAlert.threshold}
                onChange={(e) =>
                  setNewAlert((prev) => ({ ...prev, threshold: e.target.value }))
                }
                placeholder="e.g., 90"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Duration (min)
              </label>
              <input
                type="number"
                min="1"
                value={newAlert.duration}
                onChange={(e) =>
                  setNewAlert((prev) => ({ ...prev, duration: parseInt(e.target.value) }))
                }
                className="input-field"
              />
            </div>
          </div>

          <button
            onClick={handleAddAlert}
            disabled={!newAlert.metric || !newAlert.threshold}
            className="w-full btn-primary flex items-center justify-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Alert</span>
          </button>

          {/* Active Alerts */}
          {data.alerts.length > 0 && (
            <div className="space-y-2">
              {data.alerts.map((alert, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                >
                  <div className="flex items-center space-x-4">
                    <BellIcon className="h-5 w-5 text-blue-500" />
                    <div>
                      <span className="font-medium">{alert.metric}</span>
                      <span className="text-gray-500 ml-2">
                        {alert.condition} {alert.threshold} for {alert.duration} min
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveAlert(index)}
                    className="text-red-400 hover:text-red-500"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Monitoring Notice */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start">
          <ExclamationTriangleIcon className="h-5 w-5 text-blue-500 mt-0.5" />
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Monitoring Best Practices
            </h4>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
              Regular monitoring and proper alert configuration help maintain
              optimal agent performance. Consider setting up alerts for critical
              metrics like error rates, response times, and resource usage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 