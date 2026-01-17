import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedTextProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export const AnimatedText = ({ children, delay = 0, className = '' }: AnimatedTextProps) => {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        type: "spring",
        stiffness: 100
      }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.span>
  );
};

export const GradientText = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return (
    <span className={`bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  );
};

export const GlowText = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return (
    <span className={`relative ${className}`}>
      <span className="absolute inset-0 blur-lg bg-gradient-to-r from-primary to-secondary opacity-50" />
      <span className="relative bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        {children}
      </span>
    </span>
  );
};
