"use client";

import { CodeBlock } from "@/components/CodeBlock";
import { Button } from "@/components/ui/button";
import { RocketIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function AgentSelection({
  currentStep,
  setCurrentStep,
  prebuiltAgents,
  selectedAgentIndex,
  setSelectedAgentIndex,
  selectedAgent,
  existingDeployment,
}) {
  const [agentCode, setAgentCode] = useState("");
  const [loadingCode, setLoadingCode] = useState(true);

  useEffect(() => {
    setAgentCode("");
    setLoadingCode(true);
    fetch(`/api/agent-code/${selectedAgent.id}`)
      .then((res) => res.json())
      .then((data) => setAgentCode(data.code || "# Code not found"))
      .catch(() => setAgentCode("# Error loading code"))
      .finally(() => setLoadingCode(false));
  }, [selectedAgentIndex]);

  const handleSelectAgent = () => {
    setCurrentStep(2);
  };

  return (
    <section
      className={`py-4 md:py-6 transition-opacity duration-300 ${
        currentStep === 1 ? "opacity-100" : "opacity-70"
      }`}
    >
      {/* Responsive Header */}
      <div className="text-center flex flex-col gap-2 px-4">
        <div className="mx-auto mb-2 flex items-center justify-center">
          <span className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-500/30 to-green-400/30 backdrop-blur-md shadow-xl">
            <RocketIcon className="w-6 h-6 md:w-7 md:h-7 text-blue-500 drop-shadow-glow" />
          </span>
        </div>
        <h2
          className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900 mb-1"
          style={{ fontFamily: "Inter, Space Grotesk, sans-serif" }}
        >
          Step 1:{" "}
          <span className="bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent">
            Select an Agent
          </span>
        </h2>
        <p className="text-sm md:text-base text-gray-500 font-medium mt-1 max-w-2xl mx-auto">
          Choose an agent from the list below.
        </p>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start justify-center max-w-5xl mx-auto w-full mt-2 px-4">
        {/* Agent Selection Cards - Horizontal scroll on mobile, vertical list on desktop */}
        <div className="w-full md:w-56 flex-shrink-0 flex-grow-0">
          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[800px] pb-2 md:pb-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {prebuiltAgents.map((agent, idx) => (
              <button
                key={agent.id}
                className={`flex flex-row items-center gap-2 px-2 py-2 rounded-lg border w-40 sm:w-48 md:w-full min-w-[10rem] sm:min-w-[11rem] md:min-w-0
                ${
                  idx === selectedAgentIndex
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white"
                }
                flex-shrink-0 transition-colors duration-150 text-xs md:text-sm`}
                onClick={() => setSelectedAgentIndex(idx)}
                disabled={!!existingDeployment}
              >
                <span className="text-lg md:text-xl flex-shrink-0">
                  {agent.emoji}
                </span>
                <div className="flex flex-col text-left overflow-hidden">
                  <span className="font-semibold leading-tight truncate">
                    {agent.name}
                  </span>
                  <span className="text-gray-500 leading-snug text-xs truncate">
                    {agent.description}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Continue button below agent list on mobile */}
          <div className="hidden mt-3">
            <Button
              variant="default"
              className="w-full py-2"
              onClick={handleSelectAgent}
              aria-label="Continue to Step 2"
              disabled={!!existingDeployment}
            >
              Continue
            </Button>
          </div>
        </div>

        {/* Code Example Panel */}
        <div className="flex-1 space-y-2 md:space-y-4 w-full overflow-hidden">
          <div
            className="text-base md:text-lg font-semibold text-blue-700 mb-1 flex items-center justify-between"
            style={{ fontFamily: "Inter, Space Grotesk, sans-serif" }}
          >
            <span className="text-base md:text-xl mr-2 truncate max-w-[70%]">
              {selectedAgent.emoji} {selectedAgent.name}
            </span>
            {/* Continue button on desktop */}
            <Button
              variant="default"
              className="hidden md:inline-block text-sm px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              onClick={handleSelectAgent}
              aria-label="Continue to Step 2"
              disabled={!!existingDeployment}
            >
              Continue
            </Button>
          </div>

          <div className="text-gray-500 mb-2 text-xs md:text-sm font-medium">
            {selectedAgent.description}
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-blue-900/90 to-green-900/90 border-2 border-blue-400/60 shadow-2xl p-1 sm:p-2 md:p-3 overflow-hidden relative">
            <CodeBlock
              language="python"
              code={loadingCode ? "# Loading code..." : agentCode}
              className="h-[180px] sm:h-[220px] md:h-[500px] lg:h-[620px] overflow-x-auto w-full max-w-full bg-transparent text-green-100 font-mono text-xs md:text-sm rounded-b-2xl p-2 md:p-3"
            />
          </div>
        </div>
        <div className="block md:hidden mt-3 w-full">
          <Button
            variant="default"
            className="w-full py-2"
            onClick={handleSelectAgent}
            aria-label="Continue to Step 2"
            disabled={!!existingDeployment}
          >
            Continue
          </Button>
        </div>
      </div>
    </section>
  );
}
