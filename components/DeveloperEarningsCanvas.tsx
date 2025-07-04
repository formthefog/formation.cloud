import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef, useCallback } from 'react';
import { FaRobot } from 'react-icons/fa6';
import { FaCode, FaLaptopCode, FaBuilding, FaHospital, FaGraduationCap, FaStore, FaIndustry } from 'react-icons/fa6';

// Business and developer icons
const SERVICES = [
  { id: 'enterprise', name: 'Enterprise', icon: FaBuilding, color: '#2563EB' },
  { id: 'healthcare', name: 'Healthcare', icon: FaHospital, color: '#059669' },
  { id: 'education', name: 'Education', icon: FaGraduationCap, color: '#7C3AED' },
  { id: 'retail', name: 'Retail', icon: FaStore, color: '#DB2777' },
  { id: 'industry', name: 'Industry', icon: FaIndustry, color: '#9333EA' },
  { id: 'code', name: 'Code', icon: FaCode, color: '#4361EE' },
  { id: 'laptop', name: 'Laptop', icon: FaLaptopCode, color: '#4361EE' }
];

// Calculate positions in a circle
const getPosition = (index: number, total: number, radius: number) => {
  const angle = (index * 2 * Math.PI) / total - Math.PI / 2;
  return {
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle)
  };
};

interface ActiveService {
  id: string;
  expiresAt: number;
}

interface MoneyParticle {
  id: string;
  createdAt: number;
  angle: number;
}

// Update the intersection point calculation to use the correct robot circle radius
const getIntersectionPoint = (angle: number, radius: number = 64) => { // 64px is the robot circle's radius (128px width/2)
  return {
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle)
  };
};

export default function DeveloperEarningsCanvas() {
  const [activeServices, setActiveServices] = useState<ActiveService[]>([]);
  const [moneyParticles, setMoneyParticles] = useState<MoneyParticle[]>([]);
  const lastParticleTimeRef = useRef<{ [key: string]: number }>({});
  const cleanupIntervalRef = useRef<NodeJS.Timeout>();
  const radius = 180;

  // Function to add new random connections
  const addRandomConnections = useCallback(() => {
    const now = Date.now();
    const numNewServices = Math.floor(Math.random() * 2) + 1;
    
    setActiveServices(prev => {
      const currentActiveIds = new Set(prev
        .filter(service => service.expiresAt > now)
        .map(service => service.id));

      const availableServices = SERVICES.filter(service => !currentActiveIds.has(service.id));
      
      if (availableServices.length === 0) return prev;

      const shuffled = [...availableServices].sort(() => Math.random() - 0.5);
      const newServices = shuffled.slice(0, numNewServices).map(service => ({
        id: service.id,
        expiresAt: now + (Math.random() * 4000 + 4000) // 4-8 seconds lifetime
      }));

      const active = prev.filter(service => service.expiresAt > now);
      return [...active, ...newServices];
    });
  }, []);

  // Effect to periodically add new connections
  useEffect(() => {
    const interval = setInterval(addRandomConnections, 3000); // Every 3 seconds
    return () => clearInterval(interval);
  }, [addRandomConnections]);

  // Effect to cleanup expired connections and add money particles
  useEffect(() => {
    if (cleanupIntervalRef.current) {
      clearInterval(cleanupIntervalRef.current);
    }

    cleanupIntervalRef.current = setInterval(() => {
      const now = Date.now();
      
      // Clean up expired services
      setActiveServices(prev => prev.filter(service => service.expiresAt > now));
      
      // Add money particles for active services when packets arrive
      activeServices.forEach(service => {
        const lastParticleTime = lastParticleTimeRef.current[service.id] || 0;
        const timeSinceLastParticle = now - lastParticleTime;
        
        // Only create new particle every 4 seconds (2s for packet to arrive + 2s delay)
        if (timeSinceLastParticle >= 4000) {
          const serviceIndex = SERVICES.findIndex(s => s.id === service.id);
          const angle = (serviceIndex * 2 * Math.PI) / SERVICES.length - Math.PI / 2;
          
          // Schedule money particle to appear when packet arrives (2s delay)
          setTimeout(() => {
            setMoneyParticles(prev => [...prev, {
              id: `money-${service.id}-${now}`,
              createdAt: now + 2000, // Align with packet arrival
              angle: angle
            }]);
          }, 2000);
          
          lastParticleTimeRef.current[service.id] = now;
        }
      });

      // Clean up old money particles
      setMoneyParticles(prev => prev.filter(particle => now - particle.createdAt < 2000));
    }, 1000); // Check every second
    
    return () => {
      if (cleanupIntervalRef.current) {
        clearInterval(cleanupIntervalRef.current);
      }
    };
  }, [activeServices]);

  // Get currently active service IDs for rendering
  const activeServiceIds = activeServices
    .filter(service => service.expiresAt > Date.now())
    .map(service => service.id);

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
            {SERVICES.map((service, index) => {
              const pos = getPosition(index, SERVICES.length, radius);
              const angle = Math.atan2(pos.y, pos.x) * (180 / Math.PI);
              const isActive = activeServiceIds.includes(service.id);

              return (
                <motion.div
                  key={`spoke-${service.id}`}
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
                      {/* Service to Robot Packets (Blue) */}
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
                      {/* Robot to Service Response (Green) */}
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

            {/* Money Particles */}
            <AnimatePresence>
              {moneyParticles.map((particle) => {
                const startPoint = getIntersectionPoint(particle.angle);
                const randomAngle = particle.angle + (Math.random() * 0.2 - 0.1);
                const endPoint = {
                  x: startPoint.x + Math.cos(randomAngle) * 40,
                  y: startPoint.y + Math.sin(randomAngle) * 40 - 30
                };

                return (
                  <motion.div
                    key={particle.id}
                    className="absolute left-1/2 top-1/2 text-2xl pointer-events-none"
                    initial={{ 
                      opacity: 0,
                      scale: 0.5,
                      x: startPoint.x,
                      y: startPoint.y
                    }}
                    animate={{ 
                      opacity: [0, 1, 1, 0],
                      scale: [0.5, 1, 1, 0.8],
                      x: [startPoint.x, endPoint.x],
                      y: [startPoint.y, endPoint.y]
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: 2,
                      ease: [0.4, 0, 0.2, 1],
                      times: [0, 0.1, 0.8, 1]
                    }}
                  >
                    💰
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Services */}
          {SERVICES.map((service, index) => {
            const pos = getPosition(index, SERVICES.length, radius);
            const isActive = activeServiceIds.includes(service.id);
            const Icon = service.icon;

            return (
              <div
                key={service.id}
                className="absolute w-20 h-20"
                style={{
                  left: `calc(50% + ${pos.x}px - 40px)`,
                  top: `calc(50% + ${pos.y}px - 40px)`
                }}
              >
                {/* Service Icon */}
                <motion.div
                  className="w-full h-full rounded-full flex items-center justify-center text-3xl shadow-lg"
                  style={{ 
                    backgroundColor: service.color,
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
                  <Icon className="w-8 h-8 text-white" />
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 