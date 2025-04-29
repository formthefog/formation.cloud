"use client";

import { useState, useEffect } from "react";
import { Agent } from "@/types/agent";
import Sidebar from "@/components/marketplace/Sidebar";
import FeaturedAgents from "@/components/marketplace/FeaturedAgents";
import DeveloperRevenue from "@/components/marketplace/DeveloperRevenue";
import MarketplaceHero from "@/components/marketplace/MarketplaceHero";
import AgentCard from "@/components/AgentCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

const ITEMS_PER_PAGE = 6;
const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "recent", label: "Recently Added" },
  { value: "rating", label: "Highest Rated" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

export default function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryCount, setCategoryCount] = useState<Record<string, number>>(
    {}
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("popular");
  const [selectedFilters, setSelectedFilters] = useState({
    pricing: [],
    capabilities: [],
    requirements: [],
  });

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch("/api/agents");
        const data = await response.json();

        if (data.agents) {
          setAgents(data.agents);

          const counts = data.Success.List.reduce(
            (acc: Record<string, number>, agent: Agent) => {
              const type = agent.agent_type?.toLowerCase() || "other";
              acc[type] = (acc[type] || 0) + 1;
              acc["all"] = (acc["all"] || 0) + 1;
              return acc;
            },
            {}
          );

          setCategoryCount(counts);
        } else {
          throw new Error("Invalid data structure");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch agents");
        console.error("Error fetching agents:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const filteredAgents = agents.filter((agent) => {
    const matchesCategory =
      selectedCategory === "all" ||
      agent.agent_type?.toLowerCase() === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const removeFilter = (category: string, filter: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: prev[category].filter((f: string) => f !== filter),
    }));
  };

  // Sort agents based on selected option
  const sortAgents = (agents: any[]) => {
    switch (sortBy) {
      case "popular":
        return [...agents].sort((a, b) => b.uses - a.uses);
      case "recent":
        return [...agents].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case "rating":
        return [...agents].sort((a, b) => b.rating - a.rating);
      case "price-low":
        return [...agents].sort((a, b) => a.price - b.price);
      case "price-high":
        return [...agents].sort((a, b) => b.price - a.price);
      default:
        return agents;
    }
  };

  // Apply sorting to filtered agents
  const sortedAgents = sortAgents(filteredAgents);

  // Calculate pagination
  const totalPages = Math.ceil(sortedAgents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentAgents = sortedAgents.slice(startIndex, endIndex);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, selectedFilters, sortBy]);

  // if (error) {
  //   return (
  //     <div className="min-h-screen bg-[#F9FAFB] p-8">
  //       <div className="max-w-screen-xl mx-auto text-center text-red-600">
  //         Unable to load agents. Please try again later.
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-[calc(100vh-73px)] py-6 px-4 md:px-8">
      <div className="max-w-[1280px] mx-auto gap-4 flex flex-col h-full items-center justify-center">
        {/* Hero Section */}
        <MarketplaceHero />

        {/* Featured Agents Section */}
        {selectedCategory === "all" && (
          <FeaturedAgents agents={filteredAgents} />
        )}

        {/* Filters and Sort */}

        {/* All Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {loading
            ? Array(ITEMS_PER_PAGE)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-none shadow-sm p-6 animate-pulse"
                  >
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                ))
            : currentAgents.map((agent) => (
                <AgentCard key={agent.agent_id} agent={agent} />
              ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page ? "bg-blue-600" : ""}
                  >
                    {page}
                  </Button>
                )
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}

        {/* No Results */}
        {!loading && currentAgents.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No agents found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}

        {/* Developer Revenue Section */}
        <DeveloperRevenue />
      </div>
    </div>
  );
}
