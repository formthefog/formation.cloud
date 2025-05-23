import React, { useState } from "react";
import {
  Brain,
  Database,
  Workflow,
  Key,
  Settings,
  Clock,
  Code,
  MessageSquare,
  Zap,
  ChevronRight,
  Edit3,
  Save,
  ChevronLast,
  ChevronFirst,
  Sunrise,
  Plane,
  BarChart3,
  PlayCircle,
  PauseCircle,
  CalendarClock,
  Server,
  Globe,
  HardDrive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AgentSidebarProps {
  selectedDeployment: any;
  isMinimized: boolean;
  onToggleMinimize: () => void;
}

export default function AgentSidebar({
  selectedDeployment,
  isMinimized,
  onToggleMinimize,
}: AgentSidebarProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState(
    selectedDeployment?.config?.system_prompt || ""
  );

  const features = [
    {
      id: "memory",
      title: "Memory & Context",
      description: "Persistent conversation history and preferences",
      icon: <Brain className="h-5 w-5" />,
      enabled: selectedDeployment?.agent?.has_memory || false,
      color:
        "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
    },
    {
      id: "knowledge",
      title: "Knowledge Base",
      description: "Connect to company data and tools",
      icon: <Database className="h-5 w-5" />,
      enabled: selectedDeployment?.agent?.has_knowledge_base || false,
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    },
    {
      id: "workflow",
      title: "Workflow Automation",
      description: "Zapier integration for task automation",
      icon: <Workflow className="h-5 w-5" />,
      enabled: selectedDeployment?.agent?.has_workflow || false,
      color:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    },
    {
      id: "security",
      title: "Enterprise Security",
      description: "SSO and custom authentication",
      icon: <Key className="h-5 w-5" />,
      enabled: selectedDeployment?.agent?.has_security || false,
      color:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    },
  ];

  const handleSavePrompt = () => {
    // TODO: Implement save functionality
    setIsEditing(false);
  };

  if (isMinimized) {
    return (
      <div className="w-[50px] border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col h-full">
        <div className="p-3 border-b border-gray-200 dark:border-gray-800 flex justify-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleMinimize}
                  className="h-8 w-8"
                >
                  <ChevronFirst className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Expand Sidebar</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex-1 py-4 flex flex-col items-center gap-4">
          {features.map((feature) => (
            <TooltipProvider key={feature.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`p-2 rounded-md ${feature.color} cursor-pointer`}
                  >
                    {feature.icon}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p className="font-medium">{feature.title}</p>
                  <p className="text-xs text-gray-500">{feature.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-[600px] border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-gray-500" />
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Agent Settings
          </h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleMinimize}
          className="h-8 w-8"
        >
          <ChevronLast className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* System Prompt */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-gray-500" />
                <h3 className="font-medium text-gray-900 dark:text-white">
                  System Prompt
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? (
                  <Save className="h-4 w-4 mr-1" />
                ) : (
                  <Edit3 className="h-4 w-4 mr-1" />
                )}
                {isEditing ? "Save" : "Edit"}
              </Button>
            </div>
            <Textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              disabled={!isEditing}
              className="min-h-[100px] text-sm"
              placeholder="Enter system prompt..."
            />
          </div>

          {/* Features */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-gray-500" />
              <h3 className="font-medium text-gray-900 dark:text-white">
                Features
              </h3>
            </div>
            <div className="space-y-3">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-md ${feature.color}`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  <Switch checked={feature.enabled} />
                </div>
              ))}
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarClock className="h-5 w-5 text-indigo-500" />
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Automated Tasks
                </h3>
              </div>
              <Badge
                variant="outline"
                className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
              >
                3 Active
              </Badge>
            </div>

            <div className="space-y-3">
              {/* Morning Recommendations */}
              <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
                      <Sunrise className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Daily Travel Inspiration
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Every morning at 8:00 AM
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <PauseCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </Button>
                </div>
                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  Next run in 13h 24m
                </div>
              </div>

              {/* Flight Deals */}
              <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-100 dark:border-purple-800">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300">
                      <Plane className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Flight Deal Monitor
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Hourly checks
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <PlayCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </Button>
                </div>
                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  Running now...
                </div>
              </div>

              {/* Weekly Report */}
              <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-800">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300">
                      <BarChart3 className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Travel Opportunities Report
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Weekly on Monday
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <PauseCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </Button>
                </div>
                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  Next run in 4d 2h
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Zap className="h-4 w-4 mr-2 text-indigo-500" />
                Create New Task
              </Button>
            </div>
          </div>

          {/* Tools */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5 text-gray-500" />
              <h3 className="font-medium text-gray-900 dark:text-white">
                Tools
              </h3>
            </div>
            <div className="space-y-2">
              {selectedDeployment?.agent?.tools?.map(
                (tool: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg border border-gray-100 dark:border-gray-800"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {tool.name}
                      </span>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>{tool.description}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )
              )}
              <Button variant="outline" size="sm" className="w-full">
                Configure Tools
              </Button>
            </div>
          </div>

          {/* Database Integrations */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5 text-gray-500" />
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Database Integrations
                </h3>
              </div>
              <Badge
                variant="outline"
                className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300"
              >
                Quick Connect
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center justify-start gap-2 h-auto py-3"
              >
                <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30">
                  <Database className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-sm">PostgreSQL</div>
                  <div className="text-xs text-gray-500">SQL Database</div>
                </div>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center justify-start gap-2 h-auto py-3"
              >
                <div className="p-1.5 rounded-md bg-green-100 dark:bg-green-900/30">
                  <Globe className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-sm">MongoDB</div>
                  <div className="text-xs text-gray-500">NoSQL Database</div>
                </div>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center justify-start gap-2 h-auto py-3"
              >
                <div className="p-1.5 rounded-md bg-red-100 dark:bg-red-900/30">
                  <HardDrive className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-sm">Redis</div>
                  <div className="text-xs text-gray-500">In-Memory Cache</div>
                </div>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center justify-start gap-2 h-auto py-3 border-dashed"
              >
                <div className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-800">
                  <Zap className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-sm">Add More</div>
                  <div className="text-xs text-gray-500">Connect Database</div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
