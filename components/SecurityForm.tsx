'use client';

import { useState } from 'react';
import { SecuritySettings } from '../app/marketplace/create-agent/types';
import {
  ShieldCheckIcon,
  KeyIcon,
  ClockIcon,
  GlobeAltIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

interface SecurityFormProps {
  data: SecuritySettings;
  onUpdate: (data: SecuritySettings) => void;
}

export default function SecurityForm({ data, onUpdate }: SecurityFormProps) {
  const [newIP, setNewIP] = useState('');

  const handleUpdateField = <K extends keyof SecuritySettings>(
    field: K,
    value: SecuritySettings[K]
  ) => {
    onUpdate({
      ...data,
      [field]: value,
    });
  };

  const handleAddIP = () => {
    if (!newIP || data.ipWhitelist.includes(newIP)) return;
    handleUpdateField('ipWhitelist', [...data.ipWhitelist, newIP]);
    setNewIP('');
  };

  const handleRemoveIP = (ip: string) => {
    handleUpdateField(
      'ipWhitelist',
      data.ipWhitelist.filter((item) => item !== ip)
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Configure security measures and access controls for your agent.
        </p>
      </div>

      {/* API Authentication */}
      <div className="border dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <KeyIcon className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-medium">API Authentication</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Authentication Method
            </label>
            <select
              value={data.authMethod}
              onChange={(e) => handleUpdateField('authMethod', e.target.value)}
              className="input-field"
            >
              <option value="apiKey">API Key</option>
              <option value="oauth2">OAuth 2.0</option>
              <option value="jwt">JWT</option>
              <option value="basic">Basic Auth</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="requireAuth"
              checked={data.requireAuthentication}
              onChange={(e) =>
                handleUpdateField('requireAuthentication', e.target.checked)
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="requireAuth" className="text-sm">
              Require authentication for all endpoints
            </label>
          </div>
        </div>
      </div>

      {/* Rate Limiting */}
      <div className="border dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <ClockIcon className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-medium">Rate Limiting</h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Requests per Minute
              </label>
              <input
                type="number"
                min="1"
                value={data.rateLimit.requestsPerMinute}
                onChange={(e) =>
                  handleUpdateField('rateLimit', {
                    ...data.rateLimit,
                    requestsPerMinute: parseInt(e.target.value),
                  })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Burst Limit
              </label>
              <input
                type="number"
                min="1"
                value={data.rateLimit.burstLimit}
                onChange={(e) =>
                  handleUpdateField('rateLimit', {
                    ...data.rateLimit,
                    burstLimit: parseInt(e.target.value),
                  })
                }
                className="input-field"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="enableRateLimit"
              checked={data.rateLimit.enabled}
              onChange={(e) =>
                handleUpdateField('rateLimit', {
                  ...data.rateLimit,
                  enabled: e.target.checked,
                })
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="enableRateLimit" className="text-sm">
              Enable rate limiting
            </label>
          </div>
        </div>
      </div>

      {/* IP Whitelist */}
      <div className="border dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <GlobeAltIcon className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-medium">IP Whitelist</h3>
        </div>

        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newIP}
              onChange={(e) => setNewIP(e.target.value)}
              placeholder="Enter IP address"
              className="input-field flex-grow"
            />
            <button
              onClick={handleAddIP}
              disabled={!newIP}
              className="btn-primary px-4 py-2 flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add</span>
            </button>
          </div>

          {data.ipWhitelist.length > 0 && (
            <div className="space-y-2">
              {data.ipWhitelist.map((ip) => (
                <div
                  key={ip}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                >
                  <span className="text-sm">{ip}</span>
                  <button
                    onClick={() => handleRemoveIP(ip)}
                    className="text-red-400 hover:text-red-500"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="enableWhitelist"
              checked={data.ipWhitelistEnabled}
              onChange={(e) =>
                handleUpdateField('ipWhitelistEnabled', e.target.checked)
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="enableWhitelist" className="text-sm">
              Enable IP whitelist
            </label>
          </div>
        </div>
      </div>

      {/* Security Warning */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-start">
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mt-0.5" />
          <div className="ml-3">
            <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Security Best Practices
            </h4>
            <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
              We recommend enabling authentication and rate limiting for production
              deployments. IP whitelisting provides an additional layer of security
              for sensitive operations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 