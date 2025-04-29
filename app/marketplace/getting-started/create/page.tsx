// Modified component with improved Step 2 section and state management

"use client";

import { TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Tab } from "@headlessui/react";
import { CodeBlock } from "@/components/CodeBlock";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Rocket,
  DollarSign,
  GitBranch,
  BarChart,
  Settings,
  Database,
  Box,
  RocketIcon,
  UploadCloud,
  Camera,
  Upload,
  Layers,
  Code,
} from "lucide-react";
import { PathNavigation } from "../components/PathNavigation";
import Link from "next/link";
import { useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Image from "next/image";
import { AuthButton } from "@/components/AuthButton";
import MonetizationBanner from "@/components/MonetizationBanner";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Avatar Upload Component
const AvatarUpload = ({ avatar, setAvatar }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <div className="relative">
        <div
          className={`w-24 h-24 rounded-full flex items-center justify-center overflow-hidden border-2 border-blue-200 ${
            avatar
              ? "bg-white"
              : "bg-gradient-to-br from-blue-500/10 to-green-400/10"
          }`}
          style={{ boxShadow: "0 0 20px rgba(59, 130, 246, 0.15)" }}
        >
          {avatar ? (
            <img
              src={avatar}
              alt="Agent avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <Camera className="w-8 h-8 text-blue-400" />
          )}
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1.5 shadow-md transition-all"
        >
          <Upload className="w-4 h-4" />
        </button>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      <span className="text-xs font-medium text-gray-600 mt-2">
        Upload agent portrait
      </span>
    </div>
  );
};

