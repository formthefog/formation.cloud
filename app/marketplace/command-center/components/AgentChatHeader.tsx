import { Button } from "@/components/ui/button";
import {
  EllipsisHorizontalIcon,
  BoltIcon,
  ChartBarIcon,
  CommandLineIcon,
  CpuChipIcon,
  DocumentTextIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  SignalIcon,
} from "@heroicons/react/24/outline";
import {
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AgentDeployment } from "@/types/agent";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  InformationCircleIcon,
  TrashIcon,
  CogIcon,
  ClockIcon,
  PlusIcon,
  CircleStackIcon,
} from "@heroicons/react/24/outline";
import { Loader2, Brain, Zap, Database } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

// Mock data for cron jobs - in real app this would come from the backend
interface CronJob {
  id: string;
  name: string;
  schedule: string;
  lastRun: string;
  nextRun: string;
  status: "active" | "paused" | "failed";
}

const mockCronJobs: CronJob[] = [
  {
    id: "1",
    name: "Daily Report",
    schedule: "0 0 * * *",
    lastRun: "2024-03-10T00:00:00Z",
    nextRun: "2024-03-11T00:00:00Z",
    status: "active",
  },
  {
    id: "2",
    name: "Weekly Cleanup",
    schedule: "0 0 * * 0",
    lastRun: "2024-03-03T00:00:00Z",
    nextRun: "2024-03-10T00:00:00Z",
    status: "active",
  },
  {
    id: "3",
    name: "Monthly Analytics",
    schedule: "0 0 1 * *",
    lastRun: "2024-03-01T00:00:00Z",
    nextRun: "2024-04-01T00:00:00Z",
    status: "paused",
  },
];

