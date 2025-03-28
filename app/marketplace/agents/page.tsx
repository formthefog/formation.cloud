'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import AgentCard from '@/components/AgentCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Bot,
  Code2,
  MessageSquare,
  Search,
  Database,
  BarChart,
  SlidersHorizontal,
} from 'lucide-react';
import type { Agent } from '@/types/agent';

const agentCategories = [
  {
    id: 'all',
    name: 'All Agents',
    icon: <Bot className="w-5 h-5" />,
  },
  {
    id: 'coding',
    name: 'Code Generation',
    icon: <Code2 className="w-5 h-5" />,
  },
  {
    id: 'assistant',
    name: 'Assistant',
    icon: <MessageSquare className="w-5 h-5" />,
  },
  {
    id: 'data',
    name: 'Data Processing',
    icon: <Database className="w-5 h-5" />,
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: <BarChart className="w-5 h-5" />,
  },
];

const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'recent', label: 'Recently Added' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
];

export default function AgentsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch('/api/agents');
        const data = await response.json();
        
        if (data.Success && data.Success.List) {
          setAgents(data.Success.List);
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

  // Filter agents based on category and search query
  const filteredAgents = agents.filter(agent => {
    const matchesCategory = selectedCategory === 'all' || agent.agent_type.toLowerCase() === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  // Sort agents based on selected sort option
  const sortedAgents = [...filteredAgents].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.average_rating - a.average_rating;
      case 'recent':
        return new Date(b.metadata.created_at || 0).getTime() - new Date(a.metadata.created_at || 0).getTime();
      case 'price-low':
        return (a.price_per_request || 0) - (b.price_per_request || 0);
      case 'price-high':
        return (b.price_per_request || 0) - (a.price_per_request || 0);
      case 'popular':
      default:
        return b.usage_count - a.usage_count;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Search and Filters */}
        <div className="flex flex-col gap-6">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto w-full">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for agents by name, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-11 rounded-lg bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-gray-900 placeholder:text-gray-400"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="flex flex-wrap gap-2">
              {agentCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className={selectedCategory === category.id ? "bg-blue-600 hover:bg-blue-700" : "border-blue-600 text-blue-600 hover:bg-blue-50"}
                  size="sm"
                >
                  {category.icon}
                  <span className="ml-2">{category.name}</span>
                </Button>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gray-500" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            // Loading skeletons
            Array(6).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-full text-center text-red-600">
              Error loading agents: {error}
            </div>
          ) : sortedAgents.length === 0 ? (
            <div className="col-span-full text-center text-gray-600">
              No agents found matching your criteria.
            </div>
          ) : (
            sortedAgents.map((agent) => (
              <AgentCard key={agent.agent_id} agent={agent} />
            ))
          )}
        </div>
      </div>
    </div>
  );
} 