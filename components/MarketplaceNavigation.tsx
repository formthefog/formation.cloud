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
      className={`w-[100vw] sticky top-0 z-40 transition-all left-0 right-0 duration-300 ${
        isScrolled
          ? "bg-white shadow-sm border-b border-gray-200"
          : "bg-white border-b border-gray-200"
      }`}
    >
      <div className="px-3 md:px-6 flex flex-row justify-center py-4 md:py-4 items-center w-full">
        <div className="flex flex-row gap-2 items-center justify-center md:gap-8">
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
            <FormationLogo />
          </Link>
          <span className="hidden md:block text-sm font-bold text-gray-300">
            MARKETPLACE
          </span>
        </div>
        <div className="grow" />
        <div className="flex items-center gap-2 md:gap-2">
          {user && account && (
            <Link href="/marketplace/settings">
              <div className="flex items-center space-x-2">
                <CreditBadge account={account} />
              </div>
            </Link>
          )}

          <div className="pr-8">
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
};

function CreditBadge({ account }) {
  const balance = Number(account?.credit_balance) || 0;

  // Configure badge appearance based on balance
  let color, icon, textSize;

  if (balance >= 10000) {
    color = "text-green-700 bg-green-100 border-green-300";
    icon = "💎";
  } else if (balance >= 1000) {
    color = "text-yellow-700 bg-yellow-100 border-yellow-300";
    icon = "😯";
  } else {
    color = "text-red-600 bg-red-100 border-red-300";
    icon = "😨";
  }

  // For very small screens, if the number is large, we may need smaller text
  if (balance >= 10000) {
    textSize = "text-sm sm:text-base";
  } else {
    textSize = "text-base";
  }

  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2.5 py-1 rounded-full 
        border ${color} shadow-sm transition-all duration-300 
        ${textSize} whitespace-nowrap
      `}
      title={`Your current credit balance: ${balance.toLocaleString()}`}
    >
      <span className="flex-shrink-0 mr-0.5">{icon}</span>
      <span className="font-bold">{balance.toLocaleString()}</span>
      <span className="hidden sm:inline text-xs font-normal ml-0.5">
        Credits
      </span>
    </span>
  );
}

export default MarketplaceNavigation;
