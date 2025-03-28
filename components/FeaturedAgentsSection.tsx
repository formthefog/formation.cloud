'use client';

import { useRouter } from 'next/navigation';
import { FaRobot, FaArrowRight, FaStar, FaCode, FaBrain, FaChartLine, FaMemory, FaGlobe, FaWrench, FaCircleCheck, FaServer } from 'react-icons/fa6';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

const AgentCard = ({ agent }) => {
  const router = useRouter();
  const [avatarError, setAvatarError] = useState(false);

  // Helper function to get appropriate icon
  const getAgentIcon = (agentType) => {
    switch (agentType?.toLowerCase()) {
      case 'codegenerator':
        return <FaCode />;
      case 'researcher':
        return <FaBrain />;
      default:
        return <FaRobot />;
    }
  };

  // Format requirements for display
  const formatRequirements = (requirements) => {
    if (!requirements) return null;
    return `${requirements.recommended_vcpus} vCPUs • ${requirements.recommended_memory_mb / 1024}GB RAM`;
  };

  // Get capability icons
  const getCapabilityIcon = (capability) => {
    switch (capability) {
      case 'has_memory':
        return <FaMemory title="Has Memory" />;
      case 'has_internet_access':
        return <FaGlobe title="Internet Access" />;
      case 'has_filesystem_access':
        return <FaServer title="Filesystem Access" />;
      default:
        return <FaCircleCheck title={capability} />;
    }
  };

  // Get avatar URL with Robohash fallback
  const getAvatarUrl = (ownerId: string) => {
    if (avatarError) {
      return `https://robohash.org/${ownerId}?set=set3&size=64x64`;
    }
    return `/avatars/${ownerId}.svg`;
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 overflow-hidden cursor-pointer group hover:border-formation-blue"
      onClick={() => router.push('#marketplace')}
    >
      <div className="relative">
        <div className="bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-blue-500/5 p-8 h-52 flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-blue-500/10 group-hover:via-indigo-500/10 group-hover:to-blue-500/10 transition-all duration-300">
          <div className="text-5xl text-formation-blue transform group-hover:scale-110 transition-transform duration-300">
            {getAgentIcon(agent.agent_type)}
          </div>
        </div>
        
        {agent.is_featured && (
          <div className="absolute top-4 right-4 bg-formation-blue text-white text-xs px-3 py-1 rounded-full font-medium tracking-wide shadow-md">
            Featured
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-formation-blue transition-colors">
            {agent.name}
          </h3>
          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
            <FaStar className="text-yellow-400 mr-1" />
            <span className="text-sm font-medium text-gray-700">{agent.average_rating}</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
          {agent.description}
        </p>

        {/* Capabilities */}
        <div className="flex gap-2 mb-4">
          {agent.has_memory && getCapabilityIcon('has_memory')}
          {agent.has_internet_access && getCapabilityIcon('has_internet_access')}
          {agent.has_filesystem_access && getCapabilityIcon('has_filesystem_access')}
        </div>

        {/* System Requirements */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <FaServer className="text-gray-400" />
            <span>{formatRequirements(agent.resource_requirements)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div>
            {agent.price_per_request ? (
              <span className="font-medium text-formation-blue">{agent.price_per_request}</span>
            ) : (
              <span className="font-medium text-green-600">Free</span>
            )}
            {agent.price_per_request && ' credits/use'}
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">{agent.usage_count?.toLocaleString()}</span>
            <span className="text-gray-400">uses</span>
          </div>
        </div>

        {/* Tools Section */}
        {agent.tools && agent.tools.length > 0 && (
          <div className="mb-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <FaWrench className="text-gray-400" />
              <span className="font-medium">Available Tools</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {agent.tools.slice(0, 3).map((tool, index) => (
                <span key={tool.id || index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md">
                  {tool.name}
                </span>
              ))}
              {agent.tools.length > 3 && (
                <span className="text-xs text-gray-500">+{agent.tools.length - 3} more</span>
              )}
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <img 
              src={getAvatarUrl(agent.owner_id)}
              alt={agent.owner_id}
              className="w-6 h-6 rounded-full mr-2 bg-gray-50"
              onError={() => setAvatarError(true)}
            />
            <span className="font-medium">{agent.owner_id}</span>
          </div>
          <div className="text-formation-blue opacity-0 group-hover:opacity-100 transition-opacity flex items-center font-medium">
            Try it <FaArrowRight size={12} className="ml-1" />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeaturedAgentsSection = () => {
  const router = useRouter();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch('/api/agents');
        const data = await response.json();
        
        if (data.Success && data.Success.List) {
          // Sort agents by featured status first, then by usage count
          const sortedAgents = data.Success.List
            .sort((a, b) => {
              // First sort by featured status
              if (a.is_featured && !b.is_featured) return -1;
              if (!a.is_featured && b.is_featured) return 1;
              // Then sort by usage count within each group
              return b.usage_count - a.usage_count;
            })
            .slice(0, 3);
          setAgents(sortedAgents);
        } else {
          throw new Error('Invalid data structure');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching agents:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  if (error) {
    return (
      <section className="relative bg-gray-50 py-24">
        <div className="max-w-screen-xl mx-auto px-6 text-center text-red-600">
          Unable to load agents. Please try again later.
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white py-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block border border-formation-blue px-4 py-1 text-sm font-medium uppercase tracking-wider text-formation-blue font-geistMono mb-4 rounded-full">
            Featured Agents
          </span>
          <h2 className="text-4xl font-hauora font-[500] tracking-[-0.05em] text-gray-900 mb-4">
            Discover Popular AI Agents
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Explore our curated selection of high-performance AI agents. From coding assistance to market analysis,
            find the perfect agent to enhance your workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
            // Loading skeleton
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-xl h-[600px] animate-pulse">
                <div className="h-52 bg-gray-100 rounded-t-xl" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-100 rounded w-2/3" />
                  <div className="h-4 bg-gray-100 rounded w-full" />
                  <div className="h-4 bg-gray-100 rounded w-full" />
                  <div className="h-20 bg-gray-100 rounded" />
                  <div className="h-10 bg-gray-100 rounded" />
                </div>
              </div>
            ))
          ) : (
            agents.map((agent, index) => (
              <AgentCard key={agent.agent_id || index} agent={agent} />
            ))
          )}
        </div>

        <div className="text-center mt-16">
          <Button
            onClick={() => router.push('#marketplace')}
              className="button-with-gradient  h-full text-[16px] px-8 py-6 font-medium"
          >
            Explore All Agents
            <FaArrowRight className="ml-2" size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedAgentsSection; 