import React from "react";
import "github-markdown-css/github-markdown.css";
import FormationLogo from "@/components/icons/FormationLogo";
import DocsSidebar from "@/components/DocsSidebar";

const navLinks = [
  { href: "/docs", label: "Home" },
  {
    label: "Users",
    href: "/docs/users",
    children: [
      { href: "/docs/users/agents/getting-started", label: "Getting Started" },
      {
        href: "/docs/users/models/inference-guide",
        label: "Model Inference Guide",
      },
      { href: "/docs/users/models/api-reference", label: "API Reference" },
      { href: "/docs/users/agents/examples", label: "Code Examples" },
    ],
  },
  {
    label: "Developers",
    href: "/docs/developers",
    children: [
      {
        href: "/docs/developers/agents/building-agents",
        label: "Building Agents",
      },
      {
        href: "/docs/developers/agents/deployment",
        label: "Deployment Guide (Agents)",
      },
      { href: "/docs/developers/agents/examples", label: "Agent Examples" },
      {
        href: "/docs/developers/models/model-requirements",
        label: "Model Requirements",
      },
      {
        href: "/docs/developers/models/deployment",
        label: "Deployment Guide (Models)",
      },
      {
        href: "/docs/developers/monetization/pricing-models",
        label: "Pricing Models",
      },
      {
        href: "/docs/developers/monetization/billing-integration",
        label: "Billing Integration",
      },
    ],
  },
  {
    label: "Operators",
    href: "/docs/operators",
    children: [
      { href: "/docs/operators/quick-start", label: "Quick Start" },
      { href: "/docs/operators/two-node-setup", label: "Two-Node Setup" },
      { href: "/docs/operators/troubleshooting", label: "Troubleshooting" },
    ],
  },
];

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 px-6 py-3 max-w-screen-2xl mx-auto">
          <FormationLogo />
          <span className="text-lg font-bold text-gray-700 tracking-wide ml-2">
            Docs
          </span>
        </div>
      </header>
      {/* Main Layout */}
      <div className="flex max-w-screen-2xl mx-auto w-full">
        {/* Left Sidebar Navigation (sticky) */}
        <aside className="hidden md:flex flex-col w-72 bg-white border-r border-gray-100 py-8 pr-2">
          <div className="sticky top-24">
            <DocsSidebar links={navLinks} title="Docs Navigation" />
          </div>
        </aside>
        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center">{children}</div>
      </div>
    </div>
  );
}
