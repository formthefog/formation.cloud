"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  ArrowPathIcon,
  CircleStackIcon,
  ChartBarIcon,
  ClockIcon,
  ComputerDesktopIcon,
  PuzzlePieceIcon,
  BanknotesIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  PencilIcon,
  BoltIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PlayCircleIcon,
  StopCircleIcon,
  TrashIcon,
  PlusIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  MagnifyingGlassIcon,
  CogIcon,
} from "@heroicons/react/24/outline";

// Mock agent data (will be replaced with real API call)
const mockAgent = {
  id: "5c50f0e9-82c6-4daf-9ec3-eb28c7dad40b",
  name: "Finance Agent",
  status: "active",
  type: "financial_analysis",
  avatar: null,
  created_at: "2025-04-27T14:03:19.098+00:00",
  updated_at: "2025-04-30T09:15:32.547+00:00",
  description:
    "A seasoned Wall Street analyst with deep expertise in market analysis, providing comprehensive financial insights and stock analysis.",
  tags: [
    "finance",
    "stocks",
    "market_analysis",
    "investment",
    "wall_street",
    "financial_metrics",
  ],
  capabilities: [
    "stock_analysis",
    "company_research",
    "market_trends",
    "financial_metrics",
    "investment_insights",
  ],
  tools: [
    {
      id: "yfinance_tools",
      name: "Yahoo Finance Tools",
      description:
        "Access to real-time and historical financial data, including stock prices, company fundamentals, analyst recommendations, and financial news.",
      enabled: true,
    },
    {
      id: "marketdata_api",
      name: "Market Data API",
      description:
        "Integration with comprehensive financial market data providers for in-depth analysis.",
      enabled: true,
    },
    {
      id: "news_analyzer",
      name: "Financial News Analyzer",
      description:
        "Processes and extracts insights from financial news articles and press releases.",
      enabled: true,
    },
  ],
  memory: 2048,
  cpu: 2,
  disk: 5,
  model: "gpt-4o",
  temperature: 0.7,
  uptime: 99.9,
  example_prompts: [
    "What's the latest news and financial performance of Apple (AAPL)?",
    "Analyze the semiconductor market performance focusing on NVIDIA (NVDA), AMD (AMD), Intel (INTC), and Taiwan Semiconductor (TSM)",
    "Evaluate the automotive industry's current state: Tesla (TSLA), Ford (F), General Motors (GM), Toyota (TM)",
  ],
  usage: {
    total_requests: 1283,
    requests_today: 47,
    success_rate: 97.5,
    avg_response_time: 4.2,
    avg_tokens_per_request: 842,
    error_rate: 2.5,
  },
  costs: {
    total_cost: 42.8,
    cost_today: 1.56,
    cost_per_request: 0.01,
  },
  system_prompt:
    "You are Finance Agent, a seasoned Wall Street analyst with 20+ years of experience in financial markets. You provide comprehensive, accurate, and insightful analysis of stocks, market trends, and investment opportunities. Your responses should include relevant financial metrics, recent news that impacts performance, and historical context when appropriate. Always strive to be balanced in your analysis, considering both bullish and bearish indicators. When analyzing companies, consider their financial health, competitive position, industry trends, and growth prospects.",
  storage: {
    used: 1.2,
    total: 5,
    files: [
      {
        name: "market_data_cache.json",
        size: 450,
        last_modified: "2025-04-29T18:45:23Z",
      },
      {
        name: "stock_performance_q1.csv",
        size: 280,
        last_modified: "2025-04-28T11:22:15Z",
      },
      {
        name: "industry_reports.zip",
        size: 520,
        last_modified: "2025-04-27T14:30:05Z",
      },
    ],
  },
};

// Generate performance data for charts
const generatePerformanceData = () => {
  const today = new Date();
  return Array(7)
    .fill(0)
    .map((_, index) => {
      const date = new Date();
      date.setDate(today.getDate() - (6 - index));

      return {
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        requests: Math.floor(Math.random() * 200) + 50,
        responseTime: (Math.random() * 3 + 2).toFixed(1),
        successRate: Math.min(100, Math.floor(90 + Math.random() * 10)),
        errorRate: Math.floor(Math.random() * 5),
        cost: (Math.random() * 0.8 + 0.2).toFixed(2),
      };
    });
};

