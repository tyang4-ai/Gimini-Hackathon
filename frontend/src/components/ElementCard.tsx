'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { Element } from '@/types';
import { cn } from '@/utils/cn';
import { INTERMEDIATE_ELEMENTS } from '@/lib/elements';
import { useSoundEffect } from '@/hooks/useSound';

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
    container: 'w-[88px] h-[100px]',
    emoji: 'text-[40px]',
    name: 'text-[11px]',
    whisper: 'text-[9px]',
  },
  md: {
    container: 'w-[88px] h-[100px]',
    emoji: 'text-[40px]',
    name: 'text-[11px]',
    whisper: 'text-[9px]',
  },
  lg: {
    container: 'w-[100px] h-[112px]',
    emoji: 'text-[48px]',
    name: 'text-xs',
    whisper: 'text-[10px]',
  },
} as const;

const categoryStyles = {
  primordial: {
    base: 'bg-gradient-to-br from-white/5 to-white/[0.01] border-accent-cyan/30',
    shadow: 'shadow-card',
    hoverShadow: '0 5px 15px rgba(34, 211, 238, 0.15)',
    hoverBorder: 'var(--accent-cyan)',
  },
  milestone: {
    base: 'bg-gradient-to-br from-white/5 to-white/[0.01] border-accent-gold/50',
    shadow: 'shadow-card',
    hoverShadow: '0 5px 15px rgba(251, 191, 36, 0.2)',
    hoverBorder: 'var(--accent-gold)',
  },
  intermediate: {
    base: 'bg-gradient-to-br from-white/5 to-white/[0.01] border-accent-purple/40',
    shadow: 'shadow-card',
    hoverShadow: '0 5px 15px rgba(192, 132, 252, 0.15)',
    hoverBorder: 'var(--accent-purple)',
  },
  regular: {
    base: 'bg-gradient-to-br from-white/5 to-white/[0.01] border-border',
    shadow: 'shadow-card',
    hoverShadow: '0 5px 15px rgba(34, 211, 238, 0.1)',
    hoverBorder: 'var(--accent-cyan)',
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

  // Sound effects with debounce
  const playSound = useSoundEffect();
  const lastHoverSoundRef = useRef<number>(0);
  const HOVER_DEBOUNCE_MS = 100;

  const handleMouseEnter = useCallback(() => {
    const now = Date.now();
    if (now - lastHoverSoundRef.current > HOVER_DEBOUNCE_MS) {
      playSound('hover');
      lastHoverSoundRef.current = now;
    }
  }, [playSound]);

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
      className="group"
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragOver={onCombine ? handleDragOver : undefined}
      onDragLeave={onCombine ? handleDragLeave : undefined}
      onDrop={onCombine ? handleDrop : undefined}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
    >
      <motion.div
        className={cn(
          'relative flex flex-col items-center justify-center',
          'rounded-[12px] border cursor-grab select-none',
          'transition-all duration-300',
          sizeClasses.container,
          categoryClasses.base,
          categoryClasses.shadow,
          element.category === 'milestone' && 'ring-1 ring-accent-gold/30',
          isDropTarget && 'ring-2 ring-accent-cyan border-accent-cyan scale-110',
          className
        )}
        whileHover={{
          scale: 1.05,
          y: -5,
          boxShadow: categoryClasses.hoverShadow,
          borderColor: categoryClasses.hoverBorder,
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

        {/* Element name - inside card at bottom */}
        <span
          className={cn(
            'absolute bottom-2 left-1/2 -translate-x-1/2',
            'font-body text-center',
            'text-[#94a3b8]',
            sizeClasses.name,
            'max-w-[80px] truncate tracking-[0.5px]',
            'group-hover:text-white transition-colors'
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
              'text-accent-cyan',
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
              'text-accent-gold text-[9px]',
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
            className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent-gold"
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
                '0 0 0px rgba(192, 132, 252, 0)',
                '0 0 12px rgba(192, 132, 252, 0.4)',
                '0 0 0px rgba(192, 132, 252, 0)',
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
