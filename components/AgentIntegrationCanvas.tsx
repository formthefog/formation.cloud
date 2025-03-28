import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaRobot } from 'react-icons/fa6';

// Business tool icons and their positions
const TOOLS = [
  { id: 'target', name: 'Target', icon: '🎯', color: '#E86452' },
  { id: 'chat', name: 'Chat', icon: '💬', color: '#4A154B' },
  { id: 'cloud', name: 'Cloud', icon: '☁️', color: '#4A90E2' },
  { id: 'card', name: 'Payment', icon: '💳', color: '#4A90E2' },
  { id: 'note', name: 'Notes', icon: '📝', color: '#1E1E1E' },
  { id: 'box', name: 'Package', icon: '📦', color: '#1E1E1E' },
  { id: 'database', name: 'Database', icon: '🗄️', color: '#4A90E2' },
  { id: 'clipboard', name: 'Tasks', icon: '📋', color: '#4A90E2' }
];

// Calculate positions in a circle
const getPosition = (index: number, total: number, radius: number) => {
  const angle = (index * 2 * Math.PI) / total - Math.PI / 2;
  return {
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle)
  };
};

export default function AgentIntegrationCanvas() {
  const [activeTools, setActiveTools] = useState<string[]>([]);
  const radius = 180; // Increased radius for better spacing

  // Animation to cycle through tools
  useEffect(() => {
    const interval = setInterval(() => {
      const randomTool = TOOLS[Math.floor(Math.random() * TOOLS.length)].id;
      setActiveTools(prev => {
        // Keep only the last 2 active tools
        const newTools = [...prev, randomTool].slice(-2);
        return newTools;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full relative bg-[#0A0F2C] overflow-hidden">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(#4A88FF 1px, transparent 1px),
            linear-gradient(90deg, #4A88FF 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Radial Gradient Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, #0A0F2C 70%)'
        }}
      />

      {/* Main Container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[600px] h-[600px]">
          {/* Spokes Container - Rendered before tools for proper layering */}
          <div className="absolute inset-0">
            {TOOLS.map((tool, index) => {
              const pos = getPosition(index, TOOLS.length, radius);
              const angle = Math.atan2(pos.y, pos.x) * (180 / Math.PI);
              const isActive = activeTools.includes(tool.id);

              return (
                <motion.div
                  key={`spoke-${tool.id}`}
                  className="absolute left-1/2 top-1/2 h-[2px] origin-left"
                  style={{
                    width: radius,
                    rotate: `${angle}deg`,
                    background: 'linear-gradient(90deg, rgba(67, 97, 238, 0.3) 0%, rgba(67, 97, 238, 0.1) 100%)',
                    opacity: isActive ? 1 : 0.1
                  }}
                  animate={{
                    opacity: isActive ? 1 : 0.1
                  }}
                  transition={{
                    duration: 0.4
                  }}
                >
                  {isActive && (
                    <>
                      {/* Incoming Packet Animation */}
                      <motion.div
                        className="absolute left-0 w-2 h-2 bg-blue-400 rounded-full"
                        style={{
                          boxShadow: '0 0 10px rgba(67, 97, 238, 0.5)'
                        }}
                        animate={{
                          x: [0, radius],
                          scale: [1.5, 0.5],
                          opacity: [1, 0]
                        }}
                        transition={{
                          duration: 1.5,
                          ease: "linear",
                          repeat: Infinity,
                          repeatDelay: 1
                        }}
                      />
                      {/* Response Packet Animation */}
                      <motion.div
                        className="absolute right-0 w-2 h-2 bg-emerald-400 rounded-full"
                        style={{
                          boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)'
                        }}
                        animate={{
                          x: [-radius, 0],
                          scale: [0.5, 1.5],
                          opacity: [0, 1]
                        }}
                        transition={{
                          duration: 1.5,
                          ease: "linear",
                          repeat: Infinity,
                          repeatDelay: 1,
                          delay: 1.5
                        }}
                      />
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Center Robot */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <motion.div
              className="w-32 h-32 bg-[#4361EE] rounded-full flex items-center justify-center"
              style={{
                boxShadow: '0 0 40px rgba(67, 97, 238, 0.3)'
              }}
              animate={{ 
                scale: [1, 1.05, 1],
                boxShadow: [
                  '0 0 40px rgba(67, 97, 238, 0.3)',
                  '0 0 60px rgba(67, 97, 238, 0.4)',
                  '0 0 40px rgba(67, 97, 238, 0.3)'
                ]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.div
                className="text-white w-16 h-16"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <FaRobot className="w-full h-full" />
              </motion.div>
            </motion.div>
          </div>

          {/* Tools */}
          {TOOLS.map((tool, index) => {
            const pos = getPosition(index, TOOLS.length, radius);
            const isActive = activeTools.includes(tool.id);

            return (
              <div
                key={tool.id}
                className="absolute w-20 h-20"
                style={{
                  left: `calc(50% + ${pos.x}px - 40px)`,
                  top: `calc(50% + ${pos.y}px - 40px)`
                }}
              >
                {/* Tool Icon */}
                <motion.div
                  className="w-full h-full rounded-full flex items-center justify-center text-3xl shadow-lg"
                  style={{ 
                    backgroundColor: tool.color,
                    boxShadow: isActive ? '0 0 30px rgba(67, 97, 238, 0.3)' : 'none'
                  }}
                  animate={{ 
                    scale: isActive ? 1.15 : 1,
                    y: isActive ? -4 : 0
                  }}
                  transition={{ 
                    duration: 0.4,
                    ease: "easeOut"
                  }}
                >
                  {tool.icon}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 