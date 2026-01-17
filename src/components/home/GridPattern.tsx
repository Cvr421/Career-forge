import { motion } from 'framer-motion';

export const GridPattern = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      
      {/* Grid lines */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-[0.03]" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern 
            id="grid" 
            width="60" 
            height="60" 
            patternUnits="userSpaceOnUse"
          >
            <path 
              d="M 60 0 L 0 0 0 60" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1"
              className="text-foreground"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Animated scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        initial={{ top: '-10%' }}
        animate={{ top: '110%' }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
};

