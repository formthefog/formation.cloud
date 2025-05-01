export interface Agent {
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
  tools: Array<{ id: string; name: string; description: string }>;
  resource_requirements: {
    min_vcpus: number;
    recommended_vcpus: number;
    min_memory_mb: number;
    recommended_memory_mb: number;
    min_disk_gb: number;
    recommended_disk_gb: number;
    requires_gpu: boolean;
  };
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
  avg_response_time_ms: number;
  success_rate: number;
  uptime: number;
  avg_memory_mb: number;
  total_requests: number;
  active_users: number;
  total_runtime_hours: number;
  avg_cpu_usage: number;
  network_io_mbps: number;
  error_rate: number;
  cost_per_request: number;
  monthly_cost: number;
  active_deployments: number;
}

export interface AgentDeployment {
  id: string;
  integration_id: string | null;
  commit_sha: string | null;
  status: "pending" | "running" | "stopped" | "failed" | "success";
  deployment_url: string | null;
  logs: string | null;
  created_at: string;
  updated_at: string;
  agent_id: string;
  account_id: string;
  do_id: string | null;
  config: {
    cpu: number;
    name: string;
    model: string;
    avatar: string | null;
    memory: number;
    description: string;
    temperature: number;
  };
  agent: Agent;
}
