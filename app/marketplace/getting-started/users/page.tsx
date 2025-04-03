'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Tab } from '@headlessui/react';
import { CodeBlock } from '@/components/CodeBlock';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PathNavigation } from '../components/PathNavigation';
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
  Clock,
  DollarSign,
  MessageSquare,
  FileText,
  Search,
  Database,
  BarChart,
  Settings,
  Workflow,
  GitPullRequest,
  Mail,
  Calendar
} from 'lucide-react';
import Link from 'next/link';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function UsersGettingStarted() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedExample, setSelectedExample] = useState(0);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const integrationExamples = {
    slack: `// Integrate with Slack
const agent = await formation.deployAgent('customer-support');

// Set up Slack integration
agent.connect('slack', {
  channel: 'support',
  triggerOn: ['mention', 'direct-message']
});

// Example response
agent.on('message', async (message) => {
  const response = await agent.process(message.text);
  await message.reply(response);
});`,
    zapier: `// Connect to Zapier
const agent = await formation.deployAgent('data-processor');

// Set up Zapier trigger
agent.connect('zapier', {
  trigger: {
    app: 'gmail',
    event: 'new_email'
  },
  action: async (email) => {
    const summary = await agent.summarize(email.body);
    await agent.tools.notion.createPage({
      title: email.subject,
      content: summary
    });
  }
});`,
    api: `// Direct API integration
const agent = await formation.deployAgent('content-generator');

app.post('/generate-content', async (req, res) => {
  const { topic, length, tone } = req.body;
  
  const content = await agent.generate({
    prompt: topic,
    parameters: {
      maxLength: length,
      style: tone
    }
  });

  res.json({ content });
});`
  };

  const realWorldExamples = [
    {
      title: "Customer Support Automation",
      description: "Handle support tickets automatically with context-aware responses",
      icon: <MessageSquare className="w-6 h-6" />,
      examples: [
        "Automatically categorize and route support tickets",
        "Generate contextual responses based on user history",
        "Escalate complex issues to human agents",
        "Maintain conversation history and context"
      ],
      code: `const supportAgent = await formation.deployAgent('support');

// Configure knowledge base
await supportAgent.loadDocs('support-articles');

// Handle incoming ticket
supportAgent.on('ticket', async (ticket) => {
  // Analyze ticket content
  const category = await supportAgent.categorize(ticket.content);
  
  // Generate response based on similar cases
  const response = await supportAgent.respond({
    content: ticket.content,
    userHistory: await ticket.getUserHistory(),
    category
  });

  if (response.confidence > 0.8) {
    await ticket.reply(response.text);
  } else {
    await ticket.escalateToHuman();
  }
});`
    },
    {
      title: "Document Processing Pipeline",
      description: "Process, analyze, and extract data from documents at scale",
      icon: <FileText className="w-6 h-6" />,
      examples: [
        "Extract key information from invoices and receipts",
        "Analyze legal documents for compliance",
        "Generate document summaries and reports",
        "Convert unstructured data to structured formats"
      ],
      code: `const docAgent = await formation.deployAgent('document-processor');

// Configure document processing pipeline
const pipeline = docAgent.createPipeline([
  'extract-text',
  'analyze-structure',
  'identify-entities',
  'generate-summary'
]);

// Process incoming documents
docAgent.on('document', async (doc) => {
  const result = await pipeline.process(doc);
  
  // Store structured data
  await database.store({
    documentId: doc.id,
    entities: result.entities,
    summary: result.summary,
    metadata: result.metadata
  });
});`
    },
    {
      title: "Research Assistant",
      description: "Conduct comprehensive research and generate insights",
      icon: <Search className="w-6 h-6" />,
      examples: [
        "Analyze market trends and competitor data",
        "Generate research reports and summaries",
        "Monitor news and social media sentiment",
        "Create data visualizations and insights"
      ],
      code: `const researchAgent = await formation.deployAgent('research');

// Configure research parameters
const research = await researchAgent.research({
  topic: 'AI Market Trends 2024',
  sources: ['news', 'academic', 'social'],
  timeframe: 'last_3_months',
  deliverables: ['summary', 'insights', 'visualization']
});

// Generate comprehensive report
const report = await researchAgent.generateReport({
  research,
  format: 'pdf',
  sections: [
    'executive_summary',
    'key_findings',
    'market_analysis',
    'recommendations'
  ]
});`
    }
  ];

  const integrationTypes = [
    {
      name: "Chat Platforms",
      description: "Integrate with Slack, Discord, or custom chat solutions",
      icon: <MessageSquare className="w-8 h-8" />,
      platforms: ["Slack", "Discord", "Microsoft Teams", "Custom WebSocket"]
    },
    {
      name: "Workflow Automation",
      description: "Connect with Zapier, n8n, or direct API integration",
      icon: <Workflow className="w-8 h-8" />,
      platforms: ["Zapier", "n8n", "Make.com", "Custom Workflows"]
    },
    {
      name: "Data Processing",
      description: "Process data from various sources and formats",
      icon: <Database className="w-8 h-8" />,
      platforms: ["CSV/Excel", "JSON/XML", "PDFs", "Images/OCR"]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
      <motion.div {...fadeIn} className="space-y-8 md:space-y-16">
        <PathNavigation />
        
        {/* Hero Section */}
        <div className="text-left md:text-center space-y-4">
          <span className="text-blue-600 text-sm md:text-base font-semibold">WELCOME TO FORMATION</span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
            Build Powerful AI <br className="hidden md:block" />
            Workflows with <span className="text-blue-600">Formation</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl md:mx-auto leading-relaxed">
            Deploy pre-built AI agents to automate workflows, process data, and enhance productivity.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
            <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
              Start Free Trial <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-blue-600 text-blue-600 hover:bg-blue-50">
              View Documentation
            </Button>
          </div>
        </div>

        {/* Real World Examples */}
        <section className="space-y-8 md:space-y-12">
          <div className="text-left md:text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Real-World Applications</h2>
            <p className="text-gray-600 max-w-2xl md:mx-auto">
              Explore practical examples of how Formation agents can be integrated into your existing workflows.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            {realWorldExamples.map((example, index) => (
              <Button
                key={example.title}
                variant={selectedExample === index ? "default" : "outline"}
                onClick={() => setSelectedExample(index)}
                className={classNames(
                  "w-full sm:w-auto justify-start sm:justify-center",
                  selectedExample === index ? "bg-blue-600 hover:bg-blue-700" : "border-blue-600 text-blue-600 hover:bg-blue-50"
                )}
              >
                {example.icon}
                <span className="ml-2">{example.title}</span>
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-6">
              <h3 className="text-xl md:text-2xl font-bold">{realWorldExamples[selectedExample].title}</h3>
              <p className="text-gray-600">{realWorldExamples[selectedExample].description}</p>
              <ul className="space-y-3">
                {realWorldExamples[selectedExample].examples.map((example, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>{example}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 md:p-6 overflow-x-auto">
              <CodeBlock
                language="javascript"
                code={realWorldExamples[selectedExample].code}
              />
            </div>
          </div>
        </section>

        {/* Integration Types */}
        <section className="space-y-6 md:space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-left md:text-center">Flexible Integration Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {integrationTypes.map((type) => (
              <motion.div
                key={type.name}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
              >
                <div className="p-3 bg-blue-50 rounded-lg w-fit mb-4">
                  <div className="text-blue-600">{type.icon}</div>
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2">{type.name}</h3>
                <p className="text-sm md:text-base text-gray-600 mb-4">{type.description}</p>
                <div className="flex flex-wrap gap-2">
                  {type.platforms.map((platform) => (
                    <Badge key={platform} variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-100">{platform}</Badge>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Integration Examples */}
        <section className="bg-gray-50 rounded-2xl p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Integration Examples</h2>
            <Tab.Group>
              <Tab.List className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 bg-white rounded-lg p-2 mb-4">
                {['Slack', 'Zapier', 'Direct API'].map((tab) => (
                  <Tab
                    key={tab}
                    className={({ selected }) =>
                      classNames(
                        'py-2.5 text-sm font-medium rounded-md transition-colors',
                        selected ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-blue-50'
                      )
                    }
                  >
                    {tab}
                  </Tab>
                ))}
              </Tab.List>
              <Tab.Panels className="overflow-x-auto">
                <Tab.Panel>
                  <CodeBlock
                    language="javascript"
                    code={integrationExamples.slack}
                  />
                </Tab.Panel>
                <Tab.Panel>
                  <CodeBlock
                    language="javascript"
                    code={integrationExamples.zapier}
                  />
                </Tab.Panel>
                <Tab.Panel>
                  <CodeBlock
                    language="javascript"
                    code={integrationExamples.api}
                  />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </section>

        {/* Quick Start Guide */}
        <section className="space-y-6 md:space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-left md:text-center">Getting Started is Easy</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              {
                icon: <GitPullRequest className="w-6 h-6" />,
                title: "1. Install SDK",
                description: "Install our SDK via npm or pip"
              },
              {
                icon: <Bot className="w-6 h-6" />,
                title: "2. Choose Agent",
                description: "Select from our marketplace of pre-built agents"
              },
              {
                icon: <Settings className="w-6 h-6" />,
                title: "3. Configure",
                description: "Set up integrations and customize behavior"
              },
              {
                icon: <Rocket className="w-6 h-6" />,
                title: "4. Deploy",
                description: "Deploy your agent in under 60 seconds"
              }
            ].map((step) => (
              <motion.div
                key={step.title}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-xl shadow-lg text-center border border-gray-100"
              >
                <div className="p-3 bg-blue-50 rounded-lg w-fit mx-auto mb-4">
                  <div className="text-blue-600">{step.icon}</div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 md:p-12 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Transform Your Workflow?</h2>
          <p className="text-lg md:text-xl text-blue-100 mb-6 md:mb-8 max-w-2xl mx-auto">
            Start with a free trial and see how Formation can automate your processes.
          </p>
          <div className="flex justify-center">
            <Link href="/marketplace/agents" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-white hover:text-white border-white hover:bg-blue-500">
                Browse Agents
              </Button>
            </Link>
          </div>
        </section>
      </motion.div>
    </div>
  );
} 