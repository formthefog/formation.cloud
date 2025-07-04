import React, { useState } from "react";
import type { AIAgent } from "../../types/formation";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { AvatarUpload } from "./AvatarUpload";

const LICENSES = [
  "MIT",
  "Apache2",
  "GPL3",
  "BSD",
  "CC_BY",
  "CC_BY_SA",
  "CC_BY_NC",
  "CC_BY_NC_SA",
  "Proprietary",
];

const STEPS = ["Core Configuration", "Review & Save"];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ConfigureAgent({
  agent,
  setAgent,
}: {
  agent: AIAgent;
  setAgent: (agent: AIAgent) => void;
}) {
  const [step, setStep] = useState(0);
  const [localAgent, setLocalAgent] = useState<AIAgent>(agent);

  // Helper for updating fields
  const update = (field: keyof AIAgent, value: any) => {
    setLocalAgent((a) => ({ ...a, [field]: value }));
  };

  // Chips for array fields
  const Chips = ({
    value,
    onChange,
    placeholder,
  }: {
    value: string[];
    onChange: (v: string[]) => void;
    placeholder?: string;
  }) => {
    const [input, setInput] = useState("");
    return (
      <div>
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map((v, i) => (
            <span
              key={i}
              className="bg-gradient-to-r from-blue-400 to-purple-400 text-white px-3 py-1 rounded-full text-xs flex items-center animate-fade-in"
            >
              {v}
              <button
                className="ml-2 text-white hover:text-red-200"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              >
                &times;
              </button>
            </span>
          ))}
        </div>
        <input
          className="w-full border-b-2 border-purple-300 focus:border-purple-500 bg-transparent py-1 px-2 outline-none transition-all text-sm"
          value={input}
          placeholder={placeholder || "Add and press Enter"}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && input.trim()) {
              onChange([...value, input.trim()]);
              setInput("");
              e.preventDefault();
            }
          }}
        />
      </div>
    );
  };

  // Stepper
  const Stepper = () => (
    <div className="flex items-center justify-center mb-8">
      {STEPS.map((label, idx) => (
        <React.Fragment key={label}>
          <div
            className={classNames(
              "flex flex-col items-center cursor-pointer",
              idx === step
                ? "text-purple-600 font-bold scale-110"
                : "text-gray-400",
              "transition-all duration-300"
            )}
            onClick={() => setStep(idx)}
          >
            <div
              className={classNames(
                "rounded-full w-10 h-10 flex items-center justify-center mb-1",
                idx === step
                  ? "bg-gradient-to-r from-blue-400 to-purple-500 text-white shadow-lg"
                  : "bg-gray-200",
                "transition-all duration-300"
              )}
            >
              {idx + 1}
            </div>
            <span className="text-xs uppercase tracking-wide">{label}</span>
          </div>
          {idx < STEPS.length - 1 && (
            <div className="w-16 h-1 bg-gradient-to-r from-blue-300 to-purple-300 mx-4 rounded-full" />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  // Animated card wrapper
  const Card = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-white/80 shadow-2xl rounded-3xl p-8 max-w-4xl mx-auto animate-fade-in-up transition-all duration-500">
      {children}
    </div>
  );

  // Section header
  const SectionHeader = ({
    title,
    subtitle,
  }: {
    title: string;
    subtitle?: string;
  }) => (
    <div className="mb-4">
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
  );

  // Steps
  const steps = [
    // 0: Core Configuration (Everything)
    <Card key="core">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
          Agent Configuration
        </h2>
        <p className="text-gray-500">
          Configure all aspects of your AI agent in one place.
        </p>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-50 rounded-xl p-4">
          <SectionHeader title="Basic Information" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Agent Name*
              </label>
              <input
                className="w-full rounded-lg border-2 border-gray-200 focus:border-purple-500 px-3 py-2 transition-all text-sm"
                value={localAgent?.name ?? ""}
                onChange={(e) => update("name", e.target.value)}
                placeholder="My Agent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Agent ID*
              </label>
              <input
                className="w-full rounded-lg border-2 border-gray-200 focus:border-purple-500 px-3 py-2 transition-all text-sm"
                value={localAgent?.agent_id ?? ""}
                onChange={(e) => update("agent_id", e.target.value)}
                placeholder="my-agent-id"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Version</label>
              <input
                className="w-full rounded-lg border-2 border-gray-200 focus:border-purple-500 px-3 py-2 transition-all text-sm"
                value={localAgent?.version ?? ""}
                onChange={(e) => update("version", e.target.value)}
                placeholder="1.0.0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">License</label>
              <select
                className="w-full rounded-lg border-2 border-gray-200 focus:border-purple-500 px-3 py-2 transition-all text-sm"
                value={
                  typeof localAgent?.license === "string"
                    ? localAgent.license
                    : ""
                }
                onChange={(e) => update("license", e.target.value)}
              >
                <option value="">Select License</option>
                {LICENSES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                className="w-full rounded-lg border-2 border-gray-200 focus:border-purple-500 px-3 py-2 transition-all text-sm"
                value={localAgent?.description ?? ""}
                onChange={(e) => update("description", e.target.value)}
                rows={2}
                placeholder="Brief description of what your agent does..."
              />
            </div>
          </div>
        </div>

        {/* Technical Configuration */}
        <div className="bg-gray-50 rounded-xl p-4">
          <SectionHeader title="Technical Configuration" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Agent Type
              </label>
              <input
                className="w-full rounded-lg border-2 border-gray-200 focus:border-purple-500 px-3 py-2 transition-all text-sm"
                value={localAgent?.agent_type ?? ""}
                onChange={(e) => update("agent_type", e.target.value)}
                placeholder="assistant"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Framework
              </label>
              <input
                className="w-full rounded-lg border-2 border-gray-200 focus:border-purple-500 px-3 py-2 transition-all text-sm"
                value={localAgent?.framework ?? ""}
                onChange={(e) => update("framework", e.target.value)}
                placeholder="langchain"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Runtime</label>
              <input
                className="w-full rounded-lg border-2 border-gray-200 focus:border-purple-500 px-3 py-2 transition-all text-sm"
                value={localAgent?.runtime ?? ""}
                onChange={(e) => update("runtime", e.target.value)}
                placeholder="python"
              />
            </div>
          </div>
        </div>

        {/* Capabilities & Tags */}
        <div className="bg-gray-50 rounded-xl p-4">
          <SectionHeader title="Capabilities & Tags" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tags</label>
              <Chips
                value={localAgent?.tags ?? []}
                onChange={(v) => update("tags", v)}
                placeholder="Add tags (e.g., chatbot, analytics)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Capabilities
              </label>
              <Chips
                value={localAgent?.capabilities ?? []}
                onChange={(v) => update("capabilities", v)}
                placeholder="Add capabilities (e.g., text-generation)"
              />
            </div>
          </div>
        </div>

        {/* Model Configuration */}
        <div className="bg-gray-50 rounded-xl p-4">
          <SectionHeader title="Model Configuration" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Compatible Model Types
              </label>
              <Chips
                value={(localAgent?.compatible_model_types ?? []) as string[]}
                onChange={(v) => update("compatible_model_types", v)}
                placeholder="e.g., LLM, Embedding"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Preferred Models
              </label>
              <Chips
                value={localAgent?.preferred_models ?? []}
                onChange={(v) => update("preferred_models", v)}
                placeholder="e.g., gpt-4, claude-3"
              />
            </div>
          </div>
        </div>

        {/* Access Permissions */}
        <div className="bg-gray-50 rounded-xl p-4">
          <SectionHeader title="Access Permissions" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localAgent?.has_memory ?? false}
                onChange={(e) => update("has_memory", e.target.checked)}
                className="accent-purple-500"
              />
              <span className="text-sm">Memory</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localAgent?.has_external_api_access ?? false}
                onChange={(e) =>
                  update("has_external_api_access", e.target.checked)
                }
                className="accent-purple-500"
              />
              <span className="text-sm">External APIs</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localAgent?.has_internet_access ?? false}
                onChange={(e) =>
                  update("has_internet_access", e.target.checked)
                }
                className="accent-purple-500"
              />
              <span className="text-sm">Internet</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localAgent?.has_filesystem_access ?? false}
                onChange={(e) =>
                  update("has_filesystem_access", e.target.checked)
                }
                className="accent-purple-500"
              />
              <span className="text-sm">Filesystem</span>
            </label>
          </div>
        </div>

        {/* Additional Settings */}
        <div className="bg-gray-50 rounded-xl p-4">
          <SectionHeader title="Additional Settings" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Repository URL
              </label>
              <input
                className="w-full rounded-lg border-2 border-gray-200 focus:border-purple-500 px-3 py-2 transition-all text-sm"
                value={localAgent?.repository_url ?? ""}
                onChange={(e) => update("repository_url", e.target.value)}
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Demo URL</label>
              <input
                className="w-full rounded-lg border-2 border-gray-200 focus:border-purple-500 px-3 py-2 transition-all text-sm"
                value={localAgent?.demo_url ?? ""}
                onChange={(e) => update("demo_url", e.target.value)}
                placeholder="https://demo.example.com"
              />
            </div>
            <div className="md:col-span-2 flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localAgent?.is_featured ?? false}
                  onChange={(e) => update("is_featured", e.target.checked)}
                  className="accent-purple-500"
                />
                <span className="text-sm font-medium">Featured</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localAgent?.is_private ?? false}
                  onChange={(e) => update("is_private", e.target.checked)}
                  className="accent-purple-500"
                />
                <span className="text-sm font-medium">Private</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </Card>,

    // 1: Review
    <Card key="review">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
          Review Configuration
        </h2>
        <p className="text-gray-500">
          Please review your agent configuration before saving.
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold text-gray-800 mb-3">Basic Information</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Name:</span>{" "}
                {localAgent?.name || "Not set"}
              </div>
              <div>
                <span className="font-medium">ID:</span>{" "}
                {localAgent?.agent_id || "Not set"}
              </div>
              <div>
                <span className="font-medium">Version:</span>{" "}
                {localAgent?.version || "Not set"}
              </div>
              <div>
                <span className="font-medium">Type:</span>{" "}
                {localAgent?.agent_type || "Not set"}
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 mb-3">Technical Details</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Framework:</span>{" "}
                {localAgent?.framework || "Not set"}
              </div>
              <div>
                <span className="font-medium">Runtime:</span>{" "}
                {localAgent?.runtime || "Not set"}
              </div>
              <div>
                <span className="font-medium">License:</span>{" "}
                {typeof localAgent?.license === "string"
                  ? localAgent.license
                  : "Not set"}
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 mb-3">Capabilities</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Tags:</span>{" "}
                {localAgent?.tags?.join(", ") || "None"}
              </div>
              <div>
                <span className="font-medium">Features:</span>{" "}
                {localAgent?.capabilities?.join(", ") || "None"}
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 mb-3">Access Permissions</h3>
            <div className="space-y-2 text-sm">
              <div className="flex gap-4">
                <span>{localAgent?.has_memory ? "✓" : "✗"} Memory</span>
                <span>
                  {localAgent?.has_internet_access ? "✓" : "✗"} Internet
                </span>
              </div>
              <div className="flex gap-4">
                <span>
                  {localAgent?.has_external_api_access ? "✓" : "✗"} APIs
                </span>
                <span>
                  {localAgent?.has_filesystem_access ? "✓" : "✗"} Filesystem
                </span>
              </div>
            </div>
          </div>
        </div>

        {localAgent?.description && (
          <div className="mt-4">
            <h3 className="font-bold text-gray-800 mb-2">Description</h3>
            <p className="text-sm text-gray-600">{localAgent.description}</p>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <button
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition-all font-bold text-lg"
          onClick={() => setAgent(localAgent)}
        >
          Save Agent Configuration
        </button>
      </div>
    </Card>,
  ];

  return (
    <div className="relative flex flex-col justify-center items-center animate-fade-in">
      <Stepper />
      <div className="w-full max-w-4xl">
        <div className="relative">{steps[step]}</div>
        <div className="flex justify-between mt-8">
          <button
            className={classNames(
              "px-6 py-2 rounded-xl font-bold transition-all",
              step === 0
                ? "opacity-0 pointer-events-none"
                : "bg-gray-200 hover:bg-gray-300 text-gray-600"
            )}
            onClick={() => setStep(0)}
          >
            Back
          </button>
          <button
            className={classNames(
              "px-6 py-2 rounded-xl font-bold transition-all",
              step === 1
                ? "opacity-0 pointer-events-none"
                : "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:scale-105"
            )}
            onClick={() => setStep(1)}
          >
            Review
          </button>
        </div>
      </div>
    </div>
  );
}
