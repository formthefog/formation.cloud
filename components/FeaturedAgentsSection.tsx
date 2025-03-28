'use client';

import { useRouter } from 'next/navigation';
import { FaRobot, FaArrowRight, FaStar, FaCode, FaBrain, FaChartLine, FaMemory, FaGlobe, FaWrench, FaCircleCheck, FaServer } from 'react-icons/fa6';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import AgentCard from './AgentCard';
import Link from 'next/link';

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
    <section className="relative bg-gradient-to-b from-gray-50 to-white pt-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block border border-formation-blue px-4 py-1 text-sm font-medium uppercase tracking-wider text-formation-blue font-geistMono mb-4">
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
          <Link href="/marketplace/agents">
          <Button
              className="button-with-gradient  h-full text-[16px] px-8 py-6 font-medium"
          >
            Explore All Agents
            <FaArrowRight className="ml-2" size={16} />
          </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedAgentsSection; 