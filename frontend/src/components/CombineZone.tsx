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
        // Defensive check: ensure discoveredElements is a Map before calling .get()
        if (discoveredElements instanceof Map) {
          element = discoveredElements.get(elementId);
        } else if (Array.isArray(discoveredElements)) {
          // Handle case where it might be serialized as array of entries
          const entry = (discoveredElements as [string, Element][]).find(([id]: [string, Element]) => id === elementId);
          element = entry ? entry[1] : undefined;
        }
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
        'bg-surface rounded-2xl border border-border',
        'px-6 shadow-card',
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
        className="text-3xl font-bold text-text-secondary"
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
        className="text-3xl font-bold text-text-secondary"
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
              {/* Apple-style thin spinner */}
              <motion.div
                className="w-8 h-8 border-2 border-border border-t-accent-blue rounded-full"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
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
                stiffness: 200,
                damping: 25,
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
                'border-border bg-white flex items-center justify-center',
                'text-text-muted text-2xl'
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
              animate={{ opacity: 0.8, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={cn(
                'absolute -bottom-12 left-1/2 -translate-x-1/2',
                'bg-white/90 backdrop-blur-sm border border-gold/30',
                'text-gold text-xs px-3 py-1.5 rounded-lg',
                'whitespace-nowrap font-whisper italic',
                'shadow-card'
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
                'bg-rose text-white text-xs px-3 py-1.5 rounded-lg',
                'whitespace-nowrap',
                'shadow-elevated'
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
              'bg-white border border-border',
              'text-text-secondary text-sm',
              'hover:bg-surface hover:border-accent-blue/40',
              'transition-colors duration-200',
              'shadow-card'
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
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
          ? 'border-transparent bg-transparent'
          : isDragOver
          ? 'border-accent-blue border-solid bg-accent-blue/5 shadow-accent-teal'
          : 'border-dashed border-border bg-white hover:border-accent-blue/50'
      )}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      animate={{
        scale: isDragOver ? 1.05 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 30,
      }}
    >
      {element ? (
        <ElementCard element={element} size="md" draggable={false} />
      ) : (
        <span className="text-text-muted text-xs">Drop here</span>
      )}
    </motion.div>
  );
}

export default CombineZone;
