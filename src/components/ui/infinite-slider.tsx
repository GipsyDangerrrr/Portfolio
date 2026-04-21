import React from 'react';
import { motion } from 'framer-motion';

interface InfiniteSliderProps {
  items: React.ReactNode[];
  speed?: number; // lower is faster
  direction?: 'left' | 'right';
  className?: string;
  gap?: number;
}

const InfiniteSlider: React.FC<InfiniteSliderProps> = ({ 
  items, 
  speed = 40, 
  direction = 'left', 
  className = "",
  gap = 64
}) => {
  // Triple the items to ensure seamless loop
  const duplicatedItems = [...items, ...items, ...items];

  return (
    <div className={`relative overflow-hidden w-full ${className}`}>
      {/* Gradient Mask Overlays */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex items-center"
        style={{ gap: `${gap}px` }}
        animate={{
          x: direction === 'left' ? ['0%', '-33.33%'] : ['-33.33%', '0%'],
        }}
        transition={{
          duration: speed,
          ease: 'linear',
          repeat: Infinity,
        }}
      >
        {duplicatedItems.map((item, index) => (
          <div key={index} className="flex-shrink-0">
            {item}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default InfiniteSlider;
