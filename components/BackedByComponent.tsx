const BackedBy = () => {
  return (
    <div className="relative w-full bg-white shadow-md md:shadow-none">
      <div className="container mx-auto max-w-[1280px]">
        <div className="grid grid-cols-2 md:grid-cols-5 h-auto md:h-[96px] items-center border border-gray-200 divide-y md:divide-y-0 divide-x divide-gray-200">

          <div className="flex justify-center items-center h-[72px] md:h-full">
            <img
              src="/black-forest-labs.png"
              alt="flux"
              className="w-auto max-h-12"
            />
          </div>
          <div className="flex justify-center items-center h-[72px] md:h-full">
            <img
              src="/mistral.webp"
              alt="mistral"
              className="w-auto max-h-12"
            />
          </div>
          <div className="flex justify-center items-center h-[72px] md:h-full">
            <img
              src="ollama.png"
              alt="ollama"
              className="w-auto max-h-12"
            />
          </div>

          <div className="flex justify-center items-center h-[72px] md:h-full">
            <img
              src="/deepseek.png"
              alt="deepseek"
              className="w-auto max-h-12"
            />
          </div>
          <div className="flex justify-center items-center h-[72px] md:h-full">
            <img
              src="/qwen2-5.png"
              alt="qwen2.5"
              className="w-auto max-h-12"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackedBy;
