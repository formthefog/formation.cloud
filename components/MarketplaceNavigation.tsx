"use client";

import { useState, useEffect } from "react";
import FormationLogo from "@/components/icons/FormationLogo";
import Link from "next/link";
import { AuthButton } from "./AuthButton";
import Image from "next/image";
import { useAuth } from "./auth-provider";
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
  setIsSidebarOpen,
}: MarketplaceNavigationProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const { user, account } = useAuth();

  useEffect(() => {
    if (typeof window === "undefined") return;

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
      className={`w-full sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-sm border-b border-gray-200"
          : "bg-white border-b border-gray-200"
      }`}
    >
      <div className="max-w-[100vw] mx-auto">
        <div className="px-3 md:px-6 py-4 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-8">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 ml-1.5 md:hidden"
              aria-label="Toggle menu"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isSidebarOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>

            <Link href="/" className="flex-shrink-0">
              {/* Desktop Logo */}
              <div className="">
                <FormationLogo />
              </div>
              {/* Mobile Orb Logo */}
              {/* <div className="md:hidden w-[48px] h-[48px] relative">
                <Image
                  src="/orb.png"
                  alt="Formation"
                  width={192}
                  height={192}
                  className="w-full h-full object-contain"
                  priority
                />
              </div> */}
            </Link>
            <span className="hidden md:block h-6 w-px bg-gray-200" />
            <span className="hidden md:block text-sm font-bold text-gray-300">
              MARKETPLACE
            </span>
          </div>

          {/* Desktop Search */}
          {/* <div className="flex-1 max-w-lg mx-4 md:mx-8 hidden md:block">
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
          </div> */}

          <div className="flex items-center gap-2 md:gap-2">
            {/* Mobile Search Toggle */}
            {/* <button
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              className="p-1.5 md:hidden"
              aria-label="Toggle search"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button> */}
            {user && account && (
              <Link href="/marketplace/settings">
                <div className="flex items-center space-x-2">
                  {(() => {
                    const balance = Number(account.credit_balance) || 0;
                    let color = "text-red-600 bg-red-100 border-red-300";
                    let icon = "😨";
                    let flair = "Low";
                    if (balance >= 10000) {
                      color = "text-green-700 bg-green-100 border-green-300";
                      icon = "💎";
                      flair = "";
                    } else if (balance >= 1000) {
                      color = "text-yellow-700 bg-yellow-100 border-yellow-300";
                      icon = "😯";
                      flair = "";
                    }
                    return (
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full border font-bold ${color} shadow-sm transition-all duration-300`}
                        title={`Your current credit balance: ${balance}`}
                      >
                        <span className="mr-1">{icon}</span>
                        {balance.toLocaleString()}
                        <span className="ml-1 text-xs font-normal">
                          Credits
                        </span>
                      </span>
                    );
                  })()}
                </div>
              </Link>
            )}
            <AuthButton />
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchVisible && (
          <div className="px-3 pb-3 md:hidden">
            <div className="relative">
              <input
                type="text"
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#0A84FF] focus:ring-2 focus:ring-[#0A84FF]/20 transition-all outline-none text-sm text-gray-900 placeholder:text-gray-400"
              />
              <svg
                className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default MarketplaceNavigation;
