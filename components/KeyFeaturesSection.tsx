import Image from "next/image";
import RightBottomCorner from "./icons/RightBottomCorner";

const KeyFeaturesSection = () => {
  return (
    <section className="relative bg-white mb-64">
      <div className="max-w-screen-xl mx-auto">
        {/* Section Title */}
        <div className="relative w-full z-10 container mx-auto max-w-[1280px] border-l border-r border-b h-full border-black border-opacity-[0.05] flex flex-col items-start px-[40px] pt-[120px] pb-[64px]">
          <span className="inline-block border border-formation-blue px-4 py-1 text-sm font-medium uppercase tracking-wider text-formation-blue font-geistMono">
            Key Features
          </span>
          <h2 className="mt-4 text-4xl font-hauora tracking-[-0.05em] font-[500] text-gray-900 leading-tight">
            Unmatched speed, security, and<br />scalability for modern computing
          </h2>
          <RightBottomCorner className="absolute bottom-0 right-0" />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2 relative flex flex-col items-center border p-[32px] border-b border-black border-opacity-[0.05] gap-[24px] text-left">
            <Image
              src="/uptime.jpg"
              alt="100% Uptime Guarantee"
              width={536}
              height={368}
              className="h-[368px] w-full object-cover"
            />
            <div className="flex flex-col items-start gap-[12px]">
              <h3 className="text-lg text-left self-start font-[700] font-hauora tracking-[-0.03em] text-gray-900">
                100% Uptime Guarantee
              </h3>
              <p className="text-[16px] leading-[24px] font-inter font-[400] text-gray-500">
                Powerful, self-serve product and growth analytics to help you convert, engage, and retain more users.
              </p>
            </div>

            <RightBottomCorner className="absolute bottom-0 right-0" />
          </div>
          <div className="flex flex-col gap-[24px] text-left justify-start items-center border-b border-r p-[32px] border-black border-opacity-[0.05]">
            <Image
              src="/latency.jpg"
              alt="Low Latency"
              width={340}
              height={368}
              className="h-[368px] w-full object-cover"
            />

            <div className="flex flex-col items-start gap-[12px]">
              <h3 className="text-lg text-left self-start font-[700] font-hauora tracking-[-0.03em] text-gray-900">
                Low Latency
              </h3>
              <p className="text-[16px] leading-[24px] font-inter font-[400] text-gray-500">
                Faster response times from the near edge enhance user experience,
                driving growth and engagement.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-[24px] text-left justify-start items-center border-b border-r p-[32px] border-black border-opacity-[0.05]">
            <Image
              src="/cost.jpg"
              alt="Cost Savings"
              width={340}
              height={368}
              className="h-[368px] w-full object-cover"
            />

            <div className="flex flex-col items-start gap-[12px]">
              <h3 className="text-lg text-left self-start font-[700] font-hauora tracking-[-0.03em] text-gray-900">
                Cost Savings
              </h3>
              <p className="text-[16px] leading-[24px] font-inter font-[400] text-gray-500">
                Enjoy significant savings with Fog pricing as low as $0.004 vCPU/GB/hr,
                compared to traditional Cloud costs.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row col-span-1 md:col-span-2 items-start gap-4 border p-[32px] border-black border-opacity-[0.05]">
            <Image
              src="/scalability.jpg"
              alt="Scalability Icon"
              width={96}
              height={96}
              className="h-[96px] w-[96px]"
            />
            <div>
              <h3 className="text-lg font-[700] font-hauora text-gray-900">
                Scalability
              </h3>
              <p className="mt-1 text-[16px] leading-[24px] font-inter font-[400] text-gray-500">
                Powerful, self-serve product and growth analytics to help you convert,
                engage, and retain more users.
              </p>
            </div>
          </div>
          <div className="flex  flex-col md:flex-row relative col-span-1 md:col-span-2 items-start gap-4 border p-[32px] border-black border-opacity-[0.05]">
            <Image
              src="/sovereignty.jpg"
              alt="Data Sovereignty Icon"
              width={96}
              height={96}
              className="h-[96px] w-[96px]"
            />
            <div>
              <h3 className="text-lg font-[700] font-hauora text-gray-900">
                Data Sovereignty
              </h3>
              <p className="mt-1 text-[16px] leading-[24px] font-inter font-[400] text-gray-500">
                Powerful, self-serve product and growth analytics to help you convert,
                engage, and retain more users.
              </p>
            </div>

            <RightBottomCorner className="absolute bottom-0 right-0" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default KeyFeaturesSection;
