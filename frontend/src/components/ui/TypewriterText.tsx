'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

interface TypewriterTextProps {
  text: string;
  speed?: number; // ms per character
  className?: string;
  showCursor?: boolean;
  cursorChar?: string;
  onComplete?: () => void;
  delay?: number; // initial delay before starting
}

/**
 * TypewriterText - Animated character-by-character text reveal
 *
 * Features:
 * - Configurable typing speed
 * - Optional blinking cursor animation
 * - Click to skip animation
 * - onComplete callback when finished
 * - Initial delay before starting
 */
export function TypewriterText({
  text,
  speed = 50,
  className,
  showCursor = true,
  cursorChar = '|',
  onComplete,
  delay = 0,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Skip to end on click
  const handleSkip = useCallback(() => {
    if (!isComplete) {
      setDisplayedText(text);
      setIsComplete(true);
      onComplete?.();
    }
  }, [isComplete, text, onComplete]);

  // Handle initial delay
  useEffect(() => {
    if (delay > 0) {
      const delayTimer = setTimeout(() => {
        setHasStarted(true);
      }, delay);

      return () => clearTimeout(delayTimer);
    } else {
      setHasStarted(true);
    }
  }, [delay]);

  // Typewriter animation
  useEffect(() => {
    if (!hasStarted) return;

    // Reset state when text changes
    setDisplayedText('');
    setIsComplete(false);

    let currentIndex = 0;
    const intervalId = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(intervalId);
        setIsComplete(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed, hasStarted, onComplete]);

  return (
    <span
      className={cn('inline-block cursor-pointer select-none', className)}
      onClick={handleSkip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleSkip();
        }
      }}
      aria-label={isComplete ? text : 'Click to reveal full text'}
    >
      {displayedText}
      <AnimatePresence>
        {showCursor && (
          <motion.span
            className="inline-block ml-0.5"
            initial={{ opacity: 1 }}
            animate={{
              opacity: isComplete ? [1, 0, 1] : 1,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.8,
              repeat: isComplete ? Infinity : 0,
              ease: 'linear',
            }}
            aria-hidden="true"
          >
            {cursorChar}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

export default TypewriterText;
