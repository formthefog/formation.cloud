import { DollarSign, Users, TrendingUp } from "lucide-react";

export default function MonetizationBanner() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between bg-blue-50 border border-blue-300 rounded-xl p-5 md:p-6 mt-12 mb-8 gap-4 md:gap-0 shadow-lg">
      <div className="flex items-start md:items-center md:mr-6 gap-4">
        <div className="flex-shrink-0 relative">
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-400 shadow-inner">
            <DollarSign className="w-7 h-7 text-white" />
          </span>
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-xs text-white font-bold border-2 border-white shadow">
            !
          </span>
        </div>
        <div className="text-left">
          <span
            className="block text-xl md:text-2xl font-bold text-blue-900 mb-1"
            style={{ fontFamily: "Inter, Space Grotesk, sans-serif" }}
          >
            <span className="text-blue-700">
              Be First to Monetize Your AI Agents
            </span>
          </span>
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <span className="text-sm md:text-base text-gray-700 leading-snug">
              The Formation Marketplace is launching soon. Join our waitlist to
              become a founding creator and be among the first to earn when we
              go live.
            </span>
            <div className="hidden md:flex items-center space-x-3 text-xs text-gray-600">
              <span className="flex items-center bg-blue-100 px-2 py-1 rounded-full font-medium">
                <Users className="w-3 h-3 mr-1 text-blue-500" /> Early Access
              </span>
              <span className="flex items-center bg-green-100 px-2 py-1 rounded-full font-medium">
                <TrendingUp className="w-3 h-3 mr-1 text-green-500" /> Founding
                Creators
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full md:w-auto">
        <button
          type="button"
          className="px-6 py-1.5 rounded-sm bg-blue-600 hover:bg-green-500 text-white font-semibold shadow-md transition-colors 00 text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Join the Waitlist
        </button>
        <span className="text-xs text-center text-gray-500">
          No fees. Get notified when we launch.
        </span>
      </div>
    </div>
  );
}
