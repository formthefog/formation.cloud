"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Clock, Zap, Server, Shield, Send, Settings, Cpu, Database, Globe, Cloud, Wifi, FolderOpen, Bot, Code2, FileText, Rocket, Check, X, Loader2, DollarSign } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-markdown";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prismjs/plugins/line-numbers/prism-line-numbers";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Agent {
  id: string;
  agent_id?: string;
  agent_type?: string;
  name: string;
  description: string;
  capabilities: string[];
  documentation: string;
  examples: {
    input: string;
    output: string;
  }[];
  avg_response_time_ms: number;
  success_rate: number;
  uptime: number;
  avg_memory_mb: number;
  avg_cpu_usage: number;
  network_io_mbps: number;
  error_rate: number;
  total_requests: number;
  active_users: number;
  total_runtime_hours: number;
  cost_per_request: number;
  monthly_cost: number;
  active_deployments: number;
  tools?: any[];
  resource_requirements?: {
    min_vcpus: number;
    recommended_vcpus: number;
    min_memory_mb: number;
    recommended_memory_mb: number;
    min_disk_gb: number;
    recommended_disk_gb: number;
    requires_gpu: boolean;
  };
  has_memory?: boolean;
  has_external_api_access?: boolean;
  has_internet_access?: boolean;
  has_filesystem_access?: boolean;
  framework?: string;
  runtime?: string;
  version?: string;
  price_per_request?: string;
  average_rating?: number;
  usage_count?: number;
  deployment_count?: number;
  tags?: string[];
}

interface Tab {
  id: string;
  label: string;
  icon: any;
  highlight?: boolean;
}

const tabs: Tab[] = [
  { id: "overview", label: "Overview", icon: Bot },
  { id: "documentation", label: "Documentation", icon: FileText },
  { id: "capabilities", label: "Capabilities", icon: CheckCircle2 },
  { id: "integrations", label: "Integrations", icon: Server },
  { id: "technical", label: "Technical", icon: Cpu },
  { id: "pricing", label: "Pricing", icon: DollarSign },
  { id: "deploy", label: "Deploy", icon: Rocket, highlight: true },
];

// Add example prompts based on agent type
const getExamplePrompts = (agentType: string) => {
  const defaultPrompts = [
    "What can you help me with?",
    "Tell me about your capabilities",
    "How do you handle errors?",
    "Show me an example workflow"
  ];

  const promptsByType: Record<string, string[]> = {
    'code': [
      "Review this code for security issues",
      "Help me optimize this function",
      "Explain how this algorithm works",
      "Convert this to TypeScript"
    ],
    'research': [
      "Summarize this research paper",
      "Find relevant studies about...",
      "Compare these methodologies",
      "Analyze these findings"
    ],
    'assistant': [
      "Schedule a meeting for tomorrow",
      "Draft an email to the team",
      "Create a project timeline",
      "Summarize these notes"
    ],
    'data': [
      "Analyze this dataset",
      "Create a visualization",
      "Find patterns in this data",
      "Clean this data structure"
    ]
  };

  const type = agentType?.toLowerCase() || '';
  return promptsByType[type] || defaultPrompts;
};

