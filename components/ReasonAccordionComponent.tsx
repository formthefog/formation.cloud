'use client';

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";

interface ReasonAccordionItemProps {
  title: string;
  index: string;
  content: string;
  value: string;
  active: boolean;
  imageSrc: string;
}

const ReasonAccordionItem: React.FC<ReasonAccordionItemProps> = ({
  title,
  index,
  content,
  value,
  active,
  imageSrc,
}) => {
  return (
    <AccordionItem
      value={value}
      className={`pl-10 bg-white border ${active ? "" : "border-[#EAECF0]"
        }`}
    >
      <AccordionTrigger className="font-hauora p-8 pl-0 text-[24px] text-left no-underline">
        <div className="flex items-center justify-start gap-3 font-hauora font-medium">
          <span
            className={`text-[12px] w-[36px] h-[26px] font-geistMono flex items-center justify-center px-[8px] ${active
              ? "bg-blue-600 text-white"
              : "text-gray-400 border border-gray-400"
              }`}
          >
            {index}
          </span>
          <span>
            <span
              className={`${active ? "text-black" : "text-gray-400"}`}
            >
              For
            </span>{" "}
            {title}
          </span>
        </div>
      </AccordionTrigger>

      <AccordionContent className="font-inter text-gray-500 tracking-[-0.01em] text-[18px] pr-10 pb-[32px]">
        <p>{content}</p>
        {/* Image for Mobile */}
        <div className="mt-4 md:hidden">
          <Image
            src={imageSrc}
            alt={`${title} illustration`}
            width={864}
            height={798}
            className="w-full h-auto object-contain"
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

const ReasonAccordionComponent = () => {
  const [activeItem, setActiveItem] = useState<string | null>("item-1");

  const items = [
    {
      title: "Developers",
      index: "01",
      content:
        "Your time and effort is valuable, capture that value while contributing to the Autonomous Age with Formations Agent & Model Marketplace.",
      value: "item-1",
      imageSrc: "/developers.jpg",
    },
    {
      title: "Businesses",
      index: "02",
      content:
        "Your organization is ready to be supercharged, find the agents you need to increase productivity by multiple orders of magnitude in the Formation marketplace.",
      value: "item-2",
      imageSrc: "/businesses.jpg",
    },
    {
      title: "Individuals",
      index: "03",
      content:
        "Research, automate, build and scale in a fraction of the time at a fraction of the cost, it’s never been easier to accomplish your goals, whether getting the best deal on your upcoming trip, or building the app you’ve been thinking of for years.",
      value: "item-3",
      imageSrc: "/blockchain.jpg",
    },
  ];

  return (
    <div
      className="flex border-l border flex-col md:flex-row"
      style={{ backgroundImage: "url('/grid.png')" }}
    >
      {/* Accordion */}
      <Accordion
        type="single"
        defaultValue="item-1" // Ensure one item is always open
        className="w-full md:w-1/2"
        onValueChange={(value) => setActiveItem(value)}
      >
        {items.map((item) => (
          <ReasonAccordionItem
            key={item.value}
            title={item.title}
            index={item.index}
            content={item.content}
            value={item.value}
            active={activeItem === item.value}
            imageSrc={item.imageSrc}
          />
        ))}
      </Accordion>

      <div className="hidden md:flex w-1/2 py-[80px] justify-center items-center border-r">
        {activeItem && (
          <Image
            width={864}
            height={798}
            src={items.find((item) => item.value === activeItem)?.imageSrc || ""}
            alt="Dynamic Content"
            className="w-full h-auto object-contain m-auto"
          />
        )}
      </div>
    </div>
  );
};

export default ReasonAccordionComponent;
