import Link from "next/link";

interface SidebarProps {
  isSidebarOpen: boolean;
  categoryCount: Record<string, number>;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  metrics: Array<{ label: string; value: string; description: string; }>;
  deployedAgents?: Array<{
    id: string;
    name: string;
    status: 'active' | 'inactive' | 'error';
    type: string;
    lastActive: string;
  }>;
}

const categories = [
  { id: "all", name: "All Categories", icon: "🔍", count: 0 },
  { id: "codegenerator", name: "Code Generation", icon: "💻", count: 0 },
  { id: "assistant", name: "Assistant", icon: "🤖", count: 0 },
  { id: "researcher", name: "Research", icon: "🔬", count: 0 },
  { id: "custom", name: "Custom Solutions", icon: "⚙️", count: 0 }
];

const navigationItems = [
  {
    id: "discover",
    name: "Discover",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    href: "/discover",
    section: "marketplace"
  },
  {
    id: "my-deployments",
    name: "My Deployments",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    href: "/deployments",
    section: "user",
    badge: true
  },
  {
    id: "deploy",
    name: "Deploy New",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
    href: "/deploy",
    section: "user"
  },
  {
    id: "my-agents",
    name: "My Published Agents",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
    href: "/published-agents",
    section: "developer"
  },
  {
    id: "create",
    name: "Create Agent",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
    href: "/create",
    section: "developer"
  },
  {
    id: "analytics",
    name: "Analytics",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    href: "/analytics",
    section: "common"
  },
  {
    id: "settings",
    name: "Settings",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    href: "/settings",
    section: "common"
  }
];

export default function Sidebar({
  isSidebarOpen,
  categoryCount,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  metrics,
  deployedAgents = []
}: SidebarProps) {
  const activeAgents = deployedAgents.filter(a => a.status === 'active').length;
  
  return (
    <aside className={`w-[280px] bg-white border-r border-gray-200 flex-shrink-0 transition-all duration-300 
      ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
      fixed md:sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto z-30`}>
      <div className="p-6 space-y-6">
        {/* Quick Start Guide */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">New to AI Agents?</h3>
          <p className="text-xs text-gray-600 mb-3">Get started in 3 simple steps:</p>
          <ol className="text-xs text-gray-600 space-y-2">
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">1</span>
              Choose an agent
            </li>
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">2</span>
              Click "Deploy"
            </li>
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">3</span>
              Start automating
            </li>
          </ol>
          <Link
            href="/docs/quickstart"
            className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-3 inline-block"
          >
            View Quick Start Guide →
          </Link>
        </div>

        {/* Main Navigation */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Navigation</h3>
          <div className="space-y-4">
            {/* Marketplace */}
            <div className="space-y-1">
              {navigationItems
                .filter(item => item.section === "marketplace")
                .map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
            </div>

            {/* User Section */}
            <div className="space-y-1">
              <h4 className="text-xs font-medium text-gray-400 px-3">As User</h4>
              {navigationItems
                .filter(item => item.section === "user")
                .map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    {item.icon}
                    <span>{item.name}</span>
                    {item.badge && deployedAgents.length > 0 && (
                      <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                        {deployedAgents.length}
                      </span>
                    )}
                  </Link>
                ))}
            </div>

            {/* Developer Section */}
            <div className="space-y-1">
              <h4 className="text-xs font-medium text-gray-400 px-3">As Developer</h4>
              {navigationItems
                .filter(item => item.section === "developer")
                .map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
            </div>

            {/* Common Section */}
            <div className="space-y-1">
              {navigationItems
                .filter(item => item.section === "common")
                .map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
            </div>
          </div>
        </div>

        {/* Categories */}
        <div>
          {/* Categories content remains unchanged */}
        </div>

        {/* Agent Overview */}
        {deployedAgents.length > 0 && (
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Agent Overview</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <div className="text-2xl font-bold text-[#0A84FF]">{activeAgents}</div>
                  <div className="text-xs text-gray-600">Active</div>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <div className="text-2xl font-bold text-gray-900">{deployedAgents.length}</div>
                  <div className="text-xs text-gray-600">Total</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Metrics */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Platform Stats</h3>
          <div className="space-y-3">
            {metrics.map((metric, index) => (
              <div key={index} className="flex justify-between items-center group relative">
                <span className="text-xs text-gray-600">{metric.label}</span>
                <span className="text-sm font-semibold text-gray-900">{metric.value}</span>
                {metric.description && (
                  <div className="absolute left-0 -top-2 transform -translate-y-full bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-48">
                    {metric.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
} 