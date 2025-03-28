import { motion } from "framer-motion";
import AgentCard from "@/components/AgentCard";
import { Agent } from "@/types/agent";

interface FeaturedAgentsProps {
  agents: Agent[];
}

export default function FeaturedAgents({ agents }: FeaturedAgentsProps) {
  return (
    <div className="mb-12">
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Featured Agents
            </h2>
            <p className="text-gray-600 mt-2">
              Discover our most popular and powerful AI agents
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>Highly rated • Extensively tested • Production-ready</span>
          </div>
        </div>

        {/* Featured Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {agents
            .filter(agent => agent.is_featured)
            .slice(0, 3)
            .map((agent, index) => (
              <motion.div
                key={agent.agent_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <AgentCard agent={agent} />
              </motion.div>
            ))}
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-blue-100">
          <div>
            <div className="text-sm font-medium text-gray-500">Average Rating</div>
            <div className="mt-1 flex items-center gap-1">
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xl font-bold text-gray-900">4.9</span>
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Total Deployments</div>
            <div className="mt-1 text-xl font-bold text-gray-900">50K+</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Success Rate</div>
            <div className="mt-1 text-xl font-bold text-gray-900">99.9%</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Response Time</div>
            <div className="mt-1 text-xl font-bold text-gray-900">&lt;100ms</div>
          </div>
        </div>
      </div>
    </div>
  );
} 