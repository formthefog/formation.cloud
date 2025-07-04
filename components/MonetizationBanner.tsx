import { DollarSign, Users, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";

export default function MonetizationBanner() {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-blue-50 border border-blue-300 rounded-xl p-4 sm:p-5 md:p-6 mt-8 sm:mt-10 md:mt-12 mb-6 sm:mb-8 gap-4 shadow-md sm:shadow-lg">
      {/* Left Section with Icon, Title and Description */}
      <div className="flex flex-col md:flex-row md:items-center md:flex-1 gap-3 md:gap-5">
        {/* Icon with Notification Badge */}
        <div className="flex-shrink-0 relative">
          <span className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-blue-400 shadow-inner">
            <DollarSign className="w-6 h-6 md:w-7 md:h-7 text-white" />
          </span>
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-xs text-white font-bold border-2 border-white shadow">
            !
          </span>
        </div>

        {/* Title and Description */}
        <div className="flex flex-col md:flex-1">
          <span
            className="block text-lg sm:text-xl md:text-2xl font-bold text-blue-700 leading-tight mb-1 md:mb-0"
            style={{ fontFamily: "Inter, Space Grotesk, sans-serif" }}
          >
            Be First to Monetize Your AI Agents
          </span>

          {/* Description Text */}
          <p className="text-sm md:text-base text-gray-700 leading-snug">
            The Formation Marketplace is launching soon. Join our waitlist to
            become a founding creator and be among the first to earn when we go
            live.
          </p>

          {/* Badges - Visible on all screen sizes, but positioned differently */}
          <div className="flex items-center flex-wrap gap-2 text-xs mt-2 md:mt-1">
            <span className="flex items-center bg-blue-100 px-2 py-1 rounded-full font-medium text-gray-600">
              <Users className="w-3 h-3 mr-1 text-blue-500" /> Early Access
            </span>
            <span className="flex items-center bg-green-100 px-2 py-1 rounded-full font-medium text-gray-600">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" /> Founding
              Creators
            </span>
          </div>
        </div>
      </div>

      {/* Right Section with Button */}
      <div className="flex justify-center md:justify-end w-full md:w-auto md:ml-4">
        <Button className="w-full md:w-auto px-4 py-2 text-sm md:text-base whitespace-nowrap">
          Join the Waitlist
        </Button>
      </div>
    </div>
  );
}
