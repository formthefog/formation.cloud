import RightBottomCorner from "./icons/RightBottomCorner";

const WhyFormationSection = () => {
  return (
    <section className="relative bg-white">
      <div className="max-w-screen-xl mx-auto">
        {/* Section Title */}
        <div className="relative w-full z-10 container mx-auto max-w-[1280px] border-l border-r border-b h-full border-black border-opacity-[0.05] flex flex-col items-center justify-center text-center px-[32px] py-[120px] gap-[24px]">
          <span className="inline-block border border-formation-blue px-4 py-1 text-sm font-medium uppercase tracking-wider text-formation-blue font-geistMono">
            Why Formation
          </span>
          <h2 className="text-[56px] max-w-[676px] font-hauora tracking-[-0.05em] font-[500] text-gray-900 leading-[64px]">
            Resilient, distributed, and the future of computing
          </h2>
          <span className="font-inter text-gray-500 tracking-[-0.01em] font-[400]">Learn why Formation is the foundation for next-gen computing.</span>
          <RightBottomCorner className="absolute bottom-0 right-0" />
        </div>
      </div>
    </section>
  );
};

export default WhyFormationSection;
