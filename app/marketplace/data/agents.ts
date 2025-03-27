import { 
  Briefcase, 
  ShieldCheck, 
  Brain, 
  MessageSquare, 
  LineChart, 
  Code, 
  Search,
  Database,
  Globe,
  Zap
} from 'lucide-react';

export interface DeploymentOption {
  type: string;
  description: string;
  requirements: string[];
}

export interface Reliability {
  uptime: string;
  responseTime: string;
  successRate: string;
}

export interface Performance {
  metrics: Array<{
    name: string;
    value: string;
    trend: "up" | "down" | "stable";
    change: string;
  }>;
  benchmarks: Array<{
    scenario: string;
    result: string;
    comparison: string;
  }>;
  optimizations: string[];
}

export interface Example {
  useCase: string;
  input: string;
  output: string;
  explanation: string;
}

export interface Deployment {
  time: string;
  options: DeploymentOption[];
}

export interface TargetAudience {
  roles: string[];
  industries: string[];
  companySize: string[];
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  type: "Enterprise" | "Startup" | "Individual" | "Serverless";
  category: string;
  reliability: Reliability;
  deployment: Deployment;
  targetAudience: TargetAudience;
  performance: Performance;
  examples: Example[];
}

export const agents: Agent[] = [
  {
    id: "financial-ops",
    name: "Financial Operations Agent",
    description: "Enterprise-grade AI assistant for financial operations, automating complex workflows and providing real-time insights.",
    type: "Enterprise",
    category: "Finance",
    reliability: {
      uptime: "99.99%",
      responseTime: "< 100ms",
      successRate: "99.9%"
    },
    deployment: {
      time: "< 15 minutes",
      options: [
        {
          type: "Cloud",
          description: "Deploy on our secure cloud infrastructure",
          requirements: ["Valid API key", "Cloud subscription"]
        },
        {
          type: "On-premise",
          description: "Deploy within your own infrastructure",
          requirements: ["Docker", "Kubernetes", "Min 16GB RAM"]
        }
      ]
    },
    targetAudience: {
      roles: ["CFO", "Financial Analyst", "Account Manager"],
      industries: ["Banking", "Insurance", "Investment"],
      companySize: ["Enterprise", "Mid-market"]
    },
    performance: {
      metrics: [
        {
          name: "Transaction Processing",
          value: "10k/sec",
          trend: "up",
          change: "+15%"
        },
        {
          name: "Accuracy Rate",
          value: "99.99%",
          trend: "stable",
          change: "0%"
        }
      ],
      benchmarks: [
        {
          scenario: "Batch Processing",
          result: "500k records/min",
          comparison: "2x faster than average"
        }
      ],
      optimizations: [
        "Automated reconciliation",
        "Real-time fraud detection",
        "Smart categorization"
      ]
    },
    examples: [
      {
        useCase: "Expense Categorization",
        input: "Process 1000 transactions",
        output: "Categorized with 99.9% accuracy",
        explanation: "Uses ML to automatically categorize expenses"
      },
      {
        useCase: "Fraud Detection",
        input: "Monitor transactions",
        output: "Identified 3 suspicious patterns",
        explanation: "Real-time anomaly detection"
      }
    ]
  }
]; 