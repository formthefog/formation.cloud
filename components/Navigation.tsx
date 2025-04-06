"use client";

import { useState, useEffect } from "react";
import FormationLogo from "./icons/FormationLogo";
import { Button } from "./ui/button";
import RightCaret from "./icons/RightCaret";
import Hamburger from "./icons/Hamburger";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Scroll to top when pathname changes
    window.scrollTo(0, 0);
  }, [pathname]);

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

  const handleNavigation = (e, href) => {
    e.preventDefault();
    setIsMenuOpen(false);
    router.push(href);
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
        <div className="flex items-center gap-4">
          <button onClick={toggleMenu} className="md:hidden">
            <Hamburger />
          </button>
          <div className="flex-shrink-0">
            <FormationLogo />
          </div>
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
          <Link 
            href="/marketplace" 
            onClick={(e) => handleNavigation(e, '/marketplace')}
          >
            <Button
              variant="outline"
              size="sm"
            >
              <span className="block sm:hidden">ACCESS</span>
              <span className="hidden sm:block lg:hidden">GO TO MARKETPLACE</span>
              <span className="hidden lg:block">GO TO MARKETPLACE</span>
              <RightCaret />
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-y-0 left-0 w-[280px] bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-6">
            <FormationLogo />
            <button
              onClick={toggleMenu}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex-grow space-y-6">
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Navigation</h3>
              <div className="space-y-1">
                <a
                  href="#features"
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all text-gray-600 hover:bg-gray-50"
                  onClick={(e) => handleSmoothScroll(e, "#features")}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  <span>Features</span>
                </a>
                <a
                  href="#why-formation"
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all text-gray-600 hover:bg-gray-50"
                  onClick={(e) => handleSmoothScroll(e, "#why-formation")}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Why Formation</span>
                </a>
                <a
                  href="#use-cases"
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all text-gray-600 hover:bg-gray-50"
                  onClick={(e) => handleSmoothScroll(e, "#use-cases")}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>Use Cases</span>
                </a>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Access</h3>
              <Link
                href="/marketplace"
                onClick={(e) => handleNavigation(e, '/marketplace')}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-blue-50 text-blue-600 font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Go to Marketplace</span>
              </Link>
            </div>
          </nav>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Navigation;
