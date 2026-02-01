'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { useCombine } from '@/hooks/useCombine';
import { useSoundEffect } from '@/hooks/useSound';
import { cn } from '@/utils/cn';
import { ElementCard } from './ElementCard';
import type { Element } from '@/types';

interface CombineZoneProps {
  onCombine?: (result: Element, isMilestone: boolean, isFirstDiscovery: boolean) => void;
  className?: string;
}

export function CombineZone({ onCombine, className }: CombineZoneProps) {
  const {
    combineSlots,
    addToSlot,
    clearSlots,
    primordials,
    discoveredElements,
    showHint,
  } = useGameStore();

  // Use the useCombine hook for API calls and state management
  const { combine, isLoading, error } = useCombine();

  // Sound effects
  const play = useSoundEffect();

  const [result, setResult] = useState<Element | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<0 | 1 | null>(null);

  // Auto-trigger combine when both slots are filled
  useEffect(() => {
    if (combineSlots[0] && combineSlots[1] && !isLoading && !result) {
      handleCombine();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [combineSlots[0], combineSlots[1]]);

  const handleCombine = async () => {
    const elementA = combineSlots[0];
    const elementB = combineSlots[1];

    if (!elementA || !elementB) return;

    const combineResult = await combine(elementA.id, elementB.id);

    if (combineResult) {
      const { element, isMilestone, isFirstDiscovery } = combineResult;
      setResult(element);

      // Play appropriate sound
      if (isMilestone) {
        play('milestone');
      } else {
        play('combine');
      }

      // Notify parent with milestone and discovery info
      onCombine?.(element, isMilestone, isFirstDiscovery);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    const slotAttr = e.currentTarget.getAttribute('data-slot');
    if (slotAttr !== null) {
      setDragOverSlot(parseInt(slotAttr) as 0 | 1);
    }
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverSlot(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, slotIndex: 0 | 1) => {
      e.preventDefault();
      setDragOverSlot(null);

      const elementId = e.dataTransfer.getData('text/plain');
      if (!elementId) return;

      // Find the element in primordials or discovered elements
      let element: Element | undefined = primordials.find(
        (el) => el.id === elementId
      );

      if (!element) {
        element = discoveredElements.get(elementId);
      }

      if (element) {
        addToSlot(element, slotIndex);
      }
    },
    [primordials, discoveredElements, addToSlot]
  );

  const handleClear = useCallback(() => {
    clearSlots();
    setResult(null);
  }, [clearSlots]);

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-4 h-[120px]',
        'bg-surface/20 rounded-2xl border border-surface/30',
        'px-6 backdrop-blur-sm',
        className
      )}
    >
      {/* Slot 0 */}
      <DropSlot
        index={0}
        element={combineSlots[0]}
        isDragOver={dragOverSlot === 0}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, 0)}
      />

      {/* Plus operator */}
      <motion.div
        className="text-3xl font-bold text-text-whisper/60"
        animate={{ opacity: combineSlots[0] && combineSlots[1] ? 1 : 0.4 }}
      >
        +
      </motion.div>

      {/* Slot 1 */}
      <DropSlot
        index={1}
        element={combineSlots[1]}
        isDragOver={dragOverSlot === 1}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, 1)}
      />

      {/* Equals sign */}
      <motion.div
        className="text-3xl font-bold text-text-whisper/60"
        animate={{
          opacity: isLoading || result ? 1 : 0.4,
          scale: isLoading ? [1, 1.1, 1] : 1,
        }}
        transition={{
          scale: { repeat: Infinity, duration: 0.8 },
        }}
      >
        =
      </motion.div>

      {/* Result area */}
      <div className="relative w-16 h-16 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="w-16 h-16 flex items-center justify-center"
            >
              <motion.div
                className="w-10 h-10 border-4 border-teal/30 border-t-teal rounded-full"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              />
            </motion.div>
          ) : result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.3, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
              }}
            >
              <ElementCard element={result} size="md" draggable={true} />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn(
                'w-16 h-16 rounded-xl border-2 border-dashed',
                'border-surface/40 flex items-center justify-center',
                'text-text-whisper/40 text-2xl'
              )}
            >
              ?
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hint tooltip */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={cn(
                'absolute -bottom-12 left-1/2 -translate-x-1/2',
                'bg-violet/90 text-text-primary text-xs px-3 py-1.5 rounded-lg',
                'whitespace-nowrap font-whisper italic',
                'shadow-lg shadow-violet/20'
              )}
            >
              {showHint}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error tooltip */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={cn(
                'absolute -bottom-12 left-1/2 -translate-x-1/2',
                'bg-red-500/90 text-text-primary text-xs px-3 py-1.5 rounded-lg',
                'whitespace-nowrap',
                'shadow-lg shadow-red-500/20'
              )}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Clear button */}
      <AnimatePresence>
        {(combineSlots[0] || combineSlots[1] || result) && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={handleClear}
            className={cn(
              'ml-4 px-3 py-1.5 rounded-lg',
              'bg-surface/40 border border-surface/60',
              'text-text-whisper text-sm',
              'hover:bg-surface/60 hover:border-teal/40',
              'transition-colors duration-200'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Clear
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

// === DROP SLOT COMPONENT ===

interface DropSlotProps {
  index: 0 | 1;
  element: Element | null;
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}

function DropSlot({
  index,
  element,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
}: DropSlotProps) {
  return (
    <motion.div
      data-slot={index}
      className={cn(
        'w-16 h-16 rounded-xl border-2',
        'flex items-center justify-center',
        'transition-all duration-200',
        element
          ? 'border-transparent'
          : isDragOver
          ? 'border-teal border-solid bg-teal/10 shadow-glow-teal'
          : 'border-dashed border-surface/40 hover:border-teal/50'
      )}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      animate={{
        scale: isDragOver ? 1.1 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 25,
      }}
    >
      {element ? (
        <ElementCard element={element} size="md" draggable={false} />
      ) : (
        <span className="text-text-whisper/30 text-xs">Drop here</span>
      )}
    </motion.div>
  );
}

export default CombineZone;
