import { motion } from "framer-motion";
import AgentCard from "@/components/AgentCard";
import { Agent } from "@/types/agent";
import Link from "next/link";

interface FeaturedAgentsProps {
  agents: Agent[];
}

export default function FeaturedAgents({ agents }: FeaturedAgentsProps) {
  const featuredAgents = agents.filter(agent => agent.is_featured).slice(0, 3);

  return (
    <div className="mb-12">
      <div className="relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-5" />
        
        {/* Gradient Orbs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500 rounded-none mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500 rounded-none mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
        
        <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-none p-8 border border-blue-100 backdrop-blur-sm">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
              >
                Featured Agents
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 mt-2"
              >
                Discover our most popular and powerful AI agents
              </motion.p>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4"
            >
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-none border border-blue-100">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>Highly rated • Extensively tested • Production-ready</span>
              </div>
              <Link
                href="/marketplace"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-none text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
              >
                View All Agents →
              </Link>
            </motion.div>
          </div>

          {/* Featured Cards Grid with Hover Effects */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {featuredAgents.map((agent, index) => (
              <motion.div
                key={agent.agent_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group"
              >
                  {/* Card Content */}
                  <div className="relative h-full grow">
                    <AgentCard agent={agent} />
                  </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Add keyframe animations */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
} 