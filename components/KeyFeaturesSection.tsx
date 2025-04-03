'use client';

import Image from "next/image";
import RightBottomCorner from "./icons/RightBottomCorner";
import { FaCode, FaPerson, FaStore, FaCoins, FaRobot, FaShieldHalved } from "react-icons/fa6";
import { useRouter } from 'next/navigation';

const MarketplaceHighlight = ({ icon: Icon, title, description }) => {
  const router = useRouter();
  
  return (
    <div 
      className="group relative overflow-hidden flex flex-col items-center p-8 rounded-xl bg-white border border-gray-100 hover:border-formation-blue/20 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg hover:shadow-formation-blue/5"
      onClick={() => router.push('#marketplace')}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-formation-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10">
        <div className="text-5xl text-formation-blue mb-6 transform group-hover:scale-110 transition-transform duration-300">
          <Icon />
        </div>
        <h4 className="text-xl font-bold mb-3 text-center font-hauora tracking-[-0.02em] text-gray-900">{title}</h4>
        <p className="text-base text-gray-600 text-center leading-relaxed">{description}</p>
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
    <section id="features" className="relative bg-white pt-[60px] pb-[120px]">
      <div className="max-w-screen-xl mx-auto">
        <span className="inline-block border border-formation-blue my-12 px-4 py-1 text-sm font-medium uppercase tracking-wider text-formation-blue font-geistMono">
            Launch Features
          </span>
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4">
          {features.map((feature, index) => {
            // Special handling for the first item
            if (index === 0) {
              return (
                <div
                  key={index}
                  className="col-span-1 md:col-span-2 relative flex flex-col items-center border p-[32px] border-b border-black border-opacity-[0.05] gap-[24px] text-left"
                >
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={536}
                    height={368}
                    className="h-[368px] w-full object-cover"
                  />
                  <div className="flex flex-col items-start gap-[12px]">
                    <h3 className="text-lg text-left self-start font-[700] font-hauora tracking-[-0.03em] text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-[16px] leading-[24px] font-inter font-[400] text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                  <RightBottomCorner className="absolute bottom-0 right-0" />
                </div>
              );
            }

            // Special handling for the last two items
            if (index >= features.length - 2) {
              return (
                <div
                  key={index}
                  className="flex flex-col md:flex-row col-span-1 md:col-span-2 items-start gap-4 border p-[32px] border-black border-opacity-[0.05]"
                >
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={96}
                    height={96}
                    className="h-[96px] w-[96px]"
                  />
                  <div className="flex flex-col items-start gap-[12px]">
                    <h3 className="text-lg font-[700] font-hauora text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-[16px] leading-[24px] font-inter font-[400] text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            }

            // Default for middle items
            return (
              <div
                key={index}
                className="flex flex-col gap-[24px] text-left justify-start items-center border-b border-r p-[32px] border-black border-opacity-[0.05]"
              >
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={340}
                  height={368}
                  className="h-[368px] w-full object-cover"
                />
                <div className="flex flex-col items-start gap-[12px]">
                  <h3 className="text-lg text-left self-start font-[700] font-hauora tracking-[-0.03em] text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-[16px] leading-[24px] font-inter font-[400] text-gray-500">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default KeyFeaturesSection;
