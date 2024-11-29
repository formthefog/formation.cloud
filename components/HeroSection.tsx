import BackedBy from "./BackedByComponent";
import LeftCorner from "./icons/LeftCorner";
import RightCaret from "./icons/RightCaret";
import { Button } from "./ui/button";

const HeroSection = () => {
  return (
    <section
      className="relative w-full h-[55vh] md:h-[85vh] bg-cover bg-top md:bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/fog.jpg')" }}
    >
      <div className="relative w-full z-10 container mx-auto max-w-[1280px] px-6 py-8 md:py-16 text-center border-l border-r h-full border-black flex flex-col items-center  border-opacity-[0.05] ">
        <h1 className="text-[56px] md:text-[120px] flex flex-col pt-3 md:pt-12 w-full max-w-[350px] md:max-w-[958px] font-[500] tracking-[-0.05em] font-hauora text-gray-900">

          <LeftCorner className="self-start -mb-4 md:-mb-12" />
          <span className="flex flex-row mb-[-20px]">Cloud Scale,</span>
          <span className="flex flex-row self-end">Edge Speed.</span>
        </h1>
        <p className="mt-4 max-w-[297px] tracking-[-0.01em] leading-[28px] md:max-w-[654px] text-[18px] md:text-[20px] font-inter text-gray-700">
          Formation is the foundation for the next generation of computing. A world where computing power is distributed, secure, and always available.
        </p>
        <div className="mt-8 mb-12">
          <Button size="lg" className="button-with-gradient">
            View Docs <RightCaret />
          </Button>
        </div>
      </div>

      <div className="md:-mt-24 w-full max-w-[1280px] m-auto">
        <BackedBy />
      </div>
    </section>
  );
};

export default HeroSection;
