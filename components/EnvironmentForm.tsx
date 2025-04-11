'use client';

import { useState } from 'react';
import { EnvironmentVariable } from '../app/marketplace/create-agent/types';
import {
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
  PlusIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

interface EnvironmentFormProps {
  data: EnvironmentVariable[];
  onUpdate: (data: EnvironmentVariable[]) => void;
}

export default function EnvironmentForm({ data, onUpdate }: EnvironmentFormProps) {
  const [newVar, setNewVar] = useState<EnvironmentVariable>({
    key: '',
    value: '',
    isSecret: false,
    description: '',
  });
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  const handleAddVariable = () => {
    if (!newVar.key || !newVar.value) return;
    onUpdate([...data, newVar]);
    setNewVar({
      key: '',
      value: '',
      isSecret: false,
      description: '',
    });
  };

  const handleRemoveVariable = (index: number) => {
    onUpdate(data.filter((_, i) => i !== index));
  };

  const handleUpdateVariable = (index: number, updates: Partial<EnvironmentVariable>) => {
    const updatedData = [...data];
    updatedData[index] = { ...updatedData[index], ...updates };
    onUpdate(updatedData);
  };

  const toggleSecretVisibility = (key: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Configure environment variables and secrets for your agent.
        </p>
      </div>

      {/* Add New Variable Form */}
      <div className="border dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-medium mb-4">Add New Variable</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Key</label>
              <input
                type="text"
                value={newVar.key}
                onChange={(e) => setNewVar(prev => ({ ...prev, key: e.target.value }))}
                className="input-field"
                placeholder="VARIABLE_NAME"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Value</label>
              <input
                type={newVar.isSecret ? 'password' : 'text'}
                value={newVar.value}
                onChange={(e) => setNewVar(prev => ({ ...prev, value: e.target.value }))}
                className="input-field"
                placeholder="Variable value"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <input
              type="text"
              value={newVar.description}
              onChange={(e) => setNewVar(prev => ({ ...prev, description: e.target.value }))}
              className="input-field"
              placeholder="Brief description of this variable"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isSecret"
              checked={newVar.isSecret}
              onChange={(e) => setNewVar(prev => ({ ...prev, isSecret: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isSecret" className="text-sm">
              Treat as secret (encrypted storage)
            </label>
          </div>

          <button
            onClick={handleAddVariable}
            disabled={!newVar.key || !newVar.value}
            className="w-full btn-primary flex items-center justify-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Variable</span>
          </button>
        </div>
      </div>

      {/* Variables List */}
      {data.length > 0 && (
        <div className="border dark:border-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Configured Variables</h3>
          <div className="space-y-4">
            {data.map((variable, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="space-y-1 flex-grow mr-4">
                  <div className="flex items-center space-x-2">
                    {variable.isSecret && (
                      <ShieldCheckIcon className="h-5 w-5 text-green-500" />
                    )}
                    <h4 className="font-medium">{variable.key}</h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type={showSecrets[variable.key] ? 'text' : 'password'}
                      value={variable.value}
                      readOnly
                      className="bg-transparent border-none p-0 text-sm text-gray-500"
                    />
                    <button
                      onClick={() => toggleSecretVisibility(variable.key)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      {showSecrets[variable.key] ? (
                        <EyeSlashIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {variable.description && (
                    <p className="text-sm text-gray-500">{variable.description}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleRemoveVariable(index)}
                    className="p-2 text-red-400 hover:text-red-500"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start">
          <KeyIcon className="h-5 w-5 text-blue-500 mt-0.5" />
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Security Information
            </h4>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
              Secret variables are encrypted at rest and only decrypted during agent runtime.
              They are never exposed in logs or error messages.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 