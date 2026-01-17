import { motion } from 'framer-motion';

interface GlowingOrbProps {
  color: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  position: { top?: string; left?: string; right?: string; bottom?: string };
  delay?: number;
}

export const GlowingOrb = ({ 
  color, 
  size = 'md', 
  position, 
  delay = 0 
}: GlowingOrbProps) => {
  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-64 h-64',
    lg: 'w-96 h-96'
  };

  const colorClasses = {
    primary: 'bg-primary/30',
    secondary: 'bg-secondary/30'
  };

  return (
    <motion.div
      className={`
        absolute rounded-full blur-3xl -z-10
        ${sizeClasses[size]}
        ${colorClasses[color]}
      `}
      style={position}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ 
        opacity: [0.3, 0.6, 0.3],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};
