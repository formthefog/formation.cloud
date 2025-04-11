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
  Database,
  Box,
  FileText,
  BracketsIcon,
  BeakerIcon,
  CheckCircleIcon,
  ChartBarIcon,
  GroupIcon,
  RocketIcon,
  UploadCloud
} from 'lucide-react';
import { PathNavigation } from '../components/PathNavigation';
import Link from 'next/link';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function DevelopersGettingStarted() {
  const [selectedTab, setSelectedTab] = useState(0);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const codeExamples = {
    agno: `// Agno Agent Example (Conceptual)
// Note: Replace with actual Agno SDK usage when available
import { AgnoAgent } from '@agno/sdk';

const myAgent = new AgnoAgent({
  name: 'my-agno-agent',
  description: 'Agent built with Agno',
  process: async (input: string, context: any) => {
    // Your agent logic using Agno features
    console.log('Processing input with Agno:', input);
    return { output: \`Agno processed: \${input}\` };
  }
});

// Start the agent server (example)
// myAgent.serve(process.env.PORT || 3000);

console.log('Agno agent ready. Package with Docker for deployment.');`,
    langchain: `# LangChain Agent Example (Conceptual - Python)
# Note: Replace with actual LangChain implementation
from langchain.agents import AgentExecutor, create_react_agent
from langchain_core.prompts import PromptTemplate
# Import your chosen LLM and tools

# Define tools
# tools = [...]

# Define LLM
# llm = ...

# Create prompt template
prompt = PromptTemplate.from_template(\"\"\"
Answer the following questions as best you can. You have access to the following tools:
{tools}

Use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question

Begin!

Question: {input}
Thought:{agent_scratchpad}
\"\"\")

# Create Agent
# agent = create_react_agent(llm, tools, prompt)
# agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

# Run agent (example)
# response = agent_executor.invoke({\"input\": \"Your query here\"})
# print(response)

print("LangChain agent defined. Package with Docker for deployment.")
`,
    google_adk: `// Google Agent Developer Kit Example (Conceptual)
// Note: Replace with actual Google ADK usage when available
import { Agent } from '@google/agent-developer-kit';

const googleAgent = new Agent({
  displayName: 'my-google-adk-agent',
  description: 'Agent built with Google ADK',
  // Define agent logic, tools, and instructions per ADK specs
  instructions: 'Process the user request.',
  execute: async (request: any) => {
    console.log('Processing with Google ADK:', request.input);
    return { output: \`Google ADK processed: \${request.input}\` };
  }
});

// Run or deploy the agent as per ADK guidelines
console.log('Google ADK agent defined. Package with Docker for deployment.');`,
    openai_sdk: `# OpenAI Assistants API Example (Conceptual - Python)
# Note: Replace with actual OpenAI SDK usage
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ.get(\"OPENAI_API_KEY\"))

# Create an Assistant (do this once)
# assistant = client.beta.assistants.create(
#   name=\"My Sample Agent\",
#   instructions=\"You are a helpful assistant.\",
#   model=\"gpt-4\",
# )
# print(f\"Assistant ID: {assistant.id}\")
ASSISTANT_ID = \"YOUR_ASSISTANT_ID\" # Replace with your Assistant ID

# Create a thread
# thread = client.beta.threads.create()
# print(f\"Thread ID: {thread.id}\")
THREAD_ID = \"YOUR_THREAD_ID\" # Replace with a thread ID for interaction

# Add a message to the thread
# message = client.beta.threads.messages.create(
#   thread_id=THREAD_ID,
#   role=\"user\",
#   content=\"Hello, world!\",
# )

# Run the Assistant
# run = client.beta.threads.runs.create_and_poll(
#   thread_id=THREAD_ID,
#   assistant_id=ASSISTANT_ID,
# )

# Display the Assistant's response
# if run.status == 'completed':
#   messages = client.beta.threads.messages.list(thread_id=THREAD_ID)
#   print(messages.data[0].content[0].text.value)
# else:
#   print(run.status)

print("OpenAI Assistant interaction defined. Package application with Docker for deployment.")
`,
  };

  const features = [
    {
      title: "Framework Flexibility",
      description: "Build with Agno, LangChain, Google ADK, OpenAI SDK, or your preferred tools.",
      icon: <GitBranch className="w-6 h-6" />,
      color: "blue"
    },
    {
      title: "Docker Deployment",
      description: "Package your agent using Docker for easy deployment onto the Formation Network.",
      icon: <Box className="w-6 h-6" />,
      color: "purple"
    },
    {
      title: "Monetize & Scale",
      description: "Publish to our marketplace, reach enterprise users, and earn revenue.",
      icon: <DollarSign className="w-6 h-6" />,
      color: "green"
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
      description: "Deploy agents built with your favorite frameworks onto our scalable infrastructure.",
      icon: <Database className="w-8 h-8" />,
      metrics: ["Docker-based deployment", "Scalable infrastructure", "Performance monitoring"]
    },
    {
      title: "Analytics & Insights",
      description: "Get detailed analytics and insights about your agents' performance and usage.",
      icon: <BarChart className="w-8 h-8" />,
      metrics: ["Usage analytics", "Performance metrics", "Revenue tracking"]
    }
  ];

  const frameworkTabs = [
    { name: 'Agno', language: 'typescript', code: codeExamples.agno },
    { name: 'LangChain', language: 'python', code: codeExamples.langchain },
    { name: 'Google ADK', language: 'typescript', code: codeExamples.google_adk },
    { name: 'OpenAI SDK', language: 'python', code: codeExamples.openai_sdk },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
      <motion.div {...fadeIn} className="space-y-8 md:space-y-16">
        <PathNavigation />
        
        {/* Hero Section */}
        <div className="text-left md:text-center space-y-4">
          <span className="text-purple-600 text-sm md:text-base font-semibold">BUILD & DEPLOY</span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
            Create & Deploy AI Agents <br className="hidden md:block" />
            using <span className="text-purple-600">Standard Frameworks</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl md:mx-auto leading-relaxed">
            Build your agent with Agno, LangChain, Google ADK, OpenAI SDK, or other tools. Package it with Docker and deploy easily to the Formation Network.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
            <Link href="/marketplace/agents/new">
              <Button size="lg" className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
                Deploy Your Agent <Rocket className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Badge
              variant="secondary"
              className="bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200 cursor-pointer flex items-center px-4 py-2 text-sm font-medium"
            >
              <GitBranch className="w-4 h-4 mr-2" /> Framework Flexible
            </Badge>
            <Badge
              variant="secondary"
              className="bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors duration-200 cursor-pointer flex items-center px-4 py-2 text-sm font-medium"
            >
              <Box className="w-4 h-4 mr-2" /> Docker Deploy
            </Badge>
            <Badge
              variant="secondary"
              className="bg-green-50 text-green-600 hover:bg-green-100 transition-colors duration-200 cursor-pointer flex items-center px-4 py-2 text-sm font-medium"
            >
              <DollarSign className="w-4 h-4 mr-2" /> Monetize
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

        {/* Step 1: Build & Package Your Agent */}
        <section className="space-y-8 md:space-y-12">
          <div className="text-center">
            <RocketIcon className="w-16 h-16 text-purple-600 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Step 1: Build Your Agent</h2>
            <p className="text-lg md:text-xl text-gray-600 mt-2">
              Use your preferred framework to build stateless agents that can be easily deployed.
            </p>
          </div>
          <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
            <Tab.List className="flex flex-wrap justify-center gap-2 bg-white rounded-lg p-2 mb-4">
              {frameworkTabs.map((tab) => (
                <Tab
                  key={tab.name}
                  className={({ selected }) =>
                    classNames(
                      'py-2 px-4 text-sm font-medium rounded-md flex-grow sm:flex-grow-0 text-center',
                      selected ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                    )
                  }
                >
                  {tab.name}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="overflow-x-auto">
              {frameworkTabs.map((tab) => (
                <Tab.Panel key={tab.name}>
                  <CodeBlock
                    language={tab.language}
                    code={tab.code.replace('Your agent logic', 'Your stateless agent logic')}
                  />
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </section>

        {/* Step 2: Configure Your Agent */}
        <section className="space-y-8 md:space-y-12">
          <div className="text-center">
            <Settings className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Step 2: Configure Your Agent</h2>
            <p className="text-lg md:text-xl text-gray-600 mt-2">
              Select your preferred agent framework and provide the necessary details to help us create a Formfile for you.
            </p>
          </div>
          <form className="max-w-4xl mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Agent Framework*</label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option value="agno">Agno</option>
                  <option value="langchain">LangChain</option>
                  <option value="google-adk">Google ADK</option>
                  <option value="openai-sdk">OpenAI SDK</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Agent Name*</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded-md" placeholder="Enter your agent's name" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Agent Description*</label>
              <textarea className="w-full p-2 border border-gray-300 rounded-md" placeholder="Briefly describe your agent's functionality" required></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CPU Requirements*</label>
                <input type="number" className="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g., 2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Memory Requirements (MB)*</label>
                <input type="number" className="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g., 2048" required />
              </div>
            </div>
          </form>
        </section>

        {/* Step 3: Submit Your Agent */}
        <section className="space-y-8 md:space-y-12">
          <div className="text-center">
            <UploadCloud className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Step 3: Submit Your Agent</h2>
            <p className="text-lg md:text-xl text-gray-600 mt-2">
              Once your Formfile is ready in your GitHub repository, submit it via our form for manual deployment.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 md:p-8 rounded-xl shadow-lg"
            >
              <div className="p-3 bg-purple-100 rounded-lg w-fit mb-4 md:mb-6">
                <BracketsIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Submit Repository</h3>
              <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
                Share your GitHub repository with us for review.
              </p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 md:p-8 rounded-xl shadow-lg"
            >
              <div className="p-3 bg-purple-100 rounded-lg w-fit mb-4 md:mb-6">
                <BeakerIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Manual Review</h3>
              <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
                Our team will review your agent to ensure it meets our standards.
              </p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 md:p-8 rounded-xl shadow-lg"
            >
              <div className="p-3 bg-purple-100 rounded-lg w-fit mb-4 md:mb-6">
                <CheckCircleIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Integration</h3>
              <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
                We will integrate your agent into the Formation Network.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Step 4: Earn Money */}
        <section className="space-y-8 md:space-y-12 bg-white text-gray-900 py-16 px-8 rounded-xl mt-16">
          <div className="text-center">
            <DollarSign className="w-20 h-20 text-green-500 mx-auto mb-6 animate-bounce" />
            <h2 className="text-4xl md:text-5xl font-extrabold">Step 4: Earn Money</h2>
            <p className="text-xl md:text-2xl mt-4">
              Celebrate your success by monetizing your agent on the Formation Marketplace.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-transparent text-gray-900 p-10 rounded-lg border border-gray-300"
            >
              <div className="flex items-center justify-center mb-4">
                <DollarSign className="w-12 h-12 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Monetize Your Agent</h3>
              <p className="text-lg">
                Once approved, your agent will be live on the marketplace, ready to generate revenue.
              </p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-transparent text-gray-900 p-10 rounded-lg border border-gray-300"
            >
              <div className="flex items-center justify-center mb-4">
                <ChartBarIcon className="w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Track Performance</h3>
              <p className="text-lg">
                Access detailed analytics to monitor your agent's performance and optimize for success.
              </p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-transparent text-gray-900 p-10 rounded-lg border border-gray-300"
            >
              <div className="flex items-center justify-center mb-4">
                <GroupIcon className="w-12 h-12 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Expand Your Reach</h3>
              <p className="text-lg">
                Engage with enterprise customers and expand your agent's user base.
              </p>
            </motion.div>
          </div>
          <p className="text-center text-lg mt-10">
            Start earning by leveraging the Formation Marketplace's reach and resources.
          </p>
        </section>

        {/* CTA Section - Updated */}
        <section className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-6 md:p-12 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Deploy Your Agent?</h2>
          <p className="text-lg md:text-xl text-purple-100 mb-6 md:mb-8 max-w-2xl mx-auto">
            Build your agent, package it with Docker, and publish it to the Formation Marketplace.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/marketplace/create-agent">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white hover:bg-white text-[#9333EA] hover:text-[#7928CA] transition-colors">
                DEPLOY AGENT
              </Button>
            </Link>
            {/* <Button size="lg" variant="outline" className="w-full sm:w-auto border-white bg-white hover:bg-white/80 text-[#9333EA] transition-colors">
              READ DEPLOYMENT DOCS
            </Button> */}
          </div>
        </section>
      </motion.div>
    </div>
  );
} 