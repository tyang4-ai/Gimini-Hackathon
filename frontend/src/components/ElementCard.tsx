'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Element } from '@/types';
import { cn } from '@/utils/cn';
import { INTERMEDIATE_ELEMENTS } from '@/lib/elements';

interface ElementCardProps {
  element: Element;
  size?: 'sm' | 'md' | 'lg';
  draggable?: boolean;
  onClick?: () => void;
  onCombine?: (draggedElementId: string, targetElementId: string) => void;
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

// Apple-style light theme category styles
const categoryStyles = {
  primordial: {
    base: 'bg-white border-teal/60',
    shadow: 'shadow-card',
    hoverShadow: '0 4px 16px rgba(0, 199, 190, 0.2)',
    accentBg: 'bg-teal/5',
  },
  milestone: {
    base: 'bg-white border-gold/70',
    shadow: 'shadow-card',
    hoverShadow: '0 4px 16px rgba(255, 149, 0, 0.25)',
    accentBg: 'bg-gold/5',
  },
  intermediate: {
    base: 'bg-white border-violet/50',
    shadow: 'shadow-card',
    hoverShadow: '0 4px 16px rgba(175, 82, 222, 0.2)',
    accentBg: 'bg-violet/5',
  },
  regular: {
    base: 'bg-white border-border',
    shadow: 'shadow-card',
    hoverShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    accentBg: 'bg-surface',
  },
} as const;

export function ElementCard({
  element,
  size = 'md',
  draggable = true,
  onClick,
  onCombine,
  showWhisper = false,
  className,
}: ElementCardProps) {
  const sizeClasses = sizeConfig[size];
  const categoryClasses = categoryStyles[element.category];
  const [isDropTarget, setIsDropTarget] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', element.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDropTarget(true);
  };

  const handleDragLeave = () => {
    setIsDropTarget(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDropTarget(false);

    const draggedId = e.dataTransfer.getData('text/plain');
    if (draggedId && draggedId !== element.id && onCombine) {
      onCombine(draggedId, element.id);
    }
  };

  return (
    <div
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragOver={onCombine ? handleDragOver : undefined}
      onDragLeave={onCombine ? handleDragLeave : undefined}
      onDrop={onCombine ? handleDrop : undefined}
      onClick={onClick}
    >
      <motion.div
        className={cn(
          // Base styles
          'relative flex flex-col items-center justify-center',
          'rounded-xl border cursor-pointer select-none',
          'transition-all duration-200',
          sizeClasses.container,
          // Category-specific styles
          categoryClasses.base,
          categoryClasses.shadow,
          categoryClasses.accentBg,
          // Milestone special treatment - subtle ring
          element.category === 'milestone' && 'ring-1 ring-gold/20',
          // Drop target highlight
          isDropTarget && 'ring-2 ring-accent-blue border-accent-blue scale-110 shadow-accent-teal',
          className
        )}
        whileHover={{
          scale: 1.08,
          boxShadow: categoryClasses.hoverShadow,
        }}
        whileTap={{ scale: 0.98 }}
        whileDrag={{ scale: 1.05, opacity: 0.9 }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 30,
        }}
      >
        {/* Emoji */}
        <span
          className={cn(
            sizeClasses.emoji,
            'leading-none',
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
            'font-display text-center',
            'text-text-primary',
            sizeClasses.name,
            // Truncate long names in small size to prevent overflow
            size === 'sm' && 'max-w-[56px] truncate'
          )}
          title={element.name}
        >
          {element.name}
        </span>

        {/* Whisper text - shown when expanded or on hover detail */}
        {showWhisper && element.whisper && (
          <motion.span
            className={cn(
              'absolute left-1/2 -translate-x-1/2',
              'whitespace-nowrap font-whisper italic',
              'text-teal',
              sizeClasses.whisper,
              'max-w-[150px] truncate text-center',
              element.category === 'intermediate' ? '-bottom-10' : '-bottom-10'
            )}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {element.whisper}
          </motion.span>
        )}

        {/* Pathway text for intermediate elements */}
        {showWhisper && element.category === 'intermediate' && INTERMEDIATE_ELEMENTS[element.id]?.pathwayText && (
          <motion.span
            className={cn(
              'absolute -bottom-[52px] left-1/2 -translate-x-1/2',
              'whitespace-nowrap font-whisper italic',
              'text-gold text-[9px]',
              'max-w-[180px] truncate text-center'
            )}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {INTERMEDIATE_ELEMENTS[element.id].pathwayText}
          </motion.span>
        )}

        {/* Milestone indicator - subtle accent dot */}
        {element.category === 'milestone' && (
          <motion.div
            className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-gold"
            animate={{
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Intermediate pulsing glow effect */}
        {element.category === 'intermediate' && (
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            animate={{
              boxShadow: [
                '0 0 0px rgba(175, 82, 222, 0)',
                '0 0 12px rgba(175, 82, 222, 0.4)',
                '0 0 0px rgba(175, 82, 222, 0)',
              ],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </motion.div>
    </div>
  );
}

export default ElementCard;
