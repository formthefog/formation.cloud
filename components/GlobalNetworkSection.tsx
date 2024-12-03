'use client'
import { useState } from "react";
import { Button } from "./ui/button";
import RightCaret from "./icons/RightCaret";
import Image from "next/image";
import RightBottomCorner from "./icons/RightBottomCorner";
import LeftTopCorner from "./icons/LeftTopCorner";
import Link from "next/link";

const GlobalNetworkSection = () => {
  const partners = [
    { id: 1, name: "Swell", icon: "/logos/swell.png", dotsLogo: "/logos/swell-dots.png", hoverBg: "bg-[#2E64EB]", textColor: "text-[#2E64EB]" },
    { id: 2, name: "Movement", icon: "/logos/movement.png", dotsLogo: "/logos/movement-dots.png", hoverBg: "bg-[#F2BB15]", textColor: "text-[#F2BB15]" },
    { id: 3, name: "Parasail", icon: "/logos/parasail.png", dotsLogo: "/logos/parasail-dots.png", hoverBg: "bg-[#326EEB]", textColor: "text-[#326EEB]" },
    { id: 4, name: "Avail", icon: "/logos/avail.png", dotsLogo: "/logos/avail-dots.png", hoverBg: "bg-[#2CBBF9]", textColor: "text-[#2CBBF9]" },
    { id: 5, name: "Kintsu", icon: "/logos/kintsu.png", dotsLogo: '/logos/kintsu-dots.png', hoverBg: "bg-[#19F3E5]", textColor: "text-[#19F3E5]" },
    { id: 6, name: "Switchboard", icon: "/logos/switchboard.png", dotsLogo: '/logos/switchboard-dots.png', hoverBg: "bg-[#252444]", textColor: "text-[#252444]" },
  ];

  const [selectedPartner, setSelectedPartner] = useState(partners[0]);


  const renderGrid = () => {
    const rows = 10; // Adjust for desired height
    const cols = 10; // Adjust for desired width
    const grid = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        grid.push(
          <div
            key={`${row}-${col}`}
            className="w-[158px] h-[158px] border border-gray-200"
            style={{
              position: "absolute",
              top: `${row * 160}px`,
              left: `${col * 160}px`,
              backgroundImage: "url('/bg.png')",
              backgroundRepeat: "repeat", // Repeat the pattern
              backgroundPosition: "top", // Align with the top of the container
              backgroundSize: "160px 160px", // Match the grid size exactly
            }}
          />
        );
      }
    }
    return grid;
  };

  return (
    <section id="ecosystem" className="relative bg-gray-50 border-b overflow-hidden">
      <div className="max-w-screen-xl mx-auto">
        <div
          className="relative w-full z-10 overflow-hidden container mx-auto max-w-[1280px] border-l border-r h-full border-black border-opacity-[0.05] flex flex-col items-center justify-center text-center"
        >

          <div className="absolute inset-0 z-1">
            {renderGrid()}
          </div>
          <div className="text-center mt-[160px] md:px-[160px] w-full flex flex-col z-10 w-full">
            <div className="flex flex-col md:flex-row md:text-left w-full grow border-l bg-white border-r h-full p-[32px]">
              <h2 className="text-4xl text-center md:text-left font-hauora w-full tracking-[-0.05em] font-[500] text-gray-900 leading-tight">
                <span className="">Join our global network<br /> of builders like </span>
                <span className={`${selectedPartner.textColor}`}>{selectedPartner.name}</span>.
              </h2>
              <div className="grow" />
              <div className="flex flex-col">
                <div className="grow" />
                <Link target="_blank" className="my-6 md:my-0" href="https://forms.gle/P9ArBkZTLcLiQt3GA">
                  <Button variant="outline" size="sm" className="">
                    APPLY AS A PARTNER
                    <RightCaret />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3  lg:grid-cols-6 gap-0 max-w-screen-lg pb-[160px]">
            {partners.map((partner) => {
              const isSelected = selectedPartner.id === partner.id;
              return (
                <div
                  key={partner.id}
                  onClick={() => setSelectedPartner(partner)}
                  className={`md:w-[160px] md:h-[160px] p-8 w-full relative flex items-center justify-center border border-gray-200 shadow-sm transition-all cursor-pointer ${isSelected
                    ? `${partner.hoverBg} font-black`
                    : "bg-white hover:bg-gray-300 hover:font-black"
                    }`}
                >
                  {isSelected &&
                    <LeftTopCorner className="absolute left-0 top-0" />
                  }
                  <Image
                    height={72}
                    width={72}
                    src={isSelected ? partner.icon : partner.dotsLogo}
                    alt={partner.name}
                    className={`transition-all ${isSelected ? "" : ""
                      }`}
                  />
                  {isSelected &&
                    <RightBottomCorner className="absolute bottom-0 right-0" />
                  }
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalNetworkSection;
