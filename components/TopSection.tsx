'use client';

import Image from "next/image";
import RightBottomCorner from "./icons/RightBottomCorner";
import { FaCode, FaPerson, FaStore, FaCoins, FaRobot, FaShieldHalved } from "react-icons/fa6";
import { useRouter } from 'next/navigation';

const MarketplaceHighlight = ({ icon: Icon, title, description }) => {
  const router = useRouter();
  
  return (
    <div 
      className="group relative overflow-hidden flex flex-col items-center p-6 sm:p-8 rounded-none bg-white border border-gray-100 hover:border-formation-blue/20 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg hover:shadow-formation-blue/5"
      onClick={() => router.push('#marketplace')}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-formation-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10 w-full">
        <div className="text-4xl sm:text-5xl text-formation-blue mb-4 sm:mb-6 transform group-hover:scale-110 transition-transform duration-300 flex justify-center">
          <Icon />
        </div>
        <h4 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-center font-hauora tracking-[-0.02em] text-gray-900">{title}</h4>
        <p className="text-sm sm:text-base text-gray-600 text-center leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

const KeyFeaturesSection = ({ tagline, features }) => {
  const marketplaceHighlights = [
    {
      icon: FaStore,
      title: "Agent Marketplace",
      description: "Be among the first to discover and deploy AI agents in our curated marketplace"
    },
    {
      icon: FaCoins,
      title: "Token Economy",
      description: "Join our early access program and help shape the future of AI agent monetization"
    },
    {
      icon: FaRobot,
      title: "Agent Development",
      description: "Build, test, and monetize your AI agents with our enterprise-grade development tools"
    },
    {
      icon: FaShieldHalved,
      title: "Secure Platform",
      description: "Enterprise-level security and compliance for all marketplace transactions"
    }
  ];

  return (
    <section id="features" className="relative bg-white pt-[40px] sm:pt-[60px] pb-[48px] sm:pb-[64px]">
      <div className="max-w-screen-xl mx-auto">
        <div className="relative w-full z-10 container mx-auto max-w-[1280px] border-l border-r border-b h-full border-black/5 flex flex-col items-start px-4 sm:px-8 md:px-12 pt-12 sm:pt-16 pb-16 sm:pb-20">
          {/* Marketplace Highlights */}
          <div className="w-full mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-hauora tracking-[-0.05em] font-[600] text-gray-900 mb-4 text-center max-w-3xl mx-auto px-4 sm:px-0">
              {tagline}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 text-center mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-6 sm:px-0">
              Be among the first to transform your AI innovations into reality. Experience enterprise-grade security, seamless deployment, and unlimited scaling potential in the new era of decentralized AI.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-6 sm:px-0">
              <div className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-2 bg-white rounded-none border border-gray-200 w-full sm:w-auto">
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">0%</span>
                <span className="text-xs sm:text-sm text-gray-600">Platform Fee at Launch</span>
              </div>
              <div className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-2 bg-white rounded-none border border-gray-200 w-full sm:w-auto">
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">24/7</span>
                <span className="text-xs sm:text-sm text-gray-600">Developer Support</span>
              </div>
              <div className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-2 bg-white rounded-none border border-gray-200 w-full sm:w-auto">
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">80%</span>
                <span className="text-xs sm:text-sm text-gray-600">Revenue Share</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 px-6 sm:px-0">
              {marketplaceHighlights.map((highlight, index) => (
                <MarketplaceHighlight key={index} {...highlight} />
              ))}
            </div>
          </div>

          {/* Users and Developers columns */}
          <div className="w-full mt-12 sm:mt-16 px-6 sm:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-12">
              {/* Users Column */}
              <div className="group flex flex-col gap-4 sm:gap-6 p-6 sm:p-8 rounded-none bg-gray-50 hover:bg-white transition-all duration-300 border border-gray-100 hover:border-formation-blue/20 hover:shadow-lg hover:shadow-formation-blue/5">
                <h6 className="text-2xl sm:text-3xl font-hauora tracking-[-0.05em] font-[500] text-gray-900 leading-tight">
                  For Users
                </h6>
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-primary gap-4 sm:gap-6">
                  <div className="w-14 sm:w-16 md:w-24 text-4xl sm:text-5xl md:text-6xl text-formation-blue transform group-hover:scale-110 transition-transform duration-300">
                    <FaPerson />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-600 leading-relaxed font-inter text-sm sm:text-base md:text-lg text-center sm:text-left">
                      Be among the first to access our marketplace of AI agents. Use Formation credits to deploy agents that enhance your productivity and unlock new possibilities.
                    </p>
                  </div>
                </div>
              </div>

              {/* Developers Column */}
              <div className="group flex flex-col gap-4 sm:gap-6 p-6 sm:p-8 rounded-none bg-gray-50 hover:bg-white transition-all duration-300 border border-gray-100 hover:border-formation-blue/20 hover:shadow-lg hover:shadow-formation-blue/5">
                <h6 className="text-2xl sm:text-3xl font-hauora tracking-[-0.05em] font-[500] text-gray-900 leading-tight">
                  For Developers
                </h6>
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-primary gap-4 sm:gap-6">
                  <div className="w-14 sm:w-16 md:w-24 text-4xl sm:text-5xl md:text-6xl text-formation-blue transform group-hover:scale-110 transition-transform duration-300">
                    <FaCode />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-600 leading-relaxed font-inter text-sm sm:text-base md:text-lg text-center sm:text-left">
                      Join our early access program and help shape the future of AI agents. List your agents on our marketplace and earn Formation credits while building innovative solutions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <RightBottomCorner className="absolute bottom-0 right-0" />
        </div>
      </div>
    </section>
  );
};

export default KeyFeaturesSection;
