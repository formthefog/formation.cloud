"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidRendererProps {
  chart: string;
}

export default function Mermaid({ chart }: MermaidRendererProps) {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const mermaidRef = useRef<HTMLDivElement>(null);
  const uniqueId = useRef(
    `mermaid-${Math.random().toString(36).substring(2, 11)}`
  );

  useEffect(() => {
    // Initialize mermaid with configuration
    mermaid.initialize({
      startOnLoad: true,
      theme: "default",
      securityLevel: "loose",
      fontFamily: "sans-serif",
    });

    const renderChart = async () => {
      try {
        setError(null);
        // Use mermaid API to render the chart
        const { svg } = await mermaid.render(uniqueId.current, chart);
        setSvg(svg);
      } catch (err) {
        console.error("Mermaid rendering error:", err);
        setError("Failed to render Mermaid diagram. Please check your syntax.");
      }
    };

    renderChart();
  }, [chart]);

  if (error) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-md">
        <p className="font-bold">Error rendering diagram:</p>
        <p>{error}</p>
        <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto text-sm">
          {chart}
        </pre>
      </div>
    );
  }

  return (
    <div className="mermaid-diagram my-4">
      {svg ? (
        <div dangerouslySetInnerHTML={{ __html: svg }} />
      ) : (
        <div className="flex justify-center items-center h-32 bg-gray-100 rounded-md">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
    </div>
  );
}
