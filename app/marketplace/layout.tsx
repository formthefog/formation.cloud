"use client";

import MarketplaceNavigation from "@/components/MarketplaceNavigation";
import Sidebar from "@/components/marketplace/Sidebar";
import { useState } from "react";

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Default metrics - these could be fetched from an API in a real implementation
  const metrics = [
    { label: "Active Agents", value: "50,000+", description: "AI agents deployed globally" },
    { label: "Processing Power", value: "1M+", description: "Requests processed daily" },
    { label: "Customer Satisfaction", value: "98%", description: "Average satisfaction rate" },
    { label: "Cost Savings", value: "$2M+", description: "Average yearly savings per enterprise customer" }
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] overflow-x-hidden">
      <MarketplaceNavigation searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="flex relative">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          categoryCount={{}}
          selectedCategory="all"
          setSelectedCategory={() => {}}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          metrics={metrics}
        />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
} 