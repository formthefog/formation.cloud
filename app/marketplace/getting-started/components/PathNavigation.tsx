'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Users, Code2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function PathNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const paths = [
    {
      name: 'Users',
      path: '/marketplace/getting-started/users',
      icon: <Users className="w-5 h-5" />,
      color: 'blue'
    },
    {
      name: 'Developers',
      path: '/marketplace/getting-started/developers',
      icon: <Code2 className="w-5 h-5" />,
      color: 'purple'
    }
  ];

  return (
    <div className="flex justify-center mb-8">
      <div className="inline-flex bg-gray-100 rounded-lg p-1">
        {paths.map((item) => {
          const isActive = pathname === item.path;
          return (
            <motion.button
              key={item.path}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(item.path)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium
                ${isActive 
                  ? `bg-white shadow-sm text-${item.color}-600` 
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              {item.icon}
              {item.name}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
} 