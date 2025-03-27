"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import MarketplaceNavigation from "@/components/MarketplaceNavigation";

interface MarketplaceAgent {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  probability: string;
  deployTime: string;
  price: {
    amount: string;
    unit: string;
  };
  features: string[];
  integrations: string[];
  capabilities: string[];
  stats: {
    uptime: string;
    responseTime: string;
    accuracy: string;
  };
  type: "Serverless" | "Startup" | "Individual" | "Enterprise";
  badge?: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  useCases: string[];
}

const featuredAgents: MarketplaceAgent[] = [
  {
    id: "gpt4-copilot",
    name: "GPT-4 Copilot Agent",
    tagline: "Enterprise-grade AI assistant for your team",
    description: "Boost productivity across your organization with context-aware AI assistance.",
    category: "productivity",
    probability: "98%",
    deployTime: "Instant",
    price: {
      amount: "$0.10",
      unit: "per request"
    },
    features: [
      "Advanced context understanding",
      "Multi-language support",
      "Custom knowledge base integration",
      "Enterprise security compliance"
    ],
    integrations: ["Slack", "MS Teams", "Discord", "Notion"],
    capabilities: [
      "Document analysis & summarization",
      "Code review & explanation",
      "Meeting notes & action items",
      "Email drafting & responses"
    ],
    stats: {
      uptime: "99.99%",
      responseTime: "~150ms",
      accuracy: "98.5%"
    },
    type: "Serverless",
    badge: "Featured",
    isBestSeller: true,
    useCases: [
      "Software Development",
      "Customer Support",
      "Content Creation",
      "Project Management"
    ]
  },
  {
    id: "data-insights",
    name: "Data Insights Explorer",
    tagline: "Turn your data into actionable insights",
    description: "Advanced analytics and visualization agent powered by machine learning.",
    category: "analytics",
    probability: "96%",
    deployTime: "< 1 hour",
    price: {
      amount: "$0.15",
      unit: "per analysis"
    },
    features: [
      "Real-time data processing",
      "Automated trend detection",
      "Custom dashboard creation",
      "Predictive analytics"
    ],
    integrations: ["Tableau", "Power BI", "Google Analytics", "Snowflake"],
    capabilities: [
      "Pattern recognition",
      "Anomaly detection",
      "Forecast modeling",
      "Data visualization"
    ],
    stats: {
      uptime: "99.95%",
      responseTime: "~200ms",
      accuracy: "97.8%"
    },
    type: "Startup",
    badge: "New",
    isNew: true,
    useCases: [
      "Business Intelligence",
      "Market Research",
      "Performance Monitoring",
      "Risk Analysis"
    ]
  },
  {
    id: "security-sentinel",
    name: "Security Sentinel",
    tagline: "AI-powered security monitoring & response",
    description: "24/7 security monitoring with automated threat detection and response.",
    category: "security",
    probability: "99%",
    deployTime: "< 2 hours",
    price: {
      amount: "$0.20",
      unit: "per hour"
    },
    features: [
      "Real-time threat detection",
      "Automated incident response",
      "Compliance monitoring",
      "Zero-day vulnerability protection"
    ],
    integrations: ["AWS Security Hub", "Azure Sentinel", "Splunk", "CloudFlare"],
    capabilities: [
      "Network monitoring",
      "Log analysis",
      "Threat hunting",
      "Security automation"
    ],
    stats: {
      uptime: "99.999%",
      responseTime: "~100ms",
      accuracy: "99.9%"
    },
    type: "Enterprise",
    badge: "Enterprise",
    isBestSeller: true,
    useCases: [
      "Enterprise Security",
      "Compliance Management",
      "DevSecOps",
      "Incident Response"
    ]
  },
  {
    id: "content-studio",
    name: "Content Studio Pro",
    tagline: "Your AI-powered creative partner",
    description: "Generate, edit, and optimize content across all channels.",
    category: "marketing",
    probability: "94%",
    deployTime: "Instant",
    price: {
      amount: "$0.08",
      unit: "per generation"
    },
    features: [
      "Multi-format content generation",
      "SEO optimization",
      "Brand voice customization",
      "Performance analytics"
    ],
    integrations: ["WordPress", "Shopify", "HubSpot", "Mailchimp"],
    capabilities: [
      "Blog writing",
      "Social media content",
      "Email campaigns",
      "Ad copy generation"
    ],
    stats: {
      uptime: "99.9%",
      responseTime: "~180ms",
      accuracy: "96.5%"
    },
    type: "Serverless",
    badge: "Popular",
    isBestSeller: true,
    useCases: [
      "Content Marketing",
      "Social Media",
      "Email Marketing",
      "Copywriting"
    ]
  }
];

