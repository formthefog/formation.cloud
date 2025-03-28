"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Clock, Zap, Server, Shield } from "lucide-react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface AgentDetailProps {
  name: string;
  description: string;
  type: string;
  capabilities: string[];
  integrations: {
    name: string;
    icon: string;
  }[];
  category: string;
  targetAudience: string[];
  reliability: string;
  deploymentTime: string;
  deploymentOptions: string[];
  technicalSpecs: {
    [key: string]: string;
  };
  pricing: {
    amount: string;
    unit: string;
    features: string[];
  };
  performance: {
    uptime: string;
    responseTime: string;
    successRate: string;
  };
}

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "capabilities", label: "Capabilities" },
  { id: "integrations", label: "Integrations" },
  { id: "technical", label: "Technical" },
  { id: "pricing", label: "Pricing" }
];

export default function AgentDetailPage() {
  const params = useParams();
  const agentId = params.agentId as string;
  const [activeTab, setActiveTab] = useState("overview");
  const [showDemo, setShowDemo] = useState(false);

  const agentData: AgentDetailProps = {
    name: "Financial Operations Agent",
    description: "An AI-powered agent designed to streamline and automate financial operations, from transaction processing to reporting and analysis.",
    type: "Enterprise",
    capabilities: [
      "Automated transaction processing",
      "Real-time financial reporting",
      "Expense management automation",
      "Invoice processing and reconciliation",
      "Budget tracking and forecasting"
    ],
    integrations: [
      { name: "QuickBooks", icon: "/icons/quickbooks.svg" },
      { name: "Xero", icon: "/icons/xero.svg" },
      { name: "Stripe", icon: "/icons/stripe.svg" },
      { name: "SAP", icon: "/icons/sap.svg" }
    ],
    category: "Finance",
    targetAudience: [
      "Finance Teams",
      "Accounting Departments",
      "CFOs",
      "Controllers"
    ],
    reliability: "99.9%",
    deploymentTime: "< 24 hours",
    deploymentOptions: [
      "Cloud",
      "On-premise",
      "Hybrid"
    ],
    technicalSpecs: {
      "Runtime": "Node.js 18+",
      "Memory": "4GB - 16GB",
      "Storage": "50GB SSD",
      "Availability": "Multi-region",
      "Security": "SOC2 Type II Certified"
    },
    pricing: {
      amount: "$0.10",
      unit: "per request",
      features: [
        "Unlimited transactions",
        "Real-time processing",
        "24/7 availability",
        "Enterprise support",
        "Custom integrations",
        "Advanced analytics"
      ]
    },
    performance: {
      uptime: "99.99%",
      responseTime: "~150ms",
      successRate: "99.9%"
    }
  };

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
                <p className="text-2xl font-bold text-blue-600">{agentData.performance.uptime}</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  <h3 className="text-sm font-medium text-green-900">Response Time</h3>
                </div>
                <p className="text-2xl font-bold text-green-600">{agentData.performance.responseTime}</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-600" />
                  <h3 className="text-sm font-medium text-purple-900">Success Rate</h3>
                </div>
                <p className="text-2xl font-bold text-purple-600">{agentData.performance.successRate}</p>
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
                        Experience the Financial Operations Agent in action. Try out these sample operations:
                      </p>
                      <div className="space-y-2">
                        <button className="w-full p-3 text-left text-sm bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-sm transition-all">
                          Process sample invoice
                        </button>
                        <button className="w-full p-3 text-left text-sm bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-sm transition-all">
                          Generate financial report
                        </button>
                        <button className="w-full p-3 text-left text-sm bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-sm transition-all">
                          Reconcile transactions
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );

      case "capabilities":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="grid grid-cols-2 gap-6">
              {agentData.capabilities.map((capability, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">{capability}</h3>
                      <p className="text-sm text-gray-600">
                        Streamline your financial operations with automated {capability.toLowerCase()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case "integrations":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {agentData.integrations.map((integration, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gray-50 p-3 group-hover:bg-blue-50 transition-all">
                  <img src={integration.icon} alt={integration.name} className="w-full h-full object-contain" />
                </div>
                <h3 className="font-medium text-gray-900">{integration.name}</h3>
                <p className="text-sm text-gray-600 mt-1">Seamless integration</p>
              </motion.div>
            ))}
          </motion.div>
        );

      case "technical":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="grid grid-cols-2 gap-6">
              {Object.entries(agentData.technicalSpecs).map(([key, value], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-white rounded-xl border border-gray-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      {key === "Runtime" && <Zap className="w-4 h-4 text-amber-600" />}
                      {key === "Memory" && <Server className="w-4 h-4 text-blue-600" />}
                      {key === "Storage" && <Server className="w-4 h-4 text-purple-600" />}
                      {key === "Availability" && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                      {key === "Security" && <Shield className="w-4 h-4 text-red-600" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-1">{key}</h3>
                      <p className="text-lg font-semibold text-gray-900">{value}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case "pricing":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto"
          >
            <div className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {agentData.pricing.amount}
                  <span className="text-sm text-gray-600 ml-1">{agentData.pricing.unit}</span>
                </h3>
                <p className="text-gray-600">Everything you need to automate your financial operations</p>
              </div>
              
              <div className="space-y-4">
                {agentData.pricing.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <Button className="w-full mt-8 bg-[#0A84FF] hover:bg-[#0A84FF]/90">
                Start Free Trial
              </Button>
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
                    <div className="text-sm font-medium text-gray-900">{agentData.category}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Type</div>
                    <div className="text-sm font-medium text-gray-900">{agentData.type}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Reliability</div>
                    <div className="text-sm font-medium text-green-600">{agentData.reliability}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Deployment</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500">Time to Deploy</div>
                    <div className="text-sm font-medium text-gray-900">{agentData.deploymentTime}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Options</div>
                    <div className="space-y-1 mt-1">
                      {agentData.deploymentOptions.map((option, index) => (
                        <div
                          key={index}
                          className="text-sm font-medium text-gray-900 flex items-center gap-2"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          {option}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Target Audience</h3>
                <div className="space-y-1">
                  {agentData.targetAudience.map((audience, index) => (
                    <div
                      key={index}
                      className="text-sm font-medium text-gray-900 flex items-center gap-2"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      {audience}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto">
          {/* Header */}
          <div className="border-b border-gray-200 bg-white">
            <div className="px-8 py-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-semibold text-gray-900">{agentData.name}</h1>
                    <span className="px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                      {agentData.type}
                    </span>
                  </div>
                  <p className="text-gray-600 max-w-2xl">
                    {agentData.description}
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