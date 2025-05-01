import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  categoryCount: Record<string, number>;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  metrics: Array<{ label: string; value: string; description: string }>;
  deployedAgents?: Array<{
    id: string;
    name: string;
    status: "active" | "inactive" | "error";
    type: string;
    lastActive: string;
  }>;
}

const navigationItems = [
  {
    id: "getting-started",
    name: "Getting Started",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    href: "/marketplace/getting-started/create",
    section: "top",
  },
  {
    id: "discover",
    name: "Discover",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
    href: "/marketplace",
    section: "top",
  },

  {
    id: "agents",
    name: "Explore Agents",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    href: "/marketplace/agents",
    section: "top",
  },
  {
    id: "spacer-1",
    type: "spacer",
    section: "top",
  },
  {
    id: "my-deployments",
    name: "Command Center",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 10h16M4 14h16M4 18h16"
        />
      </svg>
    ),
    href: "/marketplace/command-center",
    section: "top",
    badge: true,
    special: true,
  },
  {
    id: "spacer-2",
    type: "spacer",
    section: "top",
  },
  {
    id: "my-agents",
    name: "My Published Agents",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
        />
      </svg>
    ),
    href: "/marketplace/my-published-agents",
    section: "top",
  },
  {
    id: "create",
    name: "Create Agent",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
    ),
    href: "/marketplace/create-agent",
    section: "top",
  },
];

export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  categoryCount,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  metrics,
  deployedAgents = [],
}: SidebarProps) {
  const pathname = usePathname();
  const activeAgents = deployedAgents.filter(
    (a) => a.status === "active"
  ).length;
  const [showQuickStart, setShowQuickStart] = useState(true);

  // Initialize all sections as collapsed
  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({
    user: true,
    developer: true,
    overview: true,
    stats: true,
  });

  useEffect(() => {
    // Load quick start preference
    const isHidden = localStorage.getItem("hideQuickStartGuide");
    if (isHidden === "true") {
      setShowQuickStart(false);
    }

    // Load collapsed sections preferences, but maintain closed state if not found
    const savedCollapsedSections = localStorage.getItem("collapsedSections");
    if (savedCollapsedSections) {
      const parsed = JSON.parse(savedCollapsedSections);
      // Ensure any new sections are collapsed by default
      setCollapsedSections((prev) => ({
        ...prev,
        ...parsed,
      }));
    }
  }, []);

  const handleCloseQuickStart = () => {
    setShowQuickStart(false);
    localStorage.setItem("hideQuickStartGuide", "true");
  };

  const toggleSection = (section: string) => {
    const newCollapsedSections = {
      ...collapsedSections,
      [section]: !collapsedSections[section],
    };
    setCollapsedSections(newCollapsedSections);
    localStorage.setItem(
      "collapsedSections",
      JSON.stringify(newCollapsedSections)
    );
  };

  const SectionHeader = ({
    title,
    section,
  }: {
    title: string;
    section: string;
  }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors group"
      aria-expanded={!collapsedSections[section]}
      aria-controls={`section-${section}`}
    >
      <span>{title}</span>
      <svg
        className={`w-4 h-4 transition-transform duration-200 ${
          collapsedSections[section] ? "-rotate-90" : ""
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
  );

  const isActiveLink = (href: string) => {
    if (href === "/marketplace" && pathname === "/marketplace") {
      return true;
    }
    return pathname.startsWith(href) && href !== "/marketplace";
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <aside
      className={`w-[280px] bg-white border-r border-gray-200 flex-shrink-0 transition-all duration-300 ease-in-out
        fixed md:sticky top-[73px] h-[calc(100vh-73px)] 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        overflow-y-auto z-30`}
    >
      <div className="flex flex-col h-full p-6">
        <div className="flex-grow space-y-6">
          {/* Quick Start Guide */}
          {showQuickStart && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg relative">
              <button
                onClick={handleCloseQuickStart}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close quick start guide"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                New to AI Agents?
              </h3>
              <p className="text-xs text-gray-600 mb-3">
                Get started in 3 simple steps:
              </p>
              <ol className="text-xs text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                    1
                  </span>
                  Choose an agent
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                    2
                  </span>
                  Click "Deploy"
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                    3
                  </span>
                  Start automating
                </li>
              </ol>
              <Link
                href="/marketplace/getting-started"
                className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-3 inline-block"
              >
                View Quick Start Guide →
              </Link>
            </div>
          )}

          {/* Main Navigation */}
          <nav>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Navigation
            </h3>
            <div className="space-y-4">
              {/* Top Level Navigation */}
              <div className="space-y-1">
                {navigationItems
                  .filter((item) => item.section === "top")
                  .map((item) =>
                    item.type === "spacer" ? (
                      <div
                        key={item.id}
                        className="h-px bg-gray-200 dark:bg-gray-700 my-2"
                      />
                    ) : (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={handleLinkClick}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all
                          ${item.special ? "bg-gradient-to-r from-blue-500/5 to-purple-500/5 hover:from-blue-500/10 hover:to-purple-500/10" : ""}
                          ${
                            isActiveLink(item.href)
                              ? item.special
                                ? "text-blue-600 font-medium"
                                : "bg-blue-50 text-blue-600 font-medium"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                      >
                        <div
                          className={`${item.special ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white p-1 rounded" : ""}`}
                        >
                          {item.icon}
                        </div>
                        <span>{item.name}</span>
                        {item.badge && deployedAgents.length > 0 && (
                          <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                            {deployedAgents.length}
                          </span>
                        )}
                      </Link>
                    )
                  )}
              </div>

              {/* User Section */}
              {/* <div className="space-y-1">
                <SectionHeader title="As User" section="user" />
                <div
                  id="section-user"
                  className={`space-y-1 overflow-hidden transition-all duration-200 ${
                    collapsedSections.user ? 'h-0' : 'h-auto'
                  }`}
                >
                  {navigationItems
                    .filter(item => item.section === "user")
                    .map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={handleLinkClick}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all
                          ${isActiveLink(item.href)
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'}`}
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
              </div> */}

              {/* Developer Section */}
              {/* <div className="space-y-1">
                <SectionHeader title="As Developer" section="developer" />
                <div
                  id="section-developer"
                  className={`space-y-1 overflow-hidden transition-all duration-200 ${
                    collapsedSections.developer ? 'h-0' : 'h-auto'
                  }`}
                >
                  {navigationItems
                    .filter(item => item.section === "developer")
                    .map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={handleLinkClick}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all
                          ${isActiveLink(item.href)
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'}`}
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    ))}
                </div>
              </div> */}
            </div>
          </nav>

          {/* Agent Overview */}
          {deployedAgents.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <SectionHeader title="Agent Overview" section="overview" />
              <div
                id="section-overview"
                className={`overflow-hidden transition-all duration-200 ${
                  collapsedSections.overview ? "h-0" : "h-auto"
                }`}
              >
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <div className="text-2xl font-bold text-[#0A84FF]">
                        {activeAgents}
                      </div>
                      <div className="text-xs text-gray-600">Active</div>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <div className="text-2xl font-bold text-gray-900">
                        {deployedAgents.length}
                      </div>
                      <div className="text-xs text-gray-600">Total</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success Metrics */}
          {/* <div className="border-t border-gray-200 pt-6">
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
          </div> */}
        </div>

        {/* Settings at bottom */}
        <div className="pt-6 border-t border-gray-200">
          <Link
            href="/marketplace/settings"
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all
              ${
                isActiveLink("/marketplace/settings")
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>Settings</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
