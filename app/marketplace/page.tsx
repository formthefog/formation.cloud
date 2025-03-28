"use client";

import { useState, useEffect } from "react";
import { Agent } from "@/types/agent";
import Sidebar from "@/components/marketplace/Sidebar";
import FeaturedAgents from "@/components/marketplace/FeaturedAgents";
import DeveloperRevenue from "@/components/marketplace/DeveloperRevenue";
import MarketplaceHero from "@/components/marketplace/MarketplaceHero";
import AgentCard from "@/components/AgentCard";

const metrics = [
  { label: "Active Agents", value: "50,000+", description: "AI agents deployed globally" },
  { label: "Processing Power", value: "1M+", description: "Requests processed daily" },
  { label: "Customer Satisfaction", value: "98%", description: "Average satisfaction rate" },
  { label: "Cost Savings", value: "$2M+", description: "Average yearly savings per enterprise customer" }
];

export default function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryCount, setCategoryCount] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch('/api/agents');
        const data = await response.json();
        
        if (data.Success && data.Success.List) {
          setAgents(data.Success.List);
          
          const counts = data.Success.List.reduce((acc: Record<string, number>, agent: Agent) => {
            const type = agent.agent_type?.toLowerCase() || 'other';
            acc[type] = (acc[type] || 0) + 1;
            acc['all'] = (acc['all'] || 0) + 1;
            return acc;
          }, {});
          
          setCategoryCount(counts);
        } else {
          throw new Error('Invalid data structure');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch agents');
        console.error('Error fetching agents:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const filteredAgents = agents.filter(agent => {
    const matchesCategory = selectedCategory === "all" || agent.agent_type?.toLowerCase() === selectedCategory;
    const matchesSearch = !searchQuery || 
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (error) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] p-8">
        <div className="max-w-screen-xl mx-auto text-center text-red-600">
          Unable to load agents. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Main Content with Sidebar */}
      <div className="flex relative">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          categoryCount={categoryCount}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          metrics={metrics}
        />

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-73px)] max-w-[1400px] mx-auto">
          <div className=" flex flex-col">
            {/* Mobile Toggle */}
            <button
              onClick={() => setIsSidebarOpen(prev => !prev)}
              className="md:hidden mb-6 px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            >
              {isSidebarOpen ? "Hide Filters" : "Show Filters"}
            </button>

            {/* Hero Section */}
            <MarketplaceHero />

            {/* Featured Agents Section */}
            {selectedCategory === "all" && <FeaturedAgents agents={filteredAgents} />}

            {/* All Agents Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {loading ? (
                // Loading skeletons
                Array(6).fill(0).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                ))
              ) : (
                filteredAgents
                  .filter(agent => !agent.is_featured || selectedCategory !== "all")
                  .map((agent) => (
                    <AgentCard key={agent.agent_id} agent={agent} />
                  ))
              )}
            </div>
            {/* Developer Revenue Section */}
            <DeveloperRevenue />
          </div>


        </main>
      </div>
    </div>
  );
} 