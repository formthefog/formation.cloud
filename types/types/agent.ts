export interface Agent { agent_id: string; name: string; description: string; owner_id: string; version: string; agent_type: string; documentation: string; license: string; framework: string; runtime: string; tags: string[]; capabilities: string[]; tools: Array<{ id: string; name: string; description: string; }>; resource_requirements: { min_vcpus: number; recommended_vcpus: number; min_memory_mb: number; recommended_memory_mb: number; min_disk_gb: number; recommended_disk_gb: number; requires_gpu: boolean; }; has_memory: boolean; has_external_api_access: boolean; has_internet_access: boolean; has_filesystem_access: boolean; average_rating: number; deployment_count: number; usage_count: number; is_featured: boolean; is_private: boolean; price_per_request: number | null; metadata: Record<string, any>; }
