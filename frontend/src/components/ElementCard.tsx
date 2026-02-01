'use client';

import { motion } from 'framer-motion';
import type { Element } from '@/types';
import { cn } from '@/utils/cn';

interface ElementCardProps {
  element: Element;
  size?: 'sm' | 'md' | 'lg';
  draggable?: boolean;
  onClick?: () => void;
  showWhisper?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: {
    container: 'w-12 h-12',
    emoji: 'text-2xl',
    name: 'text-[10px]',
    whisper: 'text-[8px]',
  },
  md: {
    container: 'w-16 h-16',
    emoji: 'text-3xl',
    name: 'text-xs',
    whisper: 'text-[10px]',
  },
  lg: {
    container: 'w-20 h-20',
    emoji: 'text-4xl',
    name: 'text-sm',
    whisper: 'text-xs',
  },
} as const;

const categoryStyles = {
  primordial: {
    base: 'border-teal/60 bg-void/80',
    glow: 'shadow-glow-teal',
    hoverGlow: '0 0 25px rgba(91, 192, 190, 0.6)',
  },
  milestone: {
    base: 'border-gold/70 bg-void/90',
    glow: 'shadow-glow-gold',
    hoverGlow: '0 0 30px rgba(255, 214, 107, 0.7)',
  },
  intermediate: {
    base: 'border-violet/50 bg-void/70',
    glow: 'shadow-glow-violet',
    hoverGlow: '0 0 25px rgba(127, 90, 240, 0.6)',
  },
  regular: {
    base: 'border-surface/40 bg-surface/30',
    glow: '',
    hoverGlow: '0 0 15px rgba(91, 192, 190, 0.3)',
  },
} as const;

export function ElementCard({
  element,
  size = 'md',
  draggable = true,
  onClick,
  showWhisper = false,
  className,
}: ElementCardProps) {
  const sizeClasses = sizeConfig[size];
  const categoryClasses = categoryStyles[element.category];

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', element.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable={draggable}
      onDragStart={handleDragStart}
      onClick={onClick}
    >
      <motion.div
        className={cn(
          // Base styles
          'relative flex flex-col items-center justify-center',
          'rounded-xl border-2 cursor-pointer select-none',
          'transition-colors duration-200',
          sizeClasses.container,
          // Category-specific styles
          categoryClasses.base,
          categoryClasses.glow,
          // Milestone special treatment
          element.category === 'milestone' && 'ring-1 ring-gold/30',
          className
        )}
      whileHover={{
        scale: 1.08,
        boxShadow: categoryClasses.hoverGlow,
      }}
      whileTap={{ scale: 0.95 }}
      whileDrag={{ scale: 1.1, opacity: 0.8 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 25,
      }}
    >
      {/* Emoji */}
      <span
        className={cn(
          sizeClasses.emoji,
          'leading-none drop-shadow-md',
          element.category === 'milestone' && 'drop-shadow-[0_0_8px_rgba(255,214,107,0.5)]'
        )}
        role="img"
        aria-label={element.name}
      >
        {element.emoji}
      </span>

      {/* Element name - shown below card for better layout */}
      <span
        className={cn(
          'absolute -bottom-5 left-1/2 -translate-x-1/2',
          'whitespace-nowrap font-display',
          'text-text-primary/90',
          sizeClasses.name
        )}
      >
        {element.name}
      </span>

      {/* Whisper text - shown when expanded or on hover detail */}
      {showWhisper && element.whisper && (
        <motion.span
          className={cn(
            'absolute -bottom-10 left-1/2 -translate-x-1/2',
            'whitespace-nowrap font-whisper italic',
            'text-text-whisper/80',
            sizeClasses.whisper,
            'max-w-[150px] truncate text-center'
          )}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {element.whisper}
        </motion.span>
      )}

      {/* Milestone sparkle effect */}
      {element.category === 'milestone' && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          animate={{
            boxShadow: [
              '0 0 10px rgba(255, 214, 107, 0.3)',
              '0 0 20px rgba(255, 214, 107, 0.5)',
              '0 0 10px rgba(255, 214, 107, 0.3)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Primordial shimmer effect */}
      {element.category === 'primordial' && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-teal/10 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
              repeatDelay: 2,
            }}
          />
        </motion.div>
      )}
      </motion.div>
    </div>
  );
}

export default ElementCard;
