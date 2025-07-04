"use client";
import React, { useEffect, useState } from "react";

export default function TableOfContents({
  tocLinks,
}: {
  tocLinks: { href: string; label: string; level: number }[];
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Get all heading elements that are in the ToC
      const headings = tocLinks
        .filter((link) => link.level === 2)
        .map((link) => document.getElementById(link.href.slice(1)))
        .filter(Boolean) as HTMLElement[];

      // Find the heading closest to the top of the viewport (with some offset for sticky header)
      const scrollPosition = window.scrollY + 90; // adjust for sticky header

      let current: string | null = null;
      for (const heading of headings) {
        if (heading.offsetTop <= scrollPosition) {
          current = heading.id;
        }
      }
      setActiveId(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // set on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, [tocLinks]);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const el = document.getElementById(href.slice(1));
      if (el) {
        window.scrollTo({
          top: el.getBoundingClientRect().top + window.scrollY - 80, // adjust for sticky header
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-l border-gray-100 py-8 pl-2">
      <div className="sticky top-24">
        <nav className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 w-full">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            On this page
          </h2>
          <ul className="space-y-1">
            {tocLinks
              .filter((link) => link.level === 2)
              .map((link, index) => (
                <li key={link.href + index}>
                  <a
                    href={link.href}
                    onClick={(e) => handleClick(e, link.href)}
                    className={
                      "block px-3 py-2 rounded-lg font-medium transition-colors " +
                      (activeId === link.href.slice(1)
                        ? "bg-blue-50 text-formation-blue font-black"
                        : "text-sm text-gray-700 hover:bg-blue-50 hover:text-formation-blue")
                    }
                  >
                    {link.label}
                  </a>
                </li>
              ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