export default function DevelopersGettingStarted() {
  // Track active step
  const [currentStep, setCurrentStep] = useState(1);

  const [selectedTab, setSelectedTab] = useState(0);
  const [showAuthFlow, setShowAuthFlow] = useState(false);
  const step2Ref = useRef(null);
  const step3Ref = useRef(null);
  const [avatar, setAvatar] = useState(null);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const features = [
    {
      title: "Framework Flexibility",
      description:
        "Build with Agno, LangChain, Google ADK, OpenAI SDK, or your preferred tools.",
      icon: <GitBranch className="w-6 h-6" />,
      color: "blue",
    },
    {
      title: "Docker Deployment",
      description:
        "Package your agent using Docker for easy deployment onto the Formation Network.",
      icon: <Box className="w-6 h-6" />,
      color: "purple",
    },
    {
      title: "Monetize & Scale",
      description:
        "Publish to our marketplace, reach enterprise users, and earn revenue.",
      icon: <DollarSign className="w-6 h-6" />,
      color: "green",
    },
  ];

  // 1. Define pre-built agents (from screenshot and code examples)
  const prebuiltAgents = [
    {
      id: "blog-post-generator",
      name: "Blog Post Generator",
      description: "Generate high-quality blog posts on any topic with AI.",
      emoji: "📝",
    },
    {
      id: "books-recommender",
      name: "Books Recommender",
      description:
        "Get personalized book recommendations based on your interests.",
      emoji: "📚",
    },
    {
      id: "discussion-team",
      name: "Discussion Team",
      description: "Facilitate and summarize team discussions with AI.",
      emoji: "💬",
    },
    {
      id: "finance-agent",
      name: "Finance Agent",
      description: "Automate financial analysis and reporting tasks.",
      emoji: "💹",
    },
    {
      id: "investment-report-generator",
      name: "Investment Report Generator",
      description: "Create detailed investment reports and summaries.",
      emoji: "📈",
    },
    {
      id: "movie-recommender",
      name: "Movie Recommender",
      description: "Find movies you'll love with AI-powered recommendations.",
      emoji: "🎬",
    },
    {
      id: "research-agent",
      name: "Research Agent",
      description: "Automate research and information gathering tasks.",
      emoji: "🔎",
    },
    {
      id: "start-up-idea-validator",
      name: "Startup Idea Validator",
      description:
        "Validate startup ideas with market and competitor analysis.",
      emoji: "🚀",
    },
    {
      id: "teaching-assistant",
      name: "Teaching Assistant",
      description:
        "Support educators with lesson planning and student feedback.",
      emoji: "🧑‍🏫",
    },
    {
      id: "travel-agent",
      name: "Travel Agent",
      description: "Plan trips and itineraries with AI-powered travel advice.",
      emoji: "🌍",
    },
  ];

  // 2. State for selected agent, form fields, deploy status
  const [selectedAgentIndex, setSelectedAgentIndex] = useState(0);
  const selectedAgent = prebuiltAgents[selectedAgentIndex];
  const [agentCode, setAgentCode] = useState("");
  const [loadingCode, setLoadingCode] = useState(false);
  const [agentName, setAgentName] = useState(selectedAgent.name);
  const [agentDescription, setAgentDescription] = useState(
    selectedAgent.description
  );

  // Agent Configuration Options
  const [agentModel, setAgentModel] = useState("gpt-4");
  const [agentTemperature, setAgentTemperature] = useState(0.7);
  const [cpu, setCpu] = useState(2);
  const [memory, setMemory] = useState(2048);
  const [deploying, setDeploying] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState(false);
  const isLoggedIn = useIsLoggedIn();

  // Configuration templates
  const configTemplates = [
    {
      id: "basic",
      name: "Basic",
      description: "Standard configuration for most use cases",
      icon: <Layers className="w-5 h-5" />,
      config: {
        model: "gpt-4",
        temperature: 0.7,
        cpu: 2,
        memory: 2048,
      },
    },
    {
      id: "performance",
      name: "Performance",
      description: "Higher resources for intensive workloads",
      icon: <BarChart className="w-5 h-5" />,
      config: {
        model: "gpt-4",
        temperature: 0.5,
        cpu: 4,
        memory: 4096,
      },
    },
    {
      id: "developer",
      name: "Developer",
      description: "Optimized for coding and technical tasks",
      icon: <Code className="w-5 h-5" />,
      config: {
        model: "gpt-4-turbo",
        temperature: 0.2,
        cpu: 2,
        memory: 3072,
      },
    },
  ];

  const [selectedConfigTemplate, setSelectedConfigTemplate] = useState("basic");

  // Apply config template
  const applyConfigTemplate = (templateId) => {
    setSelectedConfigTemplate(templateId);
    const template = configTemplates.find((t) => t.id === templateId);
    if (template) {
      setAgentModel(template.config.model);
      setAgentTemperature(template.config.temperature);
      setCpu(template.config.cpu);
      setMemory(template.config.memory);
    }
  };

  // Restore selection from localStorage on mount
  useEffect(() => {
    const savedId =
      typeof window !== "undefined"
        ? localStorage.getItem("selectedAgentId")
        : null;
    if (savedId) {
      const idx = prebuiltAgents.findIndex((a) => a.id === savedId);
      if (idx !== -1) setSelectedAgentIndex(idx);
    }
  }, []);

  // 3. Update form fields when agent changes
  useEffect(() => {
    setAgentName(selectedAgent.name);
    setAgentDescription(selectedAgent.description);
  }, [selectedAgentIndex]);

  useEffect(() => {
    setAgentCode("");
    setLoadingCode(true);
    fetch(`/api/agent-code/${selectedAgent.id}`)
      .then((res) => res.json())
      .then((data) => setAgentCode(data.code || "# Code not found"))
      .catch(() => setAgentCode("# Error loading code"))
      .finally(() => setLoadingCode(false));
  }, [selectedAgentIndex]);

  // 4. Deploy handler (mock API call)
  const handleDeploy = async () => {
    setDeploying(true);
    setDeploySuccess(false);
    // Simulate API call
    setTimeout(() => {
      setDeploying(false);
      setDeploySuccess(true);
    }, 1200);
  };

  // Handle select and scroll
  const handleSelectAgent = () => {
    localStorage.setItem("selectedAgentId", selectedAgent.id);
    setCurrentStep(2);
    if (step2Ref.current) {
      step2Ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle continue to deploy
  const handleContinueToDeploy = () => {
    setCurrentStep(3);
    if (step3Ref.current) {
      step3Ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Get savedAgentId and isSelected
  const savedAgentId =
    typeof window !== "undefined"
      ? localStorage.getItem("selectedAgentId")
      : null;
  const isSelected = savedAgentId === selectedAgent.id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
      <motion.div {...fadeIn} className="space-y-8 md:space-y-24">
        <PathNavigation />

        {/* Hero Section */}
        <div className="text-left md:text-center space-y-4">
          <span className="text-purple-600 text-sm md:text-base font-semibold">
            BUILD & DEPLOY
          </span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
            Create & Deploy AI Agents <br className="hidden md:block" />
            using <span className="text-purple-600">Standard Frameworks</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl md:mx-auto leading-relaxed">
            Build your agent with Agno, LangChain, Google ADK, OpenAI SDK, or
            other tools. Package it with Docker and deploy easily to the
            Formation Network.
          </p>
          {/* <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
            <Link href="/marketplace/create-agent">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700"
              >
                Deploy Your Agent <Rocket className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div> */}
        </div>

        {/* Progress Indicator */}
        <div className="relative max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`flex flex-col items-center relative z-10 transition-all ${
                  currentStep >= step ? "opacity-100" : "opacity-50"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    currentStep === step
                      ? "bg-gradient-to-br from-blue-500 to-green-400 text-white"
                      : currentStep > step
                        ? "bg-gradient-to-br from-blue-100 to-green-100 text-blue-500"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {step === 1 && <RocketIcon className="w-6 h-6" />}
                  {step === 2 && <Settings className="w-6 h-6" />}
                  {step === 3 && <UploadCloud className="w-6 h-6" />}
                </div>
                <span
                  className={`text-sm font-medium mt-2 ${
                    currentStep === step ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  Step {step}
                </span>
              </div>
            ))}
          </div>
          <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 -z-0">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-green-400 transition-all duration-300"
              style={{ width: `${(currentStep - 1) * 50}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Select Pre-Built Agent */}
        <section
          className={`py-4 md:py-6 transition-opacity duration-300 ${currentStep === 1 ? "opacity-100" : "opacity-70"}`}
        >
          <div className="text-center flex flex-col gap-2">
            <div className="mx-auto mb-2 flex items-center justify-center">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/30 to-green-400/30 backdrop-blur-md shadow-xl">
                <RocketIcon className="w-7 h-7 text-blue-500 drop-shadow-glow" />
              </span>
            </div>
            <h2
              className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-1"
              style={{ fontFamily: "Inter, Space Grotesk, sans-serif" }}
            >
              Step 1:{" "}
              <span className="bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent">
                Select a Pre-Built Agent
              </span>
            </h2>
            <p className="text-base text-gray-500 font-medium mt-1 max-w-2xl mx-auto">
              Choose an agent from the list below.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-6 items-start justify-center max-w-5xl mx-auto w-full mt-2">
            {/* Agent Selection Cards - Compact & Flat */}
            <div className="flex flex-col gap-1.5 w-56 flex-shrink-0 flex-grow-0 items-center">
              <div className="flex flex-col gap-1.5 w-full">
                {prebuiltAgents.map((agent, idx) => (
                  <button
                    key={agent.id}
                    className={`group flex flex-row items-center gap-3 px-2 py-2 rounded-lg border min-h-[44px] w-full bg-white/80 hover:bg-blue-50 transition-colors duration-150
                      ${
                        idx === selectedAgentIndex
                          ? "border-blue-500 border-l-4 pl-2 bg-blue-50"
                          : "border-gray-200"
                      }
                    `}
                    onClick={() => setSelectedAgentIndex(idx)}
                  >
                    <span className="text-xl mr-2">{agent.emoji}</span>
                    <span className="flex flex-col text-left">
                      <span className="text-sm font-semibold text-gray-900 leading-tight">
                        {agent.name}
                      </span>
                      <span className="text-xs text-gray-500 leading-snug">
                        {agent.description}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
            {/* Code Example with Framework Tabs - Futuristic Panel */}
            <div className="flex-1 min-w-0 space-y-4">
              <div
                className="text-lg font-semibold text-blue-700 mb-1 flex items-center justify-between"
                style={{ fontFamily: "Inter, Space Grotesk, sans-serif" }}
              >
                <span className="text-xl mr-2">
                  {selectedAgent.emoji} {selectedAgent.name}
                </span>

                <Button
                  variant={isSelected ? "default" : "outline"}
                  className={`text-sm px-4 py-2 ${isSelected ? "bg-green-500 text-white hover:bg-green-600" : ""}`}
                  disabled={isSelected}
                  aria-pressed={isSelected}
                  onClick={handleSelectAgent}
                >
                  {isSelected ? "✓ Selected" : "Select"}
                </Button>
              </div>
              <div className="text-gray-500 mb-2 text-sm font-medium">
                {selectedAgent.description}
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-blue-900/90 to-green-900/90 border-2 border-blue-400/60 shadow-2xl p-3 overflow-hidden relative">
                <Tabs defaultValue="agno" className="w-full">
                  <TabsList className="mb-0 flex gap-2 bg-gradient-to-r from-blue-100/60 to-green-100/60 p-1.5 rounded-t-2xl shadow-inner backdrop-blur-md">
                    <TabsTrigger
                      value="agno"
                      className="flex items-center gap-2 px-4 py-1.5 text-blue-700 data-[state=active]:bg-blue-200/60 data-[state=active]:text-blue-900 rounded-full font-semibold transition-all duration-200 shadow-sm text-sm"
                    >
                      <Image
                        src="/agno.png"
                        alt="Agno"
                        width={20}
                        height={20}
                        className="rounded"
                      />
                      <span>Agno</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="langchain"
                      className="flex items-center gap-2 px-4 py-1.5 text-blue-700 data-[state=active]:bg-blue-200/60 data-[state=active]:text-blue-900 rounded-full font-semibold transition-all duration-200 shadow-sm text-sm"
                    >
                      <Image
                        src="/langchain.png"
                        alt="LangChain"
                        width={20}
                        height={20}
                        className="rounded"
                      />
                      <span>LangChain</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="adk"
                      className="flex items-center gap-2 px-4 py-1.5 text-blue-700 data-[state=active]:bg-blue-200/60 data-[state=active]:text-blue-900 rounded-full font-semibold transition-all duration-200 shadow-sm text-sm"
                    >
                      <Image
                        src="/adk.png"
                        alt="Google ADK"
                        width={20}
                        height={20}
                        className="rounded"
                      />
                      <span>Google ADK</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="openai"
                      className="flex items-center gap-2 px-4 py-1.5 text-blue-700 data-[state=active]:bg-blue-200/60 data-[state=active]:text-blue-900 rounded-full font-semibold transition-all duration-200 shadow-sm text-sm"
                    >
                      <Image
                        src="/openai.png"
                        alt="OpenAI SDK"
                        width={20}
                        height={20}
                        className="rounded"
                      />
                      <span>OpenAI SDK</span>
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="agno">
                    <CodeBlock
                      language="python"
                      code={loadingCode ? "# Loading code..." : agentCode}
                      className="h-[620px] overflow-y-auto overflow-x-hidden w-full max-w-5xl bg-transparent text-green-100 font-mono text-sm rounded-b-2xl p-3"
                    />
                  </TabsContent>
                  <TabsContent value="langchain">
                    <div className="h-[320px] flex items-center justify-center bg-transparent rounded-b-2xl text-green-100 text-center text-sm font-mono">
                      LangChain example coming soon.
                    </div>
                  </TabsContent>
                  <TabsContent value="adk">
                    <div className="h-[320px] flex items-center justify-center bg-transparent rounded-b-2xl text-green-100 text-center text-sm font-mono">
                      Google ADK example coming soon.
                    </div>
                  </TabsContent>
                  <TabsContent value="openai">
                    <div className="h-[320px] flex items-center justify-center bg-transparent rounded-b-2xl text-green-100 text-center text-sm font-mono">
                      OpenAI SDK example coming soon.
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </section>

        {/* Step 2: Configure Your Agent - Redesigned to match Step 1's style */}
        <section
          ref={step2Ref}
          className={`py-4 md:py-6 transition-opacity duration-300 ${currentStep === 2 ? "opacity-100" : "opacity-70"}`}
        >
          <div className="text-center flex flex-col gap-2">
            <div className="mx-auto mb-2 flex items-center justify-center">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/30 to-green-400/30 backdrop-blur-md shadow-xl">
                <Settings className="w-7 h-7 text-blue-500 drop-shadow-glow" />
              </span>
            </div>
            <h2
              className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-1"
              style={{ fontFamily: "Inter, Space Grotesk, sans-serif" }}
            >
              Step 2:{" "}
              <span className="bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent">
                Configure Your Agent
              </span>
            </h2>
            <p className="text-base text-gray-500 font-medium mt-1 max-w-2xl mx-auto">
              Customize your agent's settings and resources.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start justify-center max-w-5xl mx-auto w-full mt-2">
            {/* Configuration Templates - Left Panel */}
            <div className="flex flex-col gap-1.5 w-56 flex-shrink-0 flex-grow-0 items-center">
              <p className="text-sm font-semibold text-gray-700 w-full mb-2">
                Configuration Templates
              </p>
              <div className="flex flex-col gap-1.5 w-full">
                {configTemplates.map((template) => (
                  <button
                    key={template.id}
                    className={`group flex flex-row items-center gap-3 px-3 py-2.5 rounded-lg border w-full bg-white/80 hover:bg-blue-50 transition-colors duration-150
                      ${
                        selectedConfigTemplate === template.id
                          ? "border-blue-500 border-l-4 pl-2 bg-blue-50"
                          : "border-gray-200"
                      }
                    `}
                    onClick={() => applyConfigTemplate(template.id)}
                  >
                    <span className="text-blue-500 flex-shrink-0">
                      {template.icon}
                    </span>
                    <span className="flex flex-col text-left">
                      <span className="text-sm font-semibold text-gray-900 leading-tight">
                        {template.name}
                      </span>
                      <span className="text-xs text-gray-500 leading-snug">
                        {template.description}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Configuration Panel - Right Side */}
            <div className="flex-1 min-w-0 space-y-4">
              <div
                className="text-lg font-semibold text-blue-700 mb-1 flex items-center justify-between"
                style={{ fontFamily: "Inter, Space Grotesk, sans-serif" }}
              >
                Agent Configuration
                <Button
                  variant="outline"
                  className="text-sm px-4 py-2 bg-blue-500 text-white hover:bg-blue-600"
                  onClick={handleContinueToDeploy}
                >
                  Continue
                </Button>
              </div>
              <div className="text-gray-500 mb-2 text-sm font-medium">
                Customize your agent's settings for optimal performance.
              </div>

              <div className="rounded-2xl bg-white border-2 border-blue-100 shadow-xl p-6 overflow-hidden relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Avatar Upload */}
                    <AvatarUpload avatar={avatar} setAvatar={setAvatar} />

                    {/* Basic Info */}
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-gray-700">
                          Agent Name*
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                          value={agentName}
                          onChange={(e) => setAgentName(e.target.value)}
                          placeholder="Enter your agent's name"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-gray-700">
                          Agent Description*
                        </label>
                        <textarea
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all min-h-[80px]"
                          value={agentDescription}
                          onChange={(e) => setAgentDescription(e.target.value)}
                          placeholder="Describe what your agent does"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Model Settings */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-700">
                        Model Settings
                      </h3>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-600">
                          Language Model
                        </label>
                        <select
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                          value={agentModel}
                          onChange={(e) => setAgentModel(e.target.value)}
                        >
                          <option value="gpt-4">GPT-4</option>
                          <option value="gpt-4-turbo">GPT-4 Turbo</option>
                          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                          <option value="claude-2">Claude 2</option>
                          <option value="claude-instant">Claude Instant</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-600 flex justify-between">
                          <span>Temperature</span>
                          <span className="text-blue-600">
                            {agentTemperature.toFixed(1)}
                          </span>
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          className="w-full"
                          value={agentTemperature}
                          onChange={(e) =>
                            setAgentTemperature(parseFloat(e.target.value))
                          }
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Precise</span>
                          <span>Creative</span>
                        </div>
                      </div>
                    </div>

                    {/* Resource Allocation */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-700">
                        Resource Allocation
                      </h3>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-600 flex justify-between">
                          <span>CPU Cores</span>
                          <span className="text-blue-600">{cpu}</span>
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="8"
                          step="1"
                          className="w-full"
                          value={cpu}
                          onChange={(e) => setCpu(parseInt(e.target.value))}
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-600 flex justify-between">
                          <span>Memory (MB)</span>
                          <span className="text-blue-600">{memory}</span>
                        </label>
                        <input
                          type="range"
                          min="1024"
                          max="8192"
                          step="1024"
                          className="w-full"
                          value={memory}
                          onChange={(e) => setMemory(parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Step 3: Deploy */}
        <section
          ref={step3Ref}
          className={`space-y-8 md:space-y-12 py-4 md:py-6 w-full flex flex-col items-center transition-opacity duration-300 ${currentStep === 3 ? "opacity-100" : "opacity-70"}`}
        >
          <div className="text-center">
            <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-500/20 to-green-400/20 backdrop-blur-md shadow-lg mx-auto mb-3">
              <UploadCloud className="w-7 h-7 text-blue-500" />
            </span>
            <h2
              className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-1"
              style={{ fontFamily: "Inter, Space Grotesk, sans-serif" }}
            >
              Step 3:{" "}
              <span className="bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent">
                Launch Your Agent
              </span>
            </h2>
            <p className="text-base md:text-lg text-gray-500 mt-1 max-w-xl mx-auto">
              Deploy your agent to the Formation Network and start using it
              right away.
            </p>
          </div>

          <div className="max-w-2xl w-full mx-auto">
            {!isLoggedIn ? (
              <div className="bg-gradient-to-br from-blue-50 to-green-50 border border-blue-100 rounded-xl p-6 md:p-8 shadow-md overflow-hidden relative">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 text-blue-700">
                      One Step Away From Launch
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Your agent is ready to take flight! Sign in to deploy
                      directly to the Formation Network and access:
                    </p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center gap-2 text-gray-700">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                        </span>
                        <span>Managed infrastructure & scaling</span>
                      </li>
                      <li className="flex items-center gap-2 text-gray-700">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                        </span>
                        <span>Usage analytics & performance metrics</span>
                      </li>
                      <li className="flex items-center gap-2 text-gray-700">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                        </span>
                        <span>API key management & version control</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="relative group cursor-pointer mb-4">
                      <AuthButton
                        buttonStyle="px-8 py-3 text-base font-medium rounded-full shadow-md"
                        textStyle="text-gray-800"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      No account? Sign up in seconds
                    </p>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute w-64 h-64 rounded-full bg-gradient-to-br from-blue-400/10 to-green-400/10 -bottom-32 -right-32 blur-2xl"></div>
                <div className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-blue-400/10 to-green-400/10 -top-16 -left-16 blur-xl"></div>
              </div>
            ) : (
              <div className="bg-white/90 border border-blue-100 rounded-xl p-6 md:p-8 shadow-md">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2 text-blue-700">
                    Ready for Launch
                  </h3>
                  <p className="text-gray-600">
                    Your agent is configured and ready to be deployed to the
                    Formation Network.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Deployment Summary
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Agent Name</p>
                      <p className="font-medium text-gray-800">{agentName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Resources</p>
                      <p className="font-medium text-gray-800">
                        {cpu} CPU, {memory}MB RAM
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Model</p>
                      <p className="font-medium text-gray-800">{agentModel}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Temperature</p>
                      <p className="font-medium text-gray-800">
                        {agentTemperature.toFixed(1)}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500">Description</p>
                      <p className="font-medium text-gray-800">
                        {agentDescription}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleDeploy}
                  disabled={deploying || deploySuccess}
                  className={`w-full py-3 rounded-lg font-medium text-white flex items-center justify-center gap-2 transition-all duration-300 ${
                    deploySuccess
                      ? "bg-green-500"
                      : deploying
                        ? "bg-blue-400 cursor-wait"
                        : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md hover:shadow-lg"
                  }`}
                >
                  {deploySuccess ? (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <span>Deployed Successfully!</span>
                    </>
                  ) : deploying ? (
                    <>
                      <svg
                        className="w-5 h-5 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Deploying Agent...</span>
                    </>
                  ) : (
                    <>
                      <Rocket className="w-5 h-5" />
                      <span>Deploy to Formation Network</span>
                    </>
                  )}
                </button>

                {deploySuccess && (
                  <div className="mt-6 bg-green-50 border border-green-100 rounded-lg p-4 flex items-start gap-3">
                    <div className="mt-0.5">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h5 className="font-medium text-green-800 mb-1">
                        Deployment Successful
                      </h5>
                      <p className="text-green-700 text-sm mb-3">
                        Your agent is now live on the Formation Network. You can
                        start using it right away or make additional
                        configurations.
                      </p>
                      <div className="flex gap-2">
                        <button className="text-sm px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded hover:bg-gray-50 transition-colors">
                          View Dashboard
                        </button>
                        <button className="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                          Test Agent
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Monetization Banner - Modern, Compact, Flat */}
        <MonetizationBanner />
      </motion.div>
    </div>
  );
}
