import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import { notFound } from "next/navigation";
import { extractTocLinks } from "@/lib/extractTocLinks";

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

export async function getTocLinks(params: { slug?: string[] }) {
  const markdown = await fetchMarkdownDoc(params.slug || []);
  if (!markdown) return [];
  return extractTocLinks(markdown);
}

export default async function DocsCatchAllPage({
  params,
}: {
  params: { slug?: string[] };
}) {
  const markdown = await fetchMarkdownDoc(params.slug || []);
  if (!markdown) {
    notFound();
  }
  return (
    <main
      style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}
      className="markdown-body flex-1"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSlug]}
      >
        {markdown}
      </ReactMarkdown>
    </main>
  );
}