const agents: MarketplaceAgent[] = [
  {
    id: "financial-ops",
    name: "Financial Operations Agent",
    tagline: "Automated accounting & financial management",
    description: "Automates accounting tasks, manages invoices, tracks expenses, and generates financial reports.",
    category: "accounting",
    probability: "92%",
    deployTime: "< 24 hours",
    price: {
      amount: "$0.05",
      unit: "per request"
    },
    features: [
      "Instant API access",
      "Deploy in < 24 hours",
      "Serverless - No infrastructure to manage"
    ],
    integrations: [
      "QuickBooks",
      "Xero",
      "Stripe",
      "PayPal"
    ],
    capabilities: [
      "Automated bookkeeping",
      "Invoice processing",
      "Expense tracking",
      "Financial reporting",
      "Tax preparation assistance"
    ],
    stats: {
      uptime: "99.99%",
      responseTime: "~200ms",
      accuracy: "99.2%"
    },
    type: "Serverless",
    isNew: true,
    useCases: [
      "Small Business",
      "Startups",
      "Freelancers",
      "Enterprise Finance"
    ]
  },
  {
    id: "marketing-campaign",
    name: "Marketing Campaign Agent",
    tagline: "Full-stack digital marketing automation",
    description: "Creates, optimizes, and manages digital marketing campaigns across multiple platforms.",
    category: "marketing",
    probability: "88%",
    deployTime: "< 24 hours",
    price: {
      amount: "$0.08",
      unit: "per request"
    },
    features: [
      "Instant API access",
      "Deploy in < 24 hours",
      "Serverless - No infrastructure to manage"
    ],
    integrations: [
      "Google Ads",
      "Facebook Ads",
      "LinkedIn"
    ],
    capabilities: [
      "Campaign creation & optimization",
      "A/B testing",
      "Performance analytics",
      "Content scheduling",
      "ROI tracking"
    ],
    stats: {
      uptime: "99.95%",
      responseTime: "~250ms",
      accuracy: "94.8%"
    },
    type: "Serverless",
    isNew: true,
    useCases: [
      "Small Business",
      "Startups",
      "Freelancers",
      "Enterprise Marketing"
    ]
  },
  // Add more agents based on the screenshot...
];

const solutions = [
  {
    title: "For Startups",
    description: "Scale your operations without scaling your team",
    image: "/solutions/startup.png",
    benefits: ["Reduce operational costs", "Automate repetitive tasks", "24/7 availability"]
  },
  {
    title: "For Enterprise",
    description: "Enterprise-grade AI solutions with maximum security",
    image: "/solutions/enterprise.png",
    benefits: ["SOC 2 compliance", "Custom deployment", "Priority support"]
  },
  {
    title: "For Developers",
    description: "Integrate AI capabilities into your applications",
    image: "/solutions/developer.png",
    benefits: ["REST API access", "SDK support", "Custom model training"]
  }
];

const categories = [
  { id: "all", name: "All Categories", count: 12 },
  { id: "productivity", name: "Productivity", count: 4 },
  { id: "analytics", name: "Analytics", count: 2 },
  { id: "security", name: "Security", count: 2 },
  { id: "marketing", name: "Marketing", count: 3 },
  { id: "accounting", name: "Accounting", count: 1 }
];

const deploymentTypes = [
  { id: "serverless", name: "Serverless", icon: "⚡" },
  { id: "startup", name: "Startup", icon: "🚀" },
  { id: "individual", name: "Individual", icon: "👤" },
  { id: "enterprise", name: "Enterprise", icon: "🏢" }
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CTO at TechFlow",
    company: "TechFlow",
    image: "/testimonials/sarah.jpg",
    quote: "Formation's AI agents have transformed our customer support operations. We've seen a 60% reduction in response times and improved customer satisfaction scores.",
    logo: "/companies/techflow.svg"
  },
  {
    name: "Michael Rodriguez",
    role: "Head of Operations",
    company: "ScaleUp Finance",
    image: "/testimonials/michael.jpg",
    quote: "The financial operations agent has eliminated manual bookkeeping tasks and reduced our accounting costs by 40%. It's like having an entire finance team working 24/7.",
    logo: "/companies/scaleup.svg"
  },
  {
    name: "Emily Watson",
    role: "Marketing Director",
    company: "GrowthLabs",
    image: "/testimonials/emily.jpg",
    quote: "We've automated our entire campaign management process. The AI agent handles everything from A/B testing to performance optimization, saving us countless hours.",
    logo: "/companies/growthlabs.svg"
  }
];

const metrics = [
  { label: "Active Agents", value: "50,000+", description: "AI agents deployed globally" },
  { label: "Processing Power", value: "1M+", description: "Requests processed daily" },
  { label: "Customer Satisfaction", value: "98%", description: "Average satisfaction rate" },
  { label: "Cost Savings", value: "$2M+", description: "Average yearly savings per enterprise customer" }
];

