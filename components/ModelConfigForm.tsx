'use client';

import { useState } from 'react';
import { ModelSettings } from '../app/marketplace/create-agent/types';
import {
  CpuChipIcon,
  AdjustmentsHorizontalIcon,
  DocumentTextIcon,
  BeakerIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

interface ModelConfigFormProps {
  data: ModelSettings;
  onUpdate: (data: ModelSettings) => void;
}

const modelsByProvider = {
  openai: ['gpt-4', 'gpt-3.5-turbo', 'gpt-3.5-turbo-16k', 'davinci-003'],
  anthropic: ['claude-2', 'claude-instant'],
  cohere: ['command', 'command-light', 'command-nightly'],
  custom: ['custom-model'],
};

export default function ModelConfigForm({ data, onUpdate }: ModelConfigFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleUpdateField = <K extends keyof ModelSettings>(
    field: K,
    value: ModelSettings[K]
  ) => {
    onUpdate({
      ...data,
      [field]: value,
    });
  };

  const handleUpdateFineTuning = <K extends keyof NonNullable<ModelSettings['fineTuningConfig']>>(
    field: K,
    value: number | string
  ) => {
    handleUpdateField('fineTuningConfig', {
      ...data.fineTuningConfig,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Model Configuration</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Configure the AI model settings and parameters for your agent.
        </p>
      </div>

      {/* Basic Model Settings */}
      <div className="border dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <CpuChipIcon className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-medium">Model Selection</h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Provider</label>
              <select
                value={data.provider}
                onChange={(e) => {
                  const provider = e.target.value as ModelSettings['provider'];
                  handleUpdateField('provider', provider);
                  handleUpdateField('model', modelsByProvider[provider][0]);
                }}
                className="input-field"
              >
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
                <option value="cohere">Cohere</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Model</label>
              <select
                value={data.model}
                onChange={(e) => handleUpdateField('model', e.target.value)}
                className="input-field"
              >
                {modelsByProvider[data.provider].map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Temperature (0-2)
              </label>
              <input
                type="number"
                min="0"
                max="2"
                step="0.1"
                value={data.temperature}
                onChange={(e) =>
                  handleUpdateField('temperature', parseFloat(e.target.value))
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Max Tokens
              </label>
              <input
                type="number"
                min="1"
                value={data.maxTokens}
                onChange={(e) =>
                  handleUpdateField('maxTokens', parseInt(e.target.value))
                }
                className="input-field"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="border dark:border-gray-700 rounded-lg p-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 w-full"
        >
          <AdjustmentsHorizontalIcon className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-medium">Advanced Settings</h3>
          <span className="text-sm text-gray-500 ml-2">
            {showAdvanced ? '(Hide)' : '(Show)'}
          </span>
        </button>

        {showAdvanced && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Top P</label>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={data.topP}
                  onChange={(e) =>
                    handleUpdateField('topP', parseFloat(e.target.value))
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Frequency Penalty
                </label>
                <input
                  type="number"
                  min="-2"
                  max="2"
                  step="0.1"
                  value={data.frequencyPenalty}
                  onChange={(e) =>
                    handleUpdateField('frequencyPenalty', parseFloat(e.target.value))
                  }
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Presence Penalty
              </label>
              <input
                type="number"
                min="-2"
                max="2"
                step="0.1"
                value={data.presencePenalty}
                onChange={(e) =>
                  handleUpdateField('presencePenalty', parseFloat(e.target.value))
                }
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Stop Sequences
              </label>
              <input
                type="text"
                value={data.stopSequences.join(',')}
                onChange={(e) =>
                  handleUpdateField(
                    'stopSequences',
                    e.target.value.split(',').map((s) => s.trim())
                  )
                }
                placeholder="Comma-separated sequences"
                className="input-field"
              />
            </div>
          </div>
        )}
      </div>

      {/* System Prompt */}
      <div className="border dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <DocumentTextIcon className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-medium">System Prompt</h3>
        </div>

        <div>
          <textarea
            value={data.systemPrompt}
            onChange={(e) => handleUpdateField('systemPrompt', e.target.value)}
            rows={4}
            className="input-field w-full"
            placeholder="Enter the system prompt that defines your agent's behavior..."
          />
        </div>
      </div>

      {/* Fine-tuning Configuration */}
      <div className="border dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <BeakerIcon className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-medium">Fine-tuning</h3>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="enableFineTuning"
              checked={data.enableFineTuning}
              onChange={(e) =>
                handleUpdateField('enableFineTuning', e.target.checked)
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="enableFineTuning" className="text-sm">
              Enable fine-tuning
            </label>
          </div>
        </div>

        {data.enableFineTuning && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Dataset Path
              </label>
              <input
                type="text"
                value={data.fineTuningConfig?.datasetPath || ''}
                onChange={(e) => handleUpdateFineTuning('datasetPath', e.target.value)}
                placeholder="/path/to/dataset.jsonl"
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Epochs</label>
                <input
                  type="number"
                  min="1"
                  value={data.fineTuningConfig?.epochs || 1}
                  onChange={(e) =>
                    handleUpdateFineTuning('epochs', parseInt(e.target.value))
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Batch Size
                </label>
                <input
                  type="number"
                  min="1"
                  value={data.fineTuningConfig?.batchSize || 1}
                  onChange={(e) =>
                    handleUpdateFineTuning('batchSize', parseInt(e.target.value))
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Learning Rate
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.0001"
                  value={data.fineTuningConfig?.learningRate || 0.0001}
                  onChange={(e) =>
                    handleUpdateFineTuning('learningRate', parseFloat(e.target.value))
                  }
                  className="input-field"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Model Configuration Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start">
          <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5" />
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Configuration Tips
            </h4>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
              Higher temperature values (0.8-1.0) make the output more creative but
              less predictable. Lower values (0.2-0.5) make it more focused and
              deterministic. For most applications, a temperature between 0.5 and
              0.8 provides a good balance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 