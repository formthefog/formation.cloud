'use client';

import BackedBy from "./BackedByComponent";
import RightCaret from "./icons/RightCaret";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useModal } from "@/context/ModalContext";

// Marketplace stats component
const MarketplaceStats = () => (
  <div className="flex flex-wrap justify-center gap-8 md:gap-16 px-8 py-8 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100">
    <div className="text-center">
      <div className="text-4xl font-bold text-gray-900 font-hauora">100+</div>
      <div className="text-sm font-medium text-gray-600 mt-1">AI Agents</div>
    </div>
    <div className="text-center">
      <div className="text-4xl font-bold text-gray-900 font-hauora">10K+</div>
      <div className="text-sm font-medium text-gray-600 mt-1">Daily Users</div>
    </div>
    <div className="text-center">
      <div className="text-4xl font-bold text-gray-900 font-hauora">1M+</div>
      <div className="text-sm font-medium text-gray-600 mt-1">Credits Earned</div>
    </div>
  </div>
);

const HeroSection = ({ title, subtitle, buttonText }: { title: string[]; subtitle: string; buttonText: string }) => {
  const { openWaitlistModal } = useModal();

  return (
    <section
      className="relative w-full h-[75vh] md:h-[90vh] bg-cover bg-top md:bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: "url('/fog.jpg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />
      <div className="relative w-full z-10 container mx-auto max-w-[1280px] px-6 py-8 md:py-16 text-center border-l border-r h-full border-black flex flex-col items-center justify-center border-opacity-[0.05]">
        <div className="flex flex-col items-center">
          <h1 className="text-[56px] md:text-[80px] flex flex-col w-full max-w-[350px] md:max-w-[958px] font-[600] tracking-[-0.05em] font-hauora text-gray-900">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-blue-600 leading-[65px] md:leading-[85px] flex flex-row self-center">
            Discover, Deploy, and Monetize
            </span>
          </h1>
          <p className="mt-4 max-w-[297px] tracking-[-0.01em] leading-[28px] md:max-w-[654px] text-[18px] md:text-[20px] font-inter text-gray-700">
            {subtitle}
          </p>
          <div className="mt-8 flex gap-4">
            <Button
              size="lg"
              className="button-with-gradient text-[16px] px-8 py-6 font-medium"
              onClick={openWaitlistModal}
            >
              {buttonText} <RightCaret />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 hover:bg-gray-50 text-[16px] px-8 py-6 font-medium"
              onClick={() => window.open('#marketplace', '_self')}
            >
              Browse Agents
            </Button>
          </div>
        </div>
      </div>
      <div className="md:-mt-24 w-full max-w-[1280px] m-auto">
        <BackedBy />
      </div>
    </section>
  );
};

export default HeroSection;
