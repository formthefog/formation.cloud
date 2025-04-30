"use client";

import "./styles.css";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChartBarIcon,
  CogIcon,
  BoltIcon,
  RocketLaunchIcon,
  CommandLineIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  DocumentMagnifyingGlassIcon,
  CircleStackIcon,
  CloudIcon,
  ShieldCheckIcon,
  PresentationChartLineIcon,
  DocumentDuplicateIcon,
  ArrowRightIcon,
  KeyIcon,
  StarIcon,
  CpuChipIcon,
  CubeIcon,
  ServerIcon,
  BanknotesIcon,
  ClockIcon,
  InformationCircleIcon,
  ChevronDownIcon,
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  PlusIcon,
  XMarkIcon,
  ArrowTrendingUpIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import { AuthButton } from "@/components/AuthButton";
import { useAuth } from "@/components/auth-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Define the interface for agent deployments based on the provided example
interface AgentDeployment {
  id: string;
  integration_id: string | null;
  commit_sha: string | null;
  status: "pending" | "running" | "stopped" | "failed";
  deployment_url: string | null;
  logs: string | null;
  created_at: string;
  updated_at: string;
  agent_id: string;
  account_id: string;
  do_id: string | null;
  config: {
    cpu: number;
    name: string;
    model: string;
    avatar: string | null;
    memory: number;
    description: string;
    temperature: number;
  };
  agent: {
    name: string;
    tags: string[];
    tools: {
      id: string;
      name: string;
      description: string;
    }[];
    uptime: number;
    license: string;
    runtime: string;
    version: string;
    agent_id: string;
    metadata: {
      data_sources: string[];
      example_prompts: string[];
      supported_models: string[];
      analysis_capabilities: string[];
    };
    owner_id: string;
    framework: string;
    agent_type: string;
    created_at: string;
    error_rate: number;
    has_memory: boolean;
    is_private: boolean;
    updated_at: string;
    description: string;
    is_featured: boolean;
    usage_count: number;
    active_users: number;
    capabilities: string[];
    monthly_cost: number;
    success_rate: number;
    avg_cpu_usage: number;
    avg_memory_mb: number;
    documentation: string;
    average_rating: number;
    total_requests: number;
    network_io_mbps: number;
    cost_per_request: number;
    deployment_count: number;
    price_per_request: number | null;
    active_deployments: number;
    has_internet_access: boolean;
    total_runtime_hours: number;
    avg_response_time_ms: number;
    has_filesystem_access: boolean;
    resource_requirements: {
      min_vcpus: number;
      min_disk_gb: number;
      requires_gpu: boolean;
      min_memory_mb: number;
      recommended_vcpus: number;
      recommended_disk_gb: number;
      recommended_memory_mb: number;
    };
    has_external_api_access: boolean;
  };
}

// Generate some mock data for the agent activity timeline
const generateMockActivityTimeline = () => {
  const activities = [
    "Processed user query about financial metrics",
    "Retrieved stock data for AAPL",
    "Analyzed market trends for semiconductor industry",
    "Generated quarterly financial report",
    "Updated market data cache",
    "Responded to complex query about automotive sector",
    "Executed financial forecast model",
    "Retrieved company news for Tesla",
  ];

  return Array(8)
    .fill(0)
    .map((_, index) => {
      const minutesAgo = Math.floor(Math.random() * 60);
      const hoursAgo = Math.floor(Math.random() * 4);
      const timestamp = new Date();
      timestamp.setHours(timestamp.getHours() - hoursAgo);
      timestamp.setMinutes(timestamp.getMinutes() - minutesAgo);

      return {
        id: `activity-${index}`,
        activity: activities[index % activities.length],
        timestamp: timestamp.toISOString(),
        formattedTime:
          hoursAgo > 0
            ? `${hoursAgo}h ${minutesAgo}m ago`
            : `${minutesAgo}m ago`,
      };
    })
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
};

// Generate usage data for charts
const generateUsageData = () => {
  return Array(7)
    .fill(0)
    .map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));

      return {
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        requests: Math.floor(Math.random() * 150) + 50,
        cpuUsage: Math.floor(Math.random() * 40) + 20,
        memoryUsage: Math.floor(Math.random() * 500) + 200,
      };
    });
};

// Generate storage data for pie chart
const generateStorageData = () => {
  return [
    { name: "Used", value: 128 },
    { name: "Free", value: 384 },
  ];
};

// Define the colors for the pie chart
const STORAGE_COLORS = ["#0A84FF", "#E2E8F0"];

// Mock conversation history
const mockConversationHistory = [
  {
    id: "msg-1",
    role: "user",
    content: "What are the latest performance metrics for Apple stock?",
    timestamp: "2025-04-30T13:45:23Z",
  },
  {
    id: "msg-2",
    role: "agent",
    content:
      "Apple (AAPL) is currently trading at $198.45, up 2.3% today. The company reported strong Q2 earnings last week with revenue of $94.8 billion, exceeding analyst expectations. Key metrics include:\n\n- EPS: $1.52 (vs $1.43 expected)\n- Gross margin: 46.5%\n- Services revenue: $22.3 billion (up 18.5% YoY)\n- iPhone revenue: $46.2 billion\n\nThe stock has gained 8.7% over the past month and is trading above both its 50-day and 200-day moving averages, indicating bullish momentum.",
    timestamp: "2025-04-30T13:45:52Z",
  },
  {
    id: "msg-3",
    role: "user",
    content: "How does this compare to other tech companies this quarter?",
    timestamp: "2025-04-30T13:46:15Z",
  },
  {
    id: "msg-4",
    role: "agent",
    content:
      "Compared to other major tech companies this quarter:\n\n- Microsoft: Revenue up 17%, EPS $2.84 (beat by $0.22)\n- Google: Revenue up 15%, EPS $1.89 (beat by $0.15)\n- Amazon: Revenue up 12%, EPS $0.98 (beat by $0.07)\n- Meta: Revenue up 22%, EPS $4.71 (beat by $0.63)\n\nApple's 2.3% growth is lower than peers, but its margins remain industry-leading. Meta showed the strongest performance with 22% revenue growth. All major tech companies exceeded analyst expectations this quarter, contributing to the tech sector outperforming the broader market by approximately 6.8% YTD.",
    timestamp: "2025-04-30T13:47:05Z",
  },
];

