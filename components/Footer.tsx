import Image from "next/image";
import { Button } from "./ui/button";
import RightCaret from "./icons/RightCaret";

const Footer = () => {
  return (
    <footer
      className="relative flex flex-col w-full bg-cover bg-top md:bg-center bg-no-repeat "
      style={{ backgroundImage: "url('/city-2.jpg')" }}
    >
      <div className="container pt-16 md:pt-24 mx-auto border-l border-r h-full max-w-[1280px] px-6 text-center">
        <div className="flex flex-col items-center gap-6">
          <span className="flex flex-col items-center justify-center">
            <Image
              alt="Orb"
              width={156}
              height={156}
              src="/orb.png"
              className={""}
            />
            <h2 className="text-4xl md:text-[72px] font-[500] leading-[88px] font-hauora tracking-[-0.05em] ">
              Build and shape the <br className="" /> future of computing.
            </h2>
          </span>

          <div className="mt-8 mb-12">
            <Button size="lg" className="button-with-gradient">
              View Docs <RightCaret />
            </Button>
          </div>
        </div>
      </div>
      <div className="grow" />
      <div className="border-t py-[32px]  text-gray-500 text-sm">
        <div className="container mx-auto max-w-[1280px] px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Footer Links */}
          <nav className="flex flex-wrap gap-4 justify-center md:justify-start">
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
          <p className="text-center md:text-right">
            Formation, Inc © 2024 All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
