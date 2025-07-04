"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Zap,
  Server,
  Shield,
  Send,
  Settings,
  Cpu,
  Database,
  Globe,
  Cloud,
  Wifi,
  FolderOpen,
  Bot,
  Code2,
  FileText,
  Rocket,
  Check,
  X,
  Loader2,
  DollarSign,
} from "lucide-react";
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
import {
  useDynamicContext,
  useIsLoggedIn,
  useDynamicEvents,
} from "@dynamic-labs/sdk-react-core";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
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
  { id: "hire", label: "Hire", icon: Rocket, highlight: true },
];

const generateDisplayId = (realId: string) => {
  const prefix = "fmt";
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}`;
};

// Add example prompts based on agent type
const getExamplePrompts = (agentType: string) => {
  const defaultPrompts = [
    "What can you help me with?",
    "Tell me about your capabilities",
    "How do you handle errors?",
    "Show me an example workflow",
  ];

  const promptsByType: Record<string, string[]> = {
    code: [
      "Review this code for security issues",
      "Help me optimize this function",
      "Explain how this algorithm works",
      "Convert this to TypeScript",
    ],
    research: [
      "Summarize this research paper",
      "Find relevant studies about...",
      "Compare these methodologies",
      "Analyze these findings",
    ],
    assistant: [
      "Schedule a meeting for tomorrow",
      "Draft an email to the team",
      "Create a project timeline",
      "Summarize these notes",
    ],
    data: [
      "Analyze this dataset",
      "Create a visualization",
      "Find patterns in this data",
      "Clean this data structure",
    ],
  };

  const type = agentType?.toLowerCase() || "";
  return promptsByType[type] || defaultPrompts;
};

export default function AgentDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const agentId = params.agentId as string;

  const [activeTab, setActiveTab] = useState(() => {
    const tab = searchParams.get("tab");
    if (tab === "documentation" || tab === "hire") {
      return tab;
    }
    return "overview";
  });

  const [showDemo, setShowDemo] = useState(true);
  const [deploymentStep, setDeploymentStep] = useState(1);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [deploymentConfig, setDeploymentConfig] = useState({
    name: "",
    environment: "production",
    framework: "formation-agent",
    model: "gpt-4-turbo",
    memory: false,
    streaming: true,
    maxTokens: 4096,
    instanceType: "serverless",
    region: "us-west-2",
    replicas: 1,
    apiKey: "",
  });

  const [hiringStep, setHiringStep] = useState(1);
  const { primaryWallet, setShowAuthFlow, sdkHasLoaded, user } =
    useDynamicContext();
  const isLoggedIn = useIsLoggedIn();
  const [isHiring, setIsHiring] = useState(false);
  const [hiringStatus, setHiringStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [hiringConfig, setHiringConfig] = useState({
    name: "",
    environment: "production",
    framework: "formation-agent",
    model: "gpt-4-turbo",
    memory: false,
    streaming: true,
    maxTokens: 4096,
    instanceType: "serverless",
    region: "us-west-2",
    replicas: 1,
    apiKey: "",
  });

  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Add isConnected state near the top with other state declarations
  const [isConnected, setIsConnected] = useState(false); // This would come from your auth context in reality

  // Subscribe to auth events
  useDynamicEvents("authInit", () => {
    toast.success("Successfully connected!");
  });

  useDynamicEvents("authFailure", () => {
    toast.error("Connection failed");
  });

  // First add these state variables near the top where other states are declared:
  const [copiedId, setCopiedId] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [copiedSdk, setCopiedSdk] = useState(false);

  const handleDeploy = async () => {
    console.log("Starting deployment with config:", deploymentConfig);
    setIsDeploying(true);
    try {
      const response = await fetch(`/api/agents/${agentId}/deploy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
          replicas: deploymentConfig.replicas,
        }),
      });

      console.log("Deployment response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Deployment failed:", errorData);
        throw new Error(errorData.message || "Failed to deploy agent");
      }

      const data = await response.json();
      console.log("Deployment response data:", data);

      setDeploymentConfig((prev) => ({
        ...prev,
        apiKey: data.apiKey,
      }));
      setDeploymentStatus("success");
      setDeploymentStep(3);
    } catch (err) {
      console.error("Deployment error:", err);
      setDeploymentStatus("error");
    } finally {
      setIsDeploying(false);
    }
  };

  const handleDeployClick = () => {
    console.log("Deploy button clicked. Current status:", deploymentStatus);
    if (deploymentStatus === "success") {
      setActiveTab("deploy");
      setDeploymentStep(3);
    } else {
      setActiveTab("deploy");
      setDeploymentStep(1);
      setDeploymentStatus("idle");
      const defaultName = agent?.name ? `${agent.name.toLowerCase()}-prod` : "";
      setDeploymentConfig({
        name: defaultName,
        environment: "production",
        framework: "formation-agent",
        model: "gpt-4-turbo",
        memory: false,
        streaming: true,
        maxTokens: 4096,
        instanceType: "serverless",
        region: "us-west-2",
        replicas: 1,
        apiKey: "",
      });
    }
    console.log("Updated deployment config:", deploymentConfig);
  };

  const handleHire = async () => {
    setIsHiring(true);

    // Simulate API call with timeout
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setHiringStatus("success");
      toast.success("Agent hired successfully!");
    } catch (err) {
      console.error("Error hiring agent:", err);
      setHiringStatus("error");
      toast.error("Failed to hire agent");
    } finally {
      setIsHiring(false);
    }
  };

  const handleHireClick = () => {
    console.log("Hire button clicked. Current status:", hiringStatus);
    if (hiringStatus === "success") {
      setActiveTab("hire");
      setHiringStep(3);
    } else {
      setActiveTab("hire");
      setHiringStep(1);
      setHiringStatus("idle");
      const defaultName = agent?.name ? `${agent.name.toLowerCase()}-prod` : "";
      setHiringConfig({
        name: defaultName,
        environment: "production",
        framework: "formation-agent",
        model: "gpt-4-turbo",
        memory: false,
        streaming: true,
        maxTokens: 4096,
        instanceType: "serverless",
        region: "us-west-2",
        replicas: 1,
        apiKey: "",
      });
    }
    console.log("Updated hiring config:", hiringConfig);
  };

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        setLoading(true);
        console.log("Fetching agent data for ID:", params.agentId);
        const response = await fetch(`/api/agents/${params.agentId}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Received agent data:", data);

        // Map the API response to our Agent interface
        const mappedAgent: Agent = {
          id: data.Success.agent_id,
          agent_id: data.Success.agent_id,
          agent_type: data.Success.agent_type,
          name: data.Success.name,
          description: data.Success.description,
          capabilities: data.Success.capabilities || [],
          documentation: data.Success.documentation || "",
          examples: [], // Add example mapping if available
          avg_response_time_ms: 0, // Initialize with defaults
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
            min_memory_mb:
              data.Success.resource_requirements?.min_memory_mb || 1024,
            recommended_memory_mb:
              data.Success.resource_requirements?.recommended_memory_mb || 2048,
            min_disk_gb: 10,
            recommended_disk_gb: 20,
            requires_gpu: false,
          },
          has_memory: data.Success.has_memory || false,
          has_external_api_access:
            data.Success.has_external_api_access || false,
          has_internet_access: data.Success.has_internet_access || false,
          has_filesystem_access: data.Success.has_filesystem_access || false,
          framework: data.Success.framework || "LangChain",
          runtime: data.Success.runtime || "Python",
          version: data.Success.version || "1.2.0",
          price_per_request: data.Success.price_per_request?.toString() || "5",
          average_rating: data.Success.average_rating || 4,
          usage_count: data.Success.usage_count || 12000,
          deployment_count: data.Success.deployment_count || 800,
          tags: data.Success.tags || ["research", "academic", "literature"],
        };

        setAgent(mappedAgent);
        setError(null);

        // Set initial deployment config based on agent data
        setDeploymentConfig((prev) => ({
          ...prev,
          name: `${mappedAgent.name.toLowerCase()}-prod`,
          framework: mappedAgent.framework || "formation-agent",
        }));
      } catch (err) {
        console.error("Error fetching agent:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch agent");
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, [params.agentId]);

  // Add debug logging for state changes
  useEffect(() => {
    console.log("Current agent state:", agent);
    console.log("Current activeTab:", activeTab);
    console.log("Current deploymentStep:", deploymentStep);
    console.log("Current deploymentStatus:", deploymentStatus);
    console.log("Current deploymentConfig:", deploymentConfig);
  }, [agent, activeTab, deploymentStep, deploymentStatus, deploymentConfig]);

  // Safe access helper function
  const safeAccess = (
    obj: any,
    path: string,
    defaultValue: any = undefined
  ) => {
    try {
      return (
        path.split(".").reduce((acc, part) => acc?.[part], obj) ?? defaultValue
      );
    } catch (e) {
      console.warn(`Error accessing path ${path}:`, e);
      return defaultValue;
    }
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
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
    if (activeTab === "overview") {
      url.searchParams.delete("tab");
    } else {
      url.searchParams.set("tab", activeTab);
    }
    window.history.replaceState({}, "", url.toString());
  }, [activeTab]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isSending) return;

    const newMessage: Message = {
      role: "user",
      content: currentMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setCurrentMessage("");
    setIsSending(true);

    try {
      const response = await fetch(`/api/agents/${params.agentId}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: currentMessage }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.Success) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.Success.response,
            timestamp: new Date(),
          },
        ]);
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error: ${err instanceof Error ? err.message : "Failed to get response"}`,
          timestamp: new Date(),
        },
      ]);
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
                  <h3 className="text-sm font-medium text-blue-900">
                    Response Time
                  </h3>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {safeAccess(agent, "avg_response_time_ms", 0)}ms
                </p>
                <p className="text-sm text-blue-600 mt-1 opacity-70">
                  Average response time
                </p>
              </div>

              <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  <h3 className="text-sm font-medium text-green-900">
                    Success Rate
                  </h3>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {safeAccess(agent, "success_rate", 0)}%
                </p>
                <p className="text-sm text-green-600 mt-1 opacity-70">
                  Request success rate
                </p>
              </div>

              <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-600" />
                  <h3 className="text-sm font-medium text-purple-900">
                    Uptime
                  </h3>
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  {safeAccess(agent, "uptime", 0)}%
                </p>
                <p className="text-sm text-purple-600 mt-1 opacity-70">
                  Service availability
                </p>
              </div>

              <div className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Server className="w-5 h-5 text-amber-600" />
                  <h3 className="text-sm font-medium text-amber-900">
                    Memory Usage
                  </h3>
                </div>
                <p className="text-2xl font-bold text-amber-600">
                  {safeAccess(agent, "avg_memory_mb", 0)
                    ? `${(safeAccess(agent, "avg_memory_mb", 0) / 1024).toFixed(1)}GB`
                    : "0GB"}
                </p>
                <p className="text-sm text-amber-600 mt-1 opacity-70">
                  Average memory usage
                </p>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 bg-white rounded-xl border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 uppercase mb-4">
                  Usage Statistics
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">
                        Total Requests
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {safeAccess(
                          agent,
                          "total_requests",
                          0
                        )?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">
                        Active Users
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {safeAccess(
                          agent,
                          "active_users",
                          0
                        )?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Total Runtime
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {safeAccess(agent, "total_runtime_hours", 0) || 0} hours
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-xl border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 uppercase mb-4">
                  Performance
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">CPU Usage</span>
                      <span className="text-sm font-medium text-gray-900">
                        {safeAccess(agent, "avg_cpu_usage", 0)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Network I/O</span>
                      <span className="text-sm font-medium text-gray-900">
                        {safeAccess(agent, "network_io_mbps", 0) || 0} MB/s
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Error Rate</span>
                      <span className="text-sm font-medium text-gray-900">
                        {safeAccess(agent, "error_rate", 0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-xl border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 uppercase mb-4">
                  Cost & Usage
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">
                        Cost per Request
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        ${safeAccess(agent, "cost_per_request", "0.00")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">
                        Monthly Cost
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        ${safeAccess(agent, "monthly_cost", "0.00")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Active Deployments
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {safeAccess(agent, "active_deployments", 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Chat Demo Section */}
            <div className="p-4 md:p-6 border border-gray-200 rounded-xl bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Try it out
                </h3>
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
                        <h4 className="text-sm font-medium text-gray-700 mb-3">
                          Example prompts:
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          {getExamplePrompts(
                            safeAccess(agent, "agent_type", "")
                          ).map((prompt, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setCurrentMessage(prompt);
                                const input = document.querySelector(
                                  'input[type="text"]'
                                ) as HTMLInputElement;
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
                            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[80%] p-3 rounded-lg ${
                                message.role === "user"
                                  ? "bg-blue-600 text-white"
                                  : "bg-white border border-gray-200"
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
                            onKeyPress={(e) =>
                              e.key === "Enter" && handleSendMessage()
                            }
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
            className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[300px]"
          >
            <div className="flex flex-col items-center justify-center py-16">
              <FileText className="w-12 h-12 text-blue-400 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Documentation Coming Soon
              </h2>
              <p className="text-gray-600 text-center max-w-md">
                We're working hard to bring you detailed documentation for this
                agent. Please check back soon!
              </p>
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
              {safeAccess(agent, "capabilities", []).map(
                (capability, index) => (
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
                      {capability.toLowerCase().replace(/-/g, " ")}
                    </span>
                  </motion.div>
                )
              )}
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
            {safeAccess(agent, "tools", []).map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
              >
                <h3 className="font-medium text-gray-900">
                  {safeAccess(tool, "name")}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {safeAccess(tool, "description")}
                </p>
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
                    <h3 className="text-base font-semibold text-gray-900 mb-3">
                      Resource Requirements
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">CPU</span>
                        <span className="text-sm font-medium text-gray-900">
                          {safeAccess(agent, "resource_requirements.min_vcpus")}{" "}
                          -{" "}
                          {safeAccess(
                            agent,
                            "resource_requirements.recommended_vcpus"
                          )}{" "}
                          vCPUs
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Memory</span>
                        <span className="text-sm font-medium text-gray-900">
                          {safeAccess(
                            agent,
                            "resource_requirements.min_memory_mb",
                            0
                          ) / 1024}{" "}
                          -{" "}
                          {safeAccess(
                            agent,
                            "resource_requirements.recommended_memory_mb",
                            0
                          ) / 1024}{" "}
                          GB
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Storage</span>
                        <span className="text-sm font-medium text-gray-900">
                          {safeAccess(
                            agent,
                            "resource_requirements.min_disk_gb"
                          )}{" "}
                          -{" "}
                          {safeAccess(
                            agent,
                            "resource_requirements.recommended_disk_gb"
                          )}{" "}
                          GB
                        </span>
                      </div>
                      {safeAccess(
                        agent,
                        "resource_requirements.requires_gpu"
                      ) && (
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
                    <h3 className="text-base font-semibold text-gray-900 mb-3">
                      Access & Permissions
                    </h3>
                    <div className="space-y-3">
                      {safeAccess(agent, "has_memory") && (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-sm">Has Memory</span>
                        </div>
                      )}
                      {safeAccess(agent, "has_external_api_access") && (
                        <div className="flex items-center gap-2 text-amber-600">
                          <Globe className="w-4 h-4" />
                          <span className="text-sm">External API Access</span>
                        </div>
                      )}
                      {safeAccess(agent, "has_internet_access") && (
                        <div className="flex items-center gap-2 text-amber-600">
                          <Wifi className="w-4 h-4" />
                          <span className="text-sm">Internet Access</span>
                        </div>
                      )}
                      {safeAccess(agent, "has_filesystem_access") && (
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
                    <h3 className="text-base font-semibold text-gray-900 mb-3">
                      Runtime Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Framework</span>
                        <span className="text-sm font-medium text-gray-900">
                          {safeAccess(agent, "framework")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Runtime</span>
                        <span className="text-sm font-medium text-gray-900">
                          {safeAccess(agent, "runtime")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Version</span>
                        <span className="text-sm font-medium text-gray-900">
                          {safeAccess(agent, "version")}
                        </span>
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
                  ${safeAccess(agent, "price_per_request")}
                  <span className="text-sm text-gray-600 ml-1">
                    per request
                  </span>
                </h3>
                <p className="text-gray-600">
                  Everything you need to automate your workflows
                </p>
              </div>

              <div className="space-y-4">
                {safeAccess(agent, "capabilities", []).map(
                  (capability, index) => (
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
                  )
                )}
              </div>

              <Button className="w-full mt-8 bg-[#0A84FF] hover:bg-[#0A84FF]/90">
                Deploy Agent
              </Button>
            </div>
          </motion.div>
        );

      case "hire":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto"
          >
            {!sdkHasLoaded ? (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-6 text-center">
                  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-gray-600 mt-4">Loading...</p>
                </div>
              </div>
            ) : !isLoggedIn ? (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bot className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    Connect to Hire {agent.name}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Sign in with your wallet or email to start using this agent.
                  </p>
                  <Button
                    size="lg"
                    onClick={() => setShowAuthFlow(true)}
                    className="bg-[#0A84FF] hover:bg-[#0A84FF]/90"
                  >
                    <div className="flex items-center gap-2">
                      <span>Connect Account</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        />
                      </svg>
                    </div>
                  </Button>
                </div>
              </div>
            ) : hiringStatus === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                      Successfully Hired!
                    </h2>
                    <p className="text-gray-600 mb-2">
                      You can now use {agent.name} in your projects.
                    </p>
                    <p className="text-sm text-gray-500">
                      Connected as {user?.email}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      Agent ID
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <code className="flex-1 block p-3 bg-gray-50 text-gray-800 rounded-lg text-sm font-mono border border-gray-200">
                        {generateDisplayId(agent.agent_id)}
                      </code>
                      <Button
                        variant={copiedId ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            generateDisplayId(agent.agent_id)
                          );
                          setCopiedId(true);
                          toast.success("Agent ID copied!", {
                            duration: 2000,
                            className:
                              "bg-green-50 text-green-900 border border-green-200",
                          });
                          setTimeout(() => setCopiedId(false), 2000);
                        }}
                        className={`flex-shrink-0 gap-2 transition-all ${copiedId ? "bg-green-500 text-white hover:bg-green-600" : ""}`}
                      >
                        {copiedId ? (
                          <>
                            <Check className="h-4 w-4" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                            <span>Copy ID</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      Quick Start
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-gray-700">
                            Using cURL
                          </h4>
                          <Button
                            variant={copiedCurl ? "default" : "ghost"}
                            size="sm"
                            onClick={() => {
                              const curlCommand = `curl -X POST https://network.formation.cloud/agent/${generateDisplayId(agent.agent_id)}/process \\
  -H "Content-Type: application/json" \\
  -d '{
    "input": "Your request here"
  }'`;
                              navigator.clipboard.writeText(curlCommand);
                              setCopiedCurl(true);
                              toast.success("cURL command copied!", {
                                duration: 2000,
                                className:
                                  "bg-green-50 text-green-900 border border-green-200",
                              });
                              setTimeout(() => setCopiedCurl(false), 2000);
                            }}
                            className={`h-8 px-2 transition-all ${
                              copiedCurl
                                ? "bg-green-500 text-white hover:bg-green-600"
                                : "text-gray-500 hover:text-gray-900"
                            }`}
                          >
                            {copiedCurl ? (
                              <>
                                <Check className="h-4 w-4" />
                                <span className="ml-2">Copied!</span>
                              </>
                            ) : (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                  />
                                </svg>
                                <span className="ml-2">Copy</span>
                              </>
                            )}
                          </Button>
                        </div>
                        <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                          <pre className="p-4 text-sm overflow-x-auto language-bash">
                            <code>{`curl -X POST https://network.formation.cloud/agent/${generateDisplayId(agent.agent_id)}/process \\
  -H "Content-Type: application/json" \\
  -d '{
    "input": "Your request here"
  }'`}</code>
                          </pre>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-gray-700">
                            Using SDK
                          </h4>
                          <Button
                            variant={copiedSdk ? "default" : "ghost"}
                            size="sm"
                            onClick={() => {
                              const sdkCode = `import { FormationAgent } from '@formation/sdk';

const agent = new FormationAgent('${generateDisplayId(agent.agent_id)}');
const response = await agent.process({
  input: "Your request here"
});`;
                              navigator.clipboard.writeText(sdkCode);
                              setCopiedSdk(true);
                              toast.success("SDK code copied!", {
                                duration: 2000,
                                className:
                                  "bg-green-50 text-green-900 border border-green-200",
                              });
                              setTimeout(() => setCopiedSdk(false), 2000);
                            }}
                            className={`h-8 px-2 transition-all ${
                              copiedSdk
                                ? "bg-green-500 text-white hover:bg-green-600"
                                : "text-gray-500 hover:text-gray-900"
                            }`}
                          >
                            {copiedSdk ? (
                              <>
                                <Check className="h-4 w-4" />
                                <span className="ml-2">Copied!</span>
                              </>
                            ) : (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                  />
                                </svg>
                                <span className="ml-2">Copy</span>
                              </>
                            )}
                          </Button>
                        </div>
                        <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                          <pre className="p-4 text-sm overflow-x-auto language-typescript">
                            <code>{`import { FormationAgent } from '@formation/sdk';

const agent = new FormationAgent('${generateDisplayId(agent.agent_id)}');
const response = await agent.process({
  input: "Your request here"
});`}</code>
                          </pre>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-start gap-2 text-sm text-gray-600">
                      <svg
                        className="w-5 h-5 text-blue-500 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p>
                        Check out the{" "}
                        <Link
                          href="#"
                          className="text-blue-600 hover:underline"
                        >
                          documentation
                        </Link>{" "}
                        for more examples and advanced usage.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <h2 className="text-2xl font-semibold text-gray-900">
                            Hire {agent.name}
                          </h2>
                          <div className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                            Connected as {user?.email?.split("@")[0]}
                          </div>
                        </div>
                        <p className="text-gray-600 mb-6">
                          {agent.description}
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-500 mb-1">
                              Price
                            </div>
                            <div className="text-lg font-semibold text-[#0A84FF]">
                              ${agent.price_per_request} per request
                            </div>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-500 mb-1">
                              Rating
                            </div>
                            <div className="text-lg font-semibold text-gray-900">
                              {agent.average_rating.toFixed(1)}/5.0
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4 mb-6">
                          <h3 className="text-sm font-medium text-gray-900">
                            What you get:
                          </h3>
                          <ul className="space-y-3">
                            {agent.capabilities.map((capability, index) => (
                              <li
                                key={index}
                                className="flex items-center gap-2 text-gray-600"
                              >
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                <span>{capability}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Button
                          size="lg"
                          onClick={handleHire}
                          disabled={isHiring}
                          className="w-full bg-[#0A84FF] hover:bg-[#0A84FF]/90"
                        >
                          {isHiring ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Hiring Agent...</span>
                            </div>
                          ) : (
                            "Hire Agent Now"
                          )}
                        </Button>
                      </div>

                      <div className="w-px h-64 bg-gray-200 hidden lg:block" />

                      <div className="hidden lg:block w-72">
                        <h3 className="text-sm font-medium text-gray-900 mb-3">
                          Usage Stats
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <div className="text-sm text-gray-500">
                              Total Uses
                            </div>
                            <div className="text-lg font-semibold text-gray-900">
                              {agent.usage_count.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">
                              Active Users
                            </div>
                            <div className="text-lg font-semibold text-gray-900">
                              {agent.active_users?.toLocaleString() || "1,000+"}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">
                              Response Time
                            </div>
                            <div className="text-lg font-semibold text-gray-900">
                              {agent.avg_response_time_ms}ms
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    if (hiringStatus === "success") {
      Prism.highlightAll();
    }
  }, [hiringStatus]);

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
        <div className="text-red-600">
          Error: {error || "Failed to load agent details"}
        </div>
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
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500">Type</div>
                    <div className="text-sm font-medium text-gray-900">
                      {safeAccess(agent, "agent_type")}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Framework</div>
                    <div className="text-sm font-medium text-gray-900">
                      {safeAccess(agent, "framework")}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Rating</div>
                    <div className="text-sm font-medium text-green-600">
                      {safeAccess(agent, "average_rating", 0).toFixed(1)}/5.0
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Usage
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500">Total Uses</div>
                    <div className="text-sm font-medium text-gray-900">
                      {safeAccess(agent, "usage_count", 0).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Deployments</div>
                    <div className="text-sm font-medium text-gray-900">
                      {safeAccess(
                        agent,
                        "deployment_count",
                        0
                      ).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {safeAccess(agent, "tags", []).map((tag, index) => (
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
                    <h1 className="text-xl lg:text-2xl font-semibold text-gray-900">
                      {safeAccess(agent, "name")}
                    </h1>
                    <span className="px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                      {safeAccess(agent, "agent_type")}
                    </span>
                  </div>
                  <p className="text-sm lg:text-base text-gray-600 max-w-2xl">
                    {safeAccess(agent, "description")}
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
                    onClick={handleHireClick}
                    className={`w-full sm:w-auto ${
                      hiringStatus === "success"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-[#0A84FF] hover:bg-[#0A84FF]/90"
                    }`}
                  >
                    {hiringStatus === "success"
                      ? "VIEW HIRED AGENT"
                      : "HIRE AGENT"}
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
            <AnimatePresence mode="wait">{renderTabContent()}</AnimatePresence>
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
