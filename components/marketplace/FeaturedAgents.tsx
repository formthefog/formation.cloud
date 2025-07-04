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
        
        <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-none p-4 md:p-8 border border-blue-100 backdrop-blur-sm">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4">
            <div className="relative w-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -inset-x-4 md:-inset-x-8 -inset-y-4 md:-inset-y-6 bg-gradient-to-r from-blue-50 via-indigo-50/50 to-blue-50/30 rounded-2xl"
              />
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative flex flex-wrap items-center gap-2 md:gap-3 mb-2"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 md:w-7 md:h-7 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <h2 className="text-2xl md:text-[32px] font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">
                    Featured Agents
                  </h2>
                </div>
                <div className="h-7 md:h-8 px-2.5 md:px-3 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 flex items-center">
                  <span className="text-xs md:text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Early Access</span>
                </div>
              </motion.div>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative text-gray-600 mt-2 text-sm md:text-base"
              >
                Be among the first to explore our curated collection of agents
                <span className="block md:inline-flex mt-3 md:mt-0 md:ml-4 items-center gap-3 text-xs md:text-sm text-gray-500">
                  <span className="inline-flex items-center gap-1.5">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
                    </svg>
                    Cloud-powered
                  </span>
                  <span className="inline-flex items-center gap-1.5 ml-3">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" />
                    </svg>
                    Developer-first
                  </span>
                </span>
              </motion.p>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-5 w-full md:w-auto"
            >
              <div className="hidden md:flex items-center gap-3 text-sm text-gray-500 bg-white/50 backdrop-blur-sm px-5 py-2.5 rounded-xl border border-blue-100">
                <svg className="w-6 h-6 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" />
                </svg>
                <span className="font-medium">Join our beta • Shape the future • Build something amazing</span>
              </div>
              <Link
                href="/marketplace/agents"
                className="w-full md:w-auto inline-flex items-center justify-center px-4 md:px-5 py-2 md:py-2.5 text-sm font-medium rounded-xl text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
              >
                Explore Agents →
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