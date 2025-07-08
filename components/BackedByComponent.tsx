const BackedBy = () => {
  return (
    <div className="relative w-full bg-white shadow-md md:shadow-none">
      <div className="container mx-auto max-w-[1280px]">
        <div className="grid grid-cols-2 md:grid-cols-7 h-auto md:h-[96px] items-center border border-gray-200 divide-y md:divide-y-0 divide-x divide-gray-200">
          <div className="flex justify-center items-center h-[96px] md:h-full">
            <img
              src="/logos/jump2.png"
              alt="Jump"
              className="w-auto max-h-36"
            />
          </div>
          <div className="flex justify-center items-center h-[96px] md:h-full">
            <img
              src="/logos/republic2.png"
              alt="Republic"
              className="w-auto max-h-24"
            />
          </div>
          <div className="flex justify-center items-center h-[96px] md:h-full">
            <img
              src="/logos/big-brain3.png"
              alt="Big Brain"
              className="w-auto max-h-24"
            />
          </div>
          <div className="flex justify-center items-center h-[96px] md:h-full">
            <img
              src="/logos/alpha-dao.png"
              alt="Alpha DAO"
              className="w-auto max-h-24"
            />
          </div>
          <div className="flex justify-center items-center h-[96px] md:h-full">
            <img
              src="/logos/ngc-ventures.png"
              alt="NGC Ventures"
              className="w-auto max-h-16"
            />
          </div>
          <div className="flex justify-center items-center h-[96px] md:h-full">
            <img
              src="/logos/taureon.png"
              alt="Taureon"
              className="w-auto max-h-24"
            />
          </div>
          <div className="flex justify-center items-center h-[96px] md:h-full">
            <img src="/logos/udao.png" alt="UDAO" className="w-auto max-h-24" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackedBy;
