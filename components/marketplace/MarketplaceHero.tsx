import Link from "next/link";
import { useState } from "react";
import AgentIntegrationCanvas from "../AgentIntegrationCanvas";
import DeveloperEarningsCanvas from "../DeveloperEarningsCanvas";
import { motion } from "framer-motion";

export default function MarketplaceHero() {
  const [activeTab, setActiveTab] = useState<'business' | 'developer'>('business');

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <>
      {/* AI Agents Marketplace Hero */}
      <div className="bg-white shadow-sm border border-gray-200 overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('business')}
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === 'business'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              For Businesses
            </button>
            <button
              onClick={() => setActiveTab('developer')}
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === 'developer'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              For Developers
            </button>
          </div>
        </div>

        {/* Hero Content */}
        <div className="grid grid-cols-2">
          {/* Left Column - Content */}
          <div className="p-6 flex flex-col h-[550px] bg-gradient-to-br from-gray-50 to-white">
            <motion.div
              key={activeTab}
              initial="initial"
              animate="animate"
              variants={fadeIn}
              className="flex flex-col h-full"
            >
              {activeTab === 'business' ? (
                <>
                  <div>
                    <div className="inline-flex items-center px-3 py-1 text-sm font-medium bg-blue-50 text-blue-600 mb-3">
                      Trusted by 500+ Companies
                    </div>
                    <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                      Agents for Every Business Need
                    </h1>
                    <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                      Deploy pre-built AI agents in minutes, not months. Automate workflows, 
                      enhance productivity, and scale your operations with enterprise-grade AI.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white p-3 border border-gray-100 shadow-sm">
                        <div className="text-3xl font-bold text-blue-600">60%</div>
                        <div className="text-sm text-gray-600">Average Cost Reduction</div>
                      </div>
                      <div className="bg-white p-3 border border-gray-100 shadow-sm">
                        <div className="text-3xl font-bold text-blue-600">24/7</div>
                        <div className="text-sm text-gray-600">Continuous Operation</div>
                      </div>
                      <div className="bg-white p-3 border border-gray-100 shadow-sm">
                        <div className="text-3xl font-bold text-blue-600">&lt;60s</div>
                        <div className="text-sm text-gray-600">Deployment Time</div>
                      </div>
                      <div className="bg-white p-3 border border-gray-100 shadow-sm">
                        <div className="text-3xl font-bold text-blue-600">99.9%</div>
                        <div className="text-sm text-gray-600">Uptime SLA</div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <div className="inline-flex items-center px-3 py-1 text-sm font-medium bg-indigo-50 text-indigo-600 mb-3">
                      $2.5M+ Paid to Developers in 2024
                    </div>
                    <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                      Build & Monetize Agents
                    </h1>
                    <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                      Turn your AI expertise into recurring revenue. Build once, earn forever. 
                      Get instant access to enterprise customers and world-class infrastructure.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white p-3 border border-gray-100 shadow-sm">
                        <div className="text-3xl font-bold text-indigo-600">80%</div>
                        <div className="text-sm text-gray-600">Revenue Share</div>
                      </div>
                      <div className="bg-white p-3 border border-gray-100 shadow-sm">
                        <div className="text-3xl font-bold text-indigo-600">5K+</div>
                        <div className="text-sm text-gray-600">Active Developers</div>
                      </div>
                      <div className="bg-white p-3 border border-gray-100 shadow-sm">
                        <div className="text-3xl font-bold text-indigo-600">10M+</div>
                        <div className="text-sm text-gray-600">Monthly Requests</div>
                      </div>
                      <div className="bg-white p-3 border border-gray-100 shadow-sm">
                        <div className="text-3xl font-bold text-indigo-600">$50K</div>
                        <div className="text-sm text-gray-600">Avg. Monthly Earnings</div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center gap-3 mt-auto">
                {activeTab === 'business' ? (
                  <>
                    <Link
                      href="/marketplace/getting-started/users"
                      className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all"
                    >
                      Get Started 
                    </Link>
                    <Link
                      href="/marketplace/agents"
                      className="inline-flex items-center justify-center px-4 py-3 text-base font-medium text-blue-600 hover:text-blue-700"
                    >
                      Browse Agents →
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/marketplace/getting-started/developers"
                      className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-all"
                    >
                      Start Building
                    </Link>
                    <Link
                      href="/marketplace/getting-started/developers"
                      className="inline-flex items-center justify-center px-4 py-3 text-base font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      View Documentation →
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Integration Canvas */}
          <div className="bg-gray-50 border-l border-gray-200 h-[550px]">
            {activeTab === 'business' ? (
              <AgentIntegrationCanvas />
            ) : (
              <DeveloperEarningsCanvas />
            )}
          </div>
        </div>
      </div>

      {/* Quick Value Props */}
      <div className="bg-white shadow-sm border border-gray-200 p-4 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeTab === 'business' ? (
            <>
              <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-blue-50 to-white border border-blue-100">
                <div className="p-2 bg-blue-100">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Lightning Fast Deployment</h3>
                  <p className="text-gray-600">Deploy AI agents in under 60 seconds with zero configuration or setup required.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-green-50 to-white border border-green-100">
                <div className="p-2 bg-green-100">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Enterprise-Ready</h3>
                  <p className="text-gray-600">SOC 2 compliant, with 99.9% uptime SLA and dedicated support team.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-purple-50 to-white border border-purple-100">
                <div className="p-2 bg-purple-100">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">24/7 Operation</h3>
                  <p className="text-gray-600">Automate workflows around the clock with AI agents that never sleep.</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-indigo-50 to-white border border-indigo-100">
                <div className="p-2 bg-indigo-100">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Modern Development</h3>
                  <p className="text-gray-600">TypeScript-first SDK with full API access and comprehensive documentation.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-pink-50 to-white border border-pink-100">
                <div className="p-2 bg-pink-100">
                  <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Industry-Leading Revenue</h3>
                  <p className="text-gray-600">Earn up to 80% revenue share with transparent pricing and instant payouts.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-yellow-50 to-white border border-yellow-100">
                <div className="p-2 bg-yellow-100">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Built to Scale</h3>
                  <p className="text-gray-600">Infrastructure that handles millions of requests with automatic scaling.</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
} 