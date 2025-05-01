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
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <ChatBubbleLeftRightIcon className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-6">Welcome to Agent Chat</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
            Log in to access your AI agent assistants and start chatting.
          </p>
          <AuthButton />
        </div>
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
