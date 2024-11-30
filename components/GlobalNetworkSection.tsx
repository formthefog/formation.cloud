import Image from "next/image";
import { Button } from "./ui/button";
import RightCaret from "./icons/RightCaret";

const GlobalNetworkSection = () => {
  const partners = [
    { id: 1, icon: "/partner-1.svg", hoverBg: "bg-yellow-300" },
    { id: 2, icon: "/partner-2.svg", hoverBg: "bg-blue-300" },
    { id: 3, icon: "/partner-3.svg", hoverBg: "bg-green-300" },
    { id: 4, icon: "/partner-4.svg", hoverBg: "bg-red-300" },
    { id: 5, icon: "/partner-5.svg", hoverBg: "bg-purple-300" },
    { id: 6, icon: "/partner-6.svg", hoverBg: "bg-pink-300" },
  ];

  return (
    <section
      className="relative bg-white"
    >
      {/* CTA Banner */}
      <div className="max-w-screen-xl mx-auto">
        <div

          style={{
            backgroundImage: "url('/dots-row-2.jpg')",
            backgroundRepeat: "repeat",
            backgroundPosition: "top",
            backgroundSize: "contain",
          }}
          className="relative w-full z-10 container mx-auto max-w-[1280px]  border h-full border-black border-opacity-[0.05] flex flex-col items-center justify-center text-center">
          <div className="text-center mt-[160px] px-[160px] flex flex-row p-[32px] bg-white w-full ">

            <h2 className="text-4xl font-hauora tracking-[-0.05em] font-[500] text-gray-900 leading-tight">
              Join our global network of<br />builders like{" "}
              <span className="text-orange-500">Movement</span>.
            </h2>
            <div className="grow" />
            <div className="flex flex-col">

              <div className="grow" />

              <Button variant="outline" size="sm" className="">
                APPY AS A PARTNER
                <RightCaret />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 mt-[5px] sm:grid-cols-6 gap-0 max-w-screen-lg  pb-[160px]">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="w-[160px] h-[160px] flex items-center justify-center bg-white border border-gray-200 shadow-sm hover:border-gray-300 hover:font-black cursor-pointer"
              >
                test
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalNetworkSection;
