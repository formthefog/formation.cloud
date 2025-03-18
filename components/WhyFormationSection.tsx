import RightBottomCorner from "./icons/RightBottomCorner";
import ReasonAccordionComponent from "./ReasonAccordionComponent";

const WhyFormationSection = ({ title, subtitle, description }) => {
  return (
    <section id="why-formation" className="relative bg-white border-t">
      <div className="max-w-screen-xl mx-auto">
        <div className="relative w-full z-10 container mx-auto max-w-[1280px] border-l border-r h-full border-black border-opacity-[0.05] flex flex-col items-center justify-center text-center px-[32px] pt-[120px] pb-[64px] gap-[24px]">
          <span className="inline-block border border-formation-blue px-4 py-1 text-sm font-medium uppercase tracking-wider text-formation-blue font-geistMono">
            {subtitle}
          </span>
          <h2 className="text-[32px] md:text-[56px] max-w-[676px] font-hauora tracking-[-0.05em] font-[500] text-gray-900 leading-[40px] md:leading-[64px]">
            {title}
          </h2>
          <span className="font-inter max-w-md text-gray-500 tracking-[-0.01em] font-[400]">
            {description}
          </span>
          <RightBottomCorner className="absolute bottom-0 right-0" />
        </div>
        <ReasonAccordionComponent />
      </div>
    </section>
  );
};

export default WhyFormationSection;