export default function CommandCenterPage() {
  const isLoggedIn = useIsLoggedIn();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAgentType, setSelectedAgentType] = useState<string>("all");
  const [selectedAgent, setSelectedAgent] = useState<AgentDeployment | null>(
    null
  );
  const [showChatDialog, setShowChatDialog] = useState(false);
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [showStorageDialog, setShowStorageDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState(mockConversationHistory);
  const [promptInput, setPromptInput] = useState("");
  const [activityTimeline, setActivityTimeline] = useState(
    generateMockActivityTimeline()
  );
  const [usageData, setUsageData] = useState(generateUsageData());
  const [storageData, setStorageData] = useState(generateStorageData());
  const [isAddingStorage, setIsAddingStorage] = useState(false);
  const [selectedStorageProvider, setSelectedStorageProvider] = useState("");

  const { user, accounts } = useAuth();

  // Initialize with the finance agent from the example
  const [deployments, setDeployments] = useState<AgentDeployment[]>([
    {
      id: "5c50f0e9-82c6-4daf-9ec3-eb28c7dad40b",
      integration_id: null,
      commit_sha: null,
      status: "running", // Changed from pending to running for demo
      deployment_url: null,
      logs: null,
      created_at: "2025-04-30T14:03:19.098+00:00",
      updated_at: "2025-04-30T14:03:19.098+00:00",
      agent_id: "1af9cf0e-de4f-4bed-9659-ca314de68790",
      account_id: "93ce6b4e-49c3-4137-aaa0-052d3e49a1a5",
      do_id: null,
      config: {
        cpu: 2,
        name: "Finance Agent",
        model: "gpt-4",
        avatar: null,
        memory: 2048,
        description: "Automate financial analysis and reporting tasks.",
        temperature: 0.7,
      },
      agent: {
        name: "Finance Agent",
        tags: [
          "finance",
          "stocks",
          "market_analysis",
          "investment",
          "wall_street",
          "financial_metrics",
        ],
        tools: [
          {
            id: "yfinance_tools",
            name: "Yahoo Finance Tools",
            description:
              "Access to real-time and historical financial data, including stock prices, company fundamentals, analyst recommendations, and financial news",
          },
        ],
        uptime: 99.9,
        license: "MIT",
        runtime: "python",
        version: "1.0.0",
        agent_id: "1af9cf0e-de4f-4bed-9659-ca314de68790",
        metadata: {
          data_sources: ["Yahoo Finance"],
          example_prompts: [
            "What's the latest news and financial performance of Apple (AAPL)?",
            "Analyze the semiconductor market performance focusing on NVIDIA (NVDA), AMD (AMD), Intel (INTC), and Taiwan Semiconductor (TSM)",
            "Evaluate the automotive industry's current state: Tesla (TSLA), Ford (F), General Motors (GM), Toyota (TM)",
          ],
          supported_models: ["gpt-4o"],
          analysis_capabilities: [
            "stock_price",
            "analyst_recommendations",
            "stock_fundamentals",
            "historical_prices",
            "company_info",
            "company_news",
          ],
        },
        owner_id: "93ce6b4e-49c3-4137-aaa0-052d3e49a1a5",
        framework: "agno",
        agent_type: "financial_analysis",
        created_at: "2025-04-30T07:40:47.416+00:00",
        error_rate: 2.5,
        has_memory: false,
        is_private: false,
        updated_at: "2025-04-30T07:40:47.416+00:00",
        description:
          "A seasoned Wall Street analyst with deep expertise in market analysis, providing comprehensive financial insights and stock analysis.",
        is_featured: false,
        usage_count: 132, // Added some usage for demo
        active_users: 7, // Added active users for demo
        capabilities: [
          "stock_analysis",
          "company_research",
          "market_trends",
          "financial_metrics",
          "investment_insights",
        ],
        monthly_cost: 42.8, // Added cost for demo
        success_rate: 97.5,
        avg_cpu_usage: 30,
        avg_memory_mb: 256,
        documentation:
          "## Finance Agent\n\nThis agent provides professional-grade financial and stock market analysis with the expertise of a Wall Street analyst.",
        average_rating: 4.7, // Added rating for demo
        total_requests: 1283, // Added requests for demo
        network_io_mbps: 3,
        cost_per_request: 0.01,
        deployment_count: 1,
        price_per_request: null,
        active_deployments: 1,
        has_internet_access: true,
        total_runtime_hours: 78, // Added runtime hours for demo
        avg_response_time_ms: 4000,
        has_filesystem_access: false,
        resource_requirements: {
          min_vcpus: 1,
          min_disk_gb: 1,
          requires_gpu: false,
          min_memory_mb: 512,
          recommended_vcpus: 2,
          recommended_disk_gb: 2,
          recommended_memory_mb: 1024,
        },
        has_external_api_access: true,
      },
    },
  ]);

  // For the demo, let's add a couple more mock agents to showcase the fleet management capabilities
  const mockAgents: AgentDeployment[] = [
    {
      id: "a2f9ab23-74c1-4e56-8901-c72d3efg5h6i",
      integration_id: null,
      commit_sha: null,
      status: "running",
      deployment_url: null,
      logs: null,
      created_at: "2025-04-27T09:15:32.098+00:00",
      updated_at: "2025-04-30T10:22:41.098+00:00",
      agent_id: "43b7cd8f-12e3-4f56-a789-0bc1d2e3f4g5",
      account_id: "93ce6b4e-49c3-4137-aaa0-052d3e49a1a5",
      do_id: null,
      config: {
        cpu: 4,
        name: "Research Assistant",
        model: "gpt-4o",
        avatar: null,
        memory: 4096,
        description: "Advanced research and document analysis agent",
        temperature: 0.5,
      },
      agent: {
        name: "Research Assistant",
        tags: [
          "research",
          "document_analysis",
          "academic",
          "literature_review",
          "data_extraction",
        ],
        tools: [
          {
            id: "web_search",
            name: "Web Search",
            description: "Search the web for current information",
          },
          {
            id: "document_reader",
            name: "Document Reader",
            description:
              "Extract and analyze information from PDFs, DOCs, and other document formats",
          },
        ],
        uptime: 99.7,
        license: "MIT",
        runtime: "python",
        version: "1.2.1",
        agent_id: "43b7cd8f-12e3-4f56-a789-0bc1d2e3f4g5",
        metadata: {
          data_sources: [
            "Web Search",
            "Academic Databases",
            "Document Processing",
          ],
          example_prompts: [
            "Analyze this research paper and summarize the key findings",
            "Find recent studies on renewable energy efficiency improvements",
            "Extract all citations from this document and format them in APA style",
          ],
          supported_models: ["gpt-4o", "claude-3-opus"],
          analysis_capabilities: [
            "text_extraction",
            "citation_analysis",
            "literature_review",
            "data_synthesis",
            "trend_analysis",
          ],
        },
        owner_id: "93ce6b4e-49c3-4137-aaa0-052d3e49a1a5",
        framework: "langchain",
        agent_type: "research",
        created_at: "2025-04-15T11:35:22.416+00:00",
        error_rate: 1.8,
        has_memory: true,
        is_private: false,
        updated_at: "2025-04-29T16:40:12.416+00:00",
        description:
          "An advanced research assistant capable of analyzing documents, extracting data, and synthesizing information from multiple sources.",
        is_featured: true,
        usage_count: 2478,
        active_users: 15,
        capabilities: [
          "document_analysis",
          "literature_review",
          "data_extraction",
          "trend_identification",
          "citation_management",
        ],
        monthly_cost: 86.5,
        success_rate: 98.2,
        avg_cpu_usage: 45,
        avg_memory_mb: 1024,
        documentation:
          "## Research Assistant\n\nThis agent helps with academic and professional research by analyzing documents and synthesizing information.",
        average_rating: 4.8,
        total_requests: 8945,
        network_io_mbps: 5,
        cost_per_request: 0.02,
        deployment_count: 1,
        price_per_request: null,
        active_deployments: 1,
        has_internet_access: true,
        total_runtime_hours: 326,
        avg_response_time_ms: 5200,
        has_filesystem_access: true,
        resource_requirements: {
          min_vcpus: 2,
          min_disk_gb: 5,
          requires_gpu: false,
          min_memory_mb: 2048,
          recommended_vcpus: 4,
          recommended_disk_gb: 10,
          recommended_memory_mb: 4096,
        },
        has_external_api_access: true,
      },
    },
    {
      id: "c4d5e6f7-89a0-4b1c-d2e3-f4g5h6i7j8k9",
      integration_id: null,
      commit_sha: null,
      status: "stopped",
      deployment_url: null,
      logs: null,
      created_at: "2025-04-22T16:42:11.098+00:00",
      updated_at: "2025-04-30T08:15:37.098+00:00",
      agent_id: "9b8c7d6e-5f4e-3d2c-1b0a-9f8e7d6c5b4a",
      account_id: "93ce6b4e-49c3-4137-aaa0-052d3e49a1a5",
      do_id: null,
      config: {
        cpu: 8,
        name: "Code Assistant",
        model: "claude-3-opus",
        avatar: null,
        memory: 8192,
        description: "Advanced coding assistant for software development",
        temperature: 0.2,
      },
      agent: {
        name: "Code Assistant",
        tags: [
          "coding",
          "software_development",
          "debugging",
          "code_review",
          "documentation",
        ],
        tools: [
          {
            id: "code_interpreter",
            name: "Code Interpreter",
            description:
              "Execute and debug code in multiple programming languages",
          },
          {
            id: "github_integration",
            name: "GitHub Integration",
            description:
              "Connect to GitHub repositories for code analysis and version control",
          },
        ],
        uptime: 99.5,
        license: "Apache-2.0",
        runtime: "node",
        version: "2.0.0",
        agent_id: "9b8c7d6e-5f4e-3d2c-1b0a-9f8e7d6c5b4a",
        metadata: {
          data_sources: ["GitHub", "StackOverflow", "Documentation Sites"],
          example_prompts: [
            "Debug this Python function that's causing an IndexError",
            "Refactor this React component to use hooks instead of class components",
            "Generate unit tests for this TypeScript class",
          ],
          supported_models: ["claude-3-opus", "gpt-4o"],
          analysis_capabilities: [
            "code_review",
            "bug_detection",
            "refactoring",
            "optimization",
            "documentation_generation",
          ],
        },
        owner_id: "93ce6b4e-49c3-4137-aaa0-052d3e49a1a5",
        framework: "langchain",
        agent_type: "code",
        created_at: "2025-04-10T08:22:15.416+00:00",
        error_rate: 1.2,
        has_memory: true,
        is_private: false,
        updated_at: "2025-04-28T14:10:33.416+00:00",
        description:
          "A powerful coding assistant that helps with software development, debugging, refactoring, and code optimization across multiple programming languages.",
        is_featured: true,
        usage_count: 5632,
        active_users: 0, // Currently stopped
        capabilities: [
          "code_generation",
          "debugging",
          "refactoring",
          "optimization",
          "documentation",
        ],
        monthly_cost: 145.8,
        success_rate: 98.8,
        avg_cpu_usage: 65,
        avg_memory_mb: 3584,
        documentation:
          "## Code Assistant\n\nThis agent provides advanced coding assistance for software development tasks across multiple programming languages.",
        average_rating: 4.9,
        total_requests: 12754,
        network_io_mbps: 7,
        cost_per_request: 0.03,
        deployment_count: 1,
        price_per_request: null,
        active_deployments: 0, // Currently stopped
        has_internet_access: true,
        total_runtime_hours: 487,
        avg_response_time_ms: 6500,
        has_filesystem_access: true,
        resource_requirements: {
          min_vcpus: 4,
          min_disk_gb: 10,
          requires_gpu: true,
          min_memory_mb: 4096,
          recommended_vcpus: 8,
          recommended_disk_gb: 20,
          recommended_memory_mb: 8192,
        },
        has_external_api_access: true,
      },
    },
  ];

  // Fetch deployments after authentication and combine with mock data
  useEffect(() => {
    const fetchDeployments = async () => {
      if (!isLoggedIn || !accounts || !accounts[0]?.id) return;
      try {
        const response = await fetch(
          `/api/deployments?account_id=${accounts[0].id}`
        );
        if (response.ok) {
          const { deployments: apiDeployments } = await response.json();
          // Combine real deployments with mock data for demo purposes
          setDeployments([...apiDeployments, ...mockAgents]);
        }
      } catch (err) {
        // If error, just use the finance agent and mock data
        setDeployments([...deployments, ...mockAgents]);
      }
    };
    fetchDeployments();
  }, [isLoggedIn, accounts]);

  // Calculate aggregated stats from deployments
  const stats = {
    activeAgents: deployments.filter((d) => d.status === "running").length,
    totalAgents: deployments.length,
    totalRequests: deployments.reduce(
      (sum, d) => sum + d.agent.total_requests,
      0
    ),
    avgSuccessRate:
      deployments.length > 0
        ? (
            deployments.reduce((sum, d) => sum + d.agent.success_rate, 0) /
            deployments.length
          ).toFixed(1)
        : 0,
    totalCost: deployments
      .reduce((sum, d) => sum + d.agent.monthly_cost, 0)
      .toFixed(2),
    avgResponseTime:
      deployments.length > 0
        ? (
            deployments.reduce(
              (sum, d) => sum + d.agent.avg_response_time_ms,
              0
            ) / deployments.length
          ).toFixed(0)
        : 0,
  };

  // Get icon for agent type
  const getAgentIcon = (agentType: string) => {
    switch (agentType) {
      case "code":
        return <CommandLineIcon className="w-6 h-6" />;
      case "research":
        return <DocumentMagnifyingGlassIcon className="w-6 h-6" />;
      case "financial_analysis":
        return <ChartBarIcon className="w-6 h-6" />;
      case "assistant":
        return <ChatBubbleLeftRightIcon className="w-6 h-6" />;
      case "analysis":
        return <PresentationChartLineIcon className="w-6 h-6" />;
      case "security":
        return <ShieldCheckIcon className="w-6 h-6" />;
      case "data":
        return <CircleStackIcon className="w-6 h-6" />;
      case "cloud":
        return <CloudIcon className="w-6 h-6" />;
      case "nlp":
        return <DocumentDuplicateIcon className="w-6 h-6" />;
      default:
        return <CogIcon className="w-6 h-6" />;
    }
  };

  // Get color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "stopped":
        return "bg-gray-400";
      case "failed":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  // Get color based on load percentage
  const getLoadColor = (load: number) => {
    if (load >= 90) return "text-red-500";
    if (load >= 70) return "text-yellow-500";
    return "text-green-500";
  };

  // Format bytes to human-readable format
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  // Filter agents based on search and type selection
  const filteredAgents = deployments.filter(
    (agent) =>
      (selectedAgentType === "all" ||
        agent.agent.agent_type === selectedAgentType) &&
      (agent.config.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.agent.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()))
  );

  // Extract unique agent types from deployments
  const agentTypes = Array.from(
    new Set(deployments.map((agent) => agent.agent.agent_type))
  );

  // Handle sending a new message in the chat
  const handleSendMessage = () => {
    if (!chatInput.trim() || !selectedAgent) return;

    const newUserMessage = {
      id: `msg-${messages.length + 1}`,
      role: "user",
      content: chatInput,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newUserMessage]);
    setChatInput("");

    // Simulate agent response after a short delay
    setTimeout(() => {
      const newAgentMessage = {
        id: `msg-${messages.length + 2}`,
        role: "agent",
        content: `I've analyzed your request about "${chatInput.substring(0, 30)}${chatInput.length > 30 ? "..." : ""}" and would like to provide the following insights: [This would be a real response from the ${selectedAgent.config.name} using the ${selectedAgent.config.model} model]`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prevMessages) => [...prevMessages, newAgentMessage]);
    }, 1500);
  };

  // Handle updating the initialization prompt
  const handleUpdatePrompt = () => {
    if (!promptInput.trim() || !selectedAgent) return;
    // In a real implementation, this would make an API call to update the agent's prompt
    setShowConfigDialog(false);
  };

  // Handle adding storage integration
  const handleAddStorage = () => {
    if (!selectedStorageProvider || !selectedAgent) return;
    // In a real implementation, this would make an API call to add storage integration
    setIsAddingStorage(false);
    setShowStorageDialog(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {isLoggedIn ? (
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Command Center Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                Agent Command HQ
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </span>
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Your mission control for AI agent operations and management.
              </p>
            </div>
            <Link href="/marketplace/getting-started/create">
              <Button className="bg-[#0A84FF] hover:bg-[#0A84FF]/90 flex items-center gap-2">
                <RocketLaunchIcon className="w-5 h-5" />
                Deploy New Agent
              </Button>
            </Link>
          </div>

          {/* Dashboard Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Active Agents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    {stats.activeAgents}/{stats.totalAgents}
                  </div>
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <ServerIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {((stats.activeAgents / stats.totalAgents) * 100).toFixed(0)}%
                  deployment rate
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    {stats.totalRequests.toLocaleString()}
                  </div>
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                    <BoltIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Avg. Response: {stats.avgResponseTime}ms
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Success Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    {stats.avgSuccessRate}%
                  </div>
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <CheckCircleIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {(100 - parseFloat(stats.avgSuccessRate.toString())).toFixed(
                    1
                  )}
                  % error rate
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Monthly Cost
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">${stats.totalCost}</div>
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <BanknotesIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  $
                  {(parseFloat(stats.totalCost) / stats.totalAgents).toFixed(2)}{" "}
                  per agent avg.
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Fleet Overview and Agent Directory */}
            <div className="lg:col-span-2 space-y-8">
              {/* Agent Directory */}
              <Card className="bg-white dark:bg-gray-800 shadow-sm">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle>Agent Directory</CardTitle>
                  <div className="flex items-center gap-2">
                    {/* Search input */}
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search agents..."
                        className="pl-9 w-48 md:w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    {/* Filter by type */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <AdjustmentsHorizontalIcon className="h-4 w-4" />
                          <span className="hidden md:inline">Filter</span>
                          <ChevronDownIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setSelectedAgentType("all")}
                          className={
                            selectedAgentType === "all"
                              ? "bg-blue-50 dark:bg-blue-900/20"
                              : ""
                          }
                        >
                          All Types
                        </DropdownMenuItem>
                        {agentTypes.map((type) => (
                          <DropdownMenuItem
                            key={type}
                            onClick={() => setSelectedAgentType(type)}
                            className={
                              selectedAgentType === type
                                ? "bg-blue-50 dark:bg-blue-900/20"
                                : ""
                            }
                          >
                            {type.charAt(0).toUpperCase() +
                              type.slice(1).replace("_", " ")}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredAgents.length > 0 ? (
                      filteredAgents.map((agent) => (
                        <div
                          key={agent.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-white dark:bg-gray-800"
                          onClick={() => setSelectedAgent(agent)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                {getAgentIcon(agent.agent.agent_type)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium text-gray-900 dark:text-white">
                                    {agent.config.name}
                                  </h3>
                                  <div
                                    className={`h-2 w-2 rounded-full ${getStatusColor(agent.status)}`}
                                  ></div>
                                  <span className="text-xs text-gray-500 capitalize">
                                    {agent.status}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {agent.config.description}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {agent.agent.tags.slice(0, 3).map((tag) => (
                                    <Badge
                                      key={tag}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {tag.replace("_", " ")}
                                    </Badge>
                                  ))}
                                  {agent.agent.tags.length > 3 && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      +{agent.agent.tags.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {agent.agent.total_requests.toLocaleString()}{" "}
                                requests
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {agent.agent.success_rate}% success rate
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                <span
                                  className={getLoadColor(
                                    agent.agent.avg_cpu_usage
                                  )}
                                >
                                  CPU: {agent.agent.avg_cpu_usage}%
                                </span>{" "}
                                |{" "}
                                {formatBytes(
                                  agent.agent.avg_memory_mb * 1024 * 1024
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                          <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          No agents found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          Try adjusting your search or filter criteria
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Usage Analytics */}
              <Card className="bg-white dark:bg-gray-800 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle>Usage Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={usageData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="requests"
                          stroke="#0A84FF"
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="cpuUsage"
                          stroke="#10B981"
                        />
                        <Line
                          type="monotone"
                          dataKey="memoryUsage"
                          stroke="#6366F1"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Agent Detail and Activity Feed */}
            <div className="space-y-8">
              {/* Selected Agent Details or Welcome */}
              {selectedAgent ? (
                <Card className="bg-white dark:bg-gray-800 shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          {getAgentIcon(selectedAgent.agent.agent_type)}
                        </div>
                        <CardTitle>{selectedAgent.config.name}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <CogIcon className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => setShowChatDialog(true)}
                            >
                              <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                              Chat with Agent
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setShowConfigDialog(true)}
                            >
                              <Cog6ToothIcon className="h-4 w-4 mr-2" />
                              Configure Agent
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setShowStorageDialog(true)}
                            >
                              <CircleStackIcon className="h-4 w-4 mr-2" />
                              Manage Storage
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ArrowPathIcon className="h-4 w-4 mr-2" />
                              {selectedAgent.status === "running"
                                ? "Stop Agent"
                                : "Start Agent"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs
                      value={activeTab}
                      onValueChange={setActiveTab}
                      className="w-full"
                    >
                      <TabsList className="grid grid-cols-3 mb-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="performance">
                          Performance
                        </TabsTrigger>
                        <TabsTrigger value="config">Configuration</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">
                            Description
                          </h4>
                          <p className="text-sm text-gray-900 dark:text-gray-100">
                            {selectedAgent.agent.description}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">
                            Capabilities
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedAgent.agent.capabilities.map(
                              (capability) => (
                                <Badge
                                  key={capability}
                                  className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                >
                                  {capability.replace("_", " ")}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">
                              Tools
                            </h4>
                            <ul className="text-sm space-y-1">
                              {selectedAgent.agent.tools.map((tool) => (
                                <li
                                  key={tool.id}
                                  className="flex items-center gap-2"
                                >
                                  <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                                  {tool.name}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">
                              Resources
                            </h4>
                            <ul className="text-sm space-y-1">
                              <li className="flex items-center justify-between">
                                <span>CPU:</span>
                                <span>{selectedAgent.config.cpu} vCPUs</span>
                              </li>
                              <li className="flex items-center justify-between">
                                <span>Memory:</span>
                                <span>{selectedAgent.config.memory} MB</span>
                              </li>
                              <li className="flex items-center justify-between">
                                <span>Model:</span>
                                <span>{selectedAgent.config.model}</span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">
                            Example Prompts
                          </h4>
                          <ul className="text-sm space-y-2">
                            {selectedAgent.agent.metadata.example_prompts.map(
                              (prompt, idx) => (
                                <li
                                  key={idx}
                                  className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700"
                                >
                                  "{prompt}"
                                </li>
                              )
                            )}
                          </ul>
                        </div>

                        <div className="flex items-center justify-center gap-4 pt-2">
                          <Button
                            onClick={() => setShowChatDialog(true)}
                            className="flex-1 bg-[#0A84FF] hover:bg-[#0A84FF]/90"
                          >
                            <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                            Chat with Agent
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setShowConfigDialog(true)}
                            className="flex-1"
                          >
                            <Cog6ToothIcon className="h-5 w-5 mr-2" />
                            Configure
                          </Button>
                        </div>
                      </TabsContent>

                      <TabsContent value="performance" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">
                              Success Rate
                            </h4>
                            <div className="flex items-center gap-2">
                              <div className="text-2xl font-bold">
                                {selectedAgent.agent.success_rate}%
                              </div>
                              <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
                            </div>
                            <Progress
                              value={selectedAgent.agent.success_rate}
                              className="h-2 mt-2"
                            />
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">
                              Response Time
                            </h4>
                            <div className="text-2xl font-bold">
                              {selectedAgent.agent.avg_response_time_ms} ms
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Average over all requests
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">
                            Resource Utilization
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm">CPU Usage</span>
                                <span
                                  className={`text-sm ${getLoadColor(selectedAgent.agent.avg_cpu_usage)}`}
                                >
                                  {selectedAgent.agent.avg_cpu_usage}%
                                </span>
                              </div>
                              <Progress
                                value={selectedAgent.agent.avg_cpu_usage}
                                className={`h-2 ${
                                  selectedAgent.agent.avg_cpu_usage >= 90
                                    ? "bg-red-500"
                                    : selectedAgent.agent.avg_cpu_usage >= 70
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                }`}
                              />
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm">Memory Usage</span>
                                <span className="text-sm">
                                  {selectedAgent.agent.avg_memory_mb} MB /{" "}
                                  {selectedAgent.config.memory} MB
                                </span>
                              </div>
                              <Progress
                                value={
                                  (selectedAgent.agent.avg_memory_mb /
                                    selectedAgent.config.memory) *
                                  100
                                }
                                className="h-2"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">
                            Storage Usage
                          </h4>
                          <div className="h-[150px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={storageData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={40}
                                  outerRadius={60}
                                  fill="#8884d8"
                                  paddingAngle={5}
                                  dataKey="value"
                                  label={({ name, percent }) =>
                                    `${name} ${(percent * 100).toFixed(0)}%`
                                  }
                                >
                                  {storageData.map((entry, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={
                                        STORAGE_COLORS[
                                          index % STORAGE_COLORS.length
                                        ]
                                      }
                                    />
                                  ))}
                                </Pie>
                                <Tooltip />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">
                            Cost Analysis
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-lg font-bold">
                                ${selectedAgent.agent.monthly_cost.toFixed(2)}
                              </div>
                              <div className="text-xs text-gray-500">
                                Monthly cost
                              </div>
                            </div>
                            <div>
                              <div className="text-lg font-bold">
                                $
                                {selectedAgent.agent.cost_per_request.toFixed(
                                  3
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                Cost per request
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="config" className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">
                            Agent Details
                          </h4>
                          <ul className="text-sm space-y-2">
                            <li className="flex items-center justify-between">
                              <span>Agent ID:</span>
                              <code className="text-xs bg-gray-100 dark:bg-gray-800 p-1 rounded">
                                {selectedAgent.agent_id}
                              </code>
                            </li>
                            <li className="flex items-center justify-between">
                              <span>Deployment ID:</span>
                              <code className="text-xs bg-gray-100 dark:bg-gray-800 p-1 rounded">
                                {selectedAgent.id}
                              </code>
                            </li>
                            <li className="flex items-center justify-between">
                              <span>Created:</span>
                              <span>
                                {new Date(
                                  selectedAgent.created_at
                                ).toLocaleString()}
                              </span>
                            </li>
                            <li className="flex items-center justify-between">
                              <span>Framework:</span>
                              <span>{selectedAgent.agent.framework}</span>
                            </li>
                            <li className="flex items-center justify-between">
                              <span>Runtime:</span>
                              <span>{selectedAgent.agent.runtime}</span>
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">
                            Model Configuration
                          </h4>
                          <ul className="text-sm space-y-2">
                            <li className="flex items-center justify-between">
                              <span>Model:</span>
                              <span>{selectedAgent.config.model}</span>
                            </li>
                            <li className="flex items-center justify-between">
                              <span>Temperature:</span>
                              <span>{selectedAgent.config.temperature}</span>
                            </li>
                            <li className="flex items-center justify-between">
                              <span>Memory Enabled:</span>
                              <span>
                                {selectedAgent.agent.has_memory ? "Yes" : "No"}
                              </span>
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">
                            Access Controls
                          </h4>
                          <ul className="text-sm space-y-2">
                            <li className="flex items-center justify-between">
                              <span>Internet Access:</span>
                              <span>
                                {selectedAgent.agent.has_internet_access
                                  ? "Enabled"
                                  : "Disabled"}
                              </span>
                            </li>
                            <li className="flex items-center justify-between">
                              <span>Filesystem Access:</span>
                              <span>
                                {selectedAgent.agent.has_filesystem_access
                                  ? "Enabled"
                                  : "Disabled"}
                              </span>
                            </li>
                            <li className="flex items-center justify-between">
                              <span>External API Access:</span>
                              <span>
                                {selectedAgent.agent.has_external_api_access
                                  ? "Enabled"
                                  : "Disabled"}
                              </span>
                            </li>
                          </ul>
                        </div>

                        <div className="flex items-center justify-center gap-4 pt-2">
                          <Button
                            variant="outline"
                            onClick={() => setShowConfigDialog(true)}
                            className="flex-1"
                          >
                            <Cog6ToothIcon className="h-5 w-5 mr-2" />
                            Edit Configuration
                          </Button>
                          <Button variant="destructive" className="flex-1">
                            <XMarkIcon className="h-5 w-5 mr-2" />
                            Delete Deployment
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 shadow-sm">
                  <CardContent className="pt-6 text-center">
                    <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full inline-flex mb-4">
                      <SparklesIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      Select an Agent
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Choose an agent from the directory to view details and
                      manage its operations.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Activity Feed */}
              <Card className="bg-white dark:bg-gray-800 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activityTimeline.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 dark:text-gray-100">
                            {activity.activity}
                          </p>
                          <span className="text-xs text-gray-500">
                            {activity.formattedTime}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Agent Chat Dialog */}
          <Dialog open={showChatDialog} onOpenChange={setShowChatDialog}>
            <DialogContent className="sm:max-w-2xl h-[80vh] flex flex-col p-0 gap-0">
              <DialogHeader className="p-4 border-b">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {selectedAgent?.config.name.slice(0, 2).toUpperCase() ||
                        "AG"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-base font-semibold">
                      {selectedAgent?.config.name || "Agent"}
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                      {selectedAgent?.config.model || "AI Model"} •{" "}
                      {selectedAgent?.agent.avg_response_time_ms || 0}ms avg.
                      response
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user"
                          ? "bg-blue-100 dark:bg-blue-900/30 text-gray-900 dark:text-gray-100"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm">
                        {message.content}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 text-right">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t flex items-end gap-2">
                <Input
                  placeholder="Type your message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim()}
                  className="bg-[#0A84FF] hover:bg-[#0A84FF]/90"
                >
                  Send
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Agent Configuration Dialog */}
          <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Configure Agent</DialogTitle>
                <DialogDescription>
                  Update the configuration and initialization prompt for{" "}
                  {selectedAgent?.config.name}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Agent Resources</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500 block mb-1">
                        CPU (vCPUs)
                      </label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between"
                          >
                            {selectedAgent?.config.cpu || 2}
                            <ChevronDownIcon className="h-4 w-4 ml-2" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>1</DropdownMenuItem>
                          <DropdownMenuItem>2</DropdownMenuItem>
                          <DropdownMenuItem>4</DropdownMenuItem>
                          <DropdownMenuItem>8</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div>
                      <label className="text-sm text-gray-500 block mb-1">
                        Memory (MB)
                      </label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between"
                          >
                            {selectedAgent?.config.memory || 2048}
                            <ChevronDownIcon className="h-4 w-4 ml-2" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>1024</DropdownMenuItem>
                          <DropdownMenuItem>2048</DropdownMenuItem>
                          <DropdownMenuItem>4096</DropdownMenuItem>
                          <DropdownMenuItem>8192</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Model Settings</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500 block mb-1">
                        Model
                      </label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between"
                          >
                            {selectedAgent?.config.model || "gpt-4"}
                            <ChevronDownIcon className="h-4 w-4 ml-2" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>gpt-4</DropdownMenuItem>
                          <DropdownMenuItem>gpt-4o</DropdownMenuItem>
                          <DropdownMenuItem>claude-3-opus</DropdownMenuItem>
                          <DropdownMenuItem>claude-3-sonnet</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div>
                      <label className="text-sm text-gray-500 block mb-1">
                        Temperature
                      </label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between"
                          >
                            {selectedAgent?.config.temperature || 0.7}
                            <ChevronDownIcon className="h-4 w-4 ml-2" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>0.1</DropdownMenuItem>
                          <DropdownMenuItem>0.3</DropdownMenuItem>
                          <DropdownMenuItem>0.5</DropdownMenuItem>
                          <DropdownMenuItem>0.7</DropdownMenuItem>
                          <DropdownMenuItem>1.0</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">
                    Initialization Prompt
                  </label>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-md">
                    <div className="bg-gray-50 dark:bg-gray-900 px-3 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                      <CommandLineIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">
                        System Prompt
                      </span>
                    </div>
                    <textarea
                      value={
                        promptInput ||
                        (selectedAgent
                          ? `You are ${selectedAgent.config.name}, a helpful AI assistant with expertise in ${selectedAgent.agent.agent_type.replace("_", " ")}. Your goal is to assist the user by providing accurate and relevant information about ${selectedAgent.agent.tags.join(", ")}.`
                          : "")
                      }
                      onChange={(e) => setPromptInput(e.target.value)}
                      className="w-full px-3 py-2 text-sm font-mono bg-transparent focus:outline-none"
                      rows={8}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <InformationCircleIcon className="h-3 w-3" />
                    This prompt will be used to initialize the agent's behavior
                    and capabilities.
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowConfigDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdatePrompt}
                  className="bg-[#0A84FF] hover:bg-[#0A84FF]/90"
                >
                  Save Configuration
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Storage Management Dialog */}
          <Dialog open={showStorageDialog} onOpenChange={setShowStorageDialog}>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Manage Storage</DialogTitle>
                <DialogDescription>
                  Configure storage options for {selectedAgent?.config.name}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium">Current Storage</h3>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm">
                        <span className="font-medium">Local Storage</span>
                        <p className="text-gray-500 text-xs mt-1">
                          Temporary storage within the agent's container
                        </p>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">512 MB</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full mb-1">
                      <div
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: "25%" }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>128 MB used</span>
                      <span>384 MB free</span>
                    </div>
                  </div>
                </div>

                {!isAddingStorage ? (
                  <div>
                    <Button
                      onClick={() => setIsAddingStorage(true)}
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <PlusIcon className="h-4 w-4" />
                      Add External Storage
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h3 className="text-sm font-medium">
                      Add External Storage
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-500 block mb-1">
                          Storage Provider
                        </label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between"
                            >
                              {selectedStorageProvider || "Select Provider"}
                              <ChevronDownIcon className="h-4 w-4 ml-2" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() =>
                                setSelectedStorageProvider("AWS S3")
                              }
                            >
                              AWS S3
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                setSelectedStorageProvider(
                                  "Google Cloud Storage"
                                )
                              }
                            >
                              Google Cloud Storage
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                setSelectedStorageProvider("Azure Blob Storage")
                              }
                            >
                              Azure Blob Storage
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                setSelectedStorageProvider("Cloudflare R2")
                              }
                            >
                              Cloudflare R2
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div>
                        <label className="text-sm text-gray-500 block mb-1">
                          Storage Size
                        </label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between"
                            >
                              Select Size
                              <ChevronDownIcon className="h-4 w-4 ml-2" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>1 GB</DropdownMenuItem>
                            <DropdownMenuItem>5 GB</DropdownMenuItem>
                            <DropdownMenuItem>10 GB</DropdownMenuItem>
                            <DropdownMenuItem>20 GB</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {selectedStorageProvider && (
                      <div className="space-y-4 mt-4">
                        <div>
                          <label className="text-sm text-gray-500 block mb-1">
                            {selectedStorageProvider === "AWS S3"
                              ? "Bucket Name"
                              : selectedStorageProvider ===
                                  "Google Cloud Storage"
                                ? "Bucket Name"
                                : selectedStorageProvider ===
                                    "Azure Blob Storage"
                                  ? "Container Name"
                                  : "Bucket Name"}
                          </label>
                          <Input placeholder="Enter name" />
                        </div>

                        <div>
                          <label className="text-sm text-gray-500 block mb-1">
                            Access Credentials
                          </label>
                          {selectedStorageProvider === "AWS S3" && (
                            <div className="space-y-2">
                              <Input placeholder="Access Key ID" />
                              <Input
                                placeholder="Secret Access Key"
                                type="password"
                              />
                            </div>
                          )}
                          {selectedStorageProvider ===
                            "Google Cloud Storage" && (
                            <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center">
                              <p className="text-sm text-gray-500">
                                Upload Service Account JSON Key
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                              >
                                Choose File
                              </Button>
                            </div>
                          )}
                          {selectedStorageProvider === "Azure Blob Storage" && (
                            <div className="space-y-2">
                              <Input placeholder="Connection String" />
                            </div>
                          )}
                          {selectedStorageProvider === "Cloudflare R2" && (
                            <div className="space-y-2">
                              <Input placeholder="Access Key ID" />
                              <Input
                                placeholder="Secret Access Key"
                                type="password"
                              />
                              <Input placeholder="Account ID" />
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-4">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setIsAddingStorage(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            className="flex-1 bg-[#0A84FF] hover:bg-[#0A84FF]/90"
                            onClick={handleAddStorage}
                          >
                            Connect Storage
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="marketing-hero rounded-3xl p-8"
            >
              <div className="inline-block mb-3 px-4 py-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-300 text-sm font-medium">
                <span className="flex items-center gap-2">
                  <KeyIcon className="w-4 h-4" />
                  Early Access Now Available
                </span>
              </div>
              <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-6">
                The Future of AI Management
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                Join an exclusive group of innovative companies shaping the
                future of AI operations. Agent Command HQ is now accepting early
                access partners.
              </p>
              <div className="flex items-center justify-center">
                <AuthButton />
              </div>
            </motion.div>
          </div>

          {/* Early Access Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            <div className="marketing-card">
              <div className="text-purple-600 mb-4">
                <StarIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Early Partner Benefits
              </h3>
              <p className="text-gray-600">
                Exclusive pricing, priority support, and direct input into our
                product roadmap.
              </p>
            </div>
            <div className="marketing-card">
              <div className="text-blue-600 mb-4">
                <ShieldCheckIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Enterprise Ready</h3>
              <p className="text-gray-600">
                SOC 2 compliant with dedicated support and custom deployment
                options.
              </p>
            </div>
            <div className="marketing-card">
              <div className="text-green-600 mb-4">
                <BoltIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Setup</h3>
              <p className="text-gray-600">
                Deploy your first AI agent in under 60 seconds. No complex
                configuration needed.
              </p>
            </div>
          </motion.div>

          {/* Preview Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-xl p-8 mb-16"
          >
            <div className="text-center mb-8">
              <div className="inline-block mb-3 px-4 py-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-300 text-sm font-medium">
                <span className="flex items-center gap-2">
                  <SparklesIcon className="w-4 h-4" />
                  Sneak Peek
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-4">Your AI Fleet Awaits</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Get early access to our growing marketplace of specialized AI
                agents.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Preview Cards for Finance, Research, and Code Agents */}
              <div className="marketing-card group cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    <ChartBarIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Finance Agent</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Financial analysis and market insights from a Wall Street
                      expert
                    </p>
                  </div>
                </div>
              </div>

              <div className="marketing-card group cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    <DocumentMagnifyingGlassIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Research Assistant</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Advanced research and document analysis for academics and
                      professionals
                    </p>
                  </div>
                </div>
              </div>

              <div className="marketing-card group cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:scale-110 transition-transform">
                    <CommandLineIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Code Assistant</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Coding help, debugging, and software development across
                      multiple languages
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-xl p-12 text-white"
          >
            <h2 className="text-3xl font-bold mb-6">Join the AI Revolution</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Be among the first to experience the future of AI operations.
              Early access spots are limited.
            </p>
            <AuthButton
              className="border-white text-white"
              buttonStyle="bg-white text-[#9333EA] hover:text-[#7928CA] transition-colors"
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}
