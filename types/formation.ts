/**
 * Response format for non-streaming task response
 */
export interface RunTaskResponse {
  /** Unique ID for the task */
  task_id: string;

  /** ID of the agent that processed the task */
  agent_id: string;

  /** The final completion/response text from the agent */
  completion?: string;

  /** Error message if the task failed */
  error?: string;

  /** Current status of the task */
  status: TaskStatus;

  /** Structured result (may be present alongside text completion) */
  result?: any;

  /** Metadata about the task execution */
  metadata?: Record<string, any>;

  /** Usage information for billing and metrics */
  usage?: UsageInfo;

  /** Timestamp of when the response was generated (seconds since epoch) */
  timestamp: number;

  /** How long the task took to complete in milliseconds */
  duration_ms: number;
}

/**
 * The current status of a task
 */
export enum TaskStatus {
  /** Task has been received but not yet started */
  Pending = "pending",

  /** Task is currently being processed */
  Running = "running",

  /** Task has been completed successfully */
  Completed = "completed",

  /** Task encountered an error */
  Failed = "failed",

  /** Task was cancelled by the user or system */
  Cancelled = "cancelled",

  /** Task timed out before completion */
  TimedOut = "timed_out",
}

/**
 * Usage information for a task, used for billing and metrics
 */
export interface UsageInfo {
  /** Number of tokens in the input/prompt */
  prompt_tokens: number;

  /** Number of tokens in the output/completion */
  completion_tokens: number;

  /** Total tokens used (prompt + completion) */
  total_tokens: number;

  /** Time taken to process the request in milliseconds */
  duration_ms: number;

  /** Billable time for the request in milliseconds (may differ from duration) */
  billable_duration_ms: number;

  /** LLM API cost if an external provider was used */
  provider_cost?: number;

  /** Currency for the provider cost (e.g., "USD") */
  cost_currency?: string;

  /** Formation internal cost metrics for the task */
  formation_cost?: number;

  /** Computational resources used (CPU, memory, etc.) */
  resources?: ResourceUsage;
}

/**
 * Resource usage metrics for a task
 */
export interface ResourceUsage {
  /** CPU time in milliseconds */
  cpu_ms?: number;

  /** Peak memory usage in megabytes */
  memory_mb?: number;

  /** GPU time in milliseconds (if GPU was used) */
  gpu_ms?: number;

  /** Network egress in kilobytes */
  network_egress_kb?: number;

  /** Network ingress in kilobytes */
  network_ingress_kb?: number;
}

/**
 * Chunk of a streaming response from an agent
 */
export interface TaskStreamChunk {
  /** ID of the task this chunk belongs to */
  task_id: string;

  /** ID of the agent generating the chunk */
  agent_id: string;

  /** Unique ID for this specific chunk */
  chunk_id: string;

  /** Content/text of this chunk */
  content: string;

  /** Whether this is the final chunk in the stream */
  is_final: boolean;

  /** Error message if there was a problem (can be present in a non-final chunk) */
  error?: string;

  /** Metadata about this chunk or the overall task */
  metadata?: Record<string, any>;

  /** Usage information (typically only in the final chunk) */
  usage?: UsageInfo;

  /** Creation timestamp for this chunk (ms since epoch) */
  timestamp: number;
}

/**
 * Represents a tool call from an agent
 */
export interface ToolCall {
  /** ID of the tool being called */
  tool_id: string;

  /** Name of the tool */
  tool_name: string;

  /** Arguments passed to the tool */
  arguments: any;

  /** Task ID that originated this tool call */
  task_id: string;

  /** Agent ID that is making the tool call */
  agent_id: string;

  /** Unique ID for this tool call */
  call_id: string;
}

/**
 * Result returned from a tool after execution
 */
export interface ToolCallResult {
  /** ID of the tool that was called */
  tool_id: string;

  /** Tool call ID this result is responding to */
  call_id: string;

  /** Whether the tool call was successful */
  success: boolean;

  /** Result data from the tool */
  result?: any;

  /** Error message if the tool call failed */
  error?: string;

  /** Tool-specific metadata about the execution */
  metadata?: Record<string, any>;
}

/**
 * Detailed error response for the API
 */
export interface ApiError {
  /** Error code for programmatic handling */
  code: string;

  /** Human-readable error message */
  message: string;

  /** Optional detailed error information */
  details?: any;

  /** HTTP status code associated with this error */
  status_code: number;

  /** Request ID for tracking this error */
  request_id: string;

  /** Path that triggered the error */
  path: string;

  /** Timestamp when the error occurred */
  timestamp: number;
}

/**
 * Extension type for task response conversion
 */
export interface IntoTaskResponse {
  /**
   * Convert to a full task response
   */
  intoTaskResponse(task_id: string, agent_id: string): RunTaskResponse;
}

