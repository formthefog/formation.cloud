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
      typescript: `import { Agent } from '@formation/agent-sdk';

export class CustomAgent extends Agent {
  async process(input: string): Promise<string> {
    // Your agent logic here
    const result = await this.tools.someAIModel.generate(input);
    return result;
  }
}`,
      python: `from formation_agent import Agent

class CustomAgent(Agent):
    async def process(self, input: str) -> str:
        # Your agent logic here
        result = await self.tools.some_ai_model.generate(input)
        return result`
    },
    advanced: {
      typescript: `import { Agent, Tool, Memory } from '@formation/agent-sdk';

@Tool('web-search')
@Tool('code-analysis')
@Memory({ type: 'conversation' })
export class CodeReviewAgent extends Agent {
  async process(input: string): Promise<string> {
    const codeAnalysis = await this.tools.codeAnalysis.analyze(input);
    const bestPractices = await this.tools.webSearch.find('code best practices ' + input);
    
    return this.formatReview(codeAnalysis, bestPractices);
  }
}`,
      python: `from formation_agent import Agent, tool, memory

@tool('web-search')
@tool('code-analysis')
@memory(type='conversation')
class CodeReviewAgent(Agent):
    async def process(self, input: str) -> str:
        code_analysis = await self.tools.code_analysis.analyze(input)
        best_practices = await self.tools.web_search.find(f'code best practices {input}')
        
        return self.format_review(code_analysis, best_practices)`
    }
  };

  const features = [
    {
      title: "Powerful SDK",
      description: "Build agents with our intuitive SDK, supporting both TypeScript and Python with full type safety.",
      icon: <Terminal className="w-6 h-6" />,
      color: "blue"
    },
    {
      title: "Built-in Tools",
      description: "Access a growing library of pre-built tools for AI models, web search, code analysis, and more.",
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
      description: "Start with a simple agent that processes input and returns output.",
      icon: <Code2 className="w-8 h-8" />
    },
    {
      name: "Advanced Agent",
      description: "Create a sophisticated agent with tools, memory, and complex processing.",
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
      title: "Developer Tools",
      description: "Access powerful development tools and APIs to build sophisticated agents.",
      icon: <Database className="w-8 h-8" />,
      metrics: ["Full TypeScript/Python support", "Extensive tool library", "Local development kit"]
    },
    {
      title: "Analytics & Insights",
      description: "Get detailed analytics and insights about your agents' performance and usage.",
      icon: <BarChart className="w-8 h-8" />,
      metrics: ["Usage analytics", "Performance metrics", "Revenue tracking"]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div {...fadeIn} className="space-y-16">
        <PathNavigation />
        
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <span className="text-purple-600 font-semibold">FOR DEVELOPERS</span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            Build & Monetize AI Agents with <span className="text-purple-600">Formation</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Create powerful AI agents, reach enterprise customers, and earn revenue with our developer-first platform.
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              Start Building <Terminal className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline">
              View Documentation
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
            >
              <div className={`p-3 bg-${feature.color}-100 rounded-lg w-fit mb-4`}>
                <div className={`text-${feature.color}-600`}>{feature.icon}</div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Code Examples Section */}
        <section className="bg-gray-50 rounded-2xl p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">Build Your First Agent</h2>
              <div className="flex gap-4">
                {frameworks.map((framework, index) => (
                  <Button
                    key={framework.name}
                    variant={selectedFramework === index ? "default" : "outline"}
                    onClick={() => setSelectedFramework(index)}
                    className={selectedFramework === index ? "bg-purple-600" : ""}
                  >
                    {framework.icon}
                    <span className="ml-2">{framework.name}</span>
                  </Button>
                ))}
              </div>
            </div>
            <Tab.Group>
              <Tab.List className="flex space-x-4 bg-white rounded-lg p-2 mb-4">
                <Tab className={({ selected }) =>
                  classNames(
                    'w-32 py-2.5 text-sm font-medium rounded-md',
                    selected ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                  )
                }>
                  TypeScript
                </Tab>
                <Tab className={({ selected }) =>
                  classNames(
                    'w-32 py-2.5 text-sm font-medium rounded-md',
                    selected ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                  )
                }>
                  Python
                </Tab>
              </Tab.List>
              <Tab.Panels>
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
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-center">Why Build on Formation</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-8 rounded-xl shadow-lg"
              >
                <div className="p-3 bg-purple-100 rounded-lg w-fit mb-6">
                  <div className="text-purple-600">{benefit.icon}</div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-gray-600 mb-6">{benefit.description}</p>
                <ul className="space-y-2">
                  {benefit.metrics.map((metric, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>{metric}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Developer Resources */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-8 text-white">
            <GitBranch className="w-8 h-8 mb-4" />
            <h3 className="text-2xl font-bold mb-4">Open Source SDK</h3>
            <p className="text-purple-100 mb-6">
              Our SDK is open source and available on GitHub. Contribute, customize, and help us build the future of AI agents.
            </p>
            <Button variant="secondary" className="bg-white text-purple-600 hover:bg-purple-50">
              View on GitHub <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
            <Share2 className="w-8 h-8 mb-4" />
            <h3 className="text-2xl font-bold mb-4">Developer Community</h3>
            <p className="text-blue-100 mb-6">
              Join our thriving developer community. Share knowledge, get help, and collaborate with other agent builders.
            </p>
            <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
              Join Discord <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Building?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of developers already building and monetizing AI agents on Formation.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-purple-50">
              Create Account
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-purple-500">
              Read Documentation
            </Button>
          </div>
        </section>

        {/* Success Stories */}
        <section className="text-center space-y-6">
          <h2 className="text-2xl font-semibold">Success Stories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-lg text-left">
                <div className="h-12 w-12 rounded-full bg-gray-200 mb-4"></div>
                <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </motion.div>
    </div>
  );
} 