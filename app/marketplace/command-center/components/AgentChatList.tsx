import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@heroicons/react/24/outline";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { AgentDeployment } from "@/types/agent";
import {
  CheckCircleIcon,
  ClockIcon,
  BoltIcon,
  UserGroupIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

interface ChatMessage {
  id: string;
  role: "user" | "agent" | "system";
  content: string;
  timestamp: string;
}
export default function AgentChatList({
  isLoading,
  filteredDeployments,
  selectedDeployment,
  setSelectedDeployment,
  getInitials,
  conversations,
  formatRelativeTime,
  searchQuery,
  setIsNewChatDialogOpen,
}: {
  isLoading: boolean;
  filteredDeployments: AgentDeployment[];
  selectedDeployment: AgentDeployment | null;
  setSelectedDeployment: (deployment: AgentDeployment) => void;
  getInitials: (name: string) => string;
  conversations: Record<string, ChatMessage[]>;
  formatRelativeTime: (timestamp: string) => string;
  searchQuery: string;
  setIsNewChatDialogOpen: (open: boolean) => void;
}) {
  return (
    <div className="flex-1 overflow-y-auto h-full">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
        </div>
      ) : filteredDeployments.length > 0 ? (
        filteredDeployments.map((deployment) => {
          const agent = deployment.agent;
          const lastMessage =
            conversations[deployment.id] &&
            conversations[deployment.id].length > 1
              ? conversations[deployment.id][
                  conversations[deployment.id].length - 1
                ]
              : null;
          const statusColor =
            deployment.status === "success"
              ? "bg-green-500"
              : deployment.status === "pending"
                ? "bg-yellow-500"
                : deployment.status === "failed"
                  ? "bg-red-500"
                  : deployment.status === "success"
                    ? "bg-blue-500"
                    : "bg-gray-400";
          return (
            <div
              key={deployment.id}
              className={
                `group relative flex m-3 items-stretch rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-shadow p-6 mb-6 cursor-pointer min-h-[140px]` +
                (selectedDeployment?.id === deployment.id
                  ? " ring-2 ring-gray-300"
                  : "")
              }
              onClick={() => setSelectedDeployment(deployment)}
            >
              {/* Left: Avatar */}
              <div className="flex flex-col items-center justify-center mr-6">
                <Avatar className="h-16 w-16 shadow-md">
                  {deployment.config.avatar ? (
                    <AvatarImage
                      src={deployment.config.avatar}
                      alt={deployment.config.name}
                    />
                  ) : null}
                  <AvatarFallback className="text-2xl font-bold bg-blue-100 text-blue-600">
                    {getInitials(deployment.config.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
              {/* Right: Info */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                {/* Top row: Name, badges, status */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-extrabold text-xl text-gray-900 dark:text-white truncate">
                        {deployment.config.name}
                      </h3>
                      {/* Agent type badge */}
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wide">
                        {agent.agent_type}
                      </span>
                      {/* Framework badge */}
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold uppercase tracking-wide">
                        {agent.framework}
                      </span>
                      {/* Tags (up to 2) */}
                      {agent.tags?.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* Status dot and label */}
                  <div className="flex flex-col items-center gap-1 ml-4">
                    <span
                      className={`h-3 w-3 rounded-full ${statusColor}`}
                    ></span>
                    <span className="text-xs font-bold italic text-gray-700 dark:text-gray-200">
                      {deployment.status.charAt(0).toUpperCase() +
                        deployment.status.slice(1)}
                    </span>
                  </div>
                </div>
                {/* Description */}
                <p className="text-base text-gray-700 dark:text-gray-300 line-clamp-2 mb-2 mt-1">
                  {agent.description}
                </p>
                {/* Stats row */}
                <div className="flex items-center gap-6 text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <div className="flex flex-col justify-center items-center gap-1">
                    <UserGroupIcon className="h-4 w-4" />
                    <span>Usage:</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-200">
                      {agent.usage_count ?? 0}
                    </span>
                  </div>
                  <div className="flex flex-col justify-center items-center gap-1">
                    <BoltIcon className="h-4 w-4" />
                    <span>Avg. Response:</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-200">
                      {agent.avg_response_time_ms ?? "-"} ms
                    </span>
                  </div>
                  <div className="flex flex-col justify-center items-center gap-1">
                    <ClockIcon className="h-4 w-4" />
                    <span>Deployed:</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-200">
                      {formatRelativeTime(deployment.created_at)}
                    </span>
                  </div>
                  <div className="flex flex-col justify-center items-center gap-1">
                    <ArrowPathIcon className="h-4 w-4" />
                    <span>Uptime:</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-200">
                      {agent.uptime ?? "-"}%
                    </span>
                  </div>
                </div>
                {/* Last message */}
                {lastMessage && (
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate">
                    <span className="font-medium">
                      {lastMessage.role === "user" ? "You: " : ""}
                    </span>
                    {lastMessage.content}
                  </div>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
          <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No agents found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchQuery
              ? "Try adjusting your search query"
              : "Deploy your first agent to start chatting"}
          </p>
          {!searchQuery && (
            <Button
              className="mt-4 bg-blue-600 hover:bg-blue-700"
              onClick={() => setIsNewChatDialogOpen(true)}
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add New Agent
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
