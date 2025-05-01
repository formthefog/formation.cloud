"use client";

import "./styles.css";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  UserCircleIcon,
  PlusIcon,
  XMarkIcon,
  CheckIcon,
  ArrowPathIcon,
  InformationCircleIcon,
  SparklesIcon,
  StarIcon,
  BoltIcon,
  ShieldCheckIcon,
  CommandLineIcon,
  ChartBarIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";
import { useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import { AuthButton } from "@/components/AuthButton";
import { useAuth } from "@/components/auth-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AgentDeployment } from "@/types/agent";
import { Agent } from "http";
import AgentChatHeader from "./components/AgentChatHeader";
import AgentChatMessages from "./components/AgentChatMessages";
import AgentChatInput from "./components/AgentChatInput";
import { ArrowRightIcon, KeyIcon, Link } from "lucide-react";
import AgentChatList from "./components/AgentChatList";
import AgentSidebar from "./components/AgentSidebar";

// Define interfaces (unchanged)

interface ChatMessage {
  id: string;
  role: "user" | "agent" | "system";
  content: string;
  timestamp: string;
  loading?: boolean;
  error?: boolean;
}

export default function AgentChatPage() {
  const isLoggedIn = useIsLoggedIn();
  const { user, accounts } = useAuth();
  const [deployments, setDeployments] = useState<AgentDeployment[]>([]);
  const [selectedDeployment, setSelectedDeployment] =
    useState<AgentDeployment | null>(null);
  const [conversations, setConversations] = useState<{
    [key: string]: ChatMessage[];
  }>({});
  const [chatInput, setChatInput] = useState("");
  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false);
  const [newAgentName, setNewAgentName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchDeployments = async () => {
    if (!isLoggedIn || !accounts || !accounts[0]?.id) return;
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/deployments?account_id=${accounts[0].id}`
      );
      if (response.ok) {
        const { deployments: apiDeployments } = await response.json();
        setDeployments(apiDeployments);
        setSelectedDeployment(apiDeployments[0]);
      }
    } catch (err) {
      console.error("Error fetching deployments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch deployments after authentication
  useEffect(() => {
    const fetchDeployments = async () => {
      if (!isLoggedIn || !accounts || !accounts[0]?.id) return;
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/deployments?account_id=${accounts[0].id}`
        );
        if (response.ok) {
          const { deployments: apiDeployments } = await response.json();
          setDeployments(apiDeployments);

          // Initialize conversations object
          const newConversations: { [key: string]: ChatMessage[] } = {};
          // apiDeployments.forEach((deployment: AgentDeployment) => {
          //   newConversations[deployment.id] = [
          //     {
          //       id: `welcome-${deployment.id}`,
          //       role: "system",
          //       content: `Welcome! I'm ${deployment.config.name}, your AI assistant. How can I help you today?`,
          //       timestamp: new Date().toISOString(),
          //     },
          //   ];
          // });
          // setConversations(newConversations);

          // Select the first deployment if any exist
          if (apiDeployments.length > 0) {
            setSelectedDeployment(apiDeployments[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching deployments:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeployments();
  }, [isLoggedIn, accounts]);

  // Effect to scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [selectedDeployment, conversations]);

  // Filter deployments based on search
  const filteredDeployments = deployments.filter(
    (deployment) =>
      deployment.config.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      deployment.agent.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // Handle sending a message to the agent
  const handleSendMessage = async () => {
    if (!chatInput.trim() || !selectedDeployment) return;

    const newUserMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: chatInput,
      timestamp: new Date().toISOString(),
    };

    // Optimistically add user message to the conversation
    setConversations((prev) => ({
      ...prev,
      [selectedDeployment.id]: [
        ...(prev[selectedDeployment.id] || []),
        newUserMessage,
        {
          id: `agent-loading-${Date.now()}`,
          role: "agent",
          content: "...",
          timestamp: new Date().toISOString(),
          loading: true,
        },
      ],
    }));

    setChatInput("");

    try {
      // Only attempt to call the agent API if we have a deployment URL
      if (selectedDeployment.deployment_url) {
        const response = await fetch(
          `${selectedDeployment.deployment_url}/run-task`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              agent_id: selectedDeployment.agent.name
                .toLowerCase()
                .replace(/\s+/g, " "),
              task_id: `task-${Date.now()}`,
              inputs: {
                variables: {
                  query: {
                    value: chatInput,
                  },
                },
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const agentResponse =
            data.outputs?.variables?.response?.value ||
            "I processed your request, but couldn't generate a proper response.";

          // Update the conversation with the actual response
          setConversations((prev) => {
            const currentConvo = [...prev[selectedDeployment.id]];
            // Remove the loading message
            const withoutLoading = currentConvo.filter((msg) => !msg.loading);

            return {
              ...prev,
              [selectedDeployment.id]: [
                ...withoutLoading,
                {
                  id: `agent-${Date.now()}`,
                  role: "agent",
                  content: agentResponse,
                  timestamp: new Date().toISOString(),
                },
              ],
            };
          });
        } else {
          throw new Error("Failed to get response from agent");
        }
      } else {
        // Simulate a response if no deployment URL (for development purposes)
        setTimeout(() => {
          const mockResponse = `### Response to: ${chatInput}\n\n**Key Points:**\n\n- This would be the first point in a detailed response\n- Another important consideration to note\n- A third element that provides value\n\n**Additional Information:**\n\nAs ${selectedDeployment.config.name}, I'm using my knowledge in ${selectedDeployment.agent.capabilities.join(", ")} to provide this detailed response.\n\nPlease let me know if you need any clarification or have further questions!`;

          setConversations((prev) => {
            const currentConvo = [...prev[selectedDeployment.id]];
            // Remove the loading message
            const withoutLoading = currentConvo.filter((msg) => !msg.loading);

            return {
              ...prev,
              [selectedDeployment.id]: [
                ...withoutLoading,
                {
                  id: `agent-${Date.now()}`,
                  role: "agent",
                  content: mockResponse,
                  timestamp: new Date().toISOString(),
                },
              ],
            };
          });
        }, 1500);
      }
    } catch (error) {
      console.error("Error sending message to agent:", error);

      // Update conversation with error message
      setConversations((prev) => {
        const currentConvo = [...prev[selectedDeployment.id]];
        // Remove the loading message
        const withoutLoading = currentConvo.filter((msg) => !msg.loading);

        return {
          ...prev,
          [selectedDeployment.id]: [
            ...withoutLoading,
            {
              id: `agent-error-${Date.now()}`,
              role: "agent",
              content:
                "Sorry, there was an error processing your request. Please try again.",
              timestamp: new Date().toISOString(),
              error: true,
            },
          ],
        };
      });
    }
  };

  // Handle new chat creation
  const handleCreateNewChat = async () => {
    if (!newAgentName.trim()) return;
    setIsNewChatDialogOpen(false);
    setNewAgentName("");
    alert("This would create a new agent with name: " + newAgentName);
  };

  // Format relative time
  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  // Clear chat history
  const clearChat = (deploymentId: string) => {
    if (!deploymentId) return;

    setConversations((prev) => ({
      ...prev,
      [deploymentId]: [
        {
          id: `welcome-${deploymentId}`,
          role: "system",
          content: `Chat history cleared. How can I help you today?`,
          timestamp: new Date().toISOString(),
        },
      ],
    }));
  };

  // Handle key press in chat input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Get initial for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {isLoggedIn ? (
          <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  Command Center
                  <span className="flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                  </span>
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Your AI agent command center awaits. Deploy your first agent
                  to get started.
                </p>
              </div>
              <Link href="/marketplace/browse">
                <Button className="bg-[#0A84FF] hover:bg-[#0A84FF]/90 flex items-center gap-2">
                  <RocketLaunchIcon className="w-5 h-5" />
                  Deploy Your First Agent
                </Button>
              </Link>
            </div>

            {/* Empty State */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
              <div className="max-w-2xl mx-auto">
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0A84FF]/10 to-blue-500/10 blur-3xl" />
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#0A84FF]/10 to-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-200/20">
                      <SparklesIcon className="w-8 h-8 text-[#0A84FF]" />
                    </div>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#0A84FF] to-blue-600">
                  Begin Your AI Journey
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                  Transform your operations with AI agents. Deploy your first
                  agent and watch as it automates tasks, processes data, and
                  drives efficiency across your workflow.
                </p>
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="p-6 rounded-xl bg-gradient-to-r flex flex-col items-center justify-center from-[#0A84FF]/5 to-blue-500/5 border border-blue-200/10">
                    <CommandLineIcon className="w-8 h-8 text-[#0A84FF] mb-3" />
                    <h3 className="font-semibold mb-2">One-Click Deploy</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Deploy agents instantly with our streamlined setup
                      process.
                    </p>
                  </div>
                  <div className="p-6 rounded-xl bg-gradient-to-r flex flex-col items-center justify-center from-[#0A84FF]/5 to-blue-500/5 border border-blue-200/10">
                    <ChartBarIcon className="w-8 h-8 text-[#0A84FF] mb-3" />
                    <h3 className="font-semibold mb-2">Real-time Insights</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Monitor performance and costs with detailed analytics.
                    </p>
                  </div>
                  <div className="p-6 rounded-xl bg-gradient-to-r flex flex-col items-center justify-center from-[#0A84FF]/5 to-blue-500/5 border border-blue-200/10">
                    <BoltIcon className="w-8 h-8 text-[#0A84FF] mb-3" />
                    <h3 className="font-semibold mb-2">Instant Results</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      See immediate impact with AI-powered automation.
                    </p>
                  </div>
                </div>
                <Link href="/marketplace">
                  <Button
                    size="lg"
                    className="bg-[#0A84FF] hover:bg-[#0A84FF]/90"
                  >
                    Explore Available Agents
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
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
                  future of AI operations. Formation's AI Command Center is now
                  accepting early access partners.
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
                <h2 className="text-3xl font-bold mb-4">
                  Your AI Fleet Awaits
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Get early access to our growing marketplace of specialized AI
                  agents.
                </p>
              </div>
              {/* <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {hiredAgents.slice(0, 3).map((agent) => (
                  <div
                    key={agent.id}
                    className="marketing-card group cursor-pointer"
                    onClick={() => setShowAuthFlow(true)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:scale-110 transition-transform">
                        {getAgentIcon(agent.type)}
                      </div>
                      <div>
                        <h3 className="font-medium">{agent.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {agent.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div> */}
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-xl p-12 text-white"
            >
              <h2 className="text-3xl font-bold mb-6">
                Join the AI Revolution
              </h2>
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

  return (
    <div className="flex max-h-[calc(100vh-85px)] overflow-hidden bg-white dark:bg-gray-900 mt-[10px]">
      {/* Sidebar - Now fixed */}
      <div>
        <div className="w-[480px] flex flex-col h-full border-r  border-gray-200 dark:border-gray-800">
          {/* Sidebar Header - Fixed */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Command Center
            </h1>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => setIsNewChatDialogOpen(true)}
            >
              <PlusIcon className="h-5 w-5" />
            </Button>
          </div>

          {/* Search - Fixed */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-800">
            <div className="relative">
              <Input
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
              <div className="absolute left-2 top-2.5 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
            </div>
          </div>

          {/* Chat List - Independently scrollable */}
          <AgentChatList
            isLoading={isLoading}
            filteredDeployments={filteredDeployments}
            selectedDeployment={selectedDeployment}
            setSelectedDeployment={setSelectedDeployment}
            getInitials={getInitials}
            conversations={conversations}
            formatRelativeTime={formatRelativeTime}
            searchQuery={searchQuery}
            setIsNewChatDialogOpen={setIsNewChatDialogOpen}
          />
        </div>
      </div>

      {/* Main Chat Area with Settings Sidebar */}
      <div className="flex flex-1 h-[calc(100vh-85px)]">
        {/* Chat Messages and Input Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedDeployment ? (
            <>
              {/* Chat Header - Fixed */}
              <AgentChatHeader
                selectedDeployment={selectedDeployment}
                clearChat={clearChat}
                getInitials={getInitials}
                fetchDeployments={fetchDeployments}
              />

              {/* Chat Messages with Input - Scrollable */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <AgentChatMessages
                  conversations={conversations}
                  selectedDeployment={selectedDeployment}
                  messagesEndRef={messagesEndRef}
                  setUserInput={setChatInput}
                  sendMessage={handleSendMessage}
                  chatInput={chatInput}
                  handleKeyPress={handleKeyPress}
                  handleSendMessage={handleSendMessage}
                />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full p-8">
              <div className="text-center max-w-md">
                <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Select an agent to start chatting
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Choose an agent from the sidebar or create a new one to begin
                  a conversation.
                </p>
                <Button
                  onClick={() => setIsNewChatDialogOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Create New Agent
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Settings Sidebar - Always visible */}
        {selectedDeployment && (
          <AgentSidebar
            selectedDeployment={selectedDeployment}
            isMinimized={isSidebarMinimized}
            onToggleMinimize={() => setIsSidebarMinimized(!isSidebarMinimized)}
          />
        )}
      </div>

      {/* New Chat Dialog */}
      <Dialog open={isNewChatDialogOpen} onOpenChange={setIsNewChatDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Agent</DialogTitle>
            <DialogDescription>
              Set up a new AI agent to help with specific tasks.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Agent Name</label>
              <Input
                placeholder="e.g. Research Assistant, Financial Advisor"
                value={newAgentName}
                onChange={(e) => setNewAgentName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Agent Type</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    Select Type
                    <ChevronDownIcon className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuItem>Financial Analysis</DropdownMenuItem>
                  <DropdownMenuItem>Research Assistant</DropdownMenuItem>
                  <DropdownMenuItem>Code Assistant</DropdownMenuItem>
                  <DropdownMenuItem>Customer Support</DropdownMenuItem>
                  <DropdownMenuItem>Data Analyst</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Model</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    Select Model
                    <ChevronDownIcon className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuItem>GPT-4</DropdownMenuItem>
                  <DropdownMenuItem>GPT-4o</DropdownMenuItem>
                  <DropdownMenuItem>Claude 3 Opus</DropdownMenuItem>
                  <DropdownMenuItem>Claude 3 Sonnet</DropdownMenuItem>
                  <DropdownMenuItem>Llama 3 70B</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNewChatDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateNewChat}
              disabled={!newAgentName.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Create Agent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
