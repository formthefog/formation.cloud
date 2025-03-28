export interface Agent {
  id: string;
  name: string;
  description: string;
  agent_type: string;
  framework: string;
  runtime: string;
  version: string;
  capabilities: string[];
  tags: string[];
  tools: {
    name: string;
    description: string;
  }[];
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
  price_per_request: number;
  usage_count: number;
  deployment_count: number;
  average_rating: number;

  // New metrics properties
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
