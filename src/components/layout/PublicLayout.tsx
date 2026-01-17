import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PublicLayoutProps {
  children: ReactNode;
  primaryColor?: string;
  accentColor?: string;
}

export const PublicLayout = ({
  children,
  primaryColor = '#0284c7',
  accentColor = '#7c3aed',
}: PublicLayoutProps) => {
  return (
    <div
      className="min-h-screen bg-background"
      style={
        {
          '--company-primary': primaryColor,
          '--company-accent': accentColor,
        } as React.CSSProperties
      }
    >
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.main>
    </div>
  );
};
