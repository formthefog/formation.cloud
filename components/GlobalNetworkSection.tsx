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

  return (
    <section className="relative bg-gray-50 border-b">
      {/* CTA Banner */}
      <div className="max-w-screen-xl mx-auto">
        <div
          style={{
            backgroundImage: "url('/dots-row-2.jpg')",
            backgroundRepeat: "repeat",
            backgroundPosition: "top",
            backgroundSize: "contain",
          }}
          className="relative w-full z-10 container mx-auto max-w-[1280px] border-l border-r h-full border-black border-opacity-[0.05] flex flex-col items-center justify-center text-center"
        >
          <div className="text-center mt-[160px] px-[160px] flex flex-row bg-white w-full">
            <div className="flex flew-row w-full border-l border-r h-full p-[32px]">
              <h2 className="text-4xl font-hauora tracking-[-0.05em] font-[500] text-gray-900 leading-tight">
                Join our global network of<br />builders like{" "}
                <span className={`${selectedPartner.textColor}`}>{selectedPartner.name}</span>.
              </h2>
              <div className="grow" />
              <div className="flex flex-col">
                <div className="grow" />
                <Link target="_blank" href="https://forms.gle/FucLj7e8wksHx6Hx7">
                  <Button variant="outline" size="sm" className="">
                    APPLY AS A PARTNER
                    <RightCaret />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 mt-[5px] sm:grid-cols-6 gap-0 max-w-screen-lg pb-[160px]">
            {partners.map((partner) => {
              const isSelected = selectedPartner.id === partner.id;
              return (
                <div
                  key={partner.id}
                  onClick={() => setSelectedPartner(partner)}
                  className={`w-[160px] h-[160px] relative flex items-center justify-center border border-gray-200 shadow-sm transition-all cursor-pointer ${isSelected
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
