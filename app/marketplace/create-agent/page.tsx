"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AgentSubmission, DeploymentSource } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  BeakerIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  CodeBracketIcon,
  CloudIcon,
  ServerIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { createClient } from "@supabase/supabase-js";
import { AuthButton } from "@/components/AuthButton";
import { useIsLoggedIn, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { GitHubIntegration } from "@/components/GithubIntegration";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const steps = [
  {
    title: "Submit Repository",
    description: "Share your GitHub repository with us",
    icon: CodeBracketIcon,
  },
  {
    title: "Manual Review",
    description: "Our team reviews your agent",
    icon: BeakerIcon,
  },
  {
    title: "Integration",
    description: "We add your agent to the network",
    icon: ArrowPathIcon,
  },
  {
    title: "Go Live",
    description: "Your agent is ready to use",
    icon: CheckCircleIcon,
  },
];

export default function CreateAgentPage() {
  const router = useRouter();
  const { primaryWallet, user } = useDynamicContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<AgentSubmission>({
    name: "",
    description: "",
    deploymentSource: "github",
  });
  const isLoggedIn = useIsLoggedIn();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      if (!formData.name || !formData.description) {
        throw new Error("Name and description are required");
      }

      // Submit to Supabase
      const { error } = await supabase.from("agent_submissions").insert([
        {
          name: formData.name,
          description: formData.description,
          deploymentsource: formData.deploymentSource,
          dockerregistryurl: formData.dockerRegistryUrl || null,
          dockercomposecontent: formData.dockerComposeContent || null,
          created_at: new Date().toISOString(),
          primary_wallet: primaryWallet?.address || null,
          user_data: user || null,
        },
      ]);

      if (error) throw error;

      toast.success("Agent submitted successfully!");
      router.push("/marketplace/command-center");
    } catch (err) {
      console.error("Error submitting agent:", err);
      toast.error(err.message || "Failed to submit agent. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderDeploymentSourceInput = () => {
    switch (formData.deploymentSource) {
      case "github":
        return (
          <div>
            <GitHubIntegration />
            <p className="mt-2 text-sm text-gray-500">
              Your agent's code is now accessible to our team via your GitHub
              integration.
            </p>
          </div>
        );
      case "docker-registry":
        return (
          <div>
            <label
              htmlFor="dockerRegistryUrl"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Docker Registry URL*
            </label>
            <Input
              id="dockerRegistryUrl"
              type="url"
              placeholder="https://registry.hub.docker.com/r/username/image"
              value={formData.dockerRegistryUrl}
              onChange={(e) =>
                setFormData({ ...formData, dockerRegistryUrl: e.target.value })
              }
              required
              className="w-full"
            />
            <p className="mt-2 text-sm text-gray-500">
              Provide the URL to your Docker image in a registry (e.g., Docker
              Hub, GitHub Container Registry).
            </p>
          </div>
        );
      case "docker-compose":
        return (
          <div>
            <label
              htmlFor="dockerComposeContent"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Docker Compose Configuration*
            </label>
            <Textarea
              id="dockerComposeContent"
              placeholder="version: '3.8'
services:
  app:
    image: your-image:tag
    ..."
              value={formData.dockerComposeContent}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dockerComposeContent: e.target.value,
                })
              }
              required
              className="w-full h-64 font-mono"
            />
            <p className="mt-2 text-sm text-gray-500">
              Paste your docker-compose.yml configuration here. We'll use this
              to deploy your agent.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-83px)] bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center py-12 bg-white text-gray-900">
          <h1 className="text-4xl font-bold mb-4">
            Create & Deploy Your Agent
          </h1>
          <p className="text-lg">
            Join the future of AI with our seamless deployment platform.
          </p>
        </div>

        {/* Feature Highlights Section */}
        <div className="grid grid-cols-1 mb-12 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-gray-50 p-4 rounded-lg text-sm shadow-sm hover:shadow-md transition-shadow">
            <CodeBracketIcon className="w-10 h-8 text-indigo-600 mb-4" />
            <h3 className="text-md font-semibold mb-2">Easy Integration</h3>
            <p className="text-gray-700">
              Integrate with your favorite tools and frameworks effortlessly.
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-sm shadow-sm hover:shadow-md transition-shadow">
            <CloudIcon className="w-10 h-8 text-blue-600 mb-4" />
            <h3 className="text-md font-semibold mb-2">Cloud Deployment</h3>
            <p className="text-gray-700">
              Deploy your agents in the cloud with just a few clicks.
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-sm shadow-sm hover:shadow-md transition-shadow">
            <CurrencyDollarIcon className="w-10 h-8 text-green-600 mb-4" />
            <h3 className="text-md font-semibold mb-2">Monetize Your Agent</h3>
            <p className="text-gray-700">
              Earn revenue by publishing your agent on our marketplace.
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden relative">
          {!isLoggedIn && (
            <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-10">
              <AuthButton />
            </div>
          )}
          <div
            className={`p-8 ${!isLoggedIn ? "opacity-50 pointer-events-none" : ""}`}
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Deployment Source Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Deployment Source*
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, deploymentSource: "github" })
                    }
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      formData.deploymentSource === "github"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800"
                    }`}
                  >
                    <CodeBracketIcon className="h-6 w-6 text-blue-500 mb-2" />
                    <h3 className="font-medium">GitHub Repository</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Deploy from a Git repository
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        deploymentSource: "docker-registry",
                      })
                    }
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      formData.deploymentSource === "docker-registry"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800"
                    }`}
                  >
                    <CloudIcon className="h-6 w-6 text-blue-500 mb-2" />
                    <h3 className="font-medium">Docker Registry</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Use a pre-built Docker image
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        deploymentSource: "docker-compose",
                      })
                    }
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      formData.deploymentSource === "docker-compose"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800"
                    }`}
                  >
                    <ServerIcon className="h-6 w-6 text-blue-500 mb-2" />
                    <h3 className="font-medium">Docker Compose</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Multi-container deployment
                    </p>
                  </button>
                </div>
              </div>

              {/* Deployment Source Input */}
              {renderDeploymentSourceInput()}

              {/* Framework and Name Selection */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, framework: "agno" })
                  }
                  className={`p-4 rounded-lg border-2 text-center transition-all ${
                    formData.framework === "agno"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800"
                  }`}
                >
                  <img
                    src="/agno.png"
                    alt="Agno Logo"
                    className="h-8 w-auto mx-auto mb-2"
                  />
                  <span className="block text-sm font-medium">Agno</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, framework: "langchain" })
                  }
                  className={`p-4 rounded-lg border-2 text-center transition-all ${
                    formData.framework === "langchain"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800"
                  }`}
                >
                  <img
                    src="/langchain.png"
                    alt="LangChain Logo"
                    className="h-8 w-auto mx-auto mb-2"
                  />
                  <span className="block text-sm font-medium">LangChain</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, framework: "google-adk" })
                  }
                  className={`p-4 rounded-lg border-2 text-center transition-all ${
                    formData.framework === "google-adk"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800"
                  }`}
                >
                  <img
                    src="/adk.png"
                    alt="Google ADK Logo"
                    className="h-8 w-8 mx-auto mb-2"
                  />
                  <span className="block text-sm font-medium">Google ADK</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, framework: "openai-sdk" })
                  }
                  className={`p-4 rounded-lg border-2 text-center transition-all ${
                    formData.framework === "openai-sdk"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800"
                  }`}
                >
                  <img
                    src="/openai.png"
                    alt="OpenAI SDK Logo"
                    className="h-8 w-auto mx-auto mb-2"
                  />
                  <span className="block text-sm font-medium">OpenAI SDK</span>
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agent Name*
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your agent's name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agent Description*
                </label>
                <Textarea
                  id="description"
                  placeholder="Briefly describe your agent's functionality"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  className="w-full h-32"
                />
              </div>

              <div className="pt-6 items-center flex flex-col w-full justify-center">
                {isLoggedIn ? (
                  <Button
                    type="submit"
                    disabled={
                      isSubmitting || !formData.name || !formData.description
                    }
                    className="w-full h-12 text-lg relative overflow-hidden group"
                  >
                    <span
                      className={`absolute inset-0 w-full h-full transition-all duration-300 ease-out transform ${isSubmitting ? "translate-y-0" : "translate-y-full"} bg-blue-600 group-hover:translate-y-0`}
                    ></span>
                    <span className="relative group-hover:text-white transition-colors duration-300">
                      {isSubmitting
                        ? "Submitting..."
                        : "Submit Agent for Review"}
                    </span>
                  </Button>
                ) : (
                  <AuthButton />
                )}
                <p className="mt-4 text-sm text-center text-gray-500">
                  <ClockIcon className="inline-block w-4 h-4 mr-1 -mt-1" />
                  Review process typically takes 1-2 business days
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
