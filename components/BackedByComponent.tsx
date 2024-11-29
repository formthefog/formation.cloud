const BackedBy = () => {
  return (
    <div className="relative w-full bg-white shadow-md md:shadow-none">
      <div className="container mx-auto max-w-[1280px]">
        <div className="grid grid-cols-2 md:grid-cols-5 h-auto md:h-[96px] items-center border border-gray-200 divide-y md:divide-y-0 divide-x divide-gray-200">
          {/* Backed By Title */}
          <div className="md:col-span-1 col-span-2 flex py-8 md:py-inherit justify-center items-center h-[48px] md:h-full">
            <h2 className="text-sm md:text-md text-[12px] font-medium uppercase text-gray-600 tracking-[0.05em]">
              Backed By
            </h2>
          </div>

          <div className="flex justify-center items-center h-[72px] md:h-full">
            <img
              src="/logos/republic.png"
              alt="Republic"
              className="w-auto max-h-12"
            />
          </div>
          <div className="flex justify-center items-center h-[72px] md:h-full">
            <img
              src="/logos/big-brain.png"
              alt="Big Brain Holdings"
              className="w-auto max-h-12"
            />
          </div>
          <div className="flex justify-center items-center h-[72px] md:h-full">
            <img
              src="/logos/jump.png"
              alt="Jump"
              className="w-auto max-h-12"
            />
          </div>
          <div className="flex justify-center items-center h-[72px] md:h-full">
            <img
              src="/logos/ngc.png"
              alt="NGC Ventures"
              className="w-auto max-h-12"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackedBy;