/**
 * Extension type for stream chunk conversion
 */
export interface IntoStreamChunk {
  /**
   * Convert to a stream chunk
   */
  intoStreamChunk(task_id: string, agent_id: string): TaskStreamChunk;
}

// --- Existing AIAgent Type ---
export interface AIAgent {
  /** Unique identifier for the agent */
  agent_id: string;

  /** Human-readable name */
  name: string;

  /** Owner’s account ID */
  owner_id: string;

  /** Semantic version (e.g., "1.2.3") */
  version: string;

  /** Concise description of the agent */
  description: string;

  /** Detailed markdown documentation */
  documentation?: string;

  /** License type */
  license: ModelLicense;

  /** Agent category/type */
  agent_type: AgentType;

  /** Framework/platform used */
  framework: AgentFramework;

  /** Runtime environment */
  runtime: AgentRuntime;

  /** Model types this agent is compatible with */
  compatible_model_types: ModelType[];

  /** Specific models this agent works best with (model_ids) */
  preferred_models: string[];

  /** Whether this agent requires a specific model */
  requires_specific_model: boolean;

  /** Specific model ID required (if applicable) */
  required_model_id?: string;

  /** Searchable tags */
  tags: string[];

  /** Creation timestamp (Unix epoch milliseconds) */
  created_at: number;

  /** Last update timestamp (Unix epoch milliseconds) */
  updated_at: number;

  /** Base64-encoded Formfile template */
  formfile_template: string;

  /** Resource requirements for deployment */
  resource_requirements: AgentResourceRequirements;

  /** List of specific capabilities this agent offers */
  capabilities: string[];

  /** Tools this agent can use */
  tools: AgentTool[];

  /** Whether the agent has persistent memory/state */
  has_memory: boolean;

  /** Whether the agent can access external APIs */
  has_external_api_access: boolean;

  /** Whether the agent can access the Internet */
  has_internet_access: boolean;

  /** Whether the agent has filesystem access */
  has_filesystem_access: boolean;

  /** Average rating (1‒5) */
  average_rating?: number;

  /** Number of deployments */
  deployment_count: number;

  /** Usage count */
  usage_count: number;

  /** Whether this agent is featured/verified */
  is_featured: boolean;

  /** Whether this is a private agent (only visible to owner and authorized users) */
  is_private: boolean;

  /** Key-value store for arbitrary metadata */
  metadata: Record<string, string>;

  /** Repository URL (if open source) */
  repository_url?: string;

  /** Demo URL (if available) */
  demo_url?: string;

  /** Base price per request (if commercial) */
  price_per_request?: number;

  /** Usage tracking settings */
  usage_tracking: AgentUsageTracking;

  /** Configuration schema for customization (JSON schema) */
  config_schema?: string;
}

// Placeholder types referenced above (fill in as your application requires)
export type AgentType = string;
export type AgentFramework = string;
export type AgentRuntime = string;
export interface AgentResourceRequirements {
  // define as needed
}
export interface AgentTool {
  // define as needed
}
export interface AgentUsageTracking {
  // define as needed
}

// --- New Types from AIModel and Related Enums/Structs ---

/**
 * Represents the type/category of AI model
 */
export type ModelType =
  | "LLM"
  | "Embedding"
  | "Multimodal"
  | "AudioProcessing"
  | "ImageGeneration"
  | "ComputerVision"
  | "Diffusion"
  | ModelTypeOther;

export interface ModelTypeOther {
  Other: string;
}

/**
 * Represents the ML framework used by the model
 */
export type ModelFramework =
  | "PyTorch"
  | "TensorFlow"
  | "ONNX"
  | "JAX"
  | "CoreML"
  | "TensorRT"
  | ModelFrameworkOther;

export interface ModelFrameworkOther {
  Other: string;
}

/**
 * Represents the quantization approach used (if any)
 */
export type QuantizationType =
  | "FP32"
  | "FP16"
  | "BF16"
  | "INT8"
  | "INT4"
  | "GPTQ"
  | "GGUF"
  | "AWQ"
  | "GGML"
  | QuantizationTypeOther;

export interface QuantizationTypeOther {
  Other: string;
}

/**
 * Represents licensing options for models
 */
export type ModelLicense =
  | "MIT"
  | "Apache2"
  | "GPL3"
  | "BSD"
  | "CC_BY"
  | "CC_BY_SA"
  | "CC_BY_NC"
  | "CC_BY_NC_SA"
  | "Proprietary"
  | ModelLicenseCustom;

export interface ModelLicenseCustom {
  Custom: string;
}

/**
 * Represents various input/output modes supported by a model
 */
