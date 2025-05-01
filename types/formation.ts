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
    Pending = 'pending',
    
    /** Task is currently being processed */
    Running = 'running',
    
    /** Task has been completed successfully */
    Completed = 'completed',
    
    /** Task encountered an error */
    Failed = 'failed',
    
    /** Task was cancelled by the user or system */
    Cancelled = 'cancelled',
    
    /** Task timed out before completion */
    TimedOut = 'timed_out',
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