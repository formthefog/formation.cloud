import Image from "next/image";
import RightBottomCorner from "./icons/RightBottomCorner";
import { FaCode, FaPerson } from "react-icons/fa6";

const KeyFeaturesSection = ({ tagline, features }) => {
  return (
    <section id="features" className="relative bg-white">
      <div className="max-w-screen-xl mx-auto">
        {/* Section Title */}
        <div className="relative w-full z-10 container mx-auto max-w-[1280px] border-l border-r border-b h-full border-black border-opacity-[0.05] flex flex-col items-start px-[40px] pt-[120px] pb-[64px]">
          <span className="inline-block border border-formation-blue px-4 py-1 text-sm font-medium uppercase tracking-wider text-formation-blue font-geistMono">
            Key Features
          </span>

          {/* Users and Developers columns */}
          <div className="w-full mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Users Column */}
              <div className="flex flex-col gap-4">
                <h6 className="text-3xl font-hauora tracking-[-0.05em] font-[100] text-gray-900 leading-tight">
                  For Users
                </h6>
                <div className="flex flex-row justify-center items-center text-primary gap-6">
                  <div className={"w-32 text-5xl"}>
                    <FaPerson />
                  </div>
                  <p className="text-gray-600 leading-relaxed font-inter">
                    Unlock the power of the Autonomous Age with Formation. Deploy cutting-edge agents and AI models to bring your ideas to life quickly and efficiently.
                  </p>
                </div>
              </div>

              {/* Developers Column */}
              <div className="flex flex-col gap-4">
                <h6 className=" text-3xl font-hauora tracking-[-0.05em] font-[100] text-gray-900 leading-tight">
                  For Developers
                </h6>
                <div className="flex flex-row justify-center items-center text-primary gap-6">

                  <div className={"w-32 text-5xl"}>
                    <FaCode />
                  </div>
                  <p className="text-gray-600 leading-relaxed font-inter">
                    Share your innovations with the world. Register your agents and customized models on Formation’s marketplace and start earning from your creations.
                  </p>
                </div>
              </div>
            </div>
          </div>

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
