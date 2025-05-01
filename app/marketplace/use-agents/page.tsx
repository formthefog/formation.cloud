'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tab } from '@headlessui/react';
import { CodeBlock } from '@/components/CodeBlock';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Code2,
  Users,
  Rocket,
  Shield,
  Zap,
  Gift,
  Search,
  Filter,
  Settings,
  Terminal,
  Workflow,
  MessageSquare,
  Database,
  Key
} from 'lucide-react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function UseAgents() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const deploymentExamples = {
    npm: `// Initialize the Formation client
const formation = require('@formation/sdk');
const client = new formation.Client('your-api-key');

// Deploy an agent
const agent = await client.deployAgent({
  agentId: 'code-review-agent',
  config: {
    language: 'typescript',
    style: 'google',
    maxIssues: 10
  }
});

// Use the agent
const results = await agent.analyze('path/to/code');
console.log(results.suggestions);`,
    python: `# Initialize the Formation client
from formation import Client
client = Client('your-api-key')

# Deploy an agent
agent = client.deploy_agent(
    agent_id='code-review-agent',
    config={
        'language': 'typescript',
        'style': 'google',
        'max_issues': 10
    }
)

# Use the agent
results = agent.analyze('path/to/code')
print(results.suggestions)`
  };

  const popularUseCases = [
    {
      title: 'Code Review & Analysis',
      description: 'Automated code review with best practices and security checks.',
      icon: <Code2 className="w-6 h-6" />,
      tags: ['Development', 'Security']
    },
    {
      title: 'Data Processing',
      description: 'Process and analyze large datasets with intelligent automation.',
      icon: <Database className="w-6 h-6" />,
      tags: ['Analytics', 'Automation']
    },
    {
      title: 'Customer Support',
      description: 'AI-powered customer service with natural language understanding.',
      icon: <MessageSquare className="w-6 h-6" />,
      tags: ['Support', 'NLP']
    },
    {
      title: 'Workflow Automation',
      description: 'Automate repetitive tasks and complex workflows.',
      icon: <Workflow className="w-6 h-6" />,
      tags: ['Automation', 'Productivity']
    }
  ];

  const integrationSteps = [
    {
      title: 'Get Your API Key',
      description: 'Sign up and generate your Formation API key from the dashboard.',
      icon: <Key className="w-6 h-6" />,
      code: 'export FORMATION_API_KEY=your-api-key-here'
    },
    {
      title: 'Install the SDK',
      description: 'Install our SDK using npm or pip package manager.',
      icon: <Terminal className="w-6 h-6" />,
      code: 'npm install @formation/sdk'
    },
    {
      title: 'Configure Settings',
      description: 'Set up your agent configuration and preferences.',
      icon: <Settings className="w-6 h-6" />,
      code: 'const config = { language: "typescript", style: "google" }'
    },
    {
      title: 'Deploy & Run',
      description: 'Deploy your first agent and start processing tasks.',
      icon: <Rocket className="w-6 h-6" />,
      code: 'const agent = await client.deployAgent("agent-id")'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div {...fadeIn} className="space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Use AI Agents
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Deploy powerful AI agents in minutes. Streamline your workflow with pre-built solutions for code review, data processing, customer support, and more.
          </p>
          <div className="flex justify-center gap-4">
            <Badge variant="default" className="text-sm py-1">
              60-Second Deploy
            </Badge>
            <Badge variant="default" className="text-sm py-1">
              Pre-built Agents
            </Badge>
            <Badge variant="default" className="text-sm py-1">
              Enterprise Ready
            </Badge>
          </div>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for agents by name, category, or use case..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-6 text-lg"
            />
            <Button variant="outline" className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Popular Use Cases */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Popular Use Cases</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {popularUseCases.map((useCase) => (
              <motion.div
                key={useCase.title}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                    {useCase.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{useCase.title}</h3>
                    <div className="flex gap-2 mt-1">
                      {useCase.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{useCase.description}</p>
                <Button variant="link" className="mt-4 p-0">
                  View Agents <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Integration Steps */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Quick Integration</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {integrationSteps.map((step, index) => (
              <Card key={step.title}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      {step.icon}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="h-6 w-6 rounded-full">
                        {index + 1}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle>{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <CodeBlock
                    language={step.code.includes('npm') ? 'bash' : 'javascript'}
                    code={step.code}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Code Example */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Deployment Example</h2>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <Tab.Group onChange={setSelectedTab}>
              <Tab.List className="flex bg-gray-100">
                <Tab className={({ selected }) =>
                  classNames(
                    'w-24 py-2.5 text-sm font-medium leading-5',
                    'ring-white ring-opacity-60 ring-offset-2 focus:outline-none',
                    selected
                      ? 'bg-white shadow'
                      : 'text-gray-600 hover:bg-white/[0.12]'
                  )
                }>
                  npm
                </Tab>
                <Tab className={({ selected }) =>
                  classNames(
                    'w-24 py-2.5 text-sm font-medium leading-5',
                    'ring-white ring-opacity-60 ring-offset-2 focus:outline-none',
                    selected
                      ? 'bg-white shadow'
                      : 'text-gray-600 hover:bg-white/[0.12]'
                  )
                }>
                  Python
                </Tab>
              </Tab.List>
              <Tab.Panels>
                <Tab.Panel>
                  <CodeBlock
                    language="javascript"
                    code={deploymentExamples.npm}
                  />
                </Tab.Panel>
                <Tab.Panel>
                  <CodeBlock
                    language="python"
                    code={deploymentExamples.python}
                  />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </section>

        {/* Support Section */}
        <section className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-8 text-white">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-blue-100 mb-6">
              Our team is here to help you find and deploy the perfect agents for your needs. Get started with a free trial or schedule a demo for enterprise solutions.
            </p>
            <div className="flex gap-4">
              <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                Start Free Trial
              </Button>
              <Button variant="outline" className="text-white border-white hover:bg-blue-400">
                Schedule Demo
              </Button>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
} 