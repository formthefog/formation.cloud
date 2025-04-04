'use client';

import Image from "next/image";
import Dots from "./icons/Dots";
import { FaArrowRight } from "react-icons/fa6";
import { useRouter } from 'next/navigation';
import AgentPlayground from "./AgentPlayground";
import Link from "next/link";
import { Button } from './ui/button';
import RightCaret from './icons/RightCaret';

const UseCaseCard = ({ useCase, index }) => {
  const router = useRouter();
  
  const handleClick = () => {
    router.push('/marketplace/agents');
  };

  return (
    <div
      className="flex flex-col gap-[72px] overflow-hidden relative gap-4 items-start border border-gray-200 bg-white p-[32px] shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex-shrink-0 relative">
        <Image
          src={useCase.icon}
          alt={`${useCase.title} icon`}
          width={80}
          height={80}
          className="transition-transform group-hover:scale-105"
        />
        <div className="absolute top-0 right-0 bg-formation-blue text-white text-xs px-2 py-1 rounded">
          Popular
        </div>
      </div>
      <div className="flex flex-col">
        <h3 className="text-lg font-hauora font-[700] tracking-[-0.03em] text-[18px] group-hover:text-formation-blue transition-colors">
          {useCase.title}
        </h3>
        <p className="mt-2 text-gray-600 text-[16px] leading-[24px] font-[400]">
          {useCase.description}
        </p>
        <div className="mt-4 flex items-center text-formation-blue opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="mr-2">Explore agents</span>
          <FaArrowRight size={12} />
        </div>
      </div>
      <Dots className="absolute bottom-0 left-0 right-0" />
    </div>
  );
};

const UseCasesSection = ({ title, subtitle, useCases }) => {
  const router = useRouter();

  return (
    <section
      id="use-cases"
      className="relative w-full bg-cover bg-top md:bg-center bg-no-repeat py-24"
      style={{ backgroundImage: "url('/fog2.jpg')" }}
    >
      <div className="relative w-full z-10 container mx-auto max-w-[1280px] border-l border-r border-black border-opacity-[0.05]">
        <div className="p-[40px] flex flex-col md:flex-row">
          <div className="flex flex-col grow w-full">
            <div>
              <span className="inline-block relative border border-formation-blue px-4 py-1 text-sm font-medium uppercase tracking-wider text-formation-blue font-geistMono">
                Use Cases
              </span>
            </div>
            <h2 className="mt-4 text-4xl md:text-[48px] font-hauora tracking-[-0.05em] font-[500] text-gray-900 leading-tight">
              {title}
            </h2>
          </div>
          <p className="mt-4 font-inter leading-[28px] text-lg text-gray-600 self-end max-w-[500px]">
            {subtitle}
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-6">
          {useCases.map((useCase, index) => (
            <UseCaseCard key={index} useCase={useCase} index={index} />
          ))}
        </div>

        {/* Interactive Demo Section */}
        <div className="mt-16 px-6">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8 border-b border-gray-100">
              <h3 className="text-2xl font-hauora font-[500] text-gray-900 mb-2">
                Try Formation Agents
              </h3>
              <p className="text-gray-600">
                Experience the power of our AI agents through interactive demonstrations.
              </p>
            </div>
            <div className="bg-gray-50">
              <AgentPlayground />
            </div>
          </div>
        </div>

        <div className="w-full text-center mt-12">
          <Link href="/marketplace/agents">
            <Button
              className="inline-flex items-center px-8 py-4 bg-[#0A84FF] text-white rounded-full hover:bg-[#0A84FF]/90 transition-all text-[15px] font-medium uppercase tracking-wide"
            >
              VIEW ALL AGENTS <RightCaret className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
