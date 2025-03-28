"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Clock, Zap, Server, Shield, Send } from "lucide-react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { Agent } from "@/types/agent";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-javascript";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "documentation", label: "Documentation" },
  { id: "capabilities", label: "Capabilities" },
  { id: "integrations", label: "Integrations" },
  { id: "technical", label: "Technical" },
  { id: "pricing", label: "Pricing" }
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

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
  const agentId = params.agentId as string;
  const [activeTab, setActiveTab] = useState("overview");
  const [showDemo, setShowDemo] = useState(true);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const response = await fetch(`/api/agents/${agentId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.Success) {
          setAgent(data.Success);
        } else if (data.error) {
          throw new Error(data.error);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch agent details');
        console.error('Error fetching agent:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, [agentId]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Add effect for syntax highlighting
  useEffect(() => {
    Prism.highlightAll();
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
      const response = await fetch(`/api/agents/${agentId}/chat`, {
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
            className="space-y-8"
          >
            {/* Performance Metrics */}
            <div className="grid grid-cols-4 gap-6">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <h3 className="text-sm font-medium text-blue-900">Response Time</h3>
                </div>
                <p className="text-2xl font-bold text-blue-600">{agent.avg_response_time_ms || 0}ms</p>
                <p className="text-sm text-blue-600 mt-1 opacity-70">Average response time</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  <h3 className="text-sm font-medium text-green-900">Success Rate</h3>
                </div>
                <p className="text-2xl font-bold text-green-600">{agent.success_rate || 0}%</p>
                <p className="text-sm text-green-600 mt-1 opacity-70">Request success rate</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-600" />
                  <h3 className="text-sm font-medium text-purple-900">Uptime</h3>
                </div>
                <p className="text-2xl font-bold text-purple-600">{agent.uptime || 0}%</p>
                <p className="text-sm text-purple-600 mt-1 opacity-70">Service availability</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Server className="w-5 h-5 text-amber-600" />
                  <h3 className="text-sm font-medium text-amber-900">Memory Usage</h3>
                </div>
                <p className="text-2xl font-bold text-amber-600">{agent.avg_memory_mb ? `${(agent.avg_memory_mb / 1024).toFixed(1)}GB` : '0GB'}</p>
                <p className="text-sm text-amber-600 mt-1 opacity-70">Average memory usage</p>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-xl border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 uppercase mb-4">Usage Statistics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Total Requests</span>
                      <span className="text-sm font-medium text-gray-900">{agent.total_requests?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Active Users</span>
                      <span className="text-sm font-medium text-gray-900">{agent.active_users?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Runtime</span>
                      <span className="text-sm font-medium text-gray-900">{agent.total_runtime_hours || 0} hours</span>
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
                      <span className="text-sm font-medium text-gray-900">{agent.avg_cpu_usage || 0}%</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Network I/O</span>
                      <span className="text-sm font-medium text-gray-900">{agent.network_io_mbps || 0} MB/s</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Error Rate</span>
                      <span className="text-sm font-medium text-gray-900">{agent.error_rate || 0}%</span>
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
                      <span className="text-sm font-medium text-gray-900">${agent.cost_per_request || '0.00'}</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Monthly Cost</span>
                      <span className="text-sm font-medium text-gray-900">${agent.monthly_cost || '0.00'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Active Deployments</span>
                      <span className="text-sm font-medium text-gray-900">{agent.active_deployments || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Chat Demo Section */}
            <div className="p-6 border border-gray-200 rounded-xl bg-white">
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
                          {getExamplePrompts(agent.agent_type).map((prompt, index) => (
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
            className="max-w-4xl mx-auto space-y-8"
          >
            {/* Quick Start */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">Quick Start</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-[#1E1E1E] rounded-lg overflow-hidden">
                  <pre className="p-4 text-sm overflow-x-auto">
                    <code className="language-typescript">{`import { FormationAgent } from '@formation/sdk';

const agent = new FormationAgent('${agent.agent_id}');

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
                    <pre className="p-4 text-sm overflow-x-auto">
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
                    <pre className="p-4 text-sm overflow-x-auto">
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
                      <pre className="p-4 text-sm overflow-x-auto">
                        <code className="language-typescript">{`// Enable debug mode
const agent = new FormationAgent('${agent.agent_id}', {
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
          >
            <div className="grid grid-cols-2 gap-6">
              {agent.capabilities.map((capability, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">{capability}</h3>
                    </div>
                  </div>
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
            {agent.tools.map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
              >
                <h3 className="font-medium text-gray-900">{tool.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
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
          >
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-xl border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <Server className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">Resource Requirements</h3>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">CPU: </span>
                        {agent.resource_requirements.min_vcpus} - {agent.resource_requirements.recommended_vcpus} vCPUs
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Memory: </span>
                        {agent.resource_requirements.min_memory_mb / 1024} - {agent.resource_requirements.recommended_memory_mb / 1024} GB
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Storage: </span>
                        {agent.resource_requirements.min_disk_gb} - {agent.resource_requirements.recommended_disk_gb} GB
                      </p>
                      {agent.resource_requirements.requires_gpu && (
                        <p className="text-sm text-amber-600">Requires GPU</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-white rounded-xl border border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">Access & Permissions</h3>
                    <div className="space-y-2">
                      {agent.has_memory && (
                        <p className="text-sm text-green-600">Has Memory</p>
                      )}
                      {agent.has_external_api_access && (
                        <p className="text-sm text-amber-600">External API Access</p>
                      )}
                      {agent.has_internet_access && (
                        <p className="text-sm text-amber-600">Internet Access</p>
                      )}
                      {agent.has_filesystem_access && (
                        <p className="text-sm text-amber-600">Filesystem Access</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-xl border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">Runtime Details</h3>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Framework: </span>
                        {agent.framework}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Runtime: </span>
                        {agent.runtime}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Version: </span>
                        {agent.version}
                      </p>
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
                  ${agent.price_per_request}
                  <span className="text-sm text-gray-600 ml-1">per request</span>
                </h3>
                <p className="text-gray-600">Everything you need to automate your workflows</p>
              </div>
              
              <div className="space-y-4">
                {agent.capabilities.map((capability, index) => (
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
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-[240px] bg-white border-r border-gray-200 h-screen sticky top-0">
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
                    <div className="text-sm font-medium text-gray-900">{agent.agent_type}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Framework</div>
                    <div className="text-sm font-medium text-gray-900">{agent.framework}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Rating</div>
                    <div className="text-sm font-medium text-green-600">{agent.average_rating.toFixed(1)}/5.0</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Usage</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500">Total Uses</div>
                    <div className="text-sm font-medium text-gray-900">{agent.usage_count.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Deployments</div>
                    <div className="text-sm font-medium text-gray-900">{agent.deployment_count.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {agent.tags.map((tag, index) => (
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

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto">
          {/* Header */}
          <div className="border-b border-gray-200 bg-white">
            <div className="px-8 py-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-semibold text-gray-900">{agent.name}</h1>
                    <span className="px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                      {agent.agent_type}
                    </span>
                  </div>
                  <p className="text-gray-600 max-w-2xl">
                    {agent.description}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="lg">
                    Documentation
                  </Button>
                  <Button size="lg" className="bg-[#0A84FF] hover:bg-[#0A84FF]/90">
                    Deploy Agent
                  </Button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-6 -mb-px">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-1 py-3 text-sm font-medium border-b-2 transition-all ${
                      activeTab === tab.id
                        ? "text-[#0A84FF] border-[#0A84FF]"
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
          <div className="p-8">
            <AnimatePresence mode="wait">
              {renderTabContent()}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
} 