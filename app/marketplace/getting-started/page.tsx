"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Code2, Users } from "lucide-react";

export default function GettingStarted() {
  const router = useRouter();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <div className="w-full min-h-[calc(100vh-73px)] bg-white flex items-start justify-center">
      <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 mt-[10vh]">
        <motion.div {...fadeIn} className="space-y-6 md:space-y-12">
          {/* Hero Section */}
          <div className="text-left space-y-3 md:text-center">
            <span className="text-sm font-medium text-blue-600 uppercase tracking-wider">
              WELCOME TO FORMATION
            </span>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-gray-900">
              Discover the Power of <br className="hidden md:block" />
              AI with <span className="text-blue-600">Formation</span>
            </h1>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl md:mx-auto leading-relaxed">
              Whether you're a developer, creator, or just getting started with
              AI, Formation helps you harness the potential of AI agents for
              your unique needs.
            </p>
          </div>

          {/* Getting Started */}
          <div className="pt-4">
            <h2 className="text-xl md:text-2xl text-center font-bold text-gray-900 mb-3">
              Choose Your Path
            </h2>
            <p className="text-sm md:text-base text-center text-gray-600 mb-6">
              Get started with Formation in the way that best suits your goals.
            </p>

            {/* Path Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-500 cursor-pointer transition-all duration-200"
                onClick={() => router.push("/marketplace/getting-started/use")}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Use Agents
                  </h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Find and deploy AI agents that match your needs. Browse our
                  marketplace and start automating tasks in minutes.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-500 cursor-pointer transition-all duration-200"
                onClick={() =>
                  router.push("/marketplace/getting-started/create")
                }
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Code2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Create Agents
                  </h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Build and share your own AI agents. Join our community of
                  creators and help shape the future of AI.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
