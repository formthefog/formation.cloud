import Link from "next/link";

export default function MarketplaceHero() {
  return (
    <>
      {/* AI Agents Advertisement */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Left Column - Content */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Transform Your Business with AI Agents
            </h2>
            <p className="text-gray-600 mb-6">
              Deploy intelligent AI agents that work 24/7, automating tasks and scaling your operations without adding headcount.
            </p>
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Instant Deployment</h3>
                  <p className="text-sm text-gray-500">From setup to running in under 60 seconds</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Cost Effective</h3>
                  <p className="text-sm text-gray-500">Pay only for what you use, starting at $0.01/request</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Enterprise Ready</h3>
                  <p className="text-sm text-gray-500">SOC 2 compliant with 99.9% uptime SLA</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Get Started Free
              </Link>
              <Link
                href="/docs"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                View Documentation →
              </Link>
            </div>
          </div>
          {/* Right Column - Stats/Metrics */}
          <div className="bg-gray-50 p-8 flex flex-col justify-center border-l border-gray-200">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">500k+</div>
                <div className="text-sm text-gray-500 mt-1">Tasks Automated Daily</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">60%</div>
                <div className="text-sm text-gray-500 mt-1">Cost Reduction</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-500 mt-1">Availability</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">&lt;1s</div>
                <div className="text-sm text-gray-500 mt-1">Response Time</div>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-center gap-6">
                <img src="/logos/microsoft.svg" alt="Microsoft" className="h-8 opacity-50 hover:opacity-75 transition-opacity" />
                <img src="/logos/google.svg" alt="Google" className="h-8 opacity-50 hover:opacity-75 transition-opacity" />
                <img src="/logos/amazon.svg" alt="Amazon" className="h-8 opacity-50 hover:opacity-75 transition-opacity" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Value Props */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
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
            <div className="p-2 bg-green-50 rounded-lg">
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
            <div className="p-2 bg-purple-50 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">24/7 Operation</h3>
              <p className="text-sm text-gray-500">Your AI workforce never sleeps</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 