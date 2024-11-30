"use client";

import { useState, useEffect } from "react";
import FormationLogo from "./icons/FormationLogo";
import { Button } from "./ui/button";
import RightCaret from "./icons/RightCaret";
import Hamburger from "./icons/Hamburger";
import Link from "next/link";

const Navigation = ({ onLogoClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);

      const sections = document.querySelectorAll("section");
      let currentSection = "";

      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 100; // Adjust offset as needed
        if (window.scrollY >= sectionTop) {
          currentSection = section.getAttribute("id");
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
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
  };

  return (
    <header
      className={`w-full sticky top-0 z-50 transition-all duration-300 ${isScrolled
        ? "bg-white shadow-md border-b"
        : "bg-transparent border-b border-black border-opacity-[0.05]"
        }`}
    >
      <div className="container border-l border-r mx-auto max-w-[1280px] px-6 py-4 flex items-center justify-between">
        <div className="flex-shrink-0" onClick={onLogoClick}>
          <FormationLogo />
        </div>

        <nav className="hidden md:flex flex-1 text-[13px] justify-evenly leading-[1.5385] tracking-[0.05em] font-geistMono font-[600] items-center">
          <a
            href="#features"
            className={`font-medium uppercase text-gray-600 hover:text-black transition-all ${activeSection === "features" ? "text-black underline underline-offset-[8px] decoration-formation-blue decoration-4" : ""
              }`}
            onClick={(e) => handleSmoothScroll(e, "#features")}
          >
            Features
          </a>
          <a
            href="#why-formation"
            className={`font-medium uppercase text-gray-600 hover:text-black transition-all ${activeSection === "why-formation" ? "text-black underline underline-offset-[8px] decoration-formation-blue decoration-4" : ""
              }`}
            onClick={(e) => handleSmoothScroll(e, "#why-formation")}
          >
            Why Formation
          </a>
          <a
            href="#use-cases"
            className={`font-medium uppercase text-gray-600 hover:text-black transition-all ${activeSection === "use-cases" ? "text-black underline underline-offset-[8px] decoration-formation-blue decoration-4" : ""
              }`}
            onClick={(e) => handleSmoothScroll(e, "#use-cases")}
          >
            Use Cases
          </a>
          <a
            href="#ecosystem"
            className={`font-medium uppercase text-gray-600 hover:text-black transition-all ${activeSection === "ecosystem" ? "text-black underline underline-offset-[8px] decoration-formation-blue decoration-4" : ""
              }`}
            onClick={(e) => handleSmoothScroll(e, "#ecosystem")}
          >
            Ecosystem
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <Link target="_blank" href="https://forms.gle/GKWfrVbdD4M3VrMr5">
            <Button variant="outline" size="sm">
              GET STARTED
              <RightCaret />
            </Button>
          </Link>
          <Hamburger className="md:hidden" />
        </div>
      </div>
    </header>
  );
};

export default Navigation;
