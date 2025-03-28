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

interface ActiveTool {
  id: string;
  expiresAt: number;
}

export default function AgentIntegrationCanvas() {
  const [activeTools, setActiveTools] = useState<ActiveTool[]>([]);
  const radius = 180;

  // Function to add new random connections
  const addRandomConnections = () => {
    const now = Date.now();
    const numNewTools = Math.floor(Math.random() * 2) + 1; // Add 1-2 new tools
    
    // Get currently active tool IDs
    const currentActiveIds = new Set(activeTools
      .filter(tool => tool.expiresAt > now)
      .map(tool => tool.id));

    // Get available tools (not currently active)
    const availableTools = TOOLS.filter(tool => !currentActiveIds.has(tool.id));
    
    if (availableTools.length === 0) return;

    // Shuffle available tools and take what we need
    const shuffled = [...availableTools]
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    const newTools = shuffled.slice(0, numNewTools).map(tool => ({
      id: tool.id,
      expiresAt: now + (Math.random() * 4000 + 2000) // Random duration between 2-6 seconds
    }));

    setActiveTools(prev => {
      // Remove expired tools and add new ones
      const active = prev.filter(tool => tool.expiresAt > now);
      return [...active, ...newTools];
    });
  };

  // Effect to periodically add new connections
  useEffect(() => {
    const interval = setInterval(addRandomConnections, 1000);
    return () => clearInterval(interval);
  }, []);

  // Effect to cleanup expired connections
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setActiveTools(prev => prev.filter(tool => tool.expiresAt > now));
    }, 1000);
    return () => clearInterval(cleanup);
  }, []);

  // Get currently active tool IDs for rendering
  const activeToolIds = activeTools
    .filter(tool => tool.expiresAt > Date.now())
    .map(tool => tool.id);

  return (
    <div className="w-full h-full relative bg-[#1C2B66] overflow-hidden">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-15"
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
          background: 'radial-gradient(circle at center, rgba(28, 43, 102, 0) 0%, rgba(28, 43, 102, 0.85) 70%)'
        }}
      />

      {/* Main Container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[600px] h-[600px]">
          {/* Spokes Container */}
          <div className="absolute inset-0">
            {TOOLS.map((tool, index) => {
              const pos = getPosition(index, TOOLS.length, radius);
              const angle = Math.atan2(pos.y, pos.x) * (180 / Math.PI);
              const isActive = activeToolIds.includes(tool.id);

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
                      {/* Tool to Robot Packets (Blue) */}
                      <motion.div
                        className="absolute right-0 w-3 h-3 bg-blue-400 rounded-full"
                        style={{
                          boxShadow: '0 0 15px rgba(67, 97, 238, 0.6)'
                        }}
                        animate={{
                          x: [0, -radius],
                          scale: [1.5, 0.8],
                          opacity: [1, 0]
                        }}
                        transition={{
                          duration: 2,
                          ease: "linear",
                          repeat: Infinity,
                          repeatDelay: 0
                        }}
                      />
                      {/* Robot to Tool Response (Green) */}
                      <motion.div
                        className="absolute left-0 w-3 h-3 bg-emerald-400 rounded-full"
                        style={{
                          boxShadow: '0 0 15px rgba(16, 185, 129, 0.6)'
                        }}
                        animate={{
                          x: [0, radius],
                          scale: [0.8, 1.5],
                          opacity: [0, 1]
                        }}
                        transition={{
                          duration: 2,
                          ease: "linear",
                          repeat: Infinity,
                          repeatDelay: 0
                        }}
                      />
                      {/* Second Set - Tool to Robot (Blue) */}
                      <motion.div
                        className="absolute right-0 w-3 h-3 bg-blue-400 rounded-full"
                        style={{
                          boxShadow: '0 0 15px rgba(67, 97, 238, 0.6)'
                        }}
                        animate={{
                          x: [0, -radius],
                          scale: [1.5, 0.8],
                          opacity: [1, 0]
                        }}
                        transition={{
                          duration: 2,
                          ease: "linear",
                          repeat: Infinity,
                          repeatDelay: 0,
                          delay: 1
                        }}
                      />
                      {/* Second Set - Robot to Tool Response (Green) */}
                      <motion.div
                        className="absolute left-0 w-3 h-3 bg-emerald-400 rounded-full"
                        style={{
                          boxShadow: '0 0 15px rgba(16, 185, 129, 0.6)'
                        }}
                        animate={{
                          x: [0, radius],
                          scale: [0.8, 1.5],
                          opacity: [0, 1]
                        }}
                        transition={{
                          duration: 2,
                          ease: "linear",
                          repeat: Infinity,
                          repeatDelay: 0,
                          delay: 1
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
            const isActive = activeToolIds.includes(tool.id);

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