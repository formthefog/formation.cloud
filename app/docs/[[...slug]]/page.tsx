import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import Link from "next/link";
import { notFound } from "next/navigation";
import "github-markdown-css/github-markdown-light.css"; // Add this at the top
import { extractTocLinks } from "@/lib/extractTocLinks";
import TableOfContents from "@/components/docs/TableOfContents";
import { Prism, SyntaxHighlighterProps } from "react-syntax-highlighter";
import TocMobileButton from "@/components/docs/ToCMobileButton";
import { materialOceanic } from "react-syntax-highlighter/dist/esm/styles/prism";
import CopyButton from "@/components/CopyButton";
import Mermaid from "@/components/Mermaid";

const SyntaxHighlighter = Prism as any as React.FC<SyntaxHighlighterProps>;

const GITHUB_BASE_URL =
  "https://raw.githubusercontent.com/formthefog/formation/refs/heads/main/docs/";

// const GITHUB_BASE_URL = "http://127.0.0.1:8080/";

async function fetchMarkdownDoc(slug: string[]): Promise<string | null> {
  // If no slug, default to README.md
  if (!slug || slug.length === 0) {
    try {
      const res = await fetch(`${GITHUB_BASE_URL}README.md`, {
        next: { revalidate: 60 },
      });
      if (!res.ok) return null;
      return await res.text();
    } catch {
      return null;
    }
  }

  // Try to fetch as a file first
  const filePath = `${slug.join("/")}.md`;
  try {
    let res = await fetch(`${GITHUB_BASE_URL}${filePath}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) return await res.text();

    // If not found, try as a directory README
    const dirReadmePath = `${slug.join("/")}/README.md`;
    res = await fetch(`${GITHUB_BASE_URL}${dirReadmePath}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) return await res.text();

    // Not found
    return null;
  } catch {
    return null;
  }
}

export default async function DocsCatchAllPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const markdown = await fetchMarkdownDoc(slug || []);
  if (!markdown) {
    notFound();
  }
  const tocLinks = await extractTocLinks(markdown);

  return (
    <div className="flex w-full max-w-screen-2xl mx-auto flex-col min-h-screen px-4 md:px-0 pt-4 md:pt-0 md:flex-row">
      {/* Main Content */}
      <main className="markdown-body w-full flex-1 px-4 bg-white sm:px-6 md:px-12 md:pr-0 py-4 md:py-10 shadow-sm min-h-[calc(100vh-64px)] md:max-w-3xl md:mx-auto">
        <ReactMarkdown
          // @ts-ignore
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSlug]}
          components={{
            a({ href = "", children, ...props }) {
              let newHref = href;
              if (href && !href.startsWith("http") && href.endsWith(".md")) {
                let cleanHref = href.startsWith("/") ? href.slice(1) : href;
                let withoutMd = cleanHref.replace(/\.md$/, "");
                let segments = withoutMd.split("/");
                if (
                  segments.length &&
                  segments[segments.length - 1].toLowerCase() === "readme"
                ) {
                  segments.pop();
                }
                newHref = segments.length ? segments.join("/") : "";
              }
              // Remove href from props so it doesn't override newHref
              return <Link href={"/docs/" + newHref}>{children}</Link>;
            },
            code(props) {
              const { children, className, ...rest } = props;
              const match = /language-(\w+)/.exec(className || "");
              const codeString = String(children).replace(/\n$/, "");

              return match && match[1] !== "mermaid" ? (
                <div className="relative group overflow-x-auto rounded-md font-mono">
                  <SyntaxHighlighter
                    language={match[1]}
                    PreTag="div"
                    {...rest}
                    style={materialOceanic}
                  >
                    {codeString}
                  </SyntaxHighlighter>
                  <CopyButton text={codeString} />
                </div>
              ) : match && match[1] === "mermaid" ? (
                <Mermaid chart={codeString} />
              ) : (
                <code
                  className={`px-1.5 py-0.5 rounded font-mono text-sm ${className || ""}`}
                  {...props}
                >
                  {children}
                </code>
              );
            },
          }}
        >
          {markdown}
        </ReactMarkdown>
      </main>

      <aside className="hidden min-h-screen md:flex flex-col w-64 bg-white border-l border-gray-100 py-8 pl-2">
        <div className="sticky top-24">
          <TableOfContents tocLinks={tocLinks} />
        </div>
      </aside>

      {/* Mobile Table of Contents Floating Button */}
      <div className="md:hidden">
        <TocMobileButton tocLinks={tocLinks} />
      </div>
    </div>
  );
}
