"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  GitBranch,
  BarChart,
  Settings,
  Database,
  Box,
  Camera,
  Upload,
  Layers,
  Code,
  UploadCloud,
  Rocket,
} from "lucide-react";
import Link from "next/link";
import { useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import { AuthButton } from "@/components/AuthButton";
import MonetizationBanner from "@/components/MonetizationBanner";
import { useAuth } from "@/components/auth-provider";
import AgentSelection from "@/components/getting-started/AgentSelection";

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
    <div className="flex flex-col items-center mb-4 md:mb-6">
      <div className="relative">
        <div
          className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center overflow-hidden border-2 border-blue-200 ${
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
            <Camera className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
          )}
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1 md:p-1.5 shadow-md transition-all"
        >
          <Upload className="w-3 h-3 md:w-4 md:h-4" />
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
  const configPanelRef = useRef(null);
  const [existingDeployment, setExistingDeployment] = useState(null);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const prebuiltAgents = [
    {
      id: "1af9cf0e-de4f-4bed-9659-ca314de68790",
      name: "Finance Agent",
      description: "Automate financial analysis and reporting tasks.",
      emoji: "💹",
    },
    {
      id: "2ff31a7d-3fa2-41e0-865b-80dbf734b059",
      name: "Teaching Assistant",
      description:
        "Support educators with lesson planning and student feedback.",
      emoji: "🧑‍🏫",
    },
    {
      id: "35128668-6491-4ac2-a6c3-9571be815b3b",
      name: "News Agency Team",
      description: "A professional news team powered by AI.",
      emoji: "📰",
    },
    {
      id: "398b3a6d-5eab-49c1-953b-be093a52146a",
      name: "Travel Agent",
      description: "Plan trips and itineraries with AI-powered travel advice.",
      emoji: "🌍",
    },
    {
      id: "4b042214-dd04-4d4d-981f-53237b4c7915",
      name: "Investment Report Generator",
      description: "Create detailed investment reports and summaries.",
      emoji: "📈",
    },
    {
      id: "5fdd1cf1-ae5b-4f84-99a3-721fedb293e8",
      name: "Recipe Creator",
      description: "A creative AI for generating recipes.",
      emoji: "👩‍🍳",
    },
    {
      id: "79d43c33-9d60-4d2a-afab-e6c0114cdfb7",
      name: "Discussion Team",
      description: "Facilitate and summarize team discussions with AI.",
      emoji: "💬",
    },
    {
      id: "8b8d2f23-872e-4fc7-8311-d426ad10848a",
      name: "Startup Idea Validator",
      description:
        "Validate startup ideas with market and competitor analysis.",
      emoji: "🚀",
    },
    {
      id: "917036af-d23b-4f85-8c4a-157a08537125",
      name: "GitHub Repo Analyzer",
      description: "An AI agent for analyzing GitHub repositories.",
      emoji: "🐙",
    },
    {
      id: "9d43c611-612d-4a8d-945e-2a9420f59d9f",
      name: "YouTube Agent",
      description: "An expert agent for YouTube content analysis.",
      emoji: "📺",
    },
    {
      id: "ccffd95f-d27f-48d7-9b9b-449c43926159",
      name: "Books Recommender",
      description:
        "Get personalized book recommendations based on your interests.",
      emoji: "📚",
    },
    {
      id: "eb89a0a3-6c6a-4392-8965-1de5edf51561",
      name: "Research Agent",
      description: "Automate research and information gathering tasks.",
      emoji: "🔎",
    },
    {
      id: "ee8b6b8a-6943-40ad-9a0f-dbd116411eb2",
      name: "Movie Recommender",
      description: "Find movies you'll love with AI-powered recommendations.",
      emoji: "🎬",
    },
  ];

  // 2. State for selected agent, form fields, deploy status
  const [selectedAgentIndex, setSelectedAgentIndex] = useState(0);
  const selectedAgent = prebuiltAgents[selectedAgentIndex];
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
  const [deployError, setDeployError] = useState("");
  const [deployRunning, setDeployRunning] = useState(false);
  const isLoggedIn = useIsLoggedIn();
  const { account } = useAuth();

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
    // Smooth scroll to config panel after user selects a template
    setTimeout(() => {
      configPanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      configPanelRef.current?.focus?.();
    }, 100);
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

  // Fetch deployments after authentication
  useEffect(() => {
    const fetchDeployments = async () => {
      if (!isLoggedIn || !account || !account.id) return;
      try {
        const response = await fetch(
          `/api/deployments?account_id=${account.id}`
        );
        if (response.ok) {
          const { deployments } = await response.json();
          if (deployments && deployments.length > 0) {
            const deployment = deployments[0]; // Only allow 1 for starter tier
            setExistingDeployment(deployment);
            // Pre-fill form fields from deployment config
            if (deployment.config) {
              setAgentName(deployment.config.name || "");
              setAgentDescription(deployment.config.description || "");
              setAgentModel(deployment.config.model || "gpt-4");
              setAgentTemperature(deployment.config.temperature ?? 0.7);
              setCpu(deployment.config.cpu ?? 2);
              setMemory(deployment.config.memory ?? 2048);
              setAvatar(deployment.config.avatar || null);
            }
            setDeploySuccess(true);
            setCurrentStep(3);
          }
        }
      } catch (err) {
        // Ignore errors, user just has no deployments
      }
    };
    fetchDeployments();
    // Only run when logged in and account is available
  }, [isLoggedIn, account]);

  // Scroll to step 3 if a deployment exists
  useEffect(() => {
    if (existingDeployment && step3Ref.current) {
      step3Ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [existingDeployment]);

  // 4. Deploy handler (mock API call)
  const handleDeploy = async () => {
    setDeploying(true);
    setDeploySuccess(false);
    setDeployError(""); // Clear previous error
    try {
      // TODO: Replace with real account_id and agent_id from user context/auth
      const accountId = account.id;
      const agentId = selectedAgent.id;

      // Compose config object from state
      const config = {
        name: agentName,
        description: agentDescription,
        model: agentModel,
        temperature: agentTemperature,
        cpu,
        memory,
        avatar,
        // Add more config fields as needed
      };

      const response = await fetch("/api/deployments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agent_id: agentId,
          account_id: accountId,
          config,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        setDeployError(error.error || "Failed to create deployment");
        throw new Error(error.error || "Failed to create deployment");
      }

      setDeployRunning(true);

      // setDeploySuccess(true);
    } catch (error) {
      setDeployError(error.message || "Deployment failed");
      // Optionally show error to user
      // alert(error.message || "Deployment failed");
    } finally {
      setDeploying(false);
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

  // Add this helper for upgrade (replace with your actual upgrade URL or logic)
  const handleUpgrade = () => {
    window.location.href = "/marketplace/upgrade"; // Or open a modal, etc.
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8 lg:py-12">
      <motion.div
        {...fadeIn}
        className="space-y-8 md:space-y-16 lg:space-y-24 w-full"
      >
        {/* <PathNavigation /> */}

        {/* Hero Section */}
        <div className="text-left md:text-center space-y-3 md:space-y-4">
          <span className="text-purple-600 text-sm md:text-base font-semibold">
            BUILD & DEPLOY
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
            Create & Deploy AI Agents{" "}
            <span className="hidden md:inline">
              <br />
            </span>
            using <span className="text-purple-600">Standard Frameworks</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl md:mx-auto leading-relaxed">
            Build your agent with Agno, LangChain, Google ADK, OpenAI SDK, or
            other tools. Package it with Docker and deploy easily to the
            Formation Network.
          </p>
        </div>

        {/* Step 1: Select Pre-Built Agent */}
        <AgentSelection
          existingDeployment={existingDeployment}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          prebuiltAgents={prebuiltAgents}
          selectedAgentIndex={selectedAgentIndex}
          selectedAgent={selectedAgent}
          setSelectedAgentIndex={setSelectedAgentIndex}
        />

        {/* Step 2: Configure Your Agent - Redesigned to match Step 1's style */}
        <section
          ref={step2Ref}
          className={`py-4 md:py-6 transition-opacity duration-300 ${currentStep === 2 ? "opacity-100" : "opacity-70"}`}
        >
          <div className="text-center flex flex-col gap-2 px-3 sm:px-4">
            <div className="mx-auto mb-2 flex items-center justify-center">
              <span className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-500/30 to-green-400/30 backdrop-blur-md shadow-xl">
                <Settings className="w-6 h-6 md:w-7 md:h-7 text-blue-500 drop-shadow-glow" />
              </span>
            </div>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-1"
              style={{ fontFamily: "Inter, Space Grotesk, sans-serif" }}
            >
              Step 2:{" "}
              <span className="bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent">
                Configure Your Agent
              </span>
            </h2>
            <p className="text-sm md:text-base text-gray-500 font-medium mt-1 max-w-2xl mx-auto">
              Customize your agent's settings and resources.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start justify-center max-w-5xl mx-auto w-full mt-2 px-3 sm:px-4">
            {/* Configuration Templates - Left Panel */}
            <div className="w-full md:w-56 flex-shrink-0 flex-grow-0">
              <p className="text-sm font-semibold text-gray-700 w-full mb-2">
                Configuration Templates
              </p>
              <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {configTemplates.map((template) => (
                  <button
                    key={template.id}
                    className={`group flex flex-row items-center gap-2 px-3 py-2 rounded-lg border min-w-[180px] md:min-w-0 md:w-full bg-white/80 hover:bg-blue-50 transition-colors duration-150
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
                    <span className="flex flex-col text-left overflow-hidden">
                      <span className="text-sm font-semibold text-gray-900 leading-tight truncate">
                        {template.name}
                      </span>
                      <span className="text-xs text-gray-500 leading-snug truncate">
                        {template.description}
                      </span>
                    </span>
                  </button>
                ))}
              </div>

              {/* Continue button on mobile */}
              <div className="hidden mt-3">
                <Button
                  variant="outline"
                  className="w-full text-sm px-4 py-2 bg-blue-500 text-white hover:bg-blue-600"
                  onClick={handleContinueToDeploy}
                >
                  Continue
                </Button>
              </div>
            </div>

            {/* Configuration Panel - Right Side */}
            <div
              ref={configPanelRef}
              tabIndex={-1}
              aria-label="Agent Configuration Panel"
              className="flex-1 min-w-0 space-y-3 md:space-y-4 m-auto"
            >
              <div
                className="text-base md:text-lg font-semibold text-blue-700 mb-1 flex items-center justify-between"
                style={{ fontFamily: "Inter, Space Grotesk, sans-serif" }}
              >
                <span className="truncate">Agent Configuration</span>
                <Button
                  variant="outline"
                  className="hidden md:inline-block text-sm px-4 py-2 bg-blue-500 text-white hover:bg-blue-600"
                  onClick={handleContinueToDeploy}
                >
                  Continue
                </Button>
              </div>
              <div className="text-gray-500 mb-2 text-xs sm:text-sm font-medium">
                Customize your agent's settings for optimal performance.
              </div>

              <div className="rounded-2xl bg-white border-2 border-blue-100 shadow-xl p-3 sm:p-4 md:p-6 overflow-hidden relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* Left Column */}
                  <div className="space-y-4 md:space-y-6">
                    {/* Avatar Upload */}
                    <AvatarUpload avatar={avatar} setAvatar={setAvatar} />

                    {/* Basic Info */}
                    <div className="space-y-3 md:space-y-4">
                      <div className="flex flex-col gap-1 md:gap-1.5">
                        <label className="text-sm font-semibold text-gray-700">
                          Agent Name*
                        </label>
                        <input
                          type="text"
                          className="w-full px-2 py-1.5 md:px-3 md:py-2 text-sm border border-gray-200 rounded-lg bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                          value={agentName}
                          onChange={(e) => setAgentName(e.target.value)}
                          placeholder="Enter your agent's name"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-1 md:gap-1.5">
                        <label className="text-sm font-semibold text-gray-700">
                          Agent Description*
                        </label>
                        <textarea
                          className="w-full px-2 py-1.5 md:px-3 md:py-2 text-sm border border-gray-200 rounded-lg bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all min-h-[60px] md:min-h-[80px]"
                          value={agentDescription}
                          onChange={(e) => setAgentDescription(e.target.value)}
                          placeholder="Describe what your agent does"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4 md:space-y-6">
                    {/* Model Settings */}
                    <div className="space-y-3 md:space-y-4">
                      <h3 className="text-sm font-semibold text-gray-700">
                        Model Settings
                      </h3>

                      <div className="flex flex-col gap-1 md:gap-1.5">
                        <label className="text-sm font-medium text-gray-600">
                          Language Model
                        </label>
                        <select
                          className="w-full px-2 py-1.5 md:px-3 md:py-2 text-sm border border-gray-200 rounded-lg bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
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

                      <div className="flex flex-col gap-1 md:gap-1.5">
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
                    <div className="space-y-3 md:space-y-4">
                      <h3 className="text-sm font-semibold text-gray-700">
                        Resource Allocation
                      </h3>

                      <div className="flex flex-col gap-1 md:gap-1.5">
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

                      <div className="flex flex-col gap-1 md:gap-1.5">
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
            <div className="block md:hidden mt-3 w-full">
              <Button
                variant="outline"
                className="w-full text-sm px-4 py-2 bg-blue-500 text-white hover:bg-blue-600"
                onClick={handleContinueToDeploy}
              >
                Continue
              </Button>
            </div>
          </div>
        </section>

        {/* Step 3: Deploy */}
        <section
          ref={step3Ref}
          className={`space-y-4 md:space-y-8 lg:space-y-12 py-4 md:py-6 w-full flex flex-col items-center transition-opacity duration-300 ${currentStep === 3 ? "opacity-100" : "opacity-70"}`}
        >
          <div className="text-center px-3 sm:px-4">
            <span className="inline-flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-blue-500/20 to-green-400/20 backdrop-blur-md shadow-lg mx-auto mb-2 md:mb-3">
              <UploadCloud className="w-5 h-5 md:w-7 md:h-7 text-blue-500" />
            </span>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-1"
              style={{ fontFamily: "Inter, Space Grotesk, sans-serif" }}
            >
              Step 3:{" "}
              <span className="bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent">
                Launch Your Agent
              </span>
            </h2>
            <p className="text-sm md:text-base text-gray-500 font-medium mt-1 max-w-2xl mx-auto">
              Deploy your agent to the Formation Network and start using it
              right away.
            </p>
          </div>

          <div className="max-w-2xl w-full mx-auto px-3 sm:px-4">
            {!isLoggedIn ? (
              <div className="bg-gradient-to-br from-blue-50 to-green-50 border border-blue-100 rounded-xl p-4 sm:p-6 md:p-8 shadow-md overflow-hidden relative">
                <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold mb-2 text-blue-700">
                      One Step Away From Launch
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
                      Your agent is ready to take flight! Sign in to deploy
                      directly to the Formation Network and access:
                    </p>
                    <ul className="space-y-2 mb-4 md:mb-6 text-sm md:text-base">
                      <li className="flex items-center gap-2 text-gray-700">
                        <span className="inline-flex items-center justify-center w-4 h-4 md:w-5 md:h-5 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
                          <svg
                            className="w-2 h-2 md:w-3 md:h-3"
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
                        <span className="inline-flex items-center justify-center w-4 h-4 md:w-5 md:h-5 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
                          <svg
                            className="w-2 h-2 md:w-3 md:h-3"
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
                        <span className="inline-flex items-center justify-center w-4 h-4 md:w-5 md:h-5 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
                          <svg
                            className="w-2 h-2 md:w-3 md:h-3"
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
                    <div className="relative group cursor-pointer mb-2 md:mb-4">
                      <AuthButton
                        buttonStyle="px-4 sm:px-6 md:px-8 py-2 md:py-3 text-sm md:text-base font-medium rounded-full shadow-md"
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
              <div className="bg-white/90 border border-blue-100 rounded-xl p-4 sm:p-6 md:p-8 shadow-md">
                <div className="text-center mb-4 md:mb-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-1 md:mb-2 text-blue-700">
                    Ready for Launch
                  </h3>
                  <p className="text-sm md:text-base text-gray-600">
                    Your agent is configured and ready to be deployed to the
                    Formation Network.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
                  <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2 text-sm md:text-base">
                    <Database className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    Deployment Summary
                  </h4>
                  <div className="grid grid-cols-2 gap-2 md:gap-3 text-xs md:text-sm">
                    <div>
                      <p className="text-gray-500">Agent Name</p>
                      <p className="font-medium text-gray-800 truncate">
                        {agentName}
                      </p>
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
                      <p className="font-medium text-gray-800 line-clamp-2">
                        {agentDescription}
                      </p>
                    </div>
                  </div>
                </div>

                {existingDeployment && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 md:p-4 mb-4 md:mb-6 shadow-sm">
                    <div className="flex items-start gap-3 md:gap-4">
                      <svg
                        className="w-6 h-6 md:w-8 md:h-8 text-yellow-400 flex-shrink-0 mt-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
                        />
                      </svg>
                      <div className="flex-1">
                        <div className="font-semibold text-yellow-800 mb-1 text-sm md:text-base">
                          Starter Tier Limit
                        </div>
                        <div className="text-yellow-700 text-xs md:text-sm mb-2">
                          You can only deploy <b>one agent</b> on the Starter
                          plan.
                          <br className="hidden md:block" />
                          To deploy more agents, upgrade to a higher tier.
                        </div>
                        <Button
                          variant="outline"
                          onClick={handleUpgrade}
                          className="text-xs md:text-sm py-1 px-3 md:py-2 md:px-4 mt-1"
                        >
                          Upgrade Now
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error message for deployment failure */}
                {deployError && (
                  <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 md:p-4 flex items-start gap-3">
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5 text-red-600 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M18.364 5.636l-1.414-1.414A9 9 0 105.636 18.364l1.414 1.414A9 9 0 1018.364 5.636z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4m0 4h.01"
                      />
                    </svg>
                    <div>
                      <h5 className="font-medium text-red-800 mb-1 text-sm md:text-base">
                        Deployment Failed
                      </h5>
                      <p className="text-red-700 text-xs md:text-sm">
                        {deployError}
                      </p>
                    </div>
                  </div>
                )}

                {deployRunning && (
                  <div className="mt-4 md:mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 md:p-6 flex flex-col gap-3 md:gap-4 shadow-md animate-pulse">
                    <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                      <svg
                        className="w-5 h-5 md:w-6 md:h-6 text-yellow-400 animate-spin"
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
                      <span className="text-yellow-800 font-semibold text-base md:text-lg">
                        Deploying Your Agent...
                      </span>
                    </div>
                    <div className="flex flex-col gap-2 md:gap-3">
                      {/* Deployment Steps */}
                      {[
                        { label: "Building Docker image", key: "docker" },
                        { label: "Provisioning resources", key: "provision" },
                        { label: "Configuring environment", key: "config" },
                        { label: "Deploying to network", key: "deploy" },
                        { label: "Finalizing deployment", key: "finalize" },
                      ].map((step, idx) => (
                        <div
                          key={step.key}
                          className="flex items-center gap-2 md:gap-3"
                        >
                          <span
                            className={`inline-flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-yellow-300 bg-yellow-100 ${idx === 0 ? "animate-bounce" : ""}`}
                          >
                            {idx === 0 ? (
                              <svg
                                className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 animate-spin"
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
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="w-3 h-3 md:w-4 md:h-4 text-yellow-400"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  className="opacity-30"
                                />
                              </svg>
                            )}
                          </span>
                          <span className="text-yellow-900 font-medium text-xs md:text-sm">
                            {step.label}
                          </span>
                          {/* Optionally, add a progress bar or animated dots */}
                          {idx === 0 && (
                            <span className="ml-1 md:ml-2 flex gap-1">
                              <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                              <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-yellow-300 rounded-full animate-pulse delay-150"></span>
                              <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-yellow-200 rounded-full animate-pulse delay-300"></span>
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 md:mt-4 w-full h-1.5 md:h-2 bg-yellow-100 rounded-full overflow-hidden">
                      <div className="h-1.5 md:h-2 bg-yellow-400 animate-pulse rounded-full w-1/3 transition-all duration-700"></div>
                    </div>
                    <div className="text-yellow-700 text-xs md:text-sm mt-1 md:mt-2 text-center">
                      This may take up to a minute. Please do not close this
                      window.
                    </div>
                  </div>
                )}

                <button
                  onClick={handleDeploy}
                  disabled={!!existingDeployment || deploying || deploySuccess}
                  className={`w-full py-2 md:py-3 rounded-lg text-sm md:text-base font-medium text-white flex items-center justify-center gap-2 transition-all duration-300 ${
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
                        className="w-4 h-4 md:w-5 md:h-5"
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
                        className="w-4 h-4 md:w-5 md:h-5 animate-spin"
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
                      <Rocket className="w-4 h-4 md:w-5 md:h-5" />
                      <span>Deploy to Formation Network</span>
                    </>
                  )}
                </button>

                {/* Only show success UI if not processing */}
                {deploySuccess && !deployRunning && (
                  <div className="mt-4 md:mt-6 bg-green-50 border border-green-100 rounded-lg p-3 md:p-4 flex items-start gap-3">
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5 text-green-600 mt-0.5"
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
                    <div>
                      <h5 className="font-medium text-green-800 mb-1 text-sm md:text-base">
                        Deployment Successful
                      </h5>
                      <p className="text-green-700 text-xs md:text-sm mb-2 md:mb-3">
                        Your agent is now live on the Formation Network. You can
                        start using it right away or make additional
                        configurations.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Link
                          href="/marketplace/command-center"
                          className="w-full"
                        >
                          <Button className="text-xs md:text-sm px-2 md:px-3 w-full py-1 bg-white border border-gray-200 text-gray-700 rounded hover:bg-gray-50 transition-colors">
                            View Command Center
                          </Button>
                        </Link>
                        <Button className="text-xs md:text-sm w-full px-2 md:px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                          Chat With {agentName}
                        </Button>
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
