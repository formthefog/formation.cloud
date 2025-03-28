import Link from "next/link";
import { motion } from "framer-motion";

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all border grow border-gray-200 h-full flex flex-col"
    >
      <div className="p-6 flex flex-col h-full">
        {/* Header Section */}
        <div className="flex flex-col mb-3">
          <div className="flex items-start gap-4 mb-1">
            <div className="flex-1">
              <Link 
                href={`/marketplace/agents/${agent.agent_id}`} 
                className="hover:text-blue-600 transition-colors inline-block mb-1"
              >
                <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
              </Link>
              <div className="flex flex-wrap gap-1">
                {agent.is_featured && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full whitespace-nowrap">
                    Featured
                  </span>
                )}
                <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 rounded-full whitespace-nowrap">
                  {agent.agent_type}
                </span>
                {agent.has_memory && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full whitespace-nowrap">
                    Has Memory
                  </span>
                )}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs text-gray-500 mb-0.5 whitespace-nowrap">Per Request</div>
              <div className="text-lg font-bold text-[#0A84FF] whitespace-nowrap">
                {agent.price_per_request ? (
                  `$${agent.price_per_request}`
                ) : (
                  <span className="text-green-600">Free</span>
                )}
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{agent.description}</p>
        </div>

        {/* Technical Details */}
        <div className="grid grid-cols-2 gap-3 mb-3 py-3 border-y border-gray-100">
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Framework & Runtime</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 line-clamp-1">
                  {agent.framework}
                </span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 line-clamp-1">
                  {agent.runtime}
                </span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">License</h4>
            <div className="flex items-center gap-1.5">
              <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 line-clamp-1">
                {agent.license}
              </span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 whitespace-nowrap">
                v{agent.version}
              </span>
            </div>
          </div>
        </div>

        {/* Capabilities Section */}
        <div className="mb-3">
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Capabilities</h4>
          <div className="flex flex-wrap gap-1.5">
            {agent.capabilities.map((capability, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md line-clamp-1"
              >
                {capability}
              </span>
            ))}
          </div>
        </div>

        {/* Tools Section */}
        {agent.tools && agent.tools.length > 0 && (
          <div className="mb-3">
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Available Tools</h4>
            <div className="flex flex-wrap gap-1.5">
              {agent.tools.slice(0, 3).map((tool, index) => (
                <div
                  key={tool.id || index}
                  className="group/tool relative"
                >
                  <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-md cursor-help line-clamp-1">
                    {tool.name}
                  </span>
                  <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-gray-900 text-xs text-white rounded-md opacity-0 group-hover/tool:opacity-100 transition-opacity pointer-events-none z-10">
                    {tool.description}
                  </div>
                </div>
              ))}
              {agent.tools.length > 3 && (
                <span className="text-xs text-gray-500">+{agent.tools.length - 3} more</span>
              )}
            </div>
          </div>
        )}

        {/* Resource Requirements */}
        <div className="mb-4">
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">System Requirements</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-500">CPU</div>
              <div className="text-sm whitespace-nowrap">
                <span className="font-medium">{agent.resource_requirements.min_vcpus}</span>
                <span className="text-gray-400"> - </span>
                <span className="font-medium">{agent.resource_requirements.recommended_vcpus}</span>
                <span className="text-gray-400"> vCPUs</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Memory</div>
              <div className="text-sm whitespace-nowrap">
                <span className="font-medium">{agent.resource_requirements.min_memory_mb / 1024}</span>
                <span className="text-gray-400"> - </span>
                <span className="font-medium">{agent.resource_requirements.recommended_memory_mb / 1024}</span>
                <span className="text-gray-400"> GB</span>
              </div>
            </div>
            {agent.resource_requirements.requires_gpu && (
              <div className="col-span-2">
                <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded whitespace-nowrap">
                  Requires GPU
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Access & Permissions */}
        <div className="mb-4">
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Access & Permissions</h4>
          <div className="flex flex-wrap gap-2">
            {agent.has_external_api_access && (
              <span className="px-2 py-1 text-xs bg-yellow-50 text-yellow-700 rounded-md whitespace-nowrap">
                External API Access
              </span>
            )}
            {agent.has_internet_access && (
              <span className="px-2 py-1 text-xs bg-yellow-50 text-yellow-700 rounded-md whitespace-nowrap">
                Internet Access
              </span>
            )}
            {agent.has_filesystem_access && (
              <span className="px-2 py-1 text-xs bg-yellow-50 text-yellow-700 rounded-md whitespace-nowrap">
                Filesystem Access
              </span>
            )}
          </div>
        </div>

        {/* Tags */}
        {agent.tags && agent.tags.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {agent.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md line-clamp-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Push footer to bottom using margin-top: auto */}
        <div className="mt-auto pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <div className="text-xs text-gray-500">Rating</div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-semibold text-gray-900">{agent.average_rating.toFixed(1)}</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Uses</div>
                <div className="text-sm font-semibold text-gray-900">{agent.usage_count.toLocaleString()}</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {agent.is_private && (
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md whitespace-nowrap">
                  Private
                </span>
              )}
              <Link
                href={`/marketplace/agents/${agent.agent_id}`}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
              >
                Details
              </Link>
              <Link href={`/marketplace/agents/${agent.agent_id}?tab=deploy`} className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
                Deploy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 