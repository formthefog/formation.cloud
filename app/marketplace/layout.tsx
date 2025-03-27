"use client";

import MarketplaceNavigation from "@/components/MarketplaceNavigation";

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <MarketplaceNavigation />
      {children}
    </div>
  );
} 