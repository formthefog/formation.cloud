import { DollarSign, Users, TrendingUp } from "lucide-react";

export default function MonetizationBanner() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-blue-100 via-green-50 to-blue-50 border border-blue-200 rounded-xl p-5 md:p-6 mt-12 mb-8 gap-4 md:gap-0 shadow-md">
      <div className="flex items-start md:items-center md:mr-6 gap-4">
        <div className="flex-shrink-0 relative">
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-green-300/70 to-blue-300/70 backdrop-blur-md shadow-inner">
            <DollarSign className="w-7 h-7 text-white" />
          </span>
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-400 flex items-center justify-center text-xs text-white font-bold">
            +
          </span>
        </div>
        <div className="text-left">
          <span
            className="block text-xl md:text-2xl font-bold text-gray-900 mb-1"
            style={{ fontFamily: "Inter, Space Grotesk, sans-serif" }}
          >
            <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              Unlock Your Revenue Potential
            </span>
          </span>
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <span className="text-sm md:text-base text-gray-700 leading-snug">
              Join top creators earning{" "}
              <span className="font-semibold">$2K-$10K monthly</span> by
              publishing your agent on the Formation Marketplace.
            </span>
            <div className="hidden md:flex items-center space-x-3 text-xs text-gray-600">
              <span className="flex items-center">
                <Users className="w-3 h-3 mr-1 text-blue-500" /> 10K+ Users
              </span>
              <span className="flex items-center">
                <TrendingUp className="w-3 h-3 mr-1 text-green-500" /> 73%
                Growth
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full md:w-auto">
        <button
          type="button"
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold shadow-md transition-colors duration-200 text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Start Monetizing Today
        </button>
        <span className="text-xs text-center text-gray-500">
          No setup fees. 15% commission only on sales.
        </span>
      </div>
    </div>
  );
}
