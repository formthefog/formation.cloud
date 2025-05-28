import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import { notFound } from "next/navigation";
import Link from "next/link";
import { extractTocLinks } from "@/lib/extractTocLinks";
import TableOfContents from "@/components/docs/TableOfContents";

const GITHUB_BASE_URL =
  "https://raw.githubusercontent.com/formthefog/formation/4c21569a65769fbb4e6b0c069f19c598bd88ce49/docs/";

async function fetchMarkdownDoc(slug: string[]): Promise<string | null> {
  // If no slug, default to README.md
  const docPath =
    slug && slug.length > 0 ? `${slug.join("/")}.md` : "README.md";
  const url = `${GITHUB_BASE_URL}${docPath}`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return await res.text();
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
    <div className="flex w-full">
      <main className="markdown-body max-w-screen-lg w-full min-w-screen-lg flex-1 px-0 md:px-12 py-10 bg-white shadow-sm min-h-[calc(100vh-64px)]">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSlug]}
          components={{
            a({ href = "", children, ...props }) {
              // Only rewrite relative .md links
              let newHref = href;
              if (
                href &&
                !href.startsWith("http") &&
                !href.startsWith("/") &&
                href.endsWith(".md")
              ) {
                // Remove .md extension and prepend /docs/
                newHref = "/docs/" + href.replace(/\.md$/, "");
              }
              return (
                <Link href={newHref} {...props}>
                  {children}
                </Link>
              );
            },
          }}
        >
          {markdown}
        </ReactMarkdown>
      </main>
      <aside className="hidden md:flex flex-col w-64 bg-white border-l border-gray-100 py-8 pl-2">
        <div className="sticky top-24">
          <TableOfContents tocLinks={tocLinks} />
        </div>
      </aside>
    </div>
  );
}
