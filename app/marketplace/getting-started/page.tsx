'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Tab } from '@headlessui/react';
import { CodeBlock } from '@/components/CodeBlock';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code2, Users, Rocket, Shield, Zap, Gift } from 'lucide-react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function GettingStarted() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedPath, setSelectedPath] = useState<'use' | 'provide' | null>(null);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const quickStartCode = {
    use: {
      npm: `npm install @formation/sdk
const formation = require('@formation/sdk');

// Initialize with your API key
const client = new formation.Client('your-api-key');

// Deploy an agent from the marketplace
const agent = await client.deployAgent('agent-id');

// Start using the agent
const response = await agent.run('Hello, Formation!');`,
      python: `pip install formation-sdk
from formation import Client

# Initialize with your API key
client = Client('your-api-key')

# Deploy an agent from the marketplace
agent = client.deploy_agent('agent-id')

# Start using the agent
response = agent.run('Hello, Formation!')`
    },
    provide: {
      npm: `npm install @formation/agent-sdk
const formation = require('@formation/agent-sdk');

// Create your agent class
class MyCustomAgent extends formation.Agent {
  async process(input) {
    // Your agent logic here
    return 'Processed: ' + input;
  }
}

// Register your agent
formation.register('my-custom-agent', MyCustomAgent);`,
      python: `pip install formation-agent-sdk
from formation_agent import Agent, register

class MyCustomAgent(Agent):
    async def process(self, input):
        # Your agent logic here
        return f"Processed: {input}"

# Register your agent
register('my-custom-agent', MyCustomAgent)`
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div {...fadeIn} className="space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Get Started with Formation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose your path: Use AI agents to supercharge your workflow, or build and monetize your own agents on our marketplace.
          </p>
        </div>

        {/* Path Selection */}
        {!selectedPath && (
          <motion.div {...fadeIn} className="grid md:grid-cols-2 gap-8 mt-12">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-8 rounded-xl shadow-lg border-2 border-transparent hover:border-blue-500 cursor-pointer"
              onClick={() => setSelectedPath('use')}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold">Use AI Agents</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Deploy pre-built AI agents for your business needs. Get started in minutes with our extensive marketplace of specialized agents.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-500" />
                  <span>Deploy agents in 60 seconds</span>
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <span>Enterprise-grade security</span>
                </li>
                <li className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-blue-500" />
                  <span>Pay-per-use pricing</span>
                </li>
              </ul>
              <Button className="w-full">
                Start Using Agents <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-8 rounded-xl shadow-lg border-2 border-transparent hover:border-blue-500 cursor-pointer"
              onClick={() => setSelectedPath('provide')}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Code2 className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold">Provide AI Agents</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Build and monetize your own AI agents. Reach enterprise customers and grow your revenue on our marketplace.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-blue-500" />
                  <span>Revenue sharing model</span>
                </li>
                <li className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span>Access enterprise customers</span>
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <span>Developer-friendly SDK</span>
                </li>
              </ul>
              <Button className="w-full">
                Start Building Agents <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* Path Specific Content */}
        {selectedPath && (
          <motion.div {...fadeIn} className="space-y-12">
            {/* Quick Start */}
            <section className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Quick Start</h2>
                <Button variant="outline" onClick={() => setSelectedPath(null)}>
                  Change Path
                </Button>
              </div>
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
                        code={quickStartCode[selectedPath].npm}
                      />
                    </Tab.Panel>
                    <Tab.Panel>
                      <CodeBlock
                        language="python"
                        code={quickStartCode[selectedPath].python}
                      />
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </div>
            </section>

            {/* Next Steps */}
            <section className="space-y-6">
              <h2 className="text-3xl font-bold">Next Steps</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {(selectedPath === 'use' ? [
                  {
                    title: 'Browse Agents',
                    description: 'Explore our marketplace of pre-built AI agents ready for deployment.',
                    link: '/marketplace/use-agents',
                    icon: <Users className="w-6 h-6" />
                  },
                  {
                    title: 'Integration Guide',
                    description: 'Learn how to integrate agents with your existing tools and workflows.',
                    link: '/docs/integration',
                    icon: <Code2 className="w-6 h-6" />
                  },
                  {
                    title: 'Enterprise Setup',
                    description: 'Set up dedicated instances and configure enterprise-grade security.',
                    link: '/docs/enterprise',
                    icon: <Shield className="w-6 h-6" />
                  }
                ] : [
                  {
                    title: 'Agent Development',
                    description: 'Learn how to build powerful AI agents using our SDK and best practices.',
                    link: '/docs/agent-development',
                    icon: <Code2 className="w-6 h-6" />
                  },
                  {
                    title: 'Monetization Guide',
                    description: 'Understand pricing strategies and revenue sharing on our marketplace.',
                    link: '/docs/monetization',
                    icon: <Gift className="w-6 h-6" />
                  },
                  {
                    title: 'Publishing Guide',
                    description: 'Learn how to publish and promote your agents on our marketplace.',
                    link: '/docs/publishing',
                    icon: <Rocket className="w-6 h-6" />
                  }
                ]).map((step) => (
                  <motion.a
                    key={step.title}
                    href={step.link}
                    whileHover={{ scale: 1.02 }}
                    className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        {step.icon}
                      </div>
                      <h3 className="text-xl font-semibold">{step.title}</h3>
                    </div>
                    <p className="text-gray-600">{step.description}</p>
                    <div className="mt-4 text-blue-600 font-medium flex items-center gap-2">
                      Learn more <ArrowRight className="w-4 h-4" />
                    </div>
                  </motion.a>
                ))}
              </div>
            </section>

            {/* Support Section */}
            <section className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-8 text-white">
              <div className="max-w-3xl">
                <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
                <p className="text-blue-100 mb-6">
                  {selectedPath === 'use'
                    ? "Our team is here to help you find and deploy the perfect agents for your needs. Whether you need technical support or want to learn more about enterprise solutions, we're just a message away."
                    : "Get support from our developer success team to build and monetize your agents. We're here to help you with technical questions, best practices, and marketplace optimization."}
                </p>
                <div className="flex gap-4">
                  <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                    Contact Support
                  </Button>
                  <Button variant="outline" className="text-white border-white hover:bg-blue-400">
                    View Documentation
                  </Button>
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
} 