import { useEffect, useState, useRef } from 'react';
import { motion, useAnimation } from 'motion/react';
import { SYMBOLS, getRandomSymbol } from '../store/gameStore';

interface ReelProps {
  spinning: boolean;
  targetSymbols: string[];
  delay: number;
  fastMode: boolean;
  onStop: () => void;
}

export function Reel({ spinning, targetSymbols, delay, fastMode, onStop }: ReelProps) {
  const controls = useAnimation();
  const [symbols, setSymbols] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize with some random symbols
  useEffect(() => {
    if (symbols.length === 0) {
      setSymbols(targetSymbols);
    }
  }, [targetSymbols]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (spinning) {
      // Create a long list of random symbols for the blur effect
      const blurSymbols = Array.from({ length: fastMode ? 20 : 40 }, () => getRandomSymbol());
      // The final symbols we want to land on should be at the top of the array
      // so when we animate translateY down, they end up in view.
      // Wait, we animate Y upwards or downwards? Downwards means top symbols come into view.
      // So final symbols at the top (index 0,1,2).
      const newSymbols = [...targetSymbols, ...blurSymbols, ...symbols];
      setSymbols(newSymbols);

      const symbolHeight = 96; // 6rem (h-24)
      const targetY = 0; // We want to end at the very top of the new array
      const startY = -(newSymbols.length - 3) * symbolHeight; // Start from near the bottom

      const spinDuration = fastMode ? 0.5 : 1.5 + delay * 0.5;

      controls.set({ y: startY });
      
      // Add slight delay before starting to stagger reels
      timeout = setTimeout(() => {
        controls.start({
          y: targetY,
          transition: {
            duration: spinDuration,
            ease: [0.15, 0.85, 0.3, 1.1], // Custom bounce curve
          },
        }).then(() => {
          setSymbols(targetSymbols);
          controls.set({ y: 0 });
          onStop();
        });
      }, delay * 100);
      
    }
    
    return () => clearTimeout(timeout);
  }, [spinning, targetSymbols, delay, fastMode, controls, onStop]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border border-white/10 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-black/40 pointer-events-none" />
      <motion.div 
        ref={containerRef}
        animate={controls}
        className="flex flex-col items-center w-full"
      >
        {symbols.map((symbol, idx) => (
          <div 
            key={idx} 
            className="flex items-center justify-center h-24 w-full text-6xl drop-shadow-lg"
            style={{ 
              filter: spinning && idx > 2 ? 'blur(4px)' : 'none',
              transform: 'scale(1.1)',
            }}
          >
            {symbol}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
