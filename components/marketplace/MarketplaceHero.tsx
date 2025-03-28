import Link from "next/link";
import { useState } from "react";
import AgentIntegrationCanvas from "../AgentIntegrationCanvas";
import DeveloperEarningsCanvas from "../DeveloperEarningsCanvas";

export default function MarketplaceHero() {
  const [activeTab, setActiveTab] = useState<'business' | 'developer'>('business');

  return (
    <>
      {/* AI Agents Marketplace Hero */}
      <div className="bg-white rounded-none shadow-sm border border-gray-200 overflow-hidden mb-8">
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
          <div className="p-8 flex flex-col justify-center">
            <h1 className="text-4xl font-bold mb-4">
              {activeTab === 'business' ? (
                'AI Agents for Every Business Need'
              ) : (
                'Build & Monetize AI Agents'
              )}
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              {activeTab === 'business' ? (
                'Deploy pre-built AI agents to automate workflows, enhance productivity, and scale your operations.'
              ) : (
                'Create powerful AI agents, publish them on our marketplace, and earn revenue from enterprise customers.'
              )}
            </p>

            <div className="flex items-center gap-4">
              {activeTab === 'business' ? (
                <>
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-none text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    href="/marketplace"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Browse Agents →
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/developers/signup"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-none text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                  >
                    Start Building
                  </Link>
                  <Link
                    href="/docs"
                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    View Documentation →
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right Column - Integration Canvas */}
          <div className="bg-gray-50 border-l border-gray-200 h-[500px]">
            {activeTab === 'business' ? (
              <AgentIntegrationCanvas />
            ) : (
              <DeveloperEarningsCanvas />
            )}
          </div>
        </div>
      </div>

      {/* Quick Value Props */}
      <div className="bg-white rounded-none shadow-sm border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeTab === 'business' ? (
            <>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-none">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Deploy in Seconds</h3>
                  <p className="text-sm text-gray-500">No setup or configuration needed</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-none">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Automate Instantly</h3>
                  <p className="text-sm text-gray-500">Replace manual tasks with AI agents</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-none">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">24/7 Operation</h3>
                  <p className="text-sm text-gray-500">Your AI workforce never sleeps</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-none">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Modern Stack</h3>
                  <p className="text-sm text-gray-500">Built for modern development</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-50 rounded-none">
                  <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Fair Revenue</h3>
                  <p className="text-sm text-gray-500">Industry-leading revenue share</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-50 rounded-none">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Scale Fast</h3>
                  <p className="text-sm text-gray-500">Built for massive scale</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
} 