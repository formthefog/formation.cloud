"use client";

import { useState, useEffect } from "react";
import FormationLogo from "./icons/FormationLogo";
import { Button } from "./ui/button";
import RightCaret from "./icons/RightCaret";
import Hamburger from "./icons/Hamburger";
import Image from "next/image";
import { useModal } from "@/context/ModalContext";
import Link from "next/link";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openWaitlistModal } = useModal();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const scrolled = window.pageYOffset > 0;
      setIsScrolled(scrolled);

      const sections = document.querySelectorAll("section");
      let currentSection = "";

      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 100;
        if (window.pageYOffset >= sectionTop) {
          currentSection = section.getAttribute("id");
        }
      });

      setActiveSection(currentSection);
    };

    // Call it once on mount to set initial state
    handleScroll();
    
    // Use passive event listener for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop,
        behavior: "smooth",
      });
    }
    setIsMenuOpen(false); // Close menu after clicking a link
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <header
      className={`w-full sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/100 shadow-sm border-b border-gray-200"
          : ""
      }`}
    >
      <div className={`container border-l border-r border-black/5 mx-auto max-w-[1280px] px-6 py-4 flex items-center justify-between ${
        !isScrolled ? "bg-transparent" : ""
      }`}>
        <div className="flex-shrink-0">
          <FormationLogo />
        </div>

        <nav className="hidden md:flex flex-1 text-[13px] justify-evenly leading-[1.5385] tracking-[0.05em] font-geistMono font-[600] items-center">
          <a
            href="#features"
            className={`font-medium uppercase text-gray-600 hover:text-black transition-all ${activeSection === "features"
              ? "text-black underline underline-offset-[8px] decoration-formation-blue decoration-4"
              : ""
              }`}
            onClick={(e) => handleSmoothScroll(e, "#features")}
          >
            Features
          </a>
          <a
            href="#why-formation"
            className={`font-medium uppercase text-gray-600 hover:text-black transition-all ${activeSection === "why-formation"
              ? "text-black underline underline-offset-[8px] decoration-formation-blue decoration-4"
              : ""
              }`}
            onClick={(e) => handleSmoothScroll(e, "#why-formation")}
          >
            Why Formation
          </a>
          <a
            href="#use-cases"
            className={`font-medium uppercase text-gray-600 hover:text-black transition-all ${activeSection === "use-cases"
              ? "text-black underline underline-offset-[8px] decoration-formation-blue decoration-4"
              : ""
              }`}
            onClick={(e) => handleSmoothScroll(e, "#use-cases")}
          >
            Use Cases
          </a>
        </nav>

        <div className="flex items-center space-x-4">
        <Link href="/marketplace">
          <Button
            variant="outline"
            size="sm"
          >
            <span className="block sm:hidden">ACCESS</span>
            <span className="hidden sm:block lg:hidden">ACCESS MARKETPLACE</span>
            <span className="hidden lg:block">ACCESS MARKETPLACE</span>
            <RightCaret />
          </Button>
          </Link>
          <button onClick={toggleMenu} className="md:hidden">
            <Hamburger />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-x-0 border-t text-2xl bottom-0 z-40 bg-white shadow-xl transition-transform h-[50%]  duration-300 ease-in-out transform translate-y-0">

          <Image
            alt="Orb"
            width={75}
            height={75}
            src="/orb.png"
            onClick={toggleMenu}
            className="absolute left-0"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width={30}
            height={30}
            viewBox="0 0 50 50"
            className="absolute right-5 top-5"
            onClick={toggleMenu}
          >
            <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z" />
          </svg>
          <div className="p-8 flex flex-col justify-center h-full space-y-4 text-center">
            <a
              href="#features"
              className="text-gray-800 uppercase font-semibold"
              onClick={(e) => handleSmoothScroll(e, "#features")}
            >
              Features
            </a>
            <a
              href="#why-formation"
              className="text-gray-800 uppercase font-semibold"
              onClick={(e) => handleSmoothScroll(e, "#why-formation")}
            >
              Why Formation
            </a>
            <a
              href="#use-cases"
              className="text-gray-800 uppercase font-semibold"
              onClick={(e) => handleSmoothScroll(e, "#use-cases")}
            >
              Use Cases
            </a>
            <Link href="/marketplace">
            <Button
              className="text-blue-500 font-bold bg-transparent hover:bg-transparent"
              variant="ghost"
            >
              ACCESS MARKETPLACE
            </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navigation;
