export type AgentType = 'development' | 'analysis' | 'assistant' | 'research' | 'automation';
export type AgentStatus = 'draft' | 'published' | 'featured' | 'trending' | 'new';
export type PricingModel = 'per-request' | 'subscription' | 'usage-based';
export type IntegrationType = 'github' | 'gitlab' | 'bitbucket' | 'zapier' | 'slack' | 'discord' | 'custom';
export type DeploymentType = 'serverless' | 'dedicated' | 'enterprise';
export type ModelProvider = 'openai' | 'anthropic' | 'google' | 'custom';
export type RuntimeEnvironment = 'node18' | 'python39' | 'python310' | 'custom';

export interface Integration {
  type: IntegrationType;
  config: Record<string, string>;
  isEnabled: boolean;
}

export interface EnvironmentVariable {
  key: string;
  value: string;
  isSecret: boolean;
  description: string;
}

export interface Pricing {
  model: PricingModel;
  basePrice: number;
  currency: string;
  customPricing?: Record<string, number>;
}

export interface Repository {
  url: string;
  branch: string;
  directory?: string;
  accessToken?: string;
  webhookEnabled: boolean;
}

export interface ModelConfig {
  provider: ModelProvider;
  model: string;
  temperature?: number;
  maxTokens?: number;
  customConfig?: Record<string, any>;
}

export interface DeploymentConfig {
  type: DeploymentType;
  runtime: RuntimeEnvironment;
  memory: number;
  timeout: number;
  scaling?: {
    minInstances: number;
    maxInstances: number;
    targetConcurrency: number;
  };
}

export interface AgentMetadata {
  name: string;
  description: string;
  type: AgentType;
  version: string;
  tags: string[];
  category: string[];
  documentation: string;
  supportEmail: string;
  website?: string;
  repository?: Repository;
}

export interface AgentFormData {
  metadata: AgentMetadata;
  pricing: Pricing;
  model: ModelConfig;
  deployment: DeploymentConfig;
  integrations: Integration[];
  environmentVariables: EnvironmentVariable[];
  security: {
    apiKeyRequired: boolean;
    rateLimit: number;
    ipWhitelist: string[];
    customHeaders?: Record<string, string>;
  };
  monitoring: {
    loggingEnabled: boolean;
    metricsEnabled: boolean;
    alertingEnabled: boolean;
    customMetrics?: string[];
  };
}

// Security Types
export interface RateLimit {
  enabled: boolean;
  requestsPerMinute: number;
  burstLimit: number;
}

export interface SecuritySettings {
  authMethod: 'apiKey' | 'oauth2' | 'jwt' | 'basic';
  requireAuthentication: boolean;
  rateLimit: RateLimit;
  ipWhitelist: string[];
  ipWhitelistEnabled: boolean;
}

// Monitoring Types
export interface Alert {
  metric: string;
  threshold: number;
  duration: number;
  condition: 'above' | 'below' | 'equal';
}

export interface MonitoringSettings {
  logLevel: 'error' | 'warn' | 'info' | 'debug' | 'trace';
  enableDetailedLogs: boolean;
  enablePerformanceMetrics: boolean;
  metricsInterval: number;
  retentionPeriod: number;
  enableCustomMetrics: boolean;
  alerts: Alert[];
}

// Pricing Types
export interface PricingTier {
  name: string;
  price: number; // Price in credits
  requestLimit: number;
  features: string[];
}

export interface PricingSettings {
  billingType: 'per_request' | 'subscription' | 'usage_based' | 'hybrid';
  billingCycle: 'monthly' | 'quarterly' | 'annual';
  offerTrial: boolean;
  trialPeriod: number;
  tiers: PricingTier[];
}

// Deployment Types
export interface DeploymentSettings {
  type: 'serverless' | 'container' | 'dedicated';
  runtime: 'node16' | 'node18' | 'python3.9' | 'python3.10' | 'custom';
  memory: number;
  timeout: number;
  scaling: {
    minInstances: number;
    maxInstances: number;
    targetConcurrency: number;
  };
  environment: 'development' | 'staging' | 'production';
}

// Model Configuration Types
export interface ModelSettings {
  provider: 'openai' | 'anthropic' | 'cohere' | 'custom';
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  systemPrompt: string;
  stopSequences: string[];
  enableFineTuning: boolean;
  fineTuningConfig?: {
    datasetPath: string;
    epochs: number;
    batchSize: number;
    learningRate: number;
  };
}

// Basic Info Types
export interface BasicInfo extends AgentMetadata {
  icon?: string;
}

// Complete Agent Configuration
export interface AgentConfiguration {
  basicInfo: BasicInfo;
  modelSettings: ModelSettings;
  deploymentSettings: DeploymentSettings;
  integrations: Integration[];
  environmentVariables: EnvironmentVariable[];
  securitySettings: SecuritySettings;
  monitoringSettings: MonitoringSettings;
  pricingSettings: PricingSettings;
}

export interface AgentSubmission {
  repositoryUrl: string;
  name: string;
  description: string;
} 