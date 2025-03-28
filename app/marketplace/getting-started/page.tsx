'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Code2, Users } from 'lucide-react';

export default function GettingStarted() {
  const router = useRouter();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div {...fadeIn} className="space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 bg-gradient-to-b from-white to-gray-50 rounded-none p-8 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            Get Started with <span className="text-blue-600">Formation</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Choose your path: Use agents to supercharge your workflow, or build and monetize your own agents on our marketplace.
          </p>
          <div className="w-16 h-1 bg-blue-500 mx-auto mt-2 rounded-full opacity-75"></div>
        </div>

        {/* Path Selection */}
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-8 rounded-none shadow-lg border-2 border-transparent hover:border-blue-500 cursor-pointer"
            onClick={() => router.push('/marketplace/getting-started/users')}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-100 rounded-none">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold">Use Agents</h2>
            </div>
            <p className="text-gray-600">
              Deploy pre-built agents for your business needs. Get started in minutes with our extensive marketplace of specialized agents.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-8 rounded-none shadow-lg border-2 border-transparent hover:border-blue-500 cursor-pointer"
            onClick={() => router.push('/marketplace/getting-started/developers')}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-100 rounded-none">
                <Code2 className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold">Provide Agents</h2>
            </div>
            <p className="text-gray-600">
              Build and monetize your own agents. Reach enterprise customers and grow your revenue on our marketplace.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
} 