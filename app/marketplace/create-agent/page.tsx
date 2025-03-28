'use client';

import { useState } from 'react';
import { AgentConfiguration } from './types';
import BasicInfoForm from '../../../components/BasicInfoForm';
import ModelConfigForm from '../../../components/ModelConfigForm';
import DeploymentForm from '../../../components/DeploymentForm';
import IntegrationsForm from '../../../components/IntegrationsForm';
import EnvironmentForm from '../../../components/EnvironmentForm';
import SecurityForm from '../../../components/SecurityForm';
import MonitoringForm from '../../../components/MonitoringForm';
import PricingForm from '../../../components/PricingForm';
import PreviewCard from '../../../components/PreviewCard';

const defaultConfig: AgentConfiguration = {
  basicInfo: {
    name: '',
    description: '',
    type: 'development',
    version: '1.0.0',
    repository: {
      url: '',
      branch: 'main',
      webhookEnabled: false,
    },
    documentation: '',
    tags: [],
    category: [],
    supportEmail: '',
  },
  modelSettings: {
    provider: 'openai',
    model: '',
    temperature: 0.7,
    maxTokens: 2048,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    systemPrompt: '',
    stopSequences: [],
    enableFineTuning: false,
    fineTuningConfig: {
      datasetPath: '',
      epochs: 3,
      batchSize: 4,
      learningRate: 0.0001,
    },
  },
  deploymentSettings: {
    type: 'serverless',
    runtime: 'node18',
    memory: 512,
    timeout: 30,
    environment: 'development',
    scaling: {
      minInstances: 1,
      maxInstances: 10,
      targetConcurrency: 100,
    },
  },
  integrations: [],
  environmentVariables: [],
  securitySettings: {
    authMethod: 'apiKey',
    requireAuthentication: true,
    rateLimit: {
      enabled: false,
      requestsPerMinute: 60,
      burstLimit: 100,
    },
    ipWhitelistEnabled: false,
    ipWhitelist: [],
  },
  monitoringSettings: {
    logLevel: 'info',
    enableDetailedLogs: true,
    enablePerformanceMetrics: true,
    metricsInterval: 60,
    retentionPeriod: 30,
    enableCustomMetrics: false,
    alerts: [],
  },
  pricingSettings: {
    billingType: 'per_request',
    billingCycle: 'monthly',
    offerTrial: false,
    trialPeriod: 14,
    tiers: [],
  },
};

const steps = [
  {
    title: 'Basic Info',
    component: BasicInfoForm,
    key: 'basicInfo' as const,
  },
  {
    title: 'Model',
    component: ModelConfigForm,
    key: 'modelSettings' as const,
  },
  {
    title: 'Deployment',
    component: DeploymentForm,
    key: 'deploymentSettings' as const,
  },
  {
    title: 'Integrations',
    component: IntegrationsForm,
    key: 'integrations' as const,
  },
  {
    title: 'Environment',
    component: EnvironmentForm,
    key: 'environmentVariables' as const,
  },
  {
    title: 'Security',
    component: SecurityForm,
    key: 'securitySettings' as const,
  },
  {
    title: 'Monitoring',
    component: MonitoringForm,
    key: 'monitoringSettings' as const,
  },
  {
    title: 'Pricing',
    component: PricingForm,
    key: 'pricingSettings' as const,
  },
] as const;

type StepKey = typeof steps[number]['key'];
type StepData<K extends StepKey> = AgentConfiguration[K];

interface FormProps<K extends StepKey> {
  data: StepData<K>;
  onUpdate: (data: Partial<StepData<K>>) => void;
}

export default function CreateAgentPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [config, setConfig] = useState<AgentConfiguration>(defaultConfig);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleUpdate = (sectionData: Partial<AgentConfiguration[typeof steps[number]['key']]>) => {
    const currentKey = steps[currentStep].key;
    setConfig((prev) => ({
      ...prev,
      [currentKey]: {
        ...prev[currentKey],
        ...sectionData,
      },
    }));
  };

  const CurrentFormComponent = steps[currentStep].component as React.ComponentType<FormProps<typeof steps[number]['key']>>;
  const currentKey = steps[currentStep].key;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create Agent</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Configure your AI agent settings and deployment options
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <nav className="flex justify-center">
            <ol className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <li key={step.title} className="flex items-center">
                  <button
                    onClick={() => setCurrentStep(index)}
                    className={`flex items-center ${
                      index <= currentStep
                        ? 'text-blue-600'
                        : 'text-gray-400'
                    }`}
                  >
                    <span
                      className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                        index === currentStep
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : index < currentStep
                          ? 'border-blue-600 text-blue-600'
                          : 'border-gray-300 text-gray-400'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="ml-2 text-sm font-medium">
                      {step.title}
                    </span>
                  </button>
                  {index < steps.length - 1 && (
                    <div className="ml-4 w-8 h-px bg-gray-300" />
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6">
                <CurrentFormComponent
                  data={config[currentKey]}
                  onUpdate={handleUpdate}
                />
              </div>
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t dark:border-gray-600 flex justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentStep === steps.length - 1}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <PreviewCard config={config} />
          </div>
        </div>
      </div>
    </div>
  );
} 