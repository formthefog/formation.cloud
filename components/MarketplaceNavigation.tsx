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
        <div className="flex flex-row gap-2 md:gap-8">
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
                      <span className="ml-1 text-xs font-normal">Credits</span>
                    </span>
                  );
                })()}
              </div>
            </Link>
          )}

          <div className="">
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default MarketplaceNavigation;
