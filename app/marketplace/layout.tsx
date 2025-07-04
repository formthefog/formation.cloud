"use client";

import MarketplaceNavigation from "@/components/MarketplaceNavigation";
import Sidebar from "@/components/marketplace/Sidebar";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [categoryCount, setCategoryCount] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [deployedAgents, setDeployedAgents] = useState([]);

  // Close sidebar by default on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Default metrics - these could be fetched from an API in a real implementation
  const metrics = [
    {
      label: "Active Agents",
      value: "50,000+",
      description: "AI agents deployed globally",
    },
    {
      label: "Processing Power",
      value: "1M+",
      description: "Requests processed daily",
    },
    {
      label: "Customer Satisfaction",
      value: "98%",
      description: "Average satisfaction rate",
    },
    {
      label: "Cost Savings",
      value: "$2M+",
      description: "Average yearly savings per enterprise customer",
    },
  ];

  return redirect("/");

  return (
    <div className="relative">
      <MarketplaceNavigation
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="flex">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          categoryCount={categoryCount}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          metrics={metrics}
          deployedAgents={deployedAgents}
        />
        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity md:hidden z-20"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        <main className="flex-1 w-full">{children}</main>
      </div>
    </div>
  );
}
