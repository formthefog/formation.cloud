'use client';

import BackedBy from "./BackedByComponent";
import RightCaret from "./icons/RightCaret";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useModal } from "@/context/ModalContext";
import Link from "next/link";

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
      className="relative w-full h-[90vh] md:h-[90vh] bg-cover bg-top md:bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: "url('/fog.jpg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />
      <div className="relative w-full z-10 container mx-auto max-w-[1280px] px-4 sm:px-6 py-6 md:py-16 text-center border-l border-r h-full border-black flex flex-col items-center justify-center border-opacity-[0.05]">
        <div className="flex flex-col items-center max-w-full">
          <h1 className="text-[32px] sm:text-[64px] md:text-[86px] flex flex-col w-full max-w-[300px] sm:max-w-[650px] md:max-w-[1000px] font-[600] tracking-[-0.05em] font-hauora">
            <span className="bg-gradient-to-r from-formation-blue via-blue-500 to-blue-600 bg-clip-text text-transparent leading-[1.2] md:leading-[1.1] flex flex-row self-center">
              Discover. Deploy.
            </span>
            <span className="bg-gradient-to-r from-formation-blue via-blue-500 to-blue-600 bg-clip-text text-transparent leading-[1.2] md:leading-[1.1] flex flex-row self-center mt-1">
              Monetize.
            </span>
          </h1>
          <div className="h-3 sm:h-4" /> {/* Spacer */}
          <p className="text-[18px] sm:text-[24px] md:text-[28px] text-gray-600 max-w-[280px] sm:max-w-[450px] md:max-w-[600px] font-[500] leading-[1.3]">
            The First Marketplace for Stateless AI Agents
          </p>
          <div className="h-4 sm:h-6" /> {/* Spacer */}
          <p className="mt-0 max-w-[280px] sm:max-w-[450px] md:max-w-[600px] tracking-[-0.01em] leading-[1.5] md:leading-[1.7] text-[15px] sm:text-[18px] md:text-[20px] font-inter text-gray-600">
            Deploy headless AI agents in seconds or monetize your own. Our stateless architecture ensures maximum reliability and instant scalability for both developers and businesses.
          </p>
          <div className="h-8 sm:h-10" /> {/* Spacer */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 sm:px-0">
            <Link href="/marketplace" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-formation-blue via-blue-500 to-blue-600 hover:opacity-90 text-white h-full text-[14px] sm:text-[16px] px-6 sm:px-10 py-5 sm:py-7 font-medium transition-all duration-300 uppercase tracking-wider shadow-lg shadow-blue-500/20"
                onClick={openWaitlistModal}
              >
                GO TO MARKETPLACE <RightCaret className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="md:-mt-24 w-full max-w-[1280px] m-auto px-4 sm:px-0">
        <BackedBy />
      </div>
    </section>
  );
};

export default HeroSection;
