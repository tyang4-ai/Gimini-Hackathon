'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Element } from '@/types';
import { useSoundEffect } from '@/hooks/useSound';
import { cn } from '@/utils/cn';

interface MilestoneRevealProps {
  element: Element; // The milestone element being revealed
  onComplete: () => void; // Called when animation completes
  isVisible: boolean; // Controls visibility
}

/**
 * MilestoneReveal - Dramatic 9-second reveal animation for milestone discoveries
 *
 * Animation Timeline:
 * - 0-2s: Screen dims (overlay opacity 0 → 0.6)
 * - 2-5s: Silhouette appears with blur (blur: 20px → 5px)
 * - 5-9s: Image sharpens completely (blur: 5px → 0)
 * - After 9s: Infinite gold glow pulse animation
 */
export function MilestoneReveal({
  element,
  onComplete,
  isVisible,
}: MilestoneRevealProps) {
  const [phase, setPhase] = useState<'dim' | 'blur' | 'sharpen' | 'glow'>('dim');
  const [showWhisper, setShowWhisper] = useState(false);

  // Sound effects
  const play = useSoundEffect();

  useEffect(() => {
    if (!isVisible) {
      // Reset state when hidden
      setPhase('dim');
      setShowWhisper(false);
      return;
    }

    // Play milestone sound when reveal becomes visible
    play('milestone');

    // Animation timeline
    const timers: NodeJS.Timeout[] = [];

    // Phase 1: Dim complete at 2s, start blur phase
    timers.push(setTimeout(() => setPhase('blur'), 2000));

    // Phase 2: Blur reduces at 5s, start sharpen phase
    timers.push(setTimeout(() => setPhase('sharpen'), 5000));

    // Phase 3: Sharpen complete at 9s, show glow and whisper
    timers.push(setTimeout(() => {
      setPhase('glow');
      setShowWhisper(true);
    }, 9000));

    // Call onComplete after the full animation (9s + small buffer)
    timers.push(setTimeout(() => {
      onComplete();
    }, 11000));

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [isVisible, onComplete, play]);

  // Calculate blur based on phase
  const getBlur = () => {
    switch (phase) {
      case 'dim':
        return 20;
      case 'blur':
        return 5;
      case 'sharpen':
      case 'glow':
        return 0;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={cn(
            'fixed inset-0 z-50',
            'flex flex-col items-center justify-center',
            'pointer-events-auto'
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Dark overlay */}
          <motion.div
            className="absolute inset-0 bg-void"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 0.5 }}
          />

          {/* Content container */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Glow ring effect (behind emoji) */}
            {phase === 'glow' && (
              <motion.div
                className="absolute inset-0 rounded-full"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                  boxShadow: [
                    '0 0 40px 20px rgba(255, 214, 107, 0.3)',
                    '0 0 80px 40px rgba(255, 214, 107, 0.5)',
                    '0 0 40px 20px rgba(255, 214, 107, 0.3)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  width: '200px',
                  height: '200px',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            )}

            {/* Emoji container with blur effect */}
            <motion.div
              className="relative flex items-center justify-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                filter: `blur(${getBlur()}px)`,
              }}
              transition={{
                scale: {
                  type: 'spring',
                  stiffness: 200,
                  damping: 20,
                  delay: 0.5,
                },
                opacity: {
                  duration: 1,
                  delay: 0.5,
                },
                filter: {
                  duration: phase === 'sharpen' ? 4 : 3,
                  ease: 'easeOut',
                },
              }}
            >
              {/* Emoji */}
              <span
                className={cn(
                  'text-[120px] leading-none',
                  'drop-shadow-[0_0_30px_rgba(255,214,107,0.6)]',
                  phase === 'glow' && 'drop-shadow-[0_0_50px_rgba(255,214,107,0.8)]'
                )}
                role="img"
                aria-label={element.name}
              >
                {element.emoji}
              </span>
            </motion.div>

            {/* Element name */}
            <motion.h2
              className={cn(
                'mt-8 font-display text-4xl',
                'text-gold',
                'drop-shadow-[0_0_20px_rgba(255,214,107,0.5)]'
              )}
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{
                opacity: phase === 'sharpen' || phase === 'glow' ? 1 : 0,
                y: phase === 'sharpen' || phase === 'glow' ? 0 : 20,
                filter: phase === 'glow' ? 'blur(0px)' : 'blur(5px)',
              }}
              transition={{
                duration: 1,
                ease: 'easeOut',
              }}
            >
              {element.name}
            </motion.h2>

            {/* Whisper text */}
            <AnimatePresence>
              {showWhisper && element.whisper && (
                <motion.p
                  className={cn(
                    'mt-6 font-whisper text-xl italic',
                    'text-text-whisper',
                    'max-w-md text-center',
                    'drop-shadow-[0_0_10px_rgba(183,240,255,0.3)]'
                  )}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.8,
                    ease: 'easeOut',
                  }}
                >
                  "{element.whisper}"
                </motion.p>
              )}
            </AnimatePresence>

            {/* Lore text for milestones */}
            <AnimatePresence>
              {showWhisper && element.category === 'milestone' && 'lore' in element && (
                <motion.p
                  className={cn(
                    'mt-4 font-body text-base',
                    'text-text-lore/80',
                    'max-w-lg text-center'
                  )}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.3,
                    ease: 'easeOut',
                  }}
                >
                  {element.lore}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Subtle particle effects during glow phase */}
            {phase === 'glow' && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-gold/60"
                    initial={{
                      x: 0,
                      y: 0,
                      opacity: 0,
                    }}
                    animate={{
                      x: [0, (Math.random() - 0.5) * 200],
                      y: [0, -100 - Math.random() * 100],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2 + Math.random(),
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: 'easeOut',
                    }}
                    style={{
                      left: '50%',
                      top: '40%',
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Click to continue hint (after animation completes) */}
          {phase === 'glow' && (
            <motion.div
              className="absolute bottom-12 left-1/2 -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <span className="font-body text-sm text-text-secondary">
                Click anywhere to continue
              </span>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MilestoneReveal;
