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
      description: "Discover and deploy production-ready AI agents instantly from our curated marketplace"
    },
    {
      icon: FaCoins,
      title: "Token Economy",
      description: "Participate in our thriving ecosystem with Formation credits - earn, trade, and utilize"
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
    <section id="features" className="relative bg-white mb-12">
      <div className="max-w-screen-xl mx-auto">
        <div className="relative w-full z-10 container mx-auto max-w-[1280px] border-l border-r border-b h-full border-black/5 flex flex-col items-start px-8 md:px-12 pt-16 pb-20">
          {/* Marketplace Highlights */}
          <div className="w-full mb-20">
            <h2 className="text-4xl md:text-5xl font-hauora tracking-[-0.05em] font-[600] text-gray-900 mb-4 text-center max-w-3xl mx-auto">
              {tagline}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto leading-relaxed">
              Transform your AI innovations into reality on our high-performance network. Experience enterprise-grade security, seamless deployment, and unlimited scaling potential in the new era of decentralized AI.
            </p>
            <div className="flex justify-center gap-4 mb-16">
              <div className="flex items-center gap-2 px-6 py-2 bg-white rounded-lg border border-gray-200">
                <span className="text-2xl font-bold text-gray-900">100+</span>
                <span className="text-sm text-gray-600">AI Agents</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-2 bg-white rounded-lg border border-gray-200">
                <span className="text-2xl font-bold text-gray-900">10K+</span>
                <span className="text-sm text-gray-600">Daily Users</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-2 bg-white rounded-lg border border-gray-200">
                <span className="text-2xl font-bold text-gray-900">1M+</span>
                <span className="text-sm text-gray-600">Credits Earned</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {marketplaceHighlights.map((highlight, index) => (
                <MarketplaceHighlight key={index} {...highlight} />
              ))}
            </div>
          </div>

          {/* Users and Developers columns */}
          <div className="w-full mt-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Users Column */}
              <div className="group flex flex-col gap-6 p-8 rounded-xl bg-gray-50 hover:bg-white transition-all duration-300 border border-gray-100 hover:border-formation-blue/20 hover:shadow-lg hover:shadow-formation-blue/5">
                <h6 className="text-3xl font-hauora tracking-[-0.05em] font-[500] text-gray-900 leading-tight">
                  For Users
                </h6>
                <div className="flex flex-row items-start text-primary gap-6">
                  <div className="w-24 text-6xl text-formation-blue transform group-hover:scale-110 transition-transform duration-300">
                    <FaPerson />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-600 leading-relaxed font-inter text-lg">
                      Access a curated marketplace of production-ready AI agents. Use Formation credits to deploy agents that enhance your productivity and unlock new possibilities.
                    </p>
                  </div>
                </div>
              </div>

              {/* Developers Column */}
              <div className="group flex flex-col gap-6 p-8 rounded-xl bg-gray-50 hover:bg-white transition-all duration-300 border border-gray-100 hover:border-formation-blue/20 hover:shadow-lg hover:shadow-formation-blue/5">
                <h6 className="text-3xl font-hauora tracking-[-0.05em] font-[500] text-gray-900 leading-tight">
                  For Developers
                </h6>
                <div className="flex flex-row items-start text-primary gap-6">
                  <div className="w-24 text-6xl text-formation-blue transform group-hover:scale-110 transition-transform duration-300">
                    <FaCode />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-600 leading-relaxed font-inter text-lg">
                      List your AI agents on our marketplace and earn Formation credits. Reach a global audience while focusing on building innovative solutions.
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
