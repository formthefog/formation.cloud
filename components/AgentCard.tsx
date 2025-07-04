import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Cpu, 
  MemoryStick, 
  Globe2, 
  Database, 
  HardDrive,
  Star,
  ExternalLink,
  Zap
} from "lucide-react";

interface Tool {
  id: string;
  name: string;
  description: string;
}

interface ResourceRequirements {
  min_vcpus: number;
  recommended_vcpus: number;
  min_memory_mb: number;
  recommended_memory_mb: number;
  min_disk_gb: number;
  recommended_disk_gb: number;
  requires_gpu: boolean;
}

interface Agent {
  agent_id: string;
  name: string;
  description: string;
  owner_id: string;
  version: string;
  agent_type: string;
  documentation: string;
  license: string;
  framework: string;
  runtime: string;
  tags: string[];
  capabilities: string[];
  tools: Tool[];
  resource_requirements: ResourceRequirements;
  has_memory: boolean;
  has_external_api_access: boolean;
  has_internet_access: boolean;
  has_filesystem_access: boolean;
  average_rating: number;
  deployment_count: number;
  usage_count: number;
  is_featured: boolean;
  is_private: boolean;
  price_per_request: number | null;
  metadata: Record<string, any>;
}

interface AgentCardProps {
  agent: Agent;
}

export default function AgentCard({ agent }: AgentCardProps) {
  const formatMemory = (mb: number) => (mb / 1024).toFixed(1);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="group bg-white rounded-lg shadow-sm hover:shadow transition-all border border-gray-200 p-4"
    >
      {/* Header with Name and Price */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <Link 
            href={`/marketplace/agents/${agent.agent_id}`}
            className="block group-hover:text-blue-600 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center">
              <span className="text-yellow-400 mr-1">★</span>
              <span className="font-medium">{agent.average_rating.toFixed(1)}</span>
            </div>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">{agent.usage_count.toLocaleString()} uses</span>
          </div>
        </div>
        <div className="text-right">
          {agent.is_featured && (
            <span className="inline-block px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mb-1">
              Featured
            </span>
          )}
          <div>
            <div className="text-lg font-bold text-blue-600">
              {agent.price_per_request ? (
                `$${agent.price_per_request}`
              ) : (
                <span className="text-green-600">Free</span>
              )}
            </div>
            <div className="text-xs text-gray-500">per request</div>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4">{agent.description}</p>

      {/* System Requirements */}
      <div className="flex items-center gap-6 mb-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-gray-400" />
          <div>
            <span className="font-medium">{agent.resource_requirements.recommended_vcpus}</span>
            <span className="text-gray-500 text-sm"> vCPUs</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <MemoryStick className="w-4 h-4 text-gray-400" />
          <div>
            <span className="font-medium">{formatMemory(agent.resource_requirements.recommended_memory_mb)}</span>
            <span className="text-gray-500 text-sm"> GB</span>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="flex flex-wrap gap-2 mb-4">
        {agent.has_memory && (
          <span className="inline-flex items-center gap-1.5 px-2 py-1 text-sm bg-green-50 text-green-700 rounded-md">
            <Database className="w-3.5 h-3.5" /> Memory
          </span>
        )}
        {agent.has_internet_access && (
          <span className="inline-flex items-center gap-1.5 px-2 py-1 text-sm bg-blue-50 text-blue-700 rounded-md">
            <Globe2 className="w-3.5 h-3.5" /> Internet
          </span>
        )}
        {agent.has_filesystem_access && (
          <span className="inline-flex items-center gap-1.5 px-2 py-1 text-sm bg-amber-50 text-amber-700 rounded-md">
            <HardDrive className="w-3.5 h-3.5" /> Filesystem
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Link 
          href={`/marketplace/agents/${agent.agent_id}`}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-center"
        >
          Learn More
        </Link>
        <Link 
          href={`/marketplace/agents/${agent.agent_id}?tab=hire`}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-center"
        >
          Hire Now
        </Link>
      </div>
    </motion.div>
  );
} 