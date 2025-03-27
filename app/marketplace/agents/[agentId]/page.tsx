"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Zap, Clock, CheckCircle2, Server, Shield } from "lucide-react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { agents } from "../../data/agents";
import { notFound } from "next/navigation";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "examples", label: "Examples" }
];

export default function AgentDetailPage() {
  const params = useParams();
  const agentId = params.agentId as string;
  const [activeTab, setActiveTab] = useState("overview");
  const [showDemo, setShowDemo] = useState(false);

  const agent = agents.find(a => a.id === agentId);
  
  if (!agent) {
    notFound();
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Performance Metrics */}
            <div className="grid grid-cols-3 gap-6">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <h3 className="text-sm font-medium text-blue-900">Uptime</h3>
                </div>
                <p className="text-2xl font-bold text-blue-600">{agent.reliability.uptime}</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  <h3 className="text-sm font-medium text-green-900">Response Time</h3>
                </div>
                <p className="text-2xl font-bold text-green-600">{agent.reliability.responseTime}</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-600" />
                  <h3 className="text-sm font-medium text-purple-900">Success Rate</h3>
                </div>
                <p className="text-2xl font-bold text-purple-600">{agent.reliability.successRate}</p>
              </div>
            </div>

            {/* Interactive Demo Section */}
            <div className="p-6 border border-gray-200 rounded-xl bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Try it out</h3>
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
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-4">
                        Experience the {agent.name} in action. Try out these sample operations:
                      </p>
                      <div className="space-y-2">
                        {agent.examples.map((example, index) => (
                          <button 
                            key={index}
                            className="w-full p-3 text-left text-sm bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-sm transition-all"
                          >
                            {example.useCase}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Performance Trends */}
            <div className="grid grid-cols-2 gap-6">
              {agent.performance.metrics.map((metric, index) => (
                <div key={index} className="p-6 bg-white rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900">{metric.name}</h3>
                    <span className={`text-sm ${
                      metric.trend === "up" ? "text-green-600" : 
                      metric.trend === "down" ? "text-red-600" : 
                      "text-gray-600"
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case "examples":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 gap-6">
              {agent.examples.map((example, index) => (
                <div key={index} className="p-6 bg-white rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{example.useCase}</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-2">Input</div>
                      <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-900">{example.input}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-2">Output</div>
                      <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-900">{example.output}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-2">Explanation</div>
                      <div className="text-sm text-gray-600">{example.explanation}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-[240px] bg-white border-r border-gray-200 h-screen sticky top-0">
          <div className="p-6">
            <Link 
              href="/marketplace"
              className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Agents
            </Link>

            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Details</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500">Category</div>
                    <div className="text-sm font-medium text-gray-900">{agent.category}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Type</div>
                    <div className="text-sm font-medium text-gray-900">{agent.type}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Reliability</div>
                    <div className="text-sm font-medium text-green-600">{agent.reliability.uptime}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Deployment</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500">Time to Deploy</div>
                    <div className="text-sm font-medium text-gray-900">{agent.deployment.time}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Options</div>
                    <div className="space-y-1 mt-1">
                      {agent.deployment.options.map((option, index) => (
                        <div
                          key={index}
                          className="text-sm font-medium text-gray-900 flex items-center gap-2"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          {option.type}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Target Audience</h3>
                <div className="space-y-1">
                  {agent.targetAudience.roles.map((role, index) => (
                    <div
                      key={index}
                      className="text-sm font-medium text-gray-900 flex items-center gap-2"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      {role}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Header */}
          <div className="border-b border-gray-200 bg-white">
            <div className="px-8 py-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-semibold text-gray-900">{agent.name}</h1>
                    <span className="px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                      {agent.type}
                    </span>
                  </div>
                  <p className="text-gray-600 max-w-2xl">
                    {agent.description}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="lg">
                    Documentation
                  </Button>
                  <Button size="lg" className="bg-[#0A84FF] hover:bg-[#0A84FF]/90">
                    Deploy Agent
                  </Button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-6 -mb-px">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-1 py-3 text-sm font-medium border-b-2 transition-all ${
                      activeTab === tab.id
                        ? "text-[#0A84FF] border-[#0A84FF]"
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
          <div className="p-8">
            <AnimatePresence mode="wait">
              {renderTabContent()}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
} 