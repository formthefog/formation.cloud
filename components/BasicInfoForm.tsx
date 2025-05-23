'use client';

import { useState } from 'react';
import { AgentMetadata, AgentType } from '../app/marketplace/create-agent/types';
import { 
  DocumentTextIcon,
  TagIcon,
  LinkIcon,
  EnvelopeIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';

interface BasicInfoFormProps {
  data: AgentMetadata;
  onUpdate: (data: Partial<AgentMetadata>) => void;
}

export default function BasicInfoForm({ data, onUpdate }: BasicInfoFormProps) {
  const [isConnectingRepo, setIsConnectingRepo] = useState(false);

  const agentTypes: AgentType[] = [
    'development',
    'analysis',
    'assistant',
    'research',
    'automation'
  ];

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();
      if (!data.tags.includes(newTag)) {
        onUpdate({ tags: [...data.tags, newTag] });
      }
      e.currentTarget.value = '';
    }
  };

  const removeTag = (tagToRemove: string) => {
    onUpdate({ tags: data.tags.filter(tag => tag !== tagToRemove) });
  };

  const handleRepoConnect = () => {
    setIsConnectingRepo(true);
    // TODO: Implement GitHub OAuth flow
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Provide essential details about your agent to help users understand its purpose and capabilities.
        </p>
      </div>

      {/* Name and Description */}
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Agent Name
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="input-field"
            placeholder="e.g., Code Review Pro"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Description
          </label>
          <textarea
            value={data.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            className="input-field min-h-[100px]"
            placeholder="Describe what your agent does and its key features..."
          />
        </div>
      </div>

      {/* Type and Version */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Agent Type
          </label>
          <select
            value={data.type}
            onChange={(e) => onUpdate({ type: e.target.value as AgentType })}
            className="input-field"
          >
            {agentTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Version
          </label>
          <input
            type="text"
            value={data.version}
            onChange={(e) => onUpdate({ version: e.target.value })}
            className="input-field"
            placeholder="e.g., 1.0.0"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {data.tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          onKeyDown={handleTagInput}
          className="input-field"
          placeholder="Type a tag and press Enter"
        />
      </div>

      {/* Documentation */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Documentation URL
        </label>
        <div className="flex items-center space-x-2">
          <DocumentTextIcon className="h-5 w-5 text-gray-400" />
          <input
            type="url"
            value={data.documentation}
            onChange={(e) => onUpdate({ documentation: e.target.value })}
            className="input-field flex-1"
            placeholder="https://docs.example.com/agent"
          />
        </div>
      </div>

      {/* Support Email */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Support Email
        </label>
        <div className="flex items-center space-x-2">
          <EnvelopeIcon className="h-5 w-5 text-gray-400" />
          <input
            type="email"
            value={data.supportEmail}
            onChange={(e) => onUpdate({ supportEmail: e.target.value })}
            className="input-field flex-1"
            placeholder="support@example.com"
          />
        </div>
      </div>

      {/* Repository Connection */}
      <div className="border dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <CodeBracketIcon className="h-6 w-6 text-gray-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium">Connect Repository</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Link your GitHub repository to enable automatic deployments and version control.
            </p>
            <button
              onClick={handleRepoConnect}
              disabled={isConnectingRepo}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-github hover:bg-github-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-github"
            >
              {isConnectingRepo ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connecting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  Connect GitHub Repository
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 