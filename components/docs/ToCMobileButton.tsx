"use client";

import { useState } from "react";

export default function TocMobileButton({
  tocLinks,
}: {
  tocLinks: { href: string; label: string; level: number }[];
}) {
  const [tocOpen, setTocOpen] = useState(false);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const el = document.getElementById(href.slice(1));
      if (el) {
        window.scrollTo({
          top: el.getBoundingClientRect().top + window.scrollY - 80,
          behavior: "smooth",
        });
        setTocOpen(false);
      }
    }
  };

  return (
    <>
      <button
        type="button"
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg"
        onClick={() => setTocOpen(!tocOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h7"
          />
        </svg>
      </button>

      <div
        className={`fixed inset-0 bg-gray-900 bg-opacity-50 z-40 transition-opacity duration-300 ${
          tocOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setTocOpen(false)}
      />

      <div
        className={`fixed inset-y-0 right-0 z-40 w-72 bg-white transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          tocOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              On this page
            </h2>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500"
              onClick={() => setTocOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <ul className="space-y-1">
            {tocLinks
              .filter((link) => link.level === 2)
              .map((link, index) => (
                <li key={link.href + index}>
                  <a
                    href={link.href}
                    onClick={(e) => handleClick(e, link.href)}
                    className="block px-3 py-2 rounded-lg font-medium transition-colors text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
}
