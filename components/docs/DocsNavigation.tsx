"use client";

import { AuthButton } from "../AuthButton";
import FormationLogo from "../icons/FormationLogo";
import Link from "next/link";
import { useState } from "react";

export default function DocsNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 px-4 sm:px-6 py-3 max-w-screen-2xl mx-auto">
        <Link href="/docs" className="flex-shrink-0">
          <FormationLogo />
        </Link>
        <span className="hidden md:block text-sm font-bold text-gray-300">
          DOCS
        </span>

        <div className="flex-grow" />
        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden ml-2 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="sr-only">Open menu</span>
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
              d={
                mobileMenuOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>

        {/* Desktop navigation */}
        <div className="hidden md:flex md:items-center">
          <Link
            href="https://formation.cloud"
            className="text-sm font-bold text-gray-400 tracking-wide hover:text-blue-600 transition-colors ml-4"
          >
            Home
          </Link>
          {/* <Link
            href="/marketplace"
            className="text-sm font-bold text-gray-400 tracking-wide hover:text-blue-600 transition-colors mx-4"
          >
            Marketplace
          </Link>
          <AuthButton /> */}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 py-2">
          <div className="px-4 space-y-2">
            <Link
              href="https://formation.cloud"
              className="block text-sm font-bold text-gray-400 tracking-wide hover:text-blue-600 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Homepage
            </Link>
            {/* <Link
              href="/marketplace"
              className="block text-sm font-bold text-gray-400 tracking-wide hover:text-blue-600 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Marketplace
            </Link>
            <div className="py-2">
              <AuthButton />
            </div> */}
          </div>
        </div>
      )}
    </header>
  );
}
