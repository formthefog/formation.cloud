import TabbedFAQComponent from "./TabbedFAQComponent";

const FAQSection = () => {
  return (
    <section className="relative hidden md:block bg-white border-b ">
      <div className="max-w-screen-xl flex flex-col mx-auto pb-[48px] md:pb-[160px] border-l border-r">
        <div className="relative w-full z-10 container mx-auto max-w-[1280px]  border h-full border-black border-opacity-[0.05] flex flex-col items-center justify-center text-center px-[32px] py-[48px] md:py-[120px] gap-[24px]">
          <span className="inline-block border border-formation-blue px-4 py-1 text-sm font-medium uppercase tracking-wider text-formation-blue font-geistMono">
            FAQ
          </span>
          <h2 className="text-[32px] md:text-[56px] max-w-[676px] font-hauora tracking-[-0.05em] font-[500] text-gray-900 leading-[40px] md:leading-[64px]">
            Your questions answered
          </h2>
        </div>
        <TabbedFAQComponent />
      </div>
    </section>
  );
};

export default FAQSection;
