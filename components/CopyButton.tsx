"use client";

import { CopyCheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { FaCheck, FaCopy } from "react-icons/fa6";
import { LuCopy } from "react-icons/lu";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <button
      onClick={handleCopy}
      className={`
    absolute top-5 right-3 px-2 py-1 flex items-center gap-2
    text-xs bg-transparent border border-blue-200 rounded-lg
    hover:bg-blue-700 transition shadow-sm
    text-blue-200
    focus:outline-none focus:ring-2 focus:ring-blue-400
  `}
      aria-label="Copy code"
      type="button"
    >
      {copied ? (
        <FaCheck className="w-4 h-4 text-blue-200  transition-transform duration-150 scale-110" />
      ) : (
        <LuCopy className="w-4 h-4 text-blue-200  transition-transform duration-150 scale-110" />
      )}
    </button>
  );
}
