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
  Bars3Icon,
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
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AgentDeployment } from "@/types/agent";
import { Agent } from "http";
import AgentChatHeader from "./components/AgentChatHeader";
import AgentChatMessages from "./components/AgentChatMessages";
import AgentChatInput from "./components/AgentChatInput";
import { ArrowRightIcon, KeyIcon, X } from "lucide-react";
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
  const { user, account } = useAuth();
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

  // Mobile-specific state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchDeployments = async () => {
    if (!isLoggedIn || !account || !account.id) return;
    try {
      setIsLoading(true);
      const response = await fetch(`/api/deployments?account_id=${account.id}`);
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
      if (!isLoggedIn || !account || !account.id) return;
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/deployments?account_id=${account.id}`
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
  }, [isLoggedIn, account]);

  // Effect to scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [selectedDeployment, conversations]);

  // Auto-close mobile sidebar when selecting a deployment
  useEffect(() => {
    if (selectedDeployment && isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
  }, [selectedDeployment]);

  // Listen for window resize to handle mobile/desktop views
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // On desktop
        setIsMobileSidebarOpen(false);
        setIsMobileSettingsOpen(false);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // Toggle mobile sidebar
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
    // Close settings drawer if opening sidebar
    if (!isMobileSidebarOpen) {
      setIsMobileSettingsOpen(false);
    }
  };

  // Toggle mobile settings
  const toggleMobileSettings = () => {
    setIsMobileSettingsOpen(!isMobileSettingsOpen);
    // Close sidebar drawer if opening settings
    if (!isMobileSettingsOpen) {
      setIsMobileSidebarOpen(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="marketing-hero rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8"
            >
              <div className="inline-block mb-3 px-3 py-1 sm:px-4 sm:py-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-300 text-xs sm:text-sm font-medium">
                <span className="flex items-center gap-1.5 sm:gap-2">
                  <KeyIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  Early Access Now Available
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-3 sm:mb-6">
                The Future of AI Management
              </h1>
              <p className="text-sm sm:text-base lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-4 sm:mb-8">
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
            className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 lg:mb-16"
          >
            <div className="marketing-card p-4 sm:p-6">
              <div className="text-purple-600 mb-3 sm:mb-4">
                <StarIcon className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
                Early Partner Benefits
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Exclusive pricing, priority support, and direct input into our
                product roadmap.
              </p>
            </div>
            <div className="marketing-card p-4 sm:p-6">
              <div className="text-blue-600 mb-3 sm:mb-4">
                <ShieldCheckIcon className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
                Enterprise Ready
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                SOC 2 compliant with dedicated support and custom deployment
                options.
              </p>
            </div>
            <div className="marketing-card p-4 sm:p-6">
              <div className="text-green-600 mb-3 sm:mb-4">
                <BoltIcon className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
                Instant Setup
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
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
            className="bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12 lg:mb-16"
          >
            <div className="text-center mb-4 sm:mb-8">
              <div className="inline-block mb-2 sm:mb-3 px-3 py-1 sm:px-4 sm:py-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-300 text-xs sm:text-sm font-medium">
                <span className="flex items-center gap-1.5 sm:gap-2">
                  <SparklesIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  Sneak Peek
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-4">
                Your AI Fleet Awaits
              </h2>
              <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                Get early access to our growing marketplace of specialized AI
                agents.
              </p>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-6 sm:p-8 lg:p-12 text-white"
          >
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-6">
              Join the AI Revolution
            </h2>
            <p className="text-sm sm:text-base lg:text-xl mb-4 sm:mb-8 max-w-2xl mx-auto opacity-90">
              Be among the first to experience the future of AI operations.
              Early access spots are limited.
            </p>
            <AuthButton
              className="border-white text-white"
              buttonStyle="bg-white text-[#9333EA] hover:text-[#7928CA] transition-colors"
            />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row max-h-[calc(100vh-85px)] overflow-hidden bg-white dark:bg-gray-900 mt-[10px]">
      {/* Mobile Top Bar - Only on mobile */}
      <div className="lg:hidden flex items-center justify-between border-b border-gray-200 dark:border-gray-800 p-3 bg-white dark:bg-gray-900 z-20">
        <Button
          variant="ghost"
          size="sm"
          className="p-1"
          onClick={toggleMobileSidebar}
        >
          <Bars3Icon className="h-6 w-6" />
        </Button>

        <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate px-2">
          {selectedDeployment
            ? selectedDeployment.config.name
            : "Command Center"}
        </h1>

        {selectedDeployment && (
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={toggleMobileSettings}
          >
            <InformationCircleIcon className="h-6 w-6" />
          </Button>
        )}
      </div>

      {/* Mobile Sidebar - Only visible when active on mobile */}
      <div
        className={`
        fixed inset-0 z-30 lg:relative lg:z-auto
        ${isMobileSidebarOpen ? "flex" : "hidden lg:flex"}
        flex-col lg:w-[320px] xl:w-[480px] h-full 
        bg-white dark:bg-gray-900 
        border-r border-gray-200 dark:border-gray-800
        transition-all duration-300
      `}
      >
        {/* Mobile sidebar close button - Only on mobile */}
        <div className="lg:hidden flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-800">
          <h2 className="font-semibold">Agent List</h2>
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-8 w-8"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Sidebar Header */}
        <div className="hidden lg:flex p-4 border-b border-gray-200 dark:border-gray-800 items-center justify-between">
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

        {/* Search */}
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

        {/* New chat button - Mobile only */}
        <div className="lg:hidden p-3 border-b border-gray-200 dark:border-gray-800">
          <Link href="/marketplace/getting-started/create">
            <Button className="w-full flex items-center justify-center gap-2">
              <PlusIcon className="h-5 w-5" />
              Create New Agent
            </Button>
          </Link>
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

      {/* Main Chat Area with Settings Sidebar */}
      <div className="flex flex-1 h-[calc(100vh-85px-48px)] lg:h-[calc(100vh-85px)] overflow-hidden relative">
        {/* Chat Messages and Input Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedDeployment ? (
            <>
              {/* Chat Header - Fixed (desktop only) */}
              <div className="hidden lg:block">
                <AgentChatHeader
                  selectedDeployment={selectedDeployment}
                  clearChat={clearChat}
                  getInitials={getInitials}
                  fetchDeployments={fetchDeployments}
                />
              </div>

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
            <div className="flex items-center justify-center h-full p-4 sm:p-8">
              <div className="text-center max-w-md px-3 py-6">
                <ChatBubbleLeftRightIcon className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Select an agent to start chatting
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
                  Choose an agent from the sidebar or create a new one to begin
                  a conversation.
                </p>
                <Link href="/marketplace/getting-started/create">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-sm sm:text-base py-1.5 sm:py-2">
                    <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Create New Agent
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Settings Sidebar - Always visible on desktop, slide-in on mobile */}
        {selectedDeployment && (
          <div
            className={`
            ${isMobileSettingsOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none lg:translate-x-0 lg:opacity-100 lg:pointer-events-auto"}
            fixed inset-y-0 right-0 z-30 lg:relative lg:z-auto
            w-[85%] sm:w-[350px] lg:w-80 xl:w-96
            h-full 
            bg-white dark:bg-gray-900
            border-l border-gray-200 dark:border-gray-800
            transition-all duration-300 ease-in-out
            overflow-y-auto
          `}
          >
            {/* Mobile close button */}
            <div className="lg:hidden flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-800">
              <h2 className="font-semibold">Agent Details</h2>
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-8 w-8"
                onClick={() => setIsMobileSettingsOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Agent sidebar content */}
            <AgentSidebar
              selectedDeployment={selectedDeployment}
              isMinimized={isSidebarMinimized}
              onToggleMinimize={() =>
                setIsSidebarMinimized(!isSidebarMinimized)
              }
            />
          </div>
        )}
      </div>

      {/* Backdrop for mobile sidebar/settings - Only visible on mobile */}
      {(isMobileSidebarOpen || isMobileSettingsOpen) && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => {
            setIsMobileSidebarOpen(false);
            setIsMobileSettingsOpen(false);
          }}
        />
      )}
    </div>
  );
}
