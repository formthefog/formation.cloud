// layout.tsx - Updated for mobile responsiveness
import React from "react";
import "github-markdown-css/github-markdown.css";
import DocsSidebar from "@/components/docs/DocsSidebar";
import DocsNavigation from "@/components/docs/DocsNavigation";
import MobileSidebarToggle from "@/components/docs/MobileSidebarToggle";

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

// app/layout.tsx
export const metadata = {
  metadataBase: new URL("https://docs.formation.cloud"),
  title: {
    default: "Formation Documentation",
    template: "%s — Formation Docs",
  },
  description:
    "Comprehensive documentation for Formation.cloud: learn how to use, integrate, and build with the Formation agent marketplace.",
  keywords: [
    "Formation documentation",
    "docs",
    "API reference",
    "agent marketplace",
    "integration guide",
    "developer guide",
    "AI agents",
    "Formation cloud",
    "Next.js",
    "TypeScript",
    "SDK",
    "REST API",
    "tutorials",
    "examples",
  ],
  applicationName: "Formation Docs",
  generator: "Next.js",
  viewport: "width=device-width,initial-scale=1",
  themeColor: "#009CFF",
  robots: "index, follow",
  canonical: "https://docs.formation.cloud",

  // Open Graph (Discord, Slack, iMessage…)
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Formation Docs",
    url: "https://docs.formation.cloud",
    title: "Formation Documentation",
    description:
      "Official documentation for Formation.cloud: guides, API reference, and integration tutorials for the agent marketplace.",
    images: [
      {
        url: "/formation-logos/formation-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Formation Documentation – Agent Marketplace",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    site: "@formthefog",
    creator: "@formthefog",
    title: "Formation Documentation",
    description:
      "Learn how to use, integrate, and build with Formation.cloud. Access guides, API docs, and tutorials.",
    images: ["/formation-logos/formation-og-image.jpg"],
  },

  // Favicons & PWA
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-96x96.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen max-w-[100vw]">
      {/* Top Navigation */}
      <DocsNavigation />

      {/* Main Layout */}
      <div className="flex max-w-screen-2xl mx-auto w-full">
        {/* Left Sidebar Navigation (desktop) */}
        <aside className="hidden md:flex flex-col w-72 bg-white border-r border-gray-100 py-8 pr-2">
          <div className="sticky top-24">
            <DocsSidebar links={navLinks} title="Docs Navigation" />
          </div>
        </aside>

        {/* Mobile Sidebar Toggle and Drawer */}
        <MobileSidebarToggle>
          <DocsSidebar links={navLinks} title="Docs Navigation" />
        </MobileSidebarToggle>

        {/* Main Content */}
        <div className="flex-1 flex flex-col w-full">{children}</div>
      </div>
    </div>
  );
}
