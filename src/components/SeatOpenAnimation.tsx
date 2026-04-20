import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SeatOpenAnimationProps {
  trigger: number;
}

export function SeatOpenAnimation({ trigger }: SeatOpenAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (trigger > 0) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000); // Hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  // Generate random positions for coins
  const coins = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * window.innerWidth,
    y: (Math.random() - 0.5) * window.innerHeight,
    delay: Math.random() * 0.2,
    scale: 0.5 + Math.random() * 1.5,
    rotation: Math.random() * 360,
  }));

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
          {/* Dark overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black"
          />

          {/* Flying Coins */}
          {coins.map((coin) => (
            <motion.div
              key={coin.id}
              initial={{ opacity: 0, scale: 0, x: 0, y: 0, rotate: 0 }}
              animate={{ 
                opacity: [0, 1, 1, 0], 
                scale: coin.scale, 
                x: coin.x, 
                y: coin.y, 
                rotate: coin.rotation + 360 
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ 
                duration: 2, 
                delay: coin.delay,
                ease: "easeOut"
              }}
              className="absolute text-4xl"
            >
              🪙
            </motion.div>
          ))}

          {/* Main Text */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              y: 0 
            }}
            exit={{ scale: 0.5, opacity: 0, y: -50 }}
            transition={{ 
              duration: 0.5, 
              type: "spring", 
              bounce: 0.6 
            }}
            className="relative z-10 text-center"
          >
            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 via-yellow-500 to-orange-600 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] uppercase tracking-tighter">
              Seat Open!
            </h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white text-xl md:text-2xl mt-4 font-bold drop-shadow-md"
            >
              A player has been eliminated
            </motion.p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
