"use client";

import { useState, useEffect } from "react";
import FormationLogo from "@/components/icons/FormationLogo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import RightCaret from './icons/RightCaret';

interface MarketplaceNavigationProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const MarketplaceNavigation = ({
  searchQuery,
  setSearchQuery,
  isSidebarOpen,
  setIsSidebarOpen
}: MarketplaceNavigationProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

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

  const handleNavigation = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    window.location.href = href;
  };

  return (
    <header
      className={`w-full sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-sm border-b border-gray-200"
          : "bg-white border-b border-gray-200"
      }`}
    >
      <div className="px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-8">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 -ml-2 md:hidden"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
              />
            </svg>
          </button>
          
          <Link href="/" className="flex-shrink-0">
            <FormationLogo />
          </Link>
          <span className="hidden md:block h-6 w-px bg-gray-200" />
          <span className="hidden md:block text-sm font-bold text-gray-300">MARKETPLACE</span>
        </div>

        {/* Mobile Search Toggle */}
        <button
          onClick={() => setIsSearchVisible(!isSearchVisible)}
          className="p-2 md:hidden"
          aria-label="Toggle search"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        {/* Desktop Search */}
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
          <Link 
            href="/marketplace" 
            onClick={(e) => handleNavigation(e, '/marketplace')}
          >
            <Button
              className="inline-flex items-center px-8 py-4 bg-[#0A84FF] text-white rounded-full hover:bg-[#0A84FF]/90 transition-all text-[15px] font-medium uppercase tracking-wide"
            >
              <span className="block sm:hidden">ACCESS</span>
              <span className="hidden sm:block lg:hidden">GO TO MARKETPLACE</span>
              <span className="hidden lg:block">GO TO MARKETPLACE</span>
              <RightCaret className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchVisible && (
        <div className="px-4 pb-4 md:hidden">
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
      )}
    </header>
  );
};

export default MarketplaceNavigation; 