export type ModelIOMode =
  | "TextToText"
  | "TextToImage"
  | "ImageToText"
  | "TextToAudio"
  | "AudioToText"
  | "ImageToImage"
  | ModelIOModeOther;

export interface ModelIOModeOther {
  Other: string;
}

/**
 * Specifies the computing resources required to run a model
 */
export interface ModelResourceRequirements {
  /** Minimum CPU cores required */
  min_vcpus: number;

  /** Recommended CPU cores for optimal performance */
  recommended_vcpus: number;

  /** Minimum RAM required (MB) */
  min_memory_mb: number;

  /** Recommended RAM for optimal performance (MB) */
  recommended_memory_mb: number;

  /** Minimum disk space required (GB) */
  min_disk_gb: number;

  /** Recommended disk space (GB) */
  recommended_disk_gb: number;

  /** Whether GPU is required */
  requires_gpu: boolean;

  /** Minimum VRAM required if GPU is used (GB) */
  min_vram_gb?: number;

  /** Recommended VRAM for optimal performance (GB) */
  recommended_vram_gb?: number;

  /** Required CUDA cores (if applicable) */
  cuda_cores?: number;

  /** Required Tensor cores (if applicable) */
  tensor_cores?: number;

  /** Required CPU extensions (AVX, AVX2, etc.) */
  required_cpu_extensions: string[];

  /** Required CUDA version (if applicable) */
  required_cuda_version?: string;
}

/**
 * Specifies how usage is tracked for a model
 */
export interface ModelUsageTracking {
  /** Whether to track token usage */
  track_tokens: boolean;

  /** Whether to track inference requests */
  track_requests: boolean;

  /** Whether to compute royalties */
  enable_royalties: boolean;

  /** Percentage of revenue that goes to the creator (0–100) */
  royalty_percentage: number;

  /** Additional usage metrics to track */
  custom_metrics: string[];
}

/**
 * Main AIModel type representing a registered model in the marketplace
 */
export interface AIModel {
  /** Unique identifier for the model */
  model_id: string;

  /** Human-readable name */
  name: string;

  /** Owner’s account ID */
  owner_id: string;

  /** Semantic version (e.g., "1.2.3") */
  version: string;

  /** Concise description of the model */
  description: string;

  /** Detailed markdown documentation */
  documentation?: string;

  /** License type */
  license: ModelLicense;

  /** Primary model type */
  model_type: ModelType;

  /** Framework used */
  framework: ModelFramework;

  /** Input/output modes supported */
  io_modes: ModelIOMode[];

  /** Parameter count (in billions) */
  parameters: number;

  /** Quantization used (if any) */
  quantization?: QuantizationType;

  /** Maximum token context length */
  context_length?: number;

  /** Average input tokens processed per second (benchmark) */
  input_tokens_per_second?: number;

  /** Average output tokens generated per second (benchmark) */
  output_tokens_per_second?: number;

  /** Searchable tags */
  tags: string[];

  /** Creation timestamp (Unix epoch milliseconds) */
  created_at: number;

  /** Last update timestamp (Unix epoch milliseconds) */
  updated_at: number;

  /** Base64-encoded Formfile template */
  formfile_template: string;

  /** URL to model weights or registry location */
  weights_url?: string;

  /** SHA-256 checksum of weights file */
  weights_checksum?: string;

  /** Size of weights file in bytes */
  weights_size_bytes?: number;

  /** Resource requirements for deployment */
  resource_requirements: ModelResourceRequirements;

  /** List of specific capabilities this model offers */
  capabilities: string[];

  /** Average rating (1–5) */
  average_rating?: number;

  /** Number of deployments */
  deployment_count: number;

  /** Download/usage count */
  usage_count: number;

  /** Whether this model is featured/verified */
  is_featured: boolean;

  /** Whether this is a private model (only visible to owner and authorized users) */
  is_private: boolean;

  /** Key-value store for arbitrary metadata */
  metadata: Record<string, string>;

  /** Repository URL (if open source) */
  repository_url?: string;

  /** Demo URL (if available) */
  demo_url?: string;

  /** Paper URL (if academic) */
  paper_url?: string;

  /** Base price per 1M tokens (if commercial) */
  price_per_1m_tokens?: number;

  /** Usage tracking settings */
  usage_tracking: ModelUsageTracking;
}

/**
 * Placeholder type aliases for CRDT-related types.
 * You can replace `any` with a more precise definition if you bring in a CRDT library.
 */
export type ModelOp = any;
export type ModelMap = any;

/**
 * Represents the state of all models in a CRDT-backed map
 */
export interface ModelState {
  /** The underlying CRDT map of (model_id → CRDT register) */
  map: ModelMap;

  /** The node’s private key (hex‐encoded) used for signing updates */
  pk: string;

  /** The unique node ID used in CRDT operations */
  node_id: string;
}
