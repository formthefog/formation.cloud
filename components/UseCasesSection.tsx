
import Image from "next/image";
import Dots from "./icons/Dots";

const UseCasesSection = () => {
  const useCases = [
    {
      icon: "/smart-city.jpg",
      title: "Smart Cities",
      description:
        "Empower urban innovation with real-time data processing for smarter infrastructure management. Optimize traffic flow, enhance public safety, and improve energy efficiency with ultra-low latency and reliable connectivity.",
    },
    {
      icon: "/autonomous-vehicle.jpg",
      title: "Autonomous Vehicles",
      description:
        "Drive the future of transportation with ultra-low latency edge processing. Enable split-second decisions for autonomous vehicles, enhancing safety and efficiency in transportation systems.",
    },
    {
      icon: "/ar-game.jpg",
      title: "AR/Gaming",
      description:
        "Create immersive experiences with powerful edge computing. Build applications that respond instantly to user interactions, ideal for gaming, education, and training simulations.",
    },
    {
      icon: "/financial.jpg",
      title: "Financial Services",
      description:
        "Secure transactions with speed through edge processing. Maximize latency and enhance security for real-time trading and fraud detection, improving customer satisfaction and trust in digital financial services.",
    },
  ];

  return (
    <section
      className="relative w-full min-h-[100vh] border  md:h-[85vh] bg-cover bg-top md:bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/fog2.jpg')" }}
    >

      <div className="relative w-full z-10 container mx-auto max-w-[1280px] border-l border-r h-full border-black border-opacity-[0.05] flex flex-col items-start pt-[120px] pb-[64px]">
        <div className="pb-[64px] p-[40px] flex flex-col md:flex-row">
          <div className="flex flex-col grow w-full">
            <div>
              <span className="inline-block relative border border-formation-blue px-4 py-1 text-sm font-medium uppercase tracking-wider text-formation-blue font-geistMono">
                Use Cases
              </span>
            </div >
            <h2 className="mt-4 text-[48px] font-hauora tracking-[-0.05em] font-[500] text-gray-900 leading-tight">
              Powerful solutions for<br />every need with Formation
            </h2>
          </div>
          <p className="mt-4 font-inter leading-[28px] text-lg text-gray-600 self-end">
            Explore how Formation solves real-world challenges for cutting-edge industries utilizing the power of advanced computing.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 w-full mx-auto">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="flex flex-col gap-[72px] relative gap-4 items-start border border-gray-200 bg-white p-[32px] shadow-sm"
            >
              <div className="flex-shrink-0">
                <Image
                  src={useCase.icon}
                  alt={`${useCase.title} icon`}
                  width={80}
                  height={80}
                />
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-hauora font-[700] tracking-[-0.03em] text-[18px]">
                  {useCase.title}
                </h3>
                <p className="mt-2 text-gray-600 text-d[16px] leading-[24px] font-[400]">{useCase.description}</p>
              </div>

              <Dots className="absolute bottom-0 left-0 right-0" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
