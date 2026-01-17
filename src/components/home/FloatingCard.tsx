import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FloatingCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export const FloatingCard = ({ children, delay = 0, className = '' }: FloatingCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: 15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{
        duration: 0.8,
        delay,
        type: "spring",
        stiffness: 80
      }}
      viewport={{ once: true }}
      whileHover={{ 
        y: -10,
        rotateY: 5,
        transition: { duration: 0.3 }
      }}
      className={`perspective-1000 ${className}`}
    >
      {children}
    </motion.div>
  );
};
