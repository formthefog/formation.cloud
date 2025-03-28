"use client";

import { useState, useEffect } from "react";
import FormationLogo from "@/components/icons/FormationLogo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface MarketplaceNavigationProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const MarketplaceNavigation = ({
  searchQuery,
  setSearchQuery
}: MarketplaceNavigationProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const scrolled = window.pageYOffset > 0;
      setIsScrolled(scrolled);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`w-full sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-sm border-b border-gray-200"
          : "bg-white border-b border-gray-200"
      }`}
    >
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex-shrink-0">
            <FormationLogo />
          </Link>
          <span className="hidden md:block h-6 w-px bg-gray-200" />
          <span className="hidden md:block text-sm font-bold text-gray-300">MARKETPLACE</span>
        </div>

        <div className="flex-1 max-w-lg mx-8 hidden md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#0A84FF] focus:ring-2 focus:ring-[#0A84FF]/20 transition-all outline-none text-sm text-gray-900 placeholder:text-gray-400"
            />
            <svg className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            className="font-medium"
          >
            Login
          </Button>
        </div>
      </div>
    </header>
  );
};

export default MarketplaceNavigation; 