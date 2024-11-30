import Image from "next/image";
import RightBottomCorner from "./icons/RightBottomCorner";

const KeyFeaturesSection = ({ tagline, features }) => {
  return (
    <section id="features" className="relative bg-white">
      <div className="max-w-screen-xl mx-auto">
        {/* Section Title */}
        <div className="relative w-full z-10 container mx-auto max-w-[1280px] border-l border-r border-b h-full border-black border-opacity-[0.05] flex flex-col items-start px-[40px] pt-[120px] pb-[64px]">
          <span className="inline-block border border-formation-blue px-4 py-1 text-sm font-medium uppercase tracking-wider text-formation-blue font-geistMono">
            Key Features
          </span>
          <h2 className="mt-4 text-4xl font-hauora tracking-[-0.05em] font-[500] text-gray-900 leading-tight">
            {tagline}
          </h2>
          <RightBottomCorner className="absolute bottom-0 right-0" />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4">
          {features.map((feature, index) => {
            // Special handling for the first item
            if (index === 0) {
              return (
                <div
                  key={index}
                  className="col-span-1 md:col-span-2 relative flex flex-col items-center border p-[32px] border-b border-black border-opacity-[0.05] gap-[24px] text-left"
                >
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={536}
                    height={368}
                    className="h-[368px] w-full object-cover"
                  />
                  <div className="flex flex-col items-start gap-[12px]">
                    <h3 className="text-lg text-left self-start font-[700] font-hauora tracking-[-0.03em] text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-[16px] leading-[24px] font-inter font-[400] text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                  <RightBottomCorner className="absolute bottom-0 right-0" />
                </div>
              );
            }

            // Special handling for the last two items
            if (index >= features.length - 2) {
              return (
                <div
                  key={index}
                  className="flex flex-col md:flex-row col-span-1 md:col-span-2 items-start gap-4 border p-[32px] border-black border-opacity-[0.05]"
                >
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={96}
                    height={96}
                    className="h-[96px] w-[96px]"
                  />
                  <div className="flex flex-col items-start gap-[12px]">
                    <h3 className="text-lg font-[700] font-hauora text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-[16px] leading-[24px] font-inter font-[400] text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            }

            // Default for middle items
            return (
              <div
                key={index}
                className="flex flex-col gap-[24px] text-left justify-start items-center border-b border-r p-[32px] border-black border-opacity-[0.05]"
              >
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={340}
                  height={368}
                  className="h-[368px] w-full object-cover"
                />
                <div className="flex flex-col items-start gap-[12px]">
                  <h3 className="text-lg text-left self-start font-[700] font-hauora tracking-[-0.03em] text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-[16px] leading-[24px] font-inter font-[400] text-gray-500">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default KeyFeaturesSection;