const useCases = [
  {
    title: "Enterprise Operations",
    description: "Streamline your business operations with AI-powered automation",
    benefits: [
      "Reduce operational costs by up to 40%",
      "Automate repetitive tasks across departments",
      "Improve accuracy and compliance",
      "24/7 availability and instant scaling"
    ],
    icon: "🏢",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    title: "Customer Support",
    description: "Deliver exceptional customer service with AI assistance",
    benefits: [
      "Instant response to customer inquiries",
      "Multi-language support",
      "Automated ticket routing and resolution",
      "Personalized customer interactions"
    ],
    icon: "💬",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    title: "Financial Management",
    description: "Optimize your financial operations with intelligent automation",
    benefits: [
      "Automated bookkeeping and reconciliation",
      "Real-time financial reporting",
      "Fraud detection and prevention",
      "Tax preparation assistance"
    ],
    icon: "💰",
    gradient: "from-green-500 to-emerald-500"
  }
];

const pricingTiers = [
  {
    name: "Starter",
    price: "$99",
    unit: "per month",
    description: "Perfect for small businesses and startups",
    features: [
      "Up to 5 AI agents",
      "1,000 requests per month",
      "Basic integrations",
      "Email support",
      "99.9% uptime SLA"
    ],
    isPopular: false
  },
  {
    name: "Professional",
    price: "$299",
    unit: "per month",
    description: "Ideal for growing companies",
    features: [
      "Up to 20 AI agents",
      "10,000 requests per month",
      "Advanced integrations",
      "Priority support",
      "99.99% uptime SLA",
      "Custom agent training"
    ],
    isPopular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    unit: "contact sales",
    description: "For large organizations with custom needs",
    features: [
      "Unlimited AI agents",
      "Unlimited requests",
      "Custom integrations",
      "24/7 dedicated support",
      "99.999% uptime SLA",
      "Custom development",
      "On-premise deployment"
    ],
    isPopular: false
  }
];

export default function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const filteredAgents = featuredAgents.filter(agent => {
    const matchesCategory = selectedCategory === "all" || agent.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(agent.type.toLowerCase());
    return matchesCategory && matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="flex">
        {/* Sidebar */}
        <aside className={`w-[240px] bg-white border-r border-gray-200 flex-shrink-0 transition-all duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed md:static h-[calc(100vh-73px)] z-30`}>
          <div className="p-6 space-y-6">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#0A84FF] focus:ring-2 focus:ring-[#0A84FF]/20 transition-all outline-none text-sm text-gray-900 placeholder:text-gray-400"
              />
              <svg className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Categories</h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                      selectedCategory === category.id
                        ? "bg-[#0A84FF]/10 text-[#0A84FF]"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Deployment Types */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Deployment Type</h3>
              <div className="space-y-1">
                {deploymentTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setSelectedTypes(prev =>
                        prev.includes(type.id)
                          ? prev.filter(t => t !== type.id)
                          : [...prev, type.id]
                      );
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                      selectedTypes.includes(type.id)
                        ? "bg-[#0A84FF]/10 text-[#0A84FF]"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span>{type.icon}</span>
                    <span>{type.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-73px)] max-w-[1400px] mx-auto">
          <div className="p-8">
            {/* Mobile Toggle */}
            <button
              onClick={() => setIsSidebarOpen(prev => !prev)}
              className="md:hidden mb-6 px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            >
              {isSidebarOpen ? "Hide Filters" : "Show Filters"}
            </button>

            {/* Grid of Agents */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAgents.map((agent) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200"
                >
                  <Link href={`/marketplace/agents/${agent.id}`}>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
                            <div className="flex gap-2">
                              {agent.badge && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                  {agent.badge}
                                </span>
                              )}
                              {agent.isNew && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full animate-pulse">
                                  New
                                </span>
                              )}
                              {agent.isBestSeller && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                                  Best Seller
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{agent.tagline}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500 mb-1">Starting at</div>
                          <div className="text-lg font-bold text-[#0A84FF]">
                            {agent.price.amount}
                            <span className="text-xs text-gray-500 ml-1">{agent.price.unit}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{agent.description}</p>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Key Features</h4>
                          <ul className="space-y-1">
                            {agent.features.slice(0, 3).map((feature) => (
                              <li key={feature} className="flex items-center gap-2 text-gray-600">
                                <svg className="w-3 h-3 text-[#0A84FF] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-xs">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Use Cases</h4>
                          <ul className="space-y-1">
                            {agent.useCases.slice(0, 3).map((useCase) => (
                              <li key={useCase} className="flex items-center gap-2 text-gray-600">
                                <svg className="w-3 h-3 text-[#0A84FF] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <span className="text-xs">{useCase}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Integrations</h4>
                        <div className="flex flex-wrap gap-1">
                          {agent.integrations.map((integration) => (
                            <span
                              key={integration}
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md"
                            >
                              {integration}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-4">
                          <div>
                            <div className="text-xs text-gray-500">Success Rate</div>
                            <div className="text-sm font-semibold text-green-600">{agent.probability}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Response Time</div>
                            <div className="text-sm font-semibold text-gray-900">{agent.stats.responseTime}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Uptime</div>
                            <div className="text-sm font-semibold text-gray-900">{agent.stats.uptime}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 