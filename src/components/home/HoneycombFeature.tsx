import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface HoneycombFeatureProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
  variant?: 'primary' | 'secondary';
}

export const HoneycombFeature = ({ 
  icon: Icon, 
  title, 
  description, 
  index,
  variant = 'primary'
}: HoneycombFeatureProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
      whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      viewport={{ once: true }}
      className="group perspective-1000"
    >
      <div 
        className={`
          relative p-6 rounded-2xl border transition-all duration-500
          transform-gpu hover:scale-105 hover:-translate-y-2
          ${variant === 'primary' 
            ? 'bg-card/50 border-primary/20 hover:border-primary/50 hover:shadow-[0_0_30px_hsl(44_99%_53%/0.2)]' 
            : 'bg-card/50 border-secondary/20 hover:border-secondary/50 hover:shadow-[0_0_30px_hsl(225_73%_57%/0.2)]'
          }
          backdrop-blur-xl
        `}
      >
        {/* Honeycomb hex pattern overlay */}
        <div className="absolute inset-0 opacity-5 rounded-2xl overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id={`hex-${index}`} width="20" height="23" patternUnits="userSpaceOnUse">
              <polygon 
                points="10,0 20,5.77 20,17.32 10,23.09 0,17.32 0,5.77" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="0.5"
              />
            </pattern>
            <rect width="100%" height="100%" fill={`url(#hex-${index})`} />
          </svg>
        </div>

        {/* Glow effect on hover */}
        <div 
          className={`
            absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10
            ${variant === 'primary' ? 'bg-primary/20' : 'bg-secondary/20'}
          `}
        />

        {/* Icon container with 3D effect */}
        <div 
          className={`
            relative w-14 h-14 mb-4 rounded-xl flex items-center justify-center
            transform-gpu transition-transform duration-300 group-hover:rotate-6
            ${variant === 'primary' 
              ? 'bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30' 
              : 'bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/30'
            }
          `}
        >
          <Icon 
            className={`
              w-7 h-7 transition-all duration-300 group-hover:scale-110
              ${variant === 'primary' ? 'text-primary' : 'text-secondary'}
            `} 
          />
        </div>

        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>

        {/* Corner accents */}
        <div 
          className={`
            absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500
            ${variant === 'primary' ? 'text-primary' : 'text-secondary'}
          `}
        >
          <svg className="w-full h-full" viewBox="0 0 64 64">
            <path 
              d="M64 0 L64 16 L48 16 L48 32 L32 32 L32 48 L16 48 L16 64" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1" 
              strokeOpacity="0.3"
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
};
