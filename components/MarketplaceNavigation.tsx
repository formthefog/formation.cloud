"use client";

import { useState, useEffect } from "react";
import FormationLogo from "@/components/icons/FormationLogo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const MarketplaceNavigation = () => {
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
          <span className="hidden md:block text-sm font-medium text-gray-900">Marketplace</span>
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