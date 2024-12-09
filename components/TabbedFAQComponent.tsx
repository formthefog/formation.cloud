'use client'
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import Image from "next/image";

const TabbedFAQComponent = () => {
  const [activeTab, setActiveTab] = useState("fog");

  const tabs = [
    { id: "fog", label: "Fog Computing", icon: "/wind.png", hoverIcon: "/wind-hover.png", activeIcon: "/wind-active.png" },
    { id: "cloud", label: "Cloud Computing", icon: "/clouds.png", hoverIcon: "/cloud-hover.png", activeIcon: "/cloud-active.png" },
    { id: "edge", label: "Edge Computing", icon: "/zap.png", hoverIcon: "/zap-hover.png", activeIcon: "/zap-active.png" },
  ];

  const faqs = {
    fog: [
      { question: "What is fog computing?", answer: "Fog computing bridges the gap between cloud and edge computing by distributing resources and services closer to end-users." },
      { question: "How is fog computing different from edge computing?", answer: "Fog computing provides a broader framework that includes edge computing but focuses on integrating devices, systems, and networks." },
    ],
    cloud: [
      { question: "What is cloud computing?", answer: "Cloud computing is a technology that allows users to access and store data and applications over the Internet instead of on local servers or personal devices." },
      { question: "What are the main drawbacks of cloud computing?", answer: "Cloud computing can face issues with latency, cost, and data security depending on the provider and network setup." },
      { question: "Why hasn't a scalable fog network been built before?", answer: "Fog networks require distributed architecture and low-latency communication, which traditional cloud infrastructure cannot easily provide." },
    ],
    edge: [
      { question: "What is edge computing?", answer: "Edge computing involves processing data closer to the data source or user, reducing latency and improving efficiency." },
      { question: "How does edge computing enhance IoT?", answer: "Edge computing enables IoT devices to process data locally, reducing bandwidth usage and latency for real-time applications." },
    ],
  };


  const FormationTabTrigger = ({ iconUrl, activeIconUrl, activeTab, label, id }: { iconUrl: string; activeIconUrl: string; activeTab: string; label: string, id: string }) => {
    const isActive = activeTab === id;
    return (
      <TabsTrigger
        value={id}
        className={cn("flex md:min-w-[320px] flex-row group border first:border-r-0 [&:nth-child(2)]:border-r-0 last:border-r-1 justify-center p-[16px] rounded-none items-center w-full gap-2 text-sm font-geistMono  uppercase bg-gray-50 font-medium text-gray-600")}
      >
        <div className="relative w-[40px] h-[40px] flex flex-col items-center justify-center">
          <div className={cn("border absolute group-hover:border-formation-blue   w-[40px] h-[40px] border-gray-400", activeTab === id ? "bg-formation-blue border-formation-blue" : "")} style={{ backgroundImage: `url("/Grid.png")`, backgroundSize: "cover" }}></div>
          <Image src={isActive ? activeIconUrl : iconUrl} alt={label} width={20} height={20} className="z-10" />
        </div>
        {label}
      </TabsTrigger>)
  }

  const CLosedCaretIcon = ({ className }: { className?: string }) => {
    return (
      <svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <rect x={8} y={5} width={2} height={2} fill="#2970FF" />
        <rect x={11} y={8} width={2} height={2} fill="#2970FF" />
        <rect x={14} y={11} width={2} height={2} fill="#2970FF" />
        <rect x={11} y={14} width={2} height={2} fill="#2970FF" />
        <rect x={8} y={17} width={2} height={2} fill="#2970FF" />
      </svg>

    )
  }

  return (
    <Tabs
      defaultValue="fog"
      className="w-full max-w-[960px] pt-12 mx-auto"
      onValueChange={(value) => setActiveTab(value)}
    >
      {/* Tabs List */}
      <TabsList className="flex flex-col md:flex-row justify-center">
        {tabs.map((tab) => (
          <FormationTabTrigger iconUrl={tab.icon} activeIconUrl={tab.activeIcon} activeTab={activeTab} label={tab.label} id={tab.id} key={tab.icon} />)
        )}
      </TabsList>

      {/* Tabs Content */}
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-4 w-full">
          <div className="w-full grow">
            {faqs[tab.id]?.map((faq, index) => (
              <Accordion key={index} type="single" collapsible className="w-full">
                <AccordionItem value={`item-${index}`} className="border-l border-r p-[24px] grow w-full border-gray-200">
                  <AccordionTrigger className="font-[600] font-hauora text-gray-900 text-left text-lg">
                    <CLosedCaretIcon className={"rotate-90"} />
                    {faq.question}
                    <div className="grow" />
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-500 ml-10 text-base mt-2">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default TabbedFAQComponent;
