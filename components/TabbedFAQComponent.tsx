'use client'
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const TabbedFAQComponent = () => {
  const [activeTab, setActiveTab] = useState("cloud");

  const tabs = [
    { id: "cloud", label: "Cloud Computing", icon: "/cloud.jpg", activeIcon: "/cloud-active.jpg" },
    { id: "edge", label: "Edge Computing", icon: "/edge.jpg", activeIcon: "/edge-active.jpg" },
    { id: "fog", label: "Fog Computing", icon: "/fog.jpg", activeIcon: "/fog-active.jpg" },
  ];

  const faqs = {
    cloud: [
      { question: "What is cloud computing?", answer: "Cloud computing is a technology that allows users to access and store data and applications over the Internet instead of on local servers or personal devices." },
      { question: "What are the main drawbacks of cloud computing?", answer: "Cloud computing can face issues with latency, cost, and data security depending on the provider and network setup." },
      { question: "Why hasn't a scalable fog network been built before?", answer: "Fog networks require distributed architecture and low-latency communication, which traditional cloud infrastructure cannot easily provide." },
    ],
    edge: [
      { question: "What is edge computing?", answer: "Edge computing involves processing data closer to the data source or user, reducing latency and improving efficiency." },
      { question: "How does edge computing enhance IoT?", answer: "Edge computing enables IoT devices to process data locally, reducing bandwidth usage and latency for real-time applications." },
    ],
    fog: [
      { question: "What is fog computing?", answer: "Fog computing bridges the gap between cloud and edge computing by distributing resources and services closer to end-users." },
      { question: "How is fog computing different from edge computing?", answer: "Fog computing provides a broader framework that includes edge computing but focuses on integrating devices, systems, and networks." },
    ],
  };

  return (
    <Tabs
      defaultValue="cloud"
      className="w-full max-w-[800px] mx-auto"
      onValueChange={(value) => setActiveTab(value)}
    >
      {/* Tabs List */}
      <TabsList className="flex gap-4 justify-center mb-6">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className={"flex flex-col items-center w-full gap-2 text-sm font-medium"}
          >
            <img
              src={activeTab === tab.id ? tab.activeIcon : tab.icon}
              alt={`${tab.label} Icon`}
              className="w-8 h-8"
            />
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Tabs Content */}
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-4">
          <div className="space-y-4">
            {faqs[tab.id]?.map((faq, index) => (
              <Accordion key={index} type="single" collapsible>
                <AccordionItem value={`item-${index}`} className="border border-gray-200">
                  <AccordionTrigger className="font-medium text-gray-900 text-left text-lg">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-500 text-base mt-2">
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
