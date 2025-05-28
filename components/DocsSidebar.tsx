"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

  const renderLinks = (links: NavLink[], level = 0) => (
    <ul className={level === 0 ? "space-y-1" : "ml-4 space-y-1"}>
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <li key={link.href || link.label}>
            <Link
              href={link.href || ""}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap text-md transition-all font-medium
                ${isActive ? "bg-blue-50 text-blue-600 font-semibold shadow-sm" : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"}
                ${level > 0 ? "pl-6 text-sm" : ""}
              `}
              aria-current={isActive ? "page" : undefined}
            >
              {link.label}
            </Link>
            {link.children && renderLinks(link.children, level + 1)}
          </li>
        );
      })}
    </ul>
  );

  return (
    <nav className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 w-full">
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
        {title}
      </h2>
      {renderLinks(links)}
    </nav>
  );
}
