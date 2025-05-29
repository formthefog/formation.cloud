// DocsSidebar.tsx - Updated with mobile support
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavLink {
  href?: string;
  label: string;
  children?: NavLink[];
}

interface DocsSidebarProps {
  links: NavLink[];
  title?: string;
}

export default function DocsSidebar({
  links,
  title = "Docs Navigation",
}: DocsSidebarProps) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  const toggleSection = (label: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const renderLinks = (links: NavLink[], level = 0) => (
    <ul className={level === 0 ? "space-y-1" : "ml-4 space-y-1"}>
      {links.map((link) => {
        const isActive = pathname === link.href;
        const hasChildren = link.children && link.children.length > 0;
        const isExpanded = expandedSections[link.label];

        return (
          <li key={link.href || link.label}>
            <div className="flex items-center">
              {hasChildren && (
                <button
                  onClick={() => toggleSection(link.label)}
                  className="mr-2 p-1 text-gray-500 hover:text-gray-700"
                  aria-expanded={isExpanded}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transition-transform${isExpanded ? " rotate-90" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}
              {hasChildren ? (
                <span
                  onClick={() => toggleSection(link.label)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap text-md font-medium transition-all text-gray-700 cursor-pointer select-none ${level > 0 ? "pl-6 text-sm" : ""}`}
                  aria-current={undefined}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      toggleSection(link.label);
                  }}
                  aria-expanded={isExpanded}
                >
                  {link.label}
                </span>
              ) : (
                <Link
                  href={link.href || ""}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap text-md transition-all font-medium
                    ${isActive ? "bg-blue-50 text-formation-blue font-semibold shadow-sm" : "text-gray-700 hover:bg-blue-50 hover:text-formation-blue"}
                    ${level > 0 ? "pl-6 text-sm" : ""}
                  `}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </Link>
              )}
            </div>
            {hasChildren && (
              <div
                style={{
                  maxHeight: isExpanded ? 500 : 0,
                  overflow: "hidden",
                  transition: "max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  opacity: isExpanded ? 1 : 0,
                  transform: isExpanded ? "translateY(0)" : "translateY(-8px)",
                  transitionProperty: "max-height, opacity, transform",
                  transitionDuration: "300ms",
                  transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {isExpanded && renderLinks(link.children, level + 1)}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <nav className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-6 w-full">
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
        {title}
      </h2>
      {renderLinks(links)}
    </nav>
  );
}