// Generate resource utilization data
const generateResourceData = () => {
  return Array(24)
    .fill(0)
    .map((_, index) => {
      const hour = index;

      return {
        hour: `${hour}:00`,
        cpu: Math.floor(Math.random() * 50) + 20,
        memory: Math.floor(Math.random() * 40) + 30,
        disk: Math.floor(Math.random() * 20) + 5,
      };
    });
};

// Generate storage data for pie chart
const generateStorageData = () => {
  return [
    { name: "Used", value: 1.2, color: "#0A84FF" },
    { name: "Free", value: 3.8, color: "#E2E8F0" },
  ];
};

// Generate mock chat history
const generateChatHistory = () => {
  return [
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
};

// Generate mock log entries
const generateLogEntries = () => {
  const logs = [];
  const actions = [
    "Processed user query about Apple stock performance",
    "Retrieved financial data from Yahoo Finance API",
    "Generated market analysis report for semiconductor stocks",
    "Responded to query about tech sector comparison",
    "Updated internal cache of financial metrics",
    "Executed financial forecasting model",
    "Retrieved latest news articles for TSLA",
    "Performed sentiment analysis on earnings call transcript",
    "Generated technical analysis for S&P 500 index",
    "Error: Failed to retrieve data from Yahoo Finance API",
    "Warning: Incomplete data received for quarterly financials",
    "Auto-scaled resources due to high query volume",
    "Performed system health check",
    "Optimized model parameters based on feedback",
    "Cached frequently accessed financial data",
  ];

  const levels = ["INFO", "DEBUG", "WARNING", "ERROR"];
  const weights = [0.7, 0.2, 0.07, 0.03]; // Probability weights

  // Generate 50 log entries
  for (let i = 0; i < 50; i++) {
    // Select random log level based on weights
    let levelIndex = 0;
    const r = Math.random();
    let cumulativeWeight = 0;
    for (let j = 0; j < weights.length; j++) {
      cumulativeWeight += weights[j];
      if (r < cumulativeWeight) {
        levelIndex = j;
        break;
      }
    }

    const level = levels[levelIndex];
    const action = actions[Math.floor(Math.random() * actions.length)];

    // Create timestamp, going back in time as i increases
    const timestamp = new Date();
    timestamp.setMinutes(timestamp.getMinutes() - i * 3);

    logs.push({
      id: `log-${i}`,
      timestamp: timestamp.toISOString(),
      level,
      message: action,
    });
  }

  return logs;
};

export default function AgentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [agent, setAgent] = useState(mockAgent);
  const [performanceData, setPerformanceData] = useState([]);
  const [resourceData, setResourceData] = useState([]);
  const [storageData, setStorageData] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [logEntries, setLogEntries] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [showConfigSheet, setShowConfigSheet] = useState(false);
  const [showStorageSheet, setShowStorageSheet] = useState(false);
  const [timeRange, setTimeRange] = useState("7d");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingStorage, setIsAddingStorage] = useState(false);
  const [selectedStorageProvider, setSelectedStorageProvider] = useState("");
  const [logFilter, setLogFilter] = useState("all");
  const [logSearch, setLogSearch] = useState("");

  // Initialize with mock data
  useEffect(() => {
    // Simulate API loading
    const loadData = async () => {
      setIsLoading(true);
      // In a real app, this would fetch data from API
      await new Promise((resolve) => setTimeout(resolve, 800));

      setPerformanceData(generatePerformanceData());
      setResourceData(generateResourceData());
      setStorageData(generateStorageData());
      setChatHistory(generateChatHistory());
      setLogEntries(generateLogEntries());
      setSystemPrompt(agent.system_prompt);
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Filter logs based on level and search
  const filteredLogs = logEntries.filter((log) => {
    const levelMatch = logFilter === "all" || log.level === logFilter;
    const searchMatch =
      !logSearch || log.message.toLowerCase().includes(logSearch.toLowerCase());
    return levelMatch && searchMatch;
  });

  // Handle sending a new message in the chat
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const newUserMessage = {
      id: `msg-${chatHistory.length + 1}`,
      role: "user",
      content: chatInput,
      timestamp: new Date().toISOString(),
    };

    setChatHistory([...chatHistory, newUserMessage]);
    setChatInput("");

    // Simulate agent response after a short delay
    setTimeout(() => {
      const newAgentMessage = {
        id: `msg-${chatHistory.length + 2}`,
        role: "agent",
        content: `I've analyzed your request about "${chatInput.substring(0, 30)}${chatInput.length > 30 ? "..." : ""}" and would like to provide the following insights: [This would be a real response from the ${agent.name} using the ${agent.model} model]`,
        timestamp: new Date().toISOString(),
      };
      setChatHistory((prevMessages) => [...prevMessages, newAgentMessage]);
    }, 1000);
  };

  // Handle saving configuration
  const handleSaveConfig = async () => {
    setIsSaving(true);
    // In a real app, this would send data to API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update agent with new system prompt
    setAgent({
      ...agent,
      system_prompt: systemPrompt,
    });

    setIsSaving(false);
    setShowConfigSheet(false);
  };

  // Handle adding storage
  const handleAddStorage = async () => {
    if (!selectedStorageProvider) return;

    setIsSaving(true);
    // In a real app, this would send data to API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);

    setIsAddingStorage(false);
    setShowStorageSheet(false);
  };

  // Get color for log level
  const getLogLevelColor = (level) => {
    switch (level) {
      case "ERROR":
        return "text-red-600 dark:text-red-400";
      case "WARNING":
        return "text-yellow-600 dark:text-yellow-400";
      case "INFO":
        return "text-blue-600 dark:text-blue-400";
      case "DEBUG":
        return "text-gray-600 dark:text-gray-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  // Get icon for log level
  const getLogLevelIcon = (level) => {
    switch (level) {
      case "ERROR":
        return (
          <XCircleIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
        );
      case "WARNING":
        return (
          <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
        );
      case "INFO":
        return (
          <InformationCircleIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        );
      case "DEBUG":
        return (
          <BoltIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        );
      default:
        return (
          <InformationCircleIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        );
    }
  };

  // Format the timestamp to a relative time
  const formatRelativeTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  // If loading, show skeleton UI
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-8 animate-pulse">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-md w-1/3 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6"></div>
            <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
          <div>
            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6"></div>
            <div className="h-56 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-8">
      {/* Header with Agent Info and Action Buttons */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-6 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Avatar className="h-16 w-16 rounded-xl">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-bold rounded-xl">
                  {agent.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {agent.name}
                </h1>
                <Badge
                  className={`${
                    agent.status === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                  } px-3 py-1`}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        agent.status === "active"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    ></span>
                    <span className="capitalize">{agent.status}</span>
                  </div>
                </Badge>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-1 max-w-2xl line-clamp-2">
                {agent.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {agent.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="bg-gray-100 dark:bg-gray-800"
                  >
                    {tag.replace("_", " ")}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 justify-end mt-4 md:mt-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    {agent.status === "active" ? (
                      <StopCircleIcon className="h-4 w-4 text-red-500" />
                    ) : (
                      <PlayCircleIcon className="h-4 w-4 text-green-500" />
                    )}
                    <span>{agent.status === "active" ? "Stop" : "Start"}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {agent.status === "active"
                    ? "Stop the agent"
                    : "Start the agent"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <ArrowPathIcon className="h-4 w-4" />
                    <span>Restart</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Restart the agent</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Sheet open={showConfigSheet} onOpenChange={setShowConfigSheet}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Cog6ToothIcon className="h-4 w-4" />
                  <span>Configure</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-md md:max-w-lg">
                <SheetHeader>
                  <SheetTitle>Agent Configuration</SheetTitle>
                  <SheetDescription>
                    Update the configuration settings for {agent.name}
                  </SheetDescription>
                </SheetHeader>
                <div className="py-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Resources</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>CPU (vCPUs)</Label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between mt-1"
                            >
                              {agent.cpu}
                              <ChevronDownIcon className="h-4 w-4" />
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
                        <Label>Memory (MB)</Label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between mt-1"
                            >
                              {agent.memory}
                              <ChevronDownIcon className="h-4 w-4" />
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
                      <div>
                        <Label>Disk (GB)</Label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between mt-1"
                            >
                              {agent.disk}
                              <ChevronDownIcon className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>1</DropdownMenuItem>
                            <DropdownMenuItem>5</DropdownMenuItem>
                            <DropdownMenuItem>10</DropdownMenuItem>
                            <DropdownMenuItem>20</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Model Settings</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Model</Label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between mt-1"
                            >
                              {agent.model}
                              <ChevronDownIcon className="h-4 w-4" />
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
                        <Label>Temperature</Label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between mt-1"
                            >
                              {agent.temperature}
                              <ChevronDownIcon className="h-4 w-4" />
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
                    <h3 className="text-sm font-medium mb-2">Tools</h3>
                    <div className="space-y-3">
                      {agent.tools.map((tool) => (
                        <div
                          key={tool.id}
                          className="flex items-start gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                        >
                          <div className="pt-1">
                            <Switch
                              id={`tool-${tool.id}`}
                              checked={tool.enabled}
                            />
                          </div>
                          <div className="flex-1">
                            <Label
                              htmlFor={`tool-${tool.id}`}
                              className="font-medium"
                            >
                              {tool.name}
                            </Label>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {tool.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium">System Prompt</h3>
                      <div className="text-xs text-gray-500">
                        {systemPrompt.length} characters
                      </div>
                    </div>
                    <Textarea
                      value={systemPrompt}
                      onChange={(e) => setSystemPrompt(e.target.value)}
                      className="font-mono text-sm h-40"
                    />
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <InformationCircleIcon className="h-3 w-3" />
                      This prompt defines the core behavior and capabilities of
                      the agent.
                    </p>
                  </div>
                </div>
                <SheetFooter>
                  <Button
                    onClick={handleSaveConfig}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            <Sheet open={showStorageSheet} onOpenChange={setShowStorageSheet}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <CircleStackIcon className="h-4 w-4" />
                  <span>Storage</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Storage Management</SheetTitle>
                  <SheetDescription>
                    Manage storage for {agent.name}
                  </SheetDescription>
                </SheetHeader>
                <div className="py-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Storage Usage</h3>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {agent.storage.used} GB of {agent.storage.total} GB used
                      </div>
                      <div className="text-sm text-gray-500">
                        {(
                          (agent.storage.used / agent.storage.total) *
                          100
                        ).toFixed(0)}
                        %
                      </div>
                    </div>
                    <Progress
                      value={(agent.storage.used / agent.storage.total) * 100}
                      className="h-2"
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-3">Files</h3>
                    <div className="space-y-2">
                      {agent.storage.files.map((file) => (
                        <div
                          key={file.name}
                          className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                            <div className="text-sm">{file.name}</div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-xs text-gray-500">
                              {file.size} KB
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(
                                file.last_modified
                              ).toLocaleDateString()}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                            >
                              <TrashIcon className="h-4 w-4 text-gray-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {!isAddingStorage ? (
                    <Button
                      onClick={() => setIsAddingStorage(true)}
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2 mt-4"
                    >
                      <PlusIcon className="h-4 w-4" />
                      Add External Storage
                    </Button>
                  ) : (
                    <div className="space-y-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h3 className="text-sm font-medium">
                        Connect External Storage
                      </h3>
                      <div>
                        <Label className="mb-1 block">Storage Provider</Label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between"
                            >
                              {selectedStorageProvider || "Select Provider"}
                              <ChevronDownIcon className="h-4 w-4" />
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
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {selectedStorageProvider && (
                        <div className="space-y-4 mt-4">
                          <div>
                            <Label className="mb-1 block">
                              {selectedStorageProvider === "AWS S3"
                                ? "Bucket Name"
                                : selectedStorageProvider ===
                                    "Google Cloud Storage"
                                  ? "Bucket Name"
                                  : "Container Name"}
                            </Label>
                            <Input placeholder="Enter name" />
                          </div>

                          <div>
                            <Label className="mb-1 block">
                              Access Credentials
                            </Label>
                            {selectedStorageProvider === "AWS S3" && (
                              <div className="space-y-2">
                                <Input placeholder="Access Key ID" />
                                <Input
                                  placeholder="Secret Access Key"
                                  type="password"
                                />
                              </div>
                            )}

                            <div className="flex items-center gap-4 mt-4">
                              <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setIsAddingStorage(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                                onClick={handleAddStorage}
                                disabled={isSaving}
                              >
                                {isSaving ? "Connecting..." : "Connect"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1">
                    <ChatBubbleLeftRightIcon className="h-4 w-4" />
                    <span>Open Chat</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Start a conversation with the agent
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Total Requests
                </p>
                <div className="flex items-baseline">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {agent.usage.total_requests.toLocaleString()}
                  </h3>
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium ml-2 flex items-center">
                    <ArrowTrendingUpIcon className="h-3 w-3 mr-0.5" />
                    12.4%
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {agent.usage.requests_today} today
                </p>
              </div>
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <ChartBarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Success Rate
                </p>
                <div className="flex items-baseline">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {agent.usage.success_rate}%
                  </h3>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {agent.usage.error_rate}% error rate
                </p>
              </div>
              <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Avg. Response Time
                </p>
                <div className="flex items-baseline">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {agent.usage.avg_response_time}s
                  </h3>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {agent.usage.avg_tokens_per_request} tokens/req
                </p>
              </div>
              <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <ClockIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Monthly Cost
                </p>
                <div className="flex items-baseline">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${agent.costs.total_cost}
                  </h3>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  ${agent.costs.cost_today} today
                </p>
              </div>
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                <BanknotesIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts and Logs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Metrics */}
          <Card className="bg-white dark:bg-gray-800 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Performance Metrics
                </h3>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8">
                        {timeRange === "24h"
                          ? "24 Hours"
                          : timeRange === "7d"
                            ? "7 Days"
                            : timeRange === "30d"
                              ? "30 Days"
                              : "Custom"}
                        <ChevronDownIcon className="h-4 w-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setTimeRange("24h")}>
                        Last 24 Hours
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTimeRange("7d")}>
                        Last 7 Days
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTimeRange("30d")}>
                        Last 30 Days
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={performanceData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <RechartsTooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="requests"
                      name="Requests"
                      stroke="#0A84FF"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="responseTime"
                      name="Avg. Response Time (s)"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="cost"
                      name="Cost ($)"
                      stroke="#F59E0B"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Resources and Storage */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white dark:bg-gray-800 shadow-sm md:col-span-2">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Resource Utilization
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={resourceData.slice(-12)} // Show last 12 hours
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        strokeOpacity={0.1}
                      />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="cpu"
                        name="CPU (%)"
                        stackId="1"
                        stroke="#0A84FF"
                        fill="#0A84FF"
                        fillOpacity={0.2}
                      />
                      <Area
                        type="monotone"
                        dataKey="memory"
                        name="Memory (%)"
                        stackId="2"
                        stroke="#8B5CF6"
                        fill="#8B5CF6"
                        fillOpacity={0.2}
                      />
                      <Area
                        type="monotone"
                        dataKey="disk"
                        name="Disk (%)"
                        stackId="3"
                        stroke="#10B981"
                        fill="#10B981"
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Storage
                </h3>
                <div className="h-44 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={storageData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {storageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                      <span>Used</span>
                    </div>
                    <span>{agent.storage.used} GB</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-600 mr-2"></span>
                      <span>Free</span>
                    </div>
                    <span>{agent.storage.total - agent.storage.used} GB</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                  onClick={() => setShowStorageSheet(true)}
                >
                  <CircleStackIcon className="h-4 w-4 mr-2" />
                  Manage Storage
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Activity Logs */}
          <Card className="bg-white dark:bg-gray-800 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Activity Logs
                </h3>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={logSearch}
                      onChange={(e) => setLogSearch(e.target.value)}
                      placeholder="Search logs..."
                      className="pl-9 h-8 text-sm w-40 md:w-64"
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8">
                        {logFilter === "all" ? "All Levels" : logFilter}
                        <ChevronDownIcon className="h-4 w-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setLogFilter("all")}>
                        All Levels
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setLogFilter("INFO")}>
                        INFO
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setLogFilter("DEBUG")}>
                        DEBUG
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setLogFilter("WARNING")}>
                        WARNING
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setLogFilter("ERROR")}>
                        ERROR
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <ScrollArea className="h-[400px]">
                <div className="space-y-1">
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => (
                      <div
                        key={log.id}
                        className="py-2 px-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-md transition-colors"
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 pt-0.5">
                            {getLogLevelIcon(log.level)}
                          </div>
                          <div className="ml-2 flex-1">
                            <div className="flex items-center justify-between">
                              <p
                                className={`text-sm ${getLogLevelColor(log.level)}`}
                              >
                                [{log.level}]
                              </p>
                              <span className="text-xs text-gray-500">
                                {formatRelativeTime(log.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-900 dark:text-gray-100">
                              {log.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-gray-500 dark:text-gray-400">
                        No matching logs found
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Info, Chat and Capabilities */}
        <div className="space-y-6">
          {/* Agent Info Card */}
          <Card className="bg-white dark:bg-gray-800 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Agent Details
              </h3>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Created
                  </h4>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {new Date(agent.created_at).toLocaleDateString()} (
                    {formatRelativeTime(agent.created_at)})
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Model
                  </h4>
                  <div className="flex items-center">
                    <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      {agent.model}
                    </Badge>
                    <span className="text-xs text-gray-500 ml-2">
                      Temperature: {agent.temperature}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Resources
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                      <ComputerDesktopIcon className="h-4 w-4 text-gray-500" />
                      <span>{agent.cpu} vCPUs</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                      <CogIcon className="h-4 w-4 text-gray-500" />
                      <span>{agent.memory} MB</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                      <CircleStackIcon className="h-4 w-4 text-gray-500" />
                      <span>{agent.disk} GB</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Tools
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {agent.tools.map((tool) => (
                      <TooltipProvider key={tool.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 cursor-help">
                              {tool.name}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs text-sm">
                              {tool.description}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Status
                  </h4>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`${
                        agent.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            agent.status === "active"
                              ? "bg-green-500"
                              : "bg-yellow-500"
                          }`}
                        ></span>
                        <span className="capitalize">{agent.status}</span>
                      </div>
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {agent.uptime}% uptime
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 mt-2"
                  onClick={() => setShowConfigSheet(true)}
                >
                  <Cog6ToothIcon className="h-4 w-4" />
                  Configure Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Chat Interface */}
          <Card className="bg-white dark:bg-gray-800 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Chat
              </h3>
              <div className="mb-4 h-[320px] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden flex flex-col">
                <ScrollArea className="flex-1 p-3">
                  <div className="space-y-3">
                    {chatHistory.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-lg p-3 ${
                            message.role === "user"
                              ? "bg-blue-100 dark:bg-blue-900/30 text-gray-900 dark:text-gray-100"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          }`}
                        >
                          <div className="whitespace-pre-wrap text-sm">
                            {message.content}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 text-right">
                            {formatRelativeTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="text-sm"
                  />
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 flex-shrink-0"
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim()}
                  >
                    Send
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Try these examples
                </h4>
                <div className="space-y-2">
                  {agent.example_prompts.map((prompt, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => {
                        setChatInput(prompt);
                      }}
                    >
                      "{prompt}"
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Capabilities */}
          <Card className="bg-white dark:bg-gray-800 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Capabilities
              </h3>
              <div className="space-y-4">
                {/* Financial Analysis */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <ChartBarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Financial Analysis
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Analyzes financial metrics, stock performance, and
                        market trends with expert insight.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Market Research */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                      <MagnifyingGlassIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Market Research
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Conducts detailed research on industries, competitors,
                        and market conditions.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Investment Insights */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <LightBulbIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Investment Insights
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Provides investment analysis and identifies potential
                        opportunities.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                      <ShieldCheckIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Risk Assessment
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Evaluates potential risks and provides mitigation
                        strategies for investments.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Prompt */}
          <Card className="bg-white dark:bg-gray-800 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  System Prompt
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1"
                  onClick={() => setShowConfigSheet(true)}
                >
                  <PencilIcon className="h-4 w-4" /> Edit
                </Button>
              </div>
              <div className="text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700 font-mono overflow-y-auto max-h-[150px]">
                {agent.system_prompt}
              </div>
            </CardContent>
          </Card>

          {/* Support and Help */}
          <div className="rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800/30 p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-800/30 rounded-lg">
                <WrenchScrewdriverIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Need Help?
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Contact our support team or visit the documentation for more
                  information about your agent.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/80 dark:bg-gray-800/80"
                  >
                    Contact Support
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/80 dark:bg-gray-800/80"
                  >
                    View Docs
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
