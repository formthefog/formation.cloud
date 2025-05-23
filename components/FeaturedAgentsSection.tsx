'use client';

import { useRouter } from 'next/navigation';
import { FaRobot, FaArrowRight, FaStar, FaCode, FaBrain, FaChartLine, FaMemory, FaGlobe, FaWrench, FaCircleCheck, FaServer } from 'react-icons/fa6';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import AgentCard from './AgentCard';
import Link from 'next/link';
import RightCaret from './icons/RightCaret';

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
    <section className="relative bg-gradient-to-b from-gray-50 to-white pt-12 sm:pt-24 pb-12 sm:pb-24">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-16">
          <span className="inline-block border border-formation-blue px-4 py-1 text-sm font-medium uppercase tracking-wider text-formation-blue font-geistMono mb-6">
            Launch Agents
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-hauora font-[600] tracking-[-0.05em] text-gray-900 mb-6 leading-[1.1]">
            Meet Our First <br className="hidden sm:block" />AI Agents
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
            Be among the first to experience our carefully crafted AI agents. From coding assistance to market analysis,
            these agents are ready to transform your workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
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

        <div className="text-center mt-8 sm:mt-16">
          <Link href="/marketplace/agents">
            <Button
              className="inline-flex items-center px-8 py-4 bg-[#0A84FF] text-white rounded-full hover:bg-[#0A84FF]/90 transition-all text-[15px] font-medium uppercase tracking-wide"
            >
              VIEW LAUNCH AGENTS <RightCaret className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedAgentsSection; 