export default function AgentChatHeader({
  selectedDeployment,
  clearChat,
  getInitials,
  fetchDeployments,
}: {
  selectedDeployment: AgentDeployment;
  clearChat: (id: string) => void;
  getInitials: (name: string) => string;
  fetchDeployments: () => Promise<void>;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [showConfigSheet, setShowConfigSheet] = useState(false);
  const [showScheduleSheet, setShowScheduleSheet] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showMongoSheet, setShowMongoSheet] = useState(false);
  const [newCronJob, setNewCronJob] = useState({
    name: "",
    schedule: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Helper function to format numbers
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      notation: num > 999 ? "compact" : "standard",
      maximumFractionDigits: 2,
    }).format(num);
  };

  // Format time from milliseconds
  const formatResponseTime = (ms: number) => {
    return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
  };

  // Calculate agent health/status score (0-100)
  const calculateHealthScore = () => {
    const { success_rate, uptime, error_rate } = selectedDeployment.agent;
    // Ensure the score is properly scaled between 0-100
    return Math.min(
      Math.round(
        (success_rate * 0.5 + uptime * 0.3 + (1 - error_rate) * 0.2) * 100
      ),
      100
    );
  };

  const healthScore = calculateHealthScore();
  const deploymentAge = formatDistanceToNow(
    new Date(selectedDeployment.created_at),
    { addSuffix: true }
  );

  // Format percentage for display (ensuring they're proper percentages between 0-100)
  const formatPercentage = (value: number): string => {
    // Ensure the value is between 0-100
    const normalizedValue =
      value >= 0 && value <= 1 ? value * 100 : Math.min(value, 100);
    return `${normalizedValue.toFixed(1)}%`;
  };

  // New helper function for cron job status
  const getCronStatusColor = (status: CronJob["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "paused":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/deployments/${selectedDeployment.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete deployment");
      }

      toast({
        title: "Success",
        description: "Deployment deleted successfully",
      });
      await fetchDeployments();
      router.push("/marketplace/command-center");
    } catch (error) {
      console.error("Error deleting deployment:", error);
      toast({
        title: "Error",
        description: "Failed to delete deployment",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 z-10">
      <div className="flex flex-col space-y-4">
        {/* Top Row - Basic Info & Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-12 w-12">
                {selectedDeployment.config.avatar ? (
                  <img
                    src={selectedDeployment.config.avatar}
                    alt={selectedDeployment.config.name}
                  />
                ) : (
                  <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-100">
                    {getInitials(selectedDeployment.config.name)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="absolute -bottom-1 -right-1">
                <Badge
                  variant="outline"
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    selectedDeployment.status === "running"
                      ? "bg-green-100 border-green-200 text-green-700"
                      : selectedDeployment.status === "pending"
                        ? "bg-yellow-100 border-yellow-200 text-yellow-700"
                        : "bg-red-100 border-red-200 text-red-700"
                  }`}
                >
                  {selectedDeployment.status}
                </Badge>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedDeployment.config.name}
                </h2>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge
                        variant="secondary"
                        className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                      >
                        v{selectedDeployment.agent.version}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>Agent Version</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      >
                        {healthScore}% Health
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>Overall Health Score</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Model: {selectedDeployment.config.model}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Avg Response:{" "}
                  {formatResponseTime(
                    selectedDeployment.agent.avg_response_time_ms
                  )}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Uptime: {formatPercentage(selectedDeployment.agent.uptime)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-indigo-100"
              onClick={() => setShowConfigSheet(true)}
            >
              <CogIcon className="h-4 w-4 text-indigo-600" />
              <span className="text-indigo-700">Configure</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-100"
              onClick={() => setShowScheduleSheet(true)}
            >
              <ClockIcon className="h-4 w-4 text-purple-600" />
              <span className="text-purple-700">Schedule</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-100"
              onClick={() => setShowMongoSheet(true)}
            >
              <Database className="h-4 w-4 text-blue-600" />
              <span className="text-blue-700">Memory</span>
            </Button>
          </div>
        </div>

        {/* Middle Row - Quick Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-lg p-3 border border-indigo-100 dark:border-indigo-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                Processing Power
              </span>
              <CpuChipIcon className="h-4 w-4 text-indigo-500" />
            </div>
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    CPU:{" "}
                    {(selectedDeployment.agent.avg_cpu_usage * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Memory:{" "}
                    {(
                      (selectedDeployment.agent.avg_memory_mb /
                        selectedDeployment.config.memory) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
              </div>
              <span className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                {selectedDeployment.config.cpu}x
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-3 border border-purple-100 dark:border-purple-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                Performance
              </span>
              <ChartBarIcon className="h-4 w-4 text-purple-500" />
            </div>
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Success:{" "}
                    {formatPercentage(selectedDeployment.agent.success_rate)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Error:{" "}
                    {formatPercentage(selectedDeployment.agent.error_rate)}
                  </span>
                </div>
              </div>
              <span className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                {formatNumber(selectedDeployment.agent.total_requests)}
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-3 border border-blue-100 dark:border-blue-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                Network Activity
              </span>
              <SignalIcon className="h-4 w-4 text-blue-500" />
            </div>
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    I/O: {selectedDeployment.agent.network_io_mbps.toFixed(1)}{" "}
                    MB/s
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Active:{" "}
                    {formatNumber(selectedDeployment.agent.active_users)} users
                  </span>
                </div>
              </div>
              <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                {selectedDeployment.agent.uptime.toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg p-3 border border-emerald-100 dark:border-emerald-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                Intelligence
              </span>
              <Brain className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Temp: {selectedDeployment.config.temperature}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-teal-500"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Context: {formatNumber(selectedDeployment.config.memory)}MB
                  </span>
                </div>
              </div>
              <Zap className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Bottom Row - Capabilities & Tools */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            {/* Capabilities */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">
                Capabilities:
              </span>
              {selectedDeployment.agent.has_external_api_access && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge
                        variant="outline"
                        className="bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300"
                      >
                        <CommandLineIcon className="h-3 w-3 mr-1" />
                        API
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>External API Access</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {selectedDeployment.agent.has_internet_access && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge
                        variant="outline"
                        className="bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-300"
                      >
                        <RocketLaunchIcon className="h-3 w-3 mr-1" />
                        Web
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>Internet Access</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {selectedDeployment.agent.has_filesystem_access && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge
                        variant="outline"
                        className="bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-300"
                      >
                        <DocumentTextIcon className="h-3 w-3 mr-1" />
                        Files
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>Filesystem Access</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            {/* Active Tools */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">
                Active Tools:
              </span>
              {selectedDeployment.agent.tools.slice(0, 3).map((tool, index) => (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge
                        variant="outline"
                        className="bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                      >
                        <LightBulbIcon className="h-3 w-3 mr-1" />
                        {tool.name}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>{tool.description}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
              {selectedDeployment.agent.tools.length > 3 && (
                <Badge
                  variant="outline"
                  className="bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                >
                  +{selectedDeployment.agent.tools.length - 3}
                </Badge>
              )}
            </div>

            {/* Runtime Info */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Runtime: {selectedDeployment.agent.runtime}</span>
              <span>•</span>
              <span>Framework: {selectedDeployment.agent.framework}</span>
              <span>•</span>
              <span>Created: {deploymentAge}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => clearChat(selectedDeployment.id)}
            >
              Clear History
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Configuration Sheet */}
      <Sheet open={showConfigSheet} onOpenChange={setShowConfigSheet}>
        <SheetContent className="w-[600px]">
          <SheetHeader>
            <SheetTitle>Agent Configuration</SheetTitle>
            <SheetDescription>View and manage agent settings</SheetDescription>
          </SheetHeader>
          <Tabs defaultValue="general" className="mt-6">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={selectedDeployment.config.name} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Model</Label>
                  <Input value={selectedDeployment.config.model} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={selectedDeployment.config.description}
                    readOnly
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="resources" className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>CPU</Label>
                  <Input
                    value={`${selectedDeployment.config.cpu} cores`}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label>Memory</Label>
                  <Input
                    value={`${selectedDeployment.config.memory}MB`}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label>Temperature</Label>
                  <Input
                    value={selectedDeployment.config.temperature}
                    readOnly
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="advanced" className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Framework</Label>
                  <Input value={selectedDeployment.agent.framework} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Runtime</Label>
                  <Input value={selectedDeployment.agent.runtime} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Version</Label>
                  <Input value={selectedDeployment.agent.version} readOnly />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>

      {/* Schedule Sheet */}
      <Sheet open={showScheduleSheet} onOpenChange={setShowScheduleSheet}>
        <SheetContent className="w-[600px]">
          <SheetHeader>
            <SheetTitle>Schedule Management</SheetTitle>
            <SheetDescription>
              Manage scheduled tasks and cron jobs
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium">Active Jobs</h3>
              <Button
                size="sm"
                onClick={() => {
                  setNewCronJob({ name: "", schedule: "" });
                  // Open new job dialog
                }}
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Job
              </Button>
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {mockCronJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div>
                    <div className="font-medium">{job.name}</div>
                    <div className="text-sm text-gray-500">{job.schedule}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Next run: {job.nextRun}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${getCronStatusColor(job.status)}`}
                  >
                    {job.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* MongoDB Integration Sheet */}
      <Sheet open={showMongoSheet} onOpenChange={setShowMongoSheet}>
        <SheetContent className="w-[500px]">
          <SheetHeader>
            <SheetTitle>MongoDB Integration</SheetTitle>
            <SheetDescription>Connect your agent to MongoDB</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label>Connection String</Label>
              <Input type="text" placeholder="mongodb://..." />
            </div>
            <div className="space-y-2">
              <Label>Database Name</Label>
              <Input type="text" placeholder="my-database" />
            </div>
            <div className="space-y-2">
              <Label>Collection Name</Label>
              <Input type="text" placeholder="my-collection" />
            </div>
            <Button className="w-full">
              <CircleStackIcon className="h-4 w-4 mr-2" />
              Connect
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Deployment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this deployment? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
