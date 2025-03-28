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
      className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200"
    >
      <Link href={`/marketplace/agents/${agent.agent_id}`}>
        <div className="p-6">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-start gap-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {agent.is_featured && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      Featured
                    </span>
                  )}
                  <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                    {agent.agent_type}
                  </span>
                  {agent.has_memory && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      Has Memory
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600">{agent.description}</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 mb-1">Per Request</div>
              <div className="text-lg font-bold text-[#0A84FF]">
                {agent.price_per_request ? (
                  `$${agent.price_per_request}`
                ) : (
                  <span className="text-green-600">Free</span>
                )}
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-y border-gray-100">
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Framework & Runtime</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                    {agent.framework}
                  </span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                    {agent.runtime}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">License</h4>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                  {agent.license}
                </span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                  v{agent.version}
                </span>
              </div>
            </div>
          </div>

          {/* Capabilities Section */}
          <div className="mb-4">
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Capabilities</h4>
            <div className="flex flex-wrap gap-2">
              {agent.capabilities.map((capability, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md"
                >
                  {capability}
                </span>
              ))}
            </div>
          </div>

          {/* Tools Section */}
          {agent.tools && agent.tools.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Available Tools</h4>
              <div className="flex flex-wrap gap-2">
                {agent.tools.map((tool) => (
                  <div
                    key={tool.id}
                    className="group/tool relative"
                  >
                    <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-md cursor-help">
                      {tool.name}
                    </span>
                    <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-gray-900 text-xs text-white rounded-md opacity-0 group-hover/tool:opacity-100 transition-opacity pointer-events-none">
                      {tool.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resource Requirements */}
          <div className="mb-4">
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">System Requirements</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500">CPU</div>
                <div className="text-sm">
                  <span className="font-medium">{agent.resource_requirements.min_vcpus}</span>
                  <span className="text-gray-400"> - </span>
                  <span className="font-medium">{agent.resource_requirements.recommended_vcpus}</span>
                  <span className="text-gray-400"> vCPUs</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Memory</div>
                <div className="text-sm">
                  <span className="font-medium">{agent.resource_requirements.min_memory_mb / 1024}</span>
                  <span className="text-gray-400"> - </span>
                  <span className="font-medium">{agent.resource_requirements.recommended_memory_mb / 1024}</span>
                  <span className="text-gray-400"> GB</span>
                </div>
              </div>
              {agent.resource_requirements.requires_gpu && (
                <div className="col-span-2">
                  <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded">
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
                <span className="px-2 py-1 text-xs bg-yellow-50 text-yellow-700 rounded-md">
                  External API Access
                </span>
              )}
              {agent.has_internet_access && (
                <span className="px-2 py-1 text-xs bg-yellow-50 text-yellow-700 rounded-md">
                  Internet Access
                </span>
              )}
              {agent.has_filesystem_access && (
                <span className="px-2 py-1 text-xs bg-yellow-50 text-yellow-700 rounded-md">
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
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metrics Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center gap-4">
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
              <div>
                <div className="text-xs text-gray-500">Deployments</div>
                <div className="text-sm font-semibold text-gray-900">{agent.deployment_count.toLocaleString()}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {agent.is_private && (
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">
                  Private
                </span>
              )}
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                Deploy
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
} 