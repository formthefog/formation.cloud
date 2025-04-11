import Link from "next/link";

export default function DeveloperRevenue() {
  return (
    <div className="my-12">
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-none p-8 border border-blue-100">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Column - Content */}
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-none bg-blue-100 text-blue-600 text-sm font-medium mb-4">
              For Developers
            </div>
            <h2 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Be Among the First Agent Developers
            </h2>
            <p className="text-gray-600 mb-6">
              Join Formation's marketplace at launch and position yourself as a pioneer in the AI agent economy. Build and monetize your AI agents with our revenue-sharing model.
            </p>
            
            {/* Key Benefits */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-none flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Generous Revenue Share</h3>
                  <p className="text-sm text-gray-600">Earn up to 80% on every request</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-none flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Early Access Advantage</h3>
                  <p className="text-sm text-gray-600">Be among the first to reach enterprise customers</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-none flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Simple Deployment</h3>
                  <p className="text-sm text-gray-600">Deploy with our SDK in minutes</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/marketplace/getting-started/create"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-none text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Start Building →
              </Link>
            </div>
          </div>

          {/* Right Column - Market Opportunity */}
          <div className="space-y-8">
            {/* Market Opportunity */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-none p-4 shadow-sm border border-gray-100">
                <div className="text-3xl font-bold text-gray-900">$1.3T</div>
                <div className="text-sm text-gray-600 mt-1">AI Market by 2030</div>
              </div>
              <div className="bg-white rounded-none p-4 shadow-sm border border-gray-100">
                <div className="text-3xl font-bold text-gray-900">80%</div>
                <div className="text-sm text-gray-600 mt-1">Revenue Share</div>
              </div>
              <div className="bg-white rounded-none p-4 shadow-sm border border-gray-100">
                <div className="text-3xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-600 mt-1">Developer Support</div>
              </div>
              <div className="bg-white rounded-none p-4 shadow-sm border border-gray-100">
                <div className="text-3xl font-bold text-gray-900">0%</div>
                <div className="text-sm text-gray-600 mt-1">Platform Fee at Launch</div>
              </div>
            </div>

            {/* Value Proposition */}
            <div className="bg-white rounded-none p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-none bg-blue-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Launch Opportunity</div>
                  <div className="text-sm text-gray-600">Be a Founding Developer</div>
                </div>
              </div>
              <p className="text-gray-600">
                Join Formation at launch and help shape the future of AI agents. As a founding developer, you'll have the opportunity to establish your presence in the marketplace and set the standard for AI agent development.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 