export default function AgentDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const agentId = params.agentId as string;
  
  const [activeTab, setActiveTab] = useState(() => {
    const tab = searchParams.get('tab');
    if (tab === 'documentation' || tab === 'deploy') {
      return tab;
    }
    return "overview";
  });
  
  const [showDemo, setShowDemo] = useState(true);
  const [deploymentStep, setDeploymentStep] = useState(1);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [deploymentConfig, setDeploymentConfig] = useState({
    name: '',
    environment: 'production',
    framework: 'formation-agent',
    model: 'gpt-4-turbo',
    memory: false,
    streaming: true,
    maxTokens: 4096,
    instanceType: 'serverless',
    region: 'us-west-2',
    replicas: 1,
    apiKey: ''
  });

  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleDeploy = async () => {
    console.log('Starting deployment with config:', deploymentConfig);
    setIsDeploying(true);
    try {
      const response = await fetch(`/api/agents/${agentId}/deploy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: deploymentConfig.name || `${agent?.name?.toLowerCase()}-prod`,
          environment: deploymentConfig.environment,
          framework: deploymentConfig.framework,
          model: deploymentConfig.model,
          memory: deploymentConfig.memory,
          streaming: deploymentConfig.streaming,
          maxTokens: deploymentConfig.maxTokens,
          instanceType: deploymentConfig.instanceType,
          region: deploymentConfig.region,
          replicas: deploymentConfig.replicas
        }),
      });

      console.log('Deployment response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Deployment failed:', errorData);
        throw new Error(errorData.message || 'Failed to deploy agent');
      }

      const data = await response.json();
      console.log('Deployment response data:', data);
      
      setDeploymentConfig(prev => ({
        ...prev,
        apiKey: data.apiKey
      }));
      setDeploymentStatus('success');
      setDeploymentStep(3);
    } catch (err) {
      console.error('Deployment error:', err);
      setDeploymentStatus('error');
    } finally {
      setIsDeploying(false);
    }
  };

  const handleDeployClick = () => {
    console.log('Deploy button clicked. Current status:', deploymentStatus);
    if (deploymentStatus === 'success') {
      setActiveTab("deploy");
      setDeploymentStep(3);
    } else {
      setActiveTab("deploy");
      setDeploymentStep(1);
      setDeploymentStatus('idle');
      const defaultName = agent?.name ? `${agent.name.toLowerCase()}-prod` : '';
      setDeploymentConfig({
        name: defaultName,
        environment: 'production',
        framework: 'formation-agent',
        model: 'gpt-4-turbo',
        memory: false,
        streaming: true,
        maxTokens: 4096,
        instanceType: 'serverless',
        region: 'us-west-2',
        replicas: 1,
        apiKey: ''
      });
    }
    console.log('Updated deployment config:', deploymentConfig);
  };

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        setLoading(true);
        console.log('Fetching agent data for ID:', params.agentId);
        const response = await fetch(`/api/agents/${params.agentId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received agent data:', data);

        // Map the API response to our Agent interface
        const mappedAgent: Agent = {
          id: data.Success.agent_id,
          agent_id: data.Success.agent_id,
          agent_type: data.Success.agent_type,
          name: data.Success.name,
          description: data.Success.description,
          capabilities: data.Success.capabilities || [],
          documentation: data.Success.documentation || '',
          examples: [],  // Add example mapping if available
          avg_response_time_ms: 0,  // Initialize with defaults
          success_rate: 0,
          uptime: 0,
          avg_memory_mb: 0,
          avg_cpu_usage: 0,
          network_io_mbps: 0,
          error_rate: 0,
          total_requests: data.Success.usage_count || 0,
          active_users: 0,
          total_runtime_hours: 0,
          cost_per_request: data.Success.price_per_request || 0,
          monthly_cost: 0,
          active_deployments: data.Success.deployment_count || 0,
          tools: data.Success.tools || [],
          resource_requirements: {
            min_vcpus: 2,
            recommended_vcpus: 4,
            min_memory_mb: data.Success.resource_requirements?.min_memory_mb || 1024,
            recommended_memory_mb: data.Success.resource_requirements?.recommended_memory_mb || 2048,
            min_disk_gb: 10,
            recommended_disk_gb: 20,
            requires_gpu: false
          },
          has_memory: data.Success.has_memory || false,
          has_external_api_access: data.Success.has_external_api_access || false,
          has_internet_access: data.Success.has_internet_access || false,
          has_filesystem_access: data.Success.has_filesystem_access || false,
          framework: data.Success.framework || 'LangChain',
          runtime: data.Success.runtime || 'Python',
          version: data.Success.version || '1.2.0',
          price_per_request: data.Success.price_per_request?.toString() || '5',
          average_rating: data.Success.average_rating || 4,
          usage_count: data.Success.usage_count || 12000,
          deployment_count: data.Success.deployment_count || 800,
          tags: data.Success.tags || ['research', 'academic', 'literature']
        };

        setAgent(mappedAgent);
        setError(null);

        // Set initial deployment config based on agent data
        setDeploymentConfig(prev => ({
          ...prev,
          name: `${mappedAgent.name.toLowerCase()}-prod`,
          framework: mappedAgent.framework || 'formation-agent'
        }));

      } catch (err) {
        console.error('Error fetching agent:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch agent');
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, [params.agentId]);

  // Add debug logging for state changes
  useEffect(() => {
    console.log('Current agent state:', agent);
    console.log('Current activeTab:', activeTab);
    console.log('Current deploymentStep:', deploymentStep);
    console.log('Current deploymentStatus:', deploymentStatus);
    console.log('Current deploymentConfig:', deploymentConfig);
  }, [agent, activeTab, deploymentStep, deploymentStatus, deploymentConfig]);

  // Safe access helper function
  const safeAccess = (obj: any, path: string, defaultValue: any = undefined) => {
    try {
      return path.split('.').reduce((acc, part) => acc?.[part], obj) ?? defaultValue;
    } catch (e) {
      console.warn(`Error accessing path ${path}:`, e);
      return defaultValue;
    }
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Update the syntax highlighting effect to run when tab content changes
  useEffect(() => {
    const highlight = () => {
      requestAnimationFrame(() => {
        Prism.highlightAll();
      });
    };
    
    highlight();
    
    // Add a small delay to ensure dynamic content is loaded
    const timer = setTimeout(highlight, 100);
    return () => clearTimeout(timer);
  }, [activeTab, deploymentStep]);

  useEffect(() => {
    // Update URL when tab changes
    const url = new URL(window.location.href);
    if (activeTab === 'overview') {
      url.searchParams.delete('tab');
    } else {
      url.searchParams.set('tab', activeTab);
    }
    window.history.replaceState({}, '', url.toString());
  }, [activeTab]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isSending) return;

    const newMessage: Message = {
      role: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setCurrentMessage('');
    setIsSending(true);

    try {
      const response = await fetch(`/api/agents/${params.agentId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentMessage }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.Success) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.Success.response,
          timestamp: new Date()
        }]);
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error: ${err instanceof Error ? err.message : 'Failed to get response'}`,
        timestamp: new Date()
      }]);
    } finally {
      setIsSending(false);
    }
  };

  const renderTabContent = () => {
    if (!agent) return null;

    switch (activeTab) {
      case "overview":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Performance Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <h3 className="text-sm font-medium text-blue-900">Response Time</h3>
                </div>
                <p className="text-2xl font-bold text-blue-600">{safeAccess(agent, 'avg_response_time_ms', 0)}ms</p>
                <p className="text-sm text-blue-600 mt-1 opacity-70">Average response time</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  <h3 className="text-sm font-medium text-green-900">Success Rate</h3>
                </div>
                <p className="text-2xl font-bold text-green-600">{safeAccess(agent, 'success_rate', 0)}%</p>
                <p className="text-sm text-green-600 mt-1 opacity-70">Request success rate</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-600" />
                  <h3 className="text-sm font-medium text-purple-900">Uptime</h3>
                </div>
                <p className="text-2xl font-bold text-purple-600">{safeAccess(agent, 'uptime', 0)}%</p>
                <p className="text-sm text-purple-600 mt-1 opacity-70">Service availability</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Server className="w-5 h-5 text-amber-600" />
                  <h3 className="text-sm font-medium text-amber-900">Memory Usage</h3>
                </div>
                <p className="text-2xl font-bold text-amber-600">
                  {safeAccess(agent, 'avg_memory_mb', 0) ? `${(safeAccess(agent, 'avg_memory_mb', 0) / 1024).toFixed(1)}GB` : '0GB'}
                </p>
                <p className="text-sm text-amber-600 mt-1 opacity-70">Average memory usage</p>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 bg-white rounded-xl border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 uppercase mb-4">Usage Statistics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Total Requests</span>
                      <span className="text-sm font-medium text-gray-900">{safeAccess(agent, 'total_requests', 0)?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Active Users</span>
                      <span className="text-sm font-medium text-gray-900">{safeAccess(agent, 'active_users', 0)?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Runtime</span>
                      <span className="text-sm font-medium text-gray-900">{safeAccess(agent, 'total_runtime_hours', 0) || 0} hours</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-xl border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 uppercase mb-4">Performance</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">CPU Usage</span>
                      <span className="text-sm font-medium text-gray-900">{safeAccess(agent, 'avg_cpu_usage', 0)}%</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Network I/O</span>
                      <span className="text-sm font-medium text-gray-900">{safeAccess(agent, 'network_io_mbps', 0) || 0} MB/s</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Error Rate</span>
                      <span className="text-sm font-medium text-gray-900">{safeAccess(agent, 'error_rate', 0)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-xl border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 uppercase mb-4">Cost & Usage</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Cost per Request</span>
                      <span className="text-sm font-medium text-gray-900">${safeAccess(agent, 'cost_per_request', '0.00')}</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Monthly Cost</span>
                      <span className="text-sm font-medium text-gray-900">${safeAccess(agent, 'monthly_cost', '0.00')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Active Deployments</span>
                      <span className="text-sm font-medium text-gray-900">{safeAccess(agent, 'active_deployments', 0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Chat Demo Section */}
            <div className="p-4 md:p-6 border border-gray-200 rounded-xl bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Try it out</h3>
                <Button
                  onClick={() => setShowDemo(!showDemo)}
                  className="bg-[#0A84FF] hover:bg-[#0A84FF]/90"
                >
                  {showDemo ? "Hide Demo" : "Show Demo"}
                </Button>
              </div>
              <AnimatePresence>
                {showDemo && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-gray-50 rounded-lg">
                      {/* Example Prompts */}
                      <div className="p-4 border-b border-gray-200">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Example prompts:</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {getExamplePrompts(safeAccess(agent, 'agent_type', '')).map((prompt, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setCurrentMessage(prompt);
                                const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                                if (input) {
                                  input.focus();
                                }
                              }}
                              className="text-left p-3 text-sm bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
                            >
                              {prompt}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Chat Messages */}
                      <div 
                        ref={chatContainerRef}
                        className="h-[400px] overflow-y-auto p-4 space-y-4"
                      >
                        {messages.map((message, index) => (
                          <div
                            key={index}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[80%] p-3 rounded-lg ${
                                message.role === 'user'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white border border-gray-200'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className="text-xs mt-1 opacity-70">
                                {message.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))}
                        {isSending && (
                          <div className="flex justify-start">
                            <div className="bg-white border border-gray-200 p-3 rounded-lg">
                              <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Chat Input */}
                      <div className="p-4 border-t border-gray-200">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Type your message..."
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                          />
                          <Button
                            onClick={handleSendMessage}
                            disabled={isSending || !currentMessage.trim()}
                            className="bg-[#0A84FF] hover:bg-[#0A84FF]/90"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );

      case "documentation":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            {/* Quick Start */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-4 md:px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">Quick Start</h2>
              </div>
              <div className="p-4 md:p-6 space-y-4">
                <div className="bg-[#1E1E1E] rounded-lg overflow-hidden">
                  <pre className="p-4 text-sm overflow-x-auto">
                    <code className="language-typescript">{`import { FormationAgent } from '@formation/sdk';

const agent = new FormationAgent('${safeAccess(agent, 'agent_id')}');

// Initialize with custom configuration
await agent.init({
  maxTokens: 2048,
  temperature: 0.7,
  memory: true
});

// Make a request
const response = await agent.process({
  input: "Your request here",
  context: { /* Optional context */ }
});`}</code>
                  </pre>
                </div>
                <p className="text-sm text-gray-600">
                  Get started quickly by installing our SDK and initializing the agent with your preferred configuration.
                </p>
              </div>
            </div>

            {/* Configuration */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">Configuration Options</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Basic Configuration</h3>
                    <div className="space-y-3">
                      <div>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">maxTokens</code>
                        <p className="text-sm text-gray-600 mt-1">Maximum number of tokens in the response (default: 2048)</p>
                      </div>
                      <div>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">temperature</code>
                        <p className="text-sm text-gray-600 mt-1">Response creativity level from 0 to 1 (default: 0.7)</p>
                      </div>
                      <div>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">memory</code>
                        <p className="text-sm text-gray-600 mt-1">Enable/disable conversation memory (default: true)</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Advanced Configuration</h3>
                    <div className="space-y-3">
                      <div>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">contextWindow</code>
                        <p className="text-sm text-gray-600 mt-1">Number of previous messages to include (default: 10)</p>
                      </div>
                      <div>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">timeout</code>
                        <p className="text-sm text-gray-600 mt-1">Request timeout in milliseconds (default: 30000)</p>
                      </div>
                      <div>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">retries</code>
                        <p className="text-sm text-gray-600 mt-1">Number of retry attempts (default: 3)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Examples */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">Examples</h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Basic Usage</h3>
                  <div className="bg-[#1E1E1E] rounded-lg overflow-hidden">
                    <pre className="p-4 text-sm overflow-x-auto line-numbers">
                      <code className="language-typescript">{`// Simple request
const response = await agent.process({
  input: "Analyze this code for security vulnerabilities",
  context: {
    code: "your code here"
  }
});

// Stream response
const stream = agent.streamProcess({
  input: "Generate a detailed report",
  onToken: (token) => {
    console.log(token);
  }
});`}</code>
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Advanced Usage</h3>
                  <div className="bg-[#1E1E1E] rounded-lg overflow-hidden">
                    <pre className="p-4 text-sm overflow-x-auto line-numbers">
                      <code className="language-typescript">{`// Custom tool integration
agent.registerTool({
  name: "custom_tool",
  description: "Custom tool description",
  handler: async (params) => {
    // Tool implementation
  }
});

// Batch processing
const results = await agent.batchProcess([
  { input: "Task 1" },
  { input: "Task 2" },
  { input: "Task 3" }
]);`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Best Practices */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">Best Practices</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Performance Optimization</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Use streaming for large responses</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Implement proper error handling and retries</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Cache responses when appropriate</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Optimize context window size</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Security Guidelines</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-blue-500 mt-0.5" />
                        <span>Always validate and sanitize inputs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-blue-500 mt-0.5" />
                        <span>Use environment variables for sensitive data</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-blue-500 mt-0.5" />
                        <span>Implement proper authentication</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-blue-500 mt-0.5" />
                        <span>Regular security audits</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Topics */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">Advanced Topics</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Custom Integrations</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Learn how to extend the agent's capabilities with custom tools and integrations.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <Server className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="text-sm text-gray-900">Custom API Integration</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Zap className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-sm text-gray-900">Webhook Support</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-sm text-gray-900">Custom Authentication</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Enterprise Features</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Discover advanced features available for enterprise deployments.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                          <Shield className="w-4 h-4 text-amber-600" />
                        </div>
                        <span className="text-sm text-gray-900">Advanced Security Controls</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                          <AlertCircle className="w-4 h-4 text-red-600" />
                        </div>
                        <span className="text-sm text-gray-900">Audit Logging</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                          <Server className="w-4 h-4 text-indigo-600" />
                        </div>
                        <span className="text-sm text-gray-900">Custom Deployment Options</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Troubleshooting */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">Troubleshooting</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <h3 className="text-sm font-medium text-amber-900 mb-2">Common Issues</h3>
                    <ul className="space-y-2 text-sm text-amber-800">
                      <li className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
                        <span>Connection timeouts</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
                        <span>Rate limiting errors</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
                        <span>Authentication failures</span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-900 mb-2">Debug Mode</h3>
                    <div className="bg-[#1E1E1E] rounded-lg overflow-hidden">
                      <pre className="p-4 text-sm overflow-x-auto line-numbers">
                        <code className="language-typescript">{`// Enable debug mode
const agent = new FormationAgent('${safeAccess(agent, 'agent_id')}', {
  debug: true,
  logLevel: 'verbose'
});

// Monitor events
agent.on('error', (error) => {
  console.error('Agent error:', error);
});

agent.on('retry', (attempt) => {
  console.log(\`Retry attempt \${attempt}\`);
});`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case "capabilities":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {safeAccess(agent, 'capabilities', []).map((capability, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-4 flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-base text-gray-900">
                    {capability.toLowerCase().replace(/-/g, ' ')}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case "integrations":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {safeAccess(agent, 'tools', []).map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
              >
                <h3 className="font-medium text-gray-900">{safeAccess(tool, 'name')}</h3>
                <p className="text-sm text-gray-600 mt-1">{safeAccess(tool, 'description')}</p>
              </motion.div>
            ))}
          </motion.div>
        );

      case "technical":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4 md:space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Resource Requirements Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Server className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900 mb-3">Resource Requirements</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">CPU</span>
                        <span className="text-sm font-medium text-gray-900">
                          {safeAccess(agent, 'resource_requirements.min_vcpus')} - {safeAccess(agent, 'resource_requirements.recommended_vcpus')} vCPUs
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Memory</span>
                        <span className="text-sm font-medium text-gray-900">
                          {safeAccess(agent, 'resource_requirements.min_memory_mb', 0) / 1024} - {safeAccess(agent, 'resource_requirements.recommended_memory_mb', 0) / 1024} GB
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Storage</span>
                        <span className="text-sm font-medium text-gray-900">
                          {safeAccess(agent, 'resource_requirements.min_disk_gb')} - {safeAccess(agent, 'resource_requirements.recommended_disk_gb')} GB
                        </span>
                      </div>
                      {safeAccess(agent, 'resource_requirements.requires_gpu') && (
                        <div className="flex items-center gap-2 text-amber-600">
                          <Cpu className="w-4 h-4" />
                          <span className="text-sm">Requires GPU</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Access & Permissions Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900 mb-3">Access & Permissions</h3>
                    <div className="space-y-3">
                      {safeAccess(agent, 'has_memory') && (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-sm">Has Memory</span>
                        </div>
                      )}
                      {safeAccess(agent, 'has_external_api_access') && (
                        <div className="flex items-center gap-2 text-amber-600">
                          <Globe className="w-4 h-4" />
                          <span className="text-sm">External API Access</span>
                        </div>
                      )}
                      {safeAccess(agent, 'has_internet_access') && (
                        <div className="flex items-center gap-2 text-amber-600">
                          <Wifi className="w-4 h-4" />
                          <span className="text-sm">Internet Access</span>
                        </div>
                      )}
                      {safeAccess(agent, 'has_filesystem_access') && (
                        <div className="flex items-center gap-2 text-amber-600">
                          <FolderOpen className="w-4 h-4" />
                          <span className="text-sm">Filesystem Access</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Runtime Details Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900 mb-3">Runtime Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Framework</span>
                        <span className="text-sm font-medium text-gray-900">{safeAccess(agent, 'framework')}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Runtime</span>
                        <span className="text-sm font-medium text-gray-900">{safeAccess(agent, 'runtime')}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Version</span>
                        <span className="text-sm font-medium text-gray-900">{safeAccess(agent, 'version')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case "pricing":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto"
          >
            <div className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  ${safeAccess(agent, 'price_per_request')}
                  <span className="text-sm text-gray-600 ml-1">per request</span>
                </h3>
                <p className="text-gray-600">Everything you need to automate your workflows</p>
              </div>
              
              <div className="space-y-4">
                {safeAccess(agent, 'capabilities', []).map((capability, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">{capability}</span>
                  </motion.div>
                ))}
              </div>

              <Button className="w-full mt-8 bg-[#0A84FF] hover:bg-[#0A84FF]/90">
                Deploy Agent
              </Button>
            </div>
          </motion.div>
        );

      case "deploy":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto"
          >
            {/* Progress Steps */}
            <div className="mb-8 px-4">
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute left-[15%] right-[15%] top-1/2 h-0.5 bg-gray-200 -z-10" />
                {/* Step Circles */}
                <div className="flex justify-between">
                  <div className="flex-1 flex justify-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      deploymentStep > 1 ? "bg-blue-600 text-white" : deploymentStep === 1 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"
                    } font-medium text-base`}>
                      {deploymentStep > 1 ? <CheckCircle2 className="w-5 h-5" /> : "1"}
                    </div>
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      deploymentStep > 2 ? "bg-blue-600 text-white" : deploymentStep === 2 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"
                    } font-medium text-base`}>
                      {deploymentStep > 2 ? <CheckCircle2 className="w-5 h-5" /> : "2"}
                    </div>
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      deploymentStep === 3 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"
                    } font-medium text-base`}>
                      3
                    </div>
                  </div>
                </div>
              </div>
              {/* Step Labels */}
              <div className="flex justify-between mt-3 px-4">
                <div className="flex-1 text-center">
                  <span className="text-sm text-gray-600">Configuration</span>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-sm text-gray-600">Resources</span>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-sm text-gray-600">Review & Deploy</span>
                </div>
              </div>
            </div>

            {/* Content Container */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mx-4">
              <AnimatePresence mode="wait">
                {deploymentStep === 3 ? (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-4 md:p-6 space-y-6"
                  >
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">Review & Deploy</h2>
                      <div className="space-y-4">
                        {/* Configuration Card */}
                        <div className="bg-blue-50 rounded-xl p-4 md:p-6">
                          <h3 className="text-lg font-semibold text-blue-900 mb-4">Configuration</h3>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-blue-700">Name</span>
                              <span className="text-blue-900 font-medium">
                                {safeAccess(deploymentConfig, 'name') || `${safeAccess(agent, 'name')?.toLowerCase()}-prod`}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-blue-700">Environment</span>
                              <span className="text-blue-900 font-medium">{safeAccess(deploymentConfig, 'environment')}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-blue-700">Framework</span>
                              <span className="text-blue-900 font-medium">{safeAccess(deploymentConfig, 'framework')}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-blue-700">Model</span>
                              <span className="text-blue-900 font-medium">{safeAccess(deploymentConfig, 'model')}</span>
                            </div>
                          </div>
                        </div>

                        {/* Resources Card */}
                        <div className="bg-purple-50 rounded-xl p-4 md:p-6">
                          <h3 className="text-lg font-semibold text-purple-900 mb-4">Resources</h3>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-purple-700">Instance Type</span>
                              <span className="text-purple-900 font-medium">{safeAccess(deploymentConfig, 'instanceType')}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-purple-700">Region</span>
                              <span className="text-purple-900 font-medium">{safeAccess(deploymentConfig, 'region')}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-purple-700">Replicas</span>
                              <span className="text-purple-900 font-medium">{safeAccess(deploymentConfig, 'replicas')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`step${deploymentStep}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-4 md:p-6 space-y-6"
                  >
                    {/* Form Content */}
                    {deploymentStep === 1 ? (
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Agent Configuration</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Deployment Name
                              </label>
                              <input
                                type="text"
                                value={safeAccess(deploymentConfig, 'name')}
                                onChange={(e) => setDeploymentConfig(prev => ({ ...prev, name: e.target.value }))}
                                placeholder={`${safeAccess(agent, 'name')?.toLowerCase()}-prod`}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Environment
                              </label>
                              <select
                                value={safeAccess(deploymentConfig, 'environment')}
                                onChange={(e) => setDeploymentConfig(prev => ({ ...prev, environment: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="production">Production</option>
                                <option value="staging">Staging</option>
                                <option value="development">Development</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Framework
                              </label>
                              <select
                                value={safeAccess(deploymentConfig, 'framework')}
                                onChange={(e) => setDeploymentConfig(prev => ({ ...prev, framework: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="formation-agent">Formation Agent</option>
                                <option value="langchain">LangChain</option>
                                <option value="autogen">AutoGen</option>
                              </select>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Model
                              </label>
                              <select
                                value={safeAccess(deploymentConfig, 'model')}
                                onChange={(e) => setDeploymentConfig(prev => ({ ...prev, model: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                                <option value="gpt-4">GPT-4</option>
                                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                                <option value="claude-3-opus">Claude 3 Opus</option>
                                <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                                <option value="mixtral-8x7b">Mixtral 8x7B</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Features
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={safeAccess(deploymentConfig, 'memory')}
                                  onChange={(e) => setDeploymentConfig(prev => ({ ...prev, memory: e.target.checked }))}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-600">Enable memory</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={safeAccess(deploymentConfig, 'streaming')}
                                  onChange={(e) => setDeploymentConfig(prev => ({ ...prev, streaming: e.target.checked }))}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-600">Enable streaming</span>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Max Tokens
                              </label>
                              <input
                                type="number"
                                value={safeAccess(deploymentConfig, 'maxTokens')}
                                onChange={(e) => setDeploymentConfig(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Resource Configuration</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Instance Type
                            </label>
                            <div className="space-y-3">
                              {[
                                { id: 'serverless', label: 'Serverless', icon: Cloud },
                                { id: 'dedicated', label: 'Dedicated Instance', icon: Server },
                                { id: 'gpu', label: 'GPU Optimized', icon: Cpu }
                              ].map((type) => (
                                <button
                                  key={type.id}
                                  onClick={() => setDeploymentConfig(prev => ({ ...prev, instanceType: type.id }))}
                                  className={`w-full flex items-center gap-3 p-3 rounded-lg border ${
                                    safeAccess(deploymentConfig, 'instanceType') === type.id
                                      ? 'border-blue-500 bg-blue-50'
                                      : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                                  } transition-all`}
                                >
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    safeAccess(deploymentConfig, 'instanceType') === type.id
                                      ? 'bg-blue-100'
                                      : 'bg-gray-100'
                                  }`}>
                                    <type.icon className={`w-4 h-4 ${
                                      safeAccess(deploymentConfig, 'instanceType') === type.id
                                        ? 'text-blue-600'
                                        : 'text-gray-600'
                                    }`} />
                                  </div>
                                  <span className="text-sm font-medium text-gray-900">{type.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Region
                              </label>
                              <select
                                value={safeAccess(deploymentConfig, 'region')}
                                onChange={(e) => setDeploymentConfig(prev => ({ ...prev, region: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="us-west-2">US West (Oregon)</option>
                                <option value="us-east-1">US East (N. Virginia)</option>
                                <option value="eu-west-1">EU (Ireland)</option>
                                <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Number of Replicas
                              </label>
                              <input
                                type="number"
                                value={safeAccess(deploymentConfig, 'replicas')}
                                onChange={(e) => setDeploymentConfig(prev => ({ ...prev, replicas: parseInt(e.target.value) }))}
                                min="1"
                                max="10"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-between p-4 md:px-6 md:py-4 bg-gray-50 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setDeploymentStep(prev => Math.max(1, prev - 1))}
                  disabled={deploymentStep === 1}
                  className="px-6"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => {
                    if (deploymentStep < 3) {
                      setDeploymentStep(prev => prev + 1);
                    } else {
                      handleDeploy();
                    }
                  }}
                  disabled={isDeploying}
                  className="bg-blue-600 hover:bg-blue-700 px-6"
                >
                  {isDeploying ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Deploying...</span>
                    </div>
                  ) : deploymentStep === 3 ? (
                    'DEPLOY AGENT'
                  ) : (
                    'Next'
                  )}
                </Button>
              </div>
            </div>

            {/* Success State */}
            {safeAccess(deploymentConfig, 'deploymentStatus') === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 space-y-4 mx-4"
              >
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Deployment successful!</span>
                  </div>
                </div>

                {/* API Details */}
                <div className="space-y-4">
                  <div className="bg-white rounded-xl border border-gray-200">
                    <div className="px-4 py-3 bg-gray-50 border-b">
                      <h3 className="font-medium text-gray-700">API Key</h3>
                    </div>
                    <div className="p-4">
                      <code className="block p-3 bg-gray-900 text-amber-400 rounded-lg text-sm font-mono break-all">
                        {safeAccess(deploymentConfig, 'apiKey')}
                      </code>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-red-600">Error: {error || 'Failed to load agent details'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar - Hidden on mobile, shown as a modal/drawer */}
        <aside className="hidden lg:block lg:w-[240px] bg-white border-r border-gray-200 h-screen sticky top-0">
          <div className="p-6">
            <Link 
              href="/marketplace/agents"
              className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Agents
            </Link>

            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Details</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500">Type</div>
                    <div className="text-sm font-medium text-gray-900">{safeAccess(agent, 'agent_type')}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Framework</div>
                    <div className="text-sm font-medium text-gray-900">{safeAccess(agent, 'framework')}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Rating</div>
                    <div className="text-sm font-medium text-green-600">{safeAccess(agent, 'average_rating', 0).toFixed(1)}/5.0</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Usage</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500">Total Uses</div>
                    <div className="text-sm font-medium text-gray-900">{safeAccess(agent, 'usage_count', 0).toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Deployments</div>
                    <div className="text-sm font-medium text-gray-900">{safeAccess(agent, 'deployment_count', 0).toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {safeAccess(agent, 'tags', []).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="p-4">
            <Link 
              href="/marketplace/agents"
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Agents
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="border-b border-gray-200 bg-white">
            <div className="px-4 lg:px-8 py-4 lg:py-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h1 className="text-xl lg:text-2xl font-semibold text-gray-900">{safeAccess(agent, 'name')}</h1>
                    <span className="px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                      {safeAccess(agent, 'agent_type')}
                    </span>
                  </div>
                  <p className="text-sm lg:text-base text-gray-600 max-w-2xl">
                    {safeAccess(agent, 'description')}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:gap-4">
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => setActiveTab("documentation")}
                    className="hover:bg-gray-50 w-full sm:w-auto"
                  >
                    DOCUMENTATION
                  </Button>
                  <Button 
                    size="lg" 
                    onClick={handleDeployClick}
                    className={`w-full sm:w-auto ${
                      safeAccess(deploymentConfig, 'deploymentStatus') === 'success' 
                        ? "bg-green-600 hover:bg-green-700" 
                        : "bg-[#0A84FF] hover:bg-[#0A84FF]/90"
                    }`}
                  >
                    {safeAccess(deploymentConfig, 'deploymentStatus') === 'success' ? 'VIEW DEPLOYMENT' : 'DEPLOY AGENT'}
                  </Button>
                </div>
              </div>

              {/* Tabs - Scrollable on mobile */}
              <div className="flex gap-6 -mb-px overflow-x-auto pb-px hide-scrollbar">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-1 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? tab.highlight
                          ? "text-green-600 border-green-600"
                          : "text-[#0A84FF] border-[#0A84FF]"
                        : "text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-4 lg:p-8">
            <AnimatePresence mode="wait">
              {renderTabContent()}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Add styles for hiding scrollbar */}
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
} 