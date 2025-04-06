'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Tab } from '@headlessui/react';
import { CodeBlock } from '@/components/CodeBlock';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Code2, 
  Users, 
  Rocket, 
  Shield, 
  Zap, 
  Gift, 
  Check, 
  Brain,
  Bot,
  Sparkles,
  Building2,
  DollarSign,
  Terminal,
  GitBranch,
  Share2,
  BarChart,
  Settings,
  Database
} from 'lucide-react';
import { PathNavigation } from '../components/PathNavigation';
import Link from 'next/link';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function DevelopersGettingStarted() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedFramework, setSelectedFramework] = useState(0);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const codeExamples = {
    basic: {
      typescript: `// Formation Agent API Example
import express from 'express';
import { FormationAgent } from './types';

const app = express();
const FORMATION_API_ENDPOINT = 'https://api.formation.cloud/v1';

// Define your agent's behavior
const agent: FormationAgent = {
  name: 'my-custom-agent',
  description: 'A powerful custom AI agent',
  process: async (input: string, context: any) => {
    const response = await fetch(\`\${FORMATION_API_ENDPOINT}/agents/\${agent.name}/process\`, {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${process.env.FORMATION_API_KEY}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input,
        context,
        config: {
          model: 'gpt-4',
          temperature: 0.7
        }
      })
    });

    return response.json();
  }
};

// Deploy your agent
await fetch(\`\${FORMATION_API_ENDPOINT}/agents\`, {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${process.env.FORMATION_API_KEY}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(agent)
});`,
      python: `# Formation Agent API Example
from fastapi import FastAPI
from typing import Dict, Any
import httpx

app = FastAPI()
FORMATION_API_ENDPOINT = 'https://api.formation.cloud/v1'

# Define your agent's behavior
class CustomAgent:
    def __init__(self):
        self.name = 'my-custom-agent'
        self.description = 'A powerful custom AI agent'
    
    async def process(self, input: str, context: Dict[str, Any]) -> Dict[str, Any]:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f'{FORMATION_API_ENDPOINT}/agents/{self.name}/process',
                headers={
                    'Authorization': f'Bearer {os.getenv("FORMATION_API_KEY")}',
                    'Content-Type': 'application/json'
                },
                json={
                    'input': input,
                    'context': context,
                    'config': {
                        'model': 'gpt-4',
                        'temperature': 0.7
                    }
                }
            )
            return response.json()

# Deploy your agent
agent = CustomAgent()
async with httpx.AsyncClient() as client:
    await client.post(
        f'{FORMATION_API_ENDPOINT}/agents',
        headers={
            'Authorization': f'Bearer {os.getenv("FORMATION_API_KEY")}',
            'Content-Type': 'application/json'
        },
        json=agent.__dict__
    )`
    },
    advanced: {
      typescript: `// Advanced Formation Agent with Tools
import express from 'express';
import { FormationAgent, Tool } from './types';

const FORMATION_API_ENDPOINT = 'https://api.formation.cloud/v1';

// Define custom tools
const tools: Tool[] = [
  {
    name: 'web-search',
    description: 'Search the web for information'
  },
  {
    name: 'code-analysis',
    description: 'Analyze code for best practices'
  }
];

// Create an advanced agent with tools
const codeReviewAgent: FormationAgent = {
  name: 'code-review-expert',
  description: 'AI-powered code review agent',
  tools: tools,
  memory: {
    type: 'conversation',
    ttl: '24h'
  },
  process: async (input: string, context: any) => {
    const response = await fetch(\`\${FORMATION_API_ENDPOINT}/agents/\${agent.name}/process\`, {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${process.env.FORMATION_API_KEY}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input,
        context,
        tools: ['web-search', 'code-analysis'],
        config: {
          model: 'gpt-4',
          temperature: 0.3,
          memory: true
        }
      })
    });

    const result = await response.json();
    return formatReview(result);
  }
};

// Deploy agent with tools
await fetch(\`\${FORMATION_API_ENDPOINT}/agents\`, {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${process.env.FORMATION_API_KEY}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(codeReviewAgent)
});`,
      python: `# Advanced Formation Agent with Tools
from fastapi import FastAPI
from typing import Dict, Any, List
import httpx

FORMATION_API_ENDPOINT = 'https://api.formation.cloud/v1'

# Define custom tools
tools = [
    {
        'name': 'web-search',
        'description': 'Search the web for information'
    },
    {
        'name': 'code-analysis',
        'description': 'Analyze code for best practices'
    }
]

class CodeReviewAgent:
    def __init__(self):
        self.name = 'code-review-expert'
        self.description = 'AI-powered code review agent'
        self.tools = tools
        self.memory = {
            'type': 'conversation',
            'ttl': '24h'
        }
    
    async def process(self, input: str, context: Dict[str, Any]) -> Dict[str, Any]:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f'{FORMATION_API_ENDPOINT}/agents/{self.name}/process',
                headers={
                    'Authorization': f'Bearer {os.getenv("FORMATION_API_KEY")}',
                    'Content-Type': 'application/json'
                },
                json={
                    'input': input,
                    'context': context,
                    'tools': ['web-search', 'code-analysis'],
                    'config': {
                        'model': 'gpt-4',
                        'temperature': 0.3,
                        'memory': True
                    }
                }
            )
            result = response.json()
            return self.format_review(result)

# Deploy agent with tools
agent = CodeReviewAgent()
async with httpx.AsyncClient() as client:
    await client.post(
        f'{FORMATION_API_ENDPOINT}/agents',
        headers={
            'Authorization': f'Bearer {os.getenv("FORMATION_API_KEY")}',
            'Content-Type': 'application/json'
        },
        json=agent.__dict__
    )`
    }
  };

  const features = [
    {
      title: "RESTful API",
      description: "Build agents with our powerful REST API. Simple, flexible, and production-ready.",
      icon: <Terminal className="w-6 h-6" />,
      color: "blue"
    },
    {
      title: "AI Tools Library",
      description: "Access our growing library of AI capabilities through simple API endpoints.",
      icon: <Settings className="w-6 h-6" />,
      color: "purple"
    },
    {
      title: "Revenue Share",
      description: "Earn up to 80% revenue share on your agents. Set your own pricing and monetization strategy.",
      icon: <DollarSign className="w-6 h-6" />,
      color: "green"
    }
  ];

  const frameworks = [
    {
      name: "Basic Agent",
      description: "Create a simple agent with our REST API.",
      icon: <Code2 className="w-8 h-8" />
    },
    {
      name: "Advanced Agent",
      description: "Build sophisticated agents with tools, memory, and advanced processing.",
      icon: <Brain className="w-8 h-8" />
    }
  ];

  const benefits = [
    {
      title: "Enterprise Distribution",
      description: "Reach Fortune 500 companies and enterprise customers through our marketplace.",
      icon: <Building2 className="w-8 h-8" />,
      metrics: ["Access to enterprise customers", "Dedicated support", "Custom deployment options"]
    },
    {
      title: "Developer Platform",
      description: "Build and deploy agents with our powerful API platform.",
      icon: <Database className="w-8 h-8" />,
      metrics: ["OpenAPI specification", "Comprehensive documentation", "Powerful AI tools"]
    },
    {
      title: "Analytics & Insights",
      description: "Get detailed analytics and insights about your agents' performance and usage.",
      icon: <BarChart className="w-8 h-8" />,
      metrics: ["Usage analytics", "Performance metrics", "Revenue tracking"]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
      <motion.div {...fadeIn} className="space-y-8 md:space-y-16">
        <PathNavigation />
        
        {/* Hero Section */}
        <div className="text-left md:text-center space-y-4">
          <span className="text-purple-600 text-sm md:text-base font-semibold">FOR DEVELOPERS</span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
            Build & Monetize AI Agents <br className="hidden md:block" />
            with Our <span className="text-purple-600">API Platform</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl md:mx-auto leading-relaxed">
            Create powerful agents with our simple REST API, reach enterprise customers, and earn revenue with our developer-first platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
            <Link href="/marketplace/settings">
              <Button size="lg" className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
                Get API Key <Terminal className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Badge 
              variant="secondary" 
              className="bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors duration-200 cursor-pointer flex items-center px-4 py-2 text-sm font-medium"
            >
              <Code2 className="w-4 h-4 mr-2" /> RESTful API
            </Badge>
            <Badge 
              variant="secondary" 
              className="bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors duration-200 cursor-pointer flex items-center px-4 py-2 text-sm font-medium"
            >
              <Shield className="w-4 h-4 mr-2" /> Enterprise Ready
            </Badge>
            <Badge 
              variant="secondary" 
              className="bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors duration-200 cursor-pointer flex items-center px-4 py-2 text-sm font-medium"
            >
              <DollarSign className="w-4 h-4 mr-2" /> Revenue Share
            </Badge>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
            >
              <div className={`p-3 bg-${feature.color}-100 rounded-lg w-fit mb-4`}>
                <div className={`text-${feature.color}-600`}>{feature.icon}</div>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm md:text-base text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Code Examples Section */}
        <section className="bg-gray-50 rounded-2xl p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-2xl md:text-3xl font-bold">Build Your First Agent</h2>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                {frameworks.map((framework, index) => (
                  <Button
                    key={framework.name}
                    variant={selectedFramework === index ? "default" : "outline"}
                    onClick={() => setSelectedFramework(index)}
                    className={classNames(
                      "w-full sm:w-auto justify-start sm:justify-center",
                      selectedFramework === index ? "bg-purple-600" : ""
                    )}
                  >
                    {framework.icon}
                    <span className="ml-2">{framework.name}</span>
                  </Button>
                ))}
              </div>
            </div>
            <Tab.Group>
              <Tab.List className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 bg-white rounded-lg p-2 mb-4">
                <Tab className={({ selected }) =>
                  classNames(
                    'py-2.5 text-sm font-medium rounded-md w-full sm:w-32',
                    selected ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                  )
                }>
                  TypeScript
                </Tab>
                <Tab className={({ selected }) =>
                  classNames(
                    'py-2.5 text-sm font-medium rounded-md w-full sm:w-32',
                    selected ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                  )
                }>
                  Python
                </Tab>
              </Tab.List>
              <Tab.Panels className="overflow-x-auto">
                <Tab.Panel>
                  <CodeBlock
                    language="typescript"
                    code={selectedFramework === 0 ? codeExamples.basic.typescript : codeExamples.advanced.typescript}
                  />
                </Tab.Panel>
                <Tab.Panel>
                  <CodeBlock
                    language="python"
                    code={selectedFramework === 0 ? codeExamples.basic.python : codeExamples.advanced.python}
                  />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="space-y-6 md:space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-left md:text-center">Why Build on Formation</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 md:p-8 rounded-xl shadow-lg"
              >
                <div className="p-3 bg-purple-100 rounded-lg w-fit mb-4 md:mb-6">
                  <div className="text-purple-600">{benefit.icon}</div>
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">{benefit.title}</h3>
                <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">{benefit.description}</p>
                <ul className="space-y-2">
                  {benefit.metrics.map((metric, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{metric}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Developer Resources */}
        {/* <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 md:p-8 text-white">
            <GitBranch className="w-8 h-8 mb-4" />
            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">API Documentation</h3>
            <p className="text-sm md:text-base text-purple-100 mb-6">
              Comprehensive API documentation with examples, guides, and best practices to help you build amazing AI agents.
            </p>
            <Button variant="secondary" className="w-full sm:w-auto bg-white text-purple-600 hover:bg-purple-50">
              View API Docs <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 md:p-8 text-white">
            <Share2 className="w-8 h-8 mb-4" />
            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Developer Community</h3>
            <p className="text-sm md:text-base text-blue-100 mb-6">
              Join our thriving developer community. Share knowledge, get help, and collaborate with other agent builders.
            </p>
            <Button variant="secondary" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50">
              Join Discord <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </section> */}

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-6 md:p-12 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Building?</h2>
          <p className="text-lg md:text-xl text-purple-100 mb-6 md:mb-8 max-w-2xl mx-auto">
            Join hundreds of developers already building and monetizing AI agents on Formation.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/marketplace/settings">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white hover:bg-white text-[#9333EA] hover:text-[#7928CA] transition-colors">
                CREATE ACCOUNT
              </Button>
            </Link>
            {/* <Button size="lg" variant="outline" className="w-full sm:w-auto border-white bg-white hover:bg-white/80 text-[#9333EA] transition-colors">
              READ DOCUMENTATION
            </Button> */}
          </div>
        </section>
      </motion.div>
    </div>
  );
} 