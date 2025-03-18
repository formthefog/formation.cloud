'use client';

import BackedBy from "./BackedByComponent";
import RightCaret from "./icons/RightCaret";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useModal } from "@/context/ModalContext";

const HeroSection = ({ title, subtitle, buttonText }: { title: string[]; subtitle: string; buttonText: string }) => {
  const { openWaitlistModal } = useModal();

  return (
    <section
      className="relative w-full h-[55vh] md:h-[85vh] bg-cover bg-top md:bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/fog.jpg')" }}
    >
      <div className="relative w-full z-10 container mx-auto max-w-[1280px] px-6 py-8 md:py-16 text-center border-l border-r h-full border-black flex flex-col items-center justify-center border-opacity-[0.05]">
        <div className="flex flex-col items-center">
          <h1 className="text-[56px] md:text-[80px] flex flex-col w-full max-w-[350px] md:max-w-[958px] font-[500] tracking-[-0.05em] font-hauora text-gray-900">
            {title.map((text, index) => (
              <span key={index} className={cn("flex leading-[60px] md:leading-[85px] flex-row self-center")}>{text}</span>
            ))}
          </h1>
          <p className="mt-4 max-w-[297px] tracking-[-0.01em] leading-[28px] md:max-w-[654px] text-[18px] md:text-[20px] font-inter text-gray-700">
            {subtitle}
          </p>
          <div className="mt-8">
            <Button
              size="lg"
              className="button-with-gradient"
              onClick={openWaitlistModal}
            >
              {buttonText} <RightCaret />
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
