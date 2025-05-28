import { unified } from "unified";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";

export type TocLink = { href: string; label: string; level: number };

export async function extractTocLinks(markdown: string): Promise<TocLink[]> {
  const tree = unified().use(remarkParse).parse(markdown);
  const tocLinks: TocLink[] = [];

  visit(tree, "heading", (node: any) => {
    if (node.depth === 2 || node.depth === 3) {
      const text = node.children
        .filter((c: any) => c.type === "text" || c.type === "inlineCode")
        .map((c: any) => c.value)
        .join(" ");
      if (text) {
        const slug = text
          .toLowerCase()
          .replace(/[^\u0000-\u007F\w\s-]/g, "")
          .replace(/\s+/g, "-");
        tocLinks.push({ href: `#${slug}`, label: text, level: node.depth });
      }
    }
  });

  return tocLinks;
}
