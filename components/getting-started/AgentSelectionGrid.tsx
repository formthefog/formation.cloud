"use client";

import { Button } from "@/components/ui/button";
import { RocketIcon } from "lucide-react";
import { useEffect } from "react";

export default function AgentSelectionGrid({
  currentStep,
  setCurrentStep,
  prebuiltAgents,
  selectedAgentIndex,
  setSelectedAgentIndex,
  selectedAgent,
  existingDeployment,
  handleContinueToSettings,
}) {
  const handleSelectAgent = () => {
    setCurrentStep(2);
  };

  useEffect(() => {
    // Scroll to top when agent selection changes (for mobile UX)
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedAgentIndex]);

  // Split agents into two rows for a two-layer grid (desktop/tablet)
  const midpoint = Math.ceil(prebuiltAgents.length / 2);
  const agentRows = [
    prebuiltAgents.slice(0, midpoint),
    prebuiltAgents.slice(midpoint),
  ];

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
          Choose an agent from the grid below.
        </p>
      </div>

      {/* Fun, Snazzy Agent Grid with Two Layers and Horizontal Scroll */}
      <div className="flex flex-col items-center justify-center max-w-6xl mx-auto w-full mt-8 px-2 md:px-4">
        {/* Mobile: Single horizontal scrollable row */}
        <div className="block md:hidden w-full">
          <div
            className="flex flex-row gap-4 overflow-x-auto pb-2 px-2 -mx-2 scrollbar-thin scrollbar-thumb-blue-200"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {/* Add left/right padding so first/last card are never cut off */}
            <div className="flex-shrink-0 w-2" />
            {prebuiltAgents.map((agent, idx) => {
              const isSelected = idx === selectedAgentIndex;
              return (
                <button
                  key={agent.id}
                  className={`relative flex flex-col items-center justify-center p-5 min-w-[80vw] max-w-[90vw] rounded-3xl border-2 shadow-xl transition-all duration-200 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white hover:-translate-y-1 hover:shadow-2xl hover:border-blue-400 active:scale-95 min-h-[170px] mx-1
                    ${
                      isSelected
                        ? "border-blue-500 ring-2 ring-blue-300 bg-gradient-to-br from-blue-50 to-green-50"
                        : "border-gray-200"
                    }
                    ${existingDeployment ? "opacity-60 pointer-events-none" : ""}
                  `}
                  onClick={() => setSelectedAgentIndex(idx)}
                  disabled={!!existingDeployment}
                  aria-pressed={isSelected}
                  aria-label={`Select agent: ${agent.name}`}
                >
                  <span className="text-3xl mb-2 drop-shadow-glow animate-bounce-slow">
                    {agent.emoji}
                  </span>
                  <span className="font-bold text-lg text-gray-900 text-center mb-1">
                    {agent.name}
                  </span>
                  <span className="text-gray-500 text-base text-center mt-1">
                    {agent.description}
                  </span>
                  {isSelected && (
                    <span className="absolute top-3 right-3 bg-blue-500 text-white rounded-full px-3 py-1 text-sm font-semibold shadow-md animate-pop-in">
                      Selected
                    </span>
                  )}
                  <span className="absolute inset-0 rounded-3xl pointer-events-none group-hover:ring-4 group-hover:ring-blue-200 transition-all duration-200" />
                </button>
              );
            })}
            <div className="flex-shrink-0 w-2" />
          </div>
        </div>
        {/* Desktop/Tablet: Two horizontal scrollable rows */}
        <div className="hidden md:block space-y-6 w-full">
          {agentRows.map((row, rowIdx) => (
            <div
              key={rowIdx}
              className="flex flex-row gap-6 w-full py-8 overflow-x-auto pb-4 px-4 -mx-4 scrollbar-thin scrollbar-thumb-blue-200"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {/* Add left/right padding so first/last card are never cut off */}
              <div className="flex-shrink-0 w-4" />
              {row.map((agent, idx) => {
                // Calculate the correct index for selection
                const agentIdx = rowIdx === 0 ? idx : idx + midpoint;
                const isSelected = agentIdx === selectedAgentIndex;
                return (
                  <button
                    key={agent.id}
                    className={`relative flex flex-col items-center justify-center p-8 min-w-[320px] max-w-[360px] rounded-3xl border-2 shadow-xl transition-all duration-200 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white hover:-translate-y-1 hover:shadow-2xl hover:border-blue-400 active:scale-95 min-h-[220px] mx-2
                      ${
                        isSelected
                          ? "border-blue-500 ring-2 ring-blue-300 bg-gradient-to-br from-blue-50 to-green-50"
                          : "border-gray-200"
                      }
                      ${existingDeployment ? "opacity-60 pointer-events-none" : ""}
                    `}
                    onClick={() => setSelectedAgentIndex(agentIdx)}
                    disabled={!!existingDeployment}
                    aria-pressed={isSelected}
                    aria-label={`Select agent: ${agent.name}`}
                  >
                    <span className="text-5xl mb-3 drop-shadow-glow animate-bounce-slow">
                      {agent.emoji}
                    </span>
                    <span className="font-bold text-2xl text-gray-900 text-center mb-1">
                      {agent.name}
                    </span>
                    <span className="text-gray-500 text-lg text-center mt-1">
                      {agent.description}
                    </span>
                    {isSelected && (
                      <span className="absolute top-3 right-3 bg-blue-500 text-white rounded-full px-3 py-1 text-sm font-semibold shadow-md animate-pop-in">
                        Selected
                      </span>
                    )}
                    <span className="absolute inset-0 rounded-3xl pointer-events-none group-hover:ring-4 group-hover:ring-blue-200 transition-all duration-200" />
                  </button>
                );
              })}
              <div className="flex-shrink-0 w-4" />
            </div>
          ))}
        </div>
        <Button
          variant="default"
          className="w-full max-w-xs mt-10 py-3 text-xl bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none rounded-xl shadow-xl transition-all duration-200"
          onClick={handleContinueToSettings}
          aria-label="Continue to Step 2"
          disabled={
            selectedAgentIndex === null ||
            selectedAgentIndex === undefined ||
            !!existingDeployment
          }
        >
          Continue
        </Button>
      </div>
    </section>
  );
}
