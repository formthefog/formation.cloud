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
    slack: `// Integrate with Slack using Formation's API
const FORMATION_API_ENDPOINT = 'https://api.formation.cloud/v1';

async function handleSlackMessage(message) {
  const response = await fetch(\`\${FORMATION_API_ENDPOINT}/agents/customer-support/process\`, {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${process.env.FORMATION_API_KEY}\`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: message.text,
      context: {
        channel: message.channel,
        user: message.user,
        thread: message.thread_ts
      }
    })
  });

  const { response: aiResponse } = await response.json();
  return aiResponse;
}

// Example Slack bot implementation
app.post('/slack/events', async (req, res) => {
  const { event } = req.body;
  if (event.type === 'message') {
    const response = await handleSlackMessage(event);
    await postToSlack(event.channel, response);
  }
});`,

    zapier: `// Formation + Zapier Integration Example
async function processNewEmail(email) {
  // Call Formation's API to analyze the email
  const response = await fetch(\`\${FORMATION_API_ENDPOINT}/agents/email-processor/analyze\`, {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${process.env.FORMATION_API_KEY}\`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content: email.body,
      metadata: {
        subject: email.subject,
        sender: email.from,
        timestamp: email.date
      }
    })
  });

  const { summary, category, priority } = await response.json();

  // Use the results in your Zapier workflow
  await notionAPI.createPage({
    title: email.subject,
    content: summary,
    properties: {
      Category: category,
      Priority: priority
    }
  });
}`,

    api: `// Direct REST API Integration
app.post('/generate-content', async (req, res) => {
  const { topic, length, tone } = req.body;
  
  try {
    const response = await fetch(\`\${FORMATION_API_ENDPOINT}/agents/content/generate\`, {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${process.env.FORMATION_API_KEY}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        topic,
        parameters: {
          maxLength: length,
          tone,
          format: 'markdown'
        }
      })
    });

    const { content } = await response.json();
    res.json({ content });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate content' });
  }
});`
  };

  const realWorldExamples = [
    {
      title: "Customer Support Automation",
      description: "Handle support tickets automatically with context-aware responses",
      icon: <MessageSquare className="w-6 h-6" />,
      examples: [
        "Instant, context-aware responses to customer inquiries",
        "Smart ticket routing based on content analysis",
        "Automated escalation with confidence scoring",
        "Seamless human handoff when needed"
      ],
      code: `// Formation Customer Support API Integration
const FORMATION_API_ENDPOINT = 'https://api.formation.cloud/v1';

async function handleSupportTicket(ticket) {
  // Analyze ticket with Formation's AI
  const response = await fetch(\`\${FORMATION_API_ENDPOINT}/agents/support/analyze\`, {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${process.env.FORMATION_API_KEY}\`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content: ticket.description,
      context: {
        customerId: ticket.customerId,
        history: await getCustomerHistory(ticket.customerId)
      }
    })
  });

  const { 
    category,
    suggestedResponse,
    confidence,
    priority
  } = await response.json();

  // Automated response for high-confidence cases
  if (confidence > 0.8) {
    await sendResponse(ticket.id, suggestedResponse);
  } else {
    await routeToHumanAgent(ticket.id, {
      category,
      priority,
      aiSuggestion: suggestedResponse
    });
  }
}`
    },
    {
      title: "Document Processing Pipeline",
      description: "Transform documents into structured data with AI-powered analysis",
      icon: <FileText className="w-6 h-6" />,
      examples: [
        "Extract key data from any document format",
        "Intelligent document classification",
        "Automated compliance checking",
        "Rich metadata extraction"
      ],
      code: `// Formation Document Processing API
async function processDocument(document) {
  const formData = new FormData();
  formData.append('file', document.file);
  formData.append('metadata', JSON.stringify({
    type: document.type,
    workflow: 'invoice-processing'
  }));

  const response = await fetch(\`\${FORMATION_API_ENDPOINT}/agents/document/process\`, {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${process.env.FORMATION_API_KEY}\`
    },
    body: formData
  });

  const {
    extractedData,
    entities,
    summary,
    confidence
  } = await response.json();

  // Store processed results
  await saveToDatabase({
    documentId: document.id,
    data: extractedData,
    metadata: {
      entities,
      summary,
      confidence
    }
  });

  return extractedData;
}`
    },
    {
      title: "Research Assistant",
      description: "Harness AI for comprehensive market research and analysis",
      icon: <Search className="w-6 h-6" />,
      examples: [
        "Real-time market trend analysis",
        "Competitive intelligence gathering",
        "Automated research summaries",
        "Data-driven insights"
      ],
      code: `// Formation Research API Integration
async function conductResearch(topic) {
  const response = await fetch(\`\${FORMATION_API_ENDPOINT}/agents/research/analyze\`, {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${process.env.FORMATION_API_KEY}\`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      topic,
      parameters: {
        sources: ['news', 'academic', 'social'],
        timeframe: 'last_3_months',
        depth: 'comprehensive'
      }
    })
  });

  const {
    insights,
    trends,
    competitors,
    recommendations
  } = await response.json();

  // Generate report with findings
  const report = await generateReport({
    insights,
    trends,
    competitors,
    recommendations,
    format: 'pdf'
  });

  return report;
}`
    }
  ];

  const integrationTypes = [
    {
      name: "RESTful API",
      description: "Simple, powerful REST endpoints for any use case",
      icon: <Code2 className="w-8 h-8" />,
      platforms: ["OpenAPI Spec", "Swagger UI", "Postman Collections", "cURL Ready"]
    },
    {
      name: "Platform Integrations",
      description: "Pre-built connectors for popular platforms",
      icon: <Workflow className="w-8 h-8" />,
      platforms: ["Slack", "Discord", "Microsoft Teams", "Zapier"]
    },
    {
      name: "Enterprise Solutions",
      description: "Secure, scalable deployment options",
      icon: <Building2 className="w-8 h-8" />,
      platforms: ["Private Cloud", "Custom Endpoints", "SSO", "Audit Logs"]
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
            Powerful AI Agents <br className="hidden md:block" />
            One API Call Away
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl md:mx-auto leading-relaxed">
            Deploy enterprise-grade AI agents in seconds with our simple, powerful API. No setup, no configuration - just instant AI capabilities for your applications.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
            <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
              Get API Key <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-blue-600 text-blue-600 hover:bg-blue-50">
              View API Docs
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Badge variant="secondary" className="bg-blue-50 text-blue-600">
              <Zap className="w-4 h-4 mr-1" /> Instant Deployment
            </Badge>
            <Badge variant="secondary" className="bg-blue-50 text-blue-600">
              <Shield className="w-4 h-4 mr-1" /> Enterprise Security
            </Badge>
            <Badge variant="secondary" className="bg-blue-50 text-blue-600">
              <Brain className="w-4 h-4 mr-1" /> State-of-the-art AI
            </Badge>
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
                title: "1. Get API Key",
                description: "Sign up and get your API key in seconds"
              },
              {
                icon: <Bot className="w-6 h-6" />,
                title: "2. Choose Agent",
                description: "Select from our marketplace of specialized AI agents"
              },
              {
                icon: <Settings className="w-6 h-6" />,
                title: "3. Make API Call",
                description: "One API call to unlock AI capabilities"
              },
              {
                icon: <Rocket className="w-6 h-6" />,
                title: "4. Scale Instantly",
                description: "Enterprise-ready infrastructure that grows with you"
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