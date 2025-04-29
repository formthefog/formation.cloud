"use client";

import "./styles.css";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChartBarIcon,
  CogIcon,
  BoltIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  ClipboardDocumentIcon,
  MagnifyingGlassIcon,
  RocketLaunchIcon,
  CommandLineIcon,
  BeakerIcon,
  ClockIcon,
  CpuChipIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  DocumentMagnifyingGlassIcon,
  CircleStackIcon,
  CloudIcon,
  ShieldCheckIcon,
  PresentationChartLineIcon,
  DocumentDuplicateIcon,
  GlobeAltIcon,
  ArrowRightIcon,
  LightBulbIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  KeyIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import { AuthButton } from "@/components/AuthButton";
import clsx from "clsx";

interface HiredAgent {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  type:
    | "code"
    | "research"
    | "assistant"
    | "analysis"
    | "security"
    | "data"
    | "cloud"
    | "nlp";
  status: "active" | "idle" | "busy";
  requests: number;
  successRate: number;
  lastActive: string;
  avgResponseTime: string;
  costPerRequest: number;
  totalCost: number;
  recentActivity: string;
  load: number; // CPU/Memory load percentage
}

export default function MyAgentsPage() {
  const isLoggedIn = useIsLoggedIn();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<HiredAgent["type"] | "all">(
    "all"
  );
  const [showAuthFlow, setShowAuthFlow] = useState(false);

  // Empty array for agents - removing fake data
  const hiredAgents: HiredAgent[] = [];

  // Basic stats with no agents
  const stats = {
    activeAgents: 0,
    totalRequests: 0,
    avgSuccessRate: 0,
    totalCost: 0,
    busyAgents: 0,
    avgLoad: 0,
  };

  const getAgentIcon = (type: HiredAgent["type"]) => {
    switch (type) {
      case "code":
        return <CommandLineIcon className="w-6 h-6" />;
      case "research":
        return <DocumentMagnifyingGlassIcon className="w-6 h-6" />;
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

  const getStatusColor = (status: HiredAgent["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "busy":
        return "bg-yellow-500";
      case "idle":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const getLoadColor = (load: number) => {
    if (load >= 90) return "text-red-500";
    if (load >= 70) return "text-yellow-500";
    return "text-green-500";
  };

  const filteredAgents = hiredAgents.filter(
    (agent) =>
      (selectedType === "all" || agent.type === selectedType) &&
      (agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const agentTypes: HiredAgent["type"][] = [
    "code",
    "research",
    "analysis",
    "security",
    "data",
    "cloud",
    "nlp",
  ];

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
                Your AI agent command center awaits. Deploy your first agent to
                get started.
              </p>
            </div>
            <Link href="/marketplace/getting-started/create">
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
                    Deploy agents instantly with our streamlined setup process.
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
              <h2 className="text-3xl font-bold mb-4">Your AI Fleet Awaits</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Get early access to our growing marketplace of specialized AI
                agents.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
