"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import RightCaret from "./icons/RightCaret";
import { useModal } from "@/context/ModalContext";
import Link from "next/link";
import BackedBy from "./BackedByComponent";

const Footer = ({ headline, buttonText }) => {
  const { openWaitlistModal } = useModal();

  return (
    <footer
      className="relative flex flex-col min-h-[60vh] w-full bg-cover bg-top md:bg-center bg-no-repeat justify-center items-center"
      style={{ backgroundImage: "url('/city-2.jpg')" }}
    >
      <div className="container grow flex flex-col justify-center grow pb-24 mx-auto border-l border-r h-full max-w-[1280px] px-6 text-center">
        <div className="flex flex-col items-center gap-6">
          <h6 className="text-xl md:text-[33px] font-[500] md:leading-[88px] font-hauora tracking-[-0.05em]">
            Supported By:
          </h6>
          <BackedBy />
          <div className="mt-8 mb-12">
            <div onClick={openWaitlistModal}>
              <Button size="lg" className="button-with-gradient">
                {buttonText} <RightCaret />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="grow" />
      <div className="border-t border-black border-opacity-[8%] py-[32px]  text-gray-600 font-geistMono text-sm">
        <div className="container mx-auto max-w-[1280px] leading-[0.05em] px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Footer Links */}
          <nav className="flex flex-wrap uppercase gap-4 justify-center md:justify-start">
            <a href="#" className="hover:text-gray-700 transition-colors">
              Home
            </a>
            <a href="#" className="hover:text-gray-700 transition-colors">
              Docs
            </a>
            <a href="#" className="hover:text-gray-700 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-gray-700 transition-colors">
              Privacy Policy
            </a>
          </nav>
          {/* Footer Text */}
          <p className="text-center uppercase md:text-right">
            Formation, Inc © 2024 All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
