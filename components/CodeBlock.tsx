import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface CodeBlockProps {
  code: string;
  language: string;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language,
  className,
}) => {
  return (
    <div
      className={`overflow-x-auto w-full ${className || ""}`}
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {/* @ts-ignore */}
      <SyntaxHighlighter
        language={language}
        style={atomDark}
        customStyle={{
          margin: 0,
          borderRadius: "0.375rem",
          fontSize: "0.75rem", // 12px for mobile
          width: "100%",
          maxWidth: "100%",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};
