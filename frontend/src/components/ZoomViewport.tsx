'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ZoomScene, SceneElement, DepthTier } from '@/types';
import { useZoom } from '@/hooks/useZoom';
import { useSoundEffect } from '@/hooks/useSound';
import { cn } from '@/utils/cn';

interface ZoomViewportProps {
  onElementClick?: (element: SceneElement) => void;
  onCombine?: (draggedId: string, targetId: string) => void;
  className?: string;
}

// Depth tier display mapping - Apple accent colors
const depthDisplay: Record<DepthTier, { label: string; color: string }> = {
  I: { label: 'Depth I', color: 'text-teal' },
  II: { label: 'Depth II', color: 'text-violet' },
  III: { label: 'Depth III', color: 'text-rose' },
  IV: { label: 'Depth IV', color: 'text-gold' },
  'V+': { label: 'Depth V+', color: 'text-ice' },
};

// Typewriter effect hook
function useTypewriter(text: string, speed: number = 30) {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayText('');
    setIsComplete(false);

    if (!text) return;

    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayText, isComplete };
}

// Apple-style loading spinner
function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className="w-10 h-10 border-2 border-border border-t-accent-blue rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
      />
      <div className="text-center">
        <p className="font-display text-text-primary text-sm">Exploring...</p>
        <p className="font-whisper text-xs text-text-secondary italic mt-1">
          Discovering deeper memories
        </p>
      </div>
    </div>
  );
}

// Scene element component
function SceneElementButton({
  element,
  index,
  onClick,
  onNativeDragStart,
  onCombine,
}: {
  element: SceneElement;
  index: number;
  onClick: () => void;
  onNativeDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onCombine?: (draggedId: string, targetId: string) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDropTarget, setIsDropTarget] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (element.canCombine && onNativeDragStart) {
      onNativeDragStart(e);
    }
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
      className="absolute cursor-pointer"
      style={{
        left: `${element.position.x}%`,
        top: `${element.position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      draggable={element.canCombine}
      onDragStart={handleDragStart}
      onDragOver={onCombine ? handleDragOver : undefined}
      onDragLeave={onCombine ? handleDragLeave : undefined}
      onDrop={onCombine ? handleDrop : undefined}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 25,
          delay: index * 0.1,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Element container - Apple-style card */}
        <div
          className={cn(
            'relative flex flex-col items-center justify-center',
            'w-16 h-16 rounded-xl border select-none',
            'transition-all duration-200',
            'bg-white shadow-card',
            element.canZoomInto
              ? 'border-violet/40 hover:shadow-accent-violet'
              : 'border-border',
            element.canCombine && 'border-teal/40',
            // Drop target highlight
            isDropTarget && 'ring-2 ring-accent-blue border-accent-blue scale-110 shadow-accent-teal'
          )}
        >
          {/* Emoji */}
          <span className="text-3xl leading-none">
            {element.emoji}
          </span>

          {/* Name */}
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-display text-text-primary">
            {element.name}
          </span>

          {/* Zoom indicator */}
          {element.canZoomInto && (
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-violet flex items-center justify-center">
              <span className="text-[8px] text-white font-bold">+</span>
            </div>
          )}

          {/* Combine indicator */}
          {element.canCombine && (
            <div className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-teal flex items-center justify-center">
              <span className="text-[8px] text-white font-bold">*</span>
            </div>
          )}
        </div>

        {/* Whisper tooltip on hover */}
        <AnimatePresence>
          {isHovered && element.whisper && (
            <motion.div
              className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-10"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
            >
              <div className="px-3 py-2 rounded-lg bg-white shadow-elevated border border-border max-w-[200px]">
                <p className="text-xs font-whisper italic text-teal text-center">
                  &ldquo;{element.whisper}&rdquo;
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// Context callback notification
function ContextNotification({
  callback,
}: {
  callback: { text: string; referencedElementId: string; referencedDepth: DepthTier };
}) {
  return (
    <motion.div
      className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20"
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="px-4 py-3 rounded-xl bg-white/95 backdrop-blur-md border border-gold/30 shadow-elevated">
        <p className="text-sm font-whisper italic text-gold">
          {callback.text}
        </p>
        <p className="text-xs text-text-secondary mt-1">
          From {depthDisplay[callback.referencedDepth].label}
        </p>
      </div>
    </motion.div>
  );
}

// Breadcrumb navigation component
function ZoomBreadcrumbs({
  breadcrumbs,
  onNavigate,
}: {
  breadcrumbs: Array<{ id: string; name: string; depth: DepthTier }>;
  onNavigate: (index: number) => void;
}) {
  if (breadcrumbs.length === 0) return null;

  return (
    <motion.div
      className="absolute top-4 left-4 z-20 flex items-center gap-1 flex-wrap max-w-[60%]"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm border border-border shadow-card">
        {/* Home / Surface link */}
        <button
          onClick={() => onNavigate(-1)}
          className={cn(
            'text-xs font-display text-text-secondary hover:text-text-primary transition-colors',
            'px-2 py-0.5 rounded hover:bg-surface'
          )}
        >
          Surface
        </button>

        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.id} className="flex items-center">
            <span className="text-text-muted mx-1">/</span>
            <button
              onClick={() => onNavigate(index)}
              className={cn(
                'text-xs font-display transition-colors px-2 py-0.5 rounded',
                index === breadcrumbs.length - 1
                  ? cn('text-text-primary font-medium', depthDisplay[crumb.depth].color)
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface'
              )}
            >
              {crumb.name}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// Error notification component
function ErrorNotification({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <motion.div
      className="absolute top-4 right-4 z-30 max-w-xs"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <div className="px-4 py-3 rounded-lg bg-rose/10 border border-rose/30 shadow-card">
        <div className="flex items-start gap-2">
          <span className="text-rose">&#x26A0;</span>
          <div className="flex-1">
            <p className="text-sm text-rose font-display">Zoom Failed</p>
            <p className="text-xs text-text-secondary mt-1">{message}</p>
          </div>
          <button
            onClick={onDismiss}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            &#x2715;
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Empty state - clean minimal prompt
function EmptyState() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      {/* Central prompt */}
      <motion.div
        className="text-center z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-6xl mb-6"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <span className="opacity-40">&#x1F30C;</span>
        </motion.div>
        <p className="font-whisper text-lg text-text-secondary italic max-w-xs">
          Click an element to explore its memories...
        </p>
      </motion.div>
    </div>
  );
}

export function ZoomViewport({
  onElementClick,
  onCombine,
  className,
}: ZoomViewportProps) {
  const [showContextCallback, setShowContextCallback] = useState(false);
  const [showError, setShowError] = useState(true);

  // Sound effects
  const play = useSoundEffect();

  // Use the zoom hook for all zoom functionality
  const {
    zoomInto,
    zoomOut,
    zoomToScene,
    isLoading,
    error,
    currentScene: scene,
    breadcrumbs,
    canZoomOut,
  } = useZoom();

  const { displayText, isComplete } = useTypewriter(scene?.description || '', 25);

  // Show context callback notification when scene has one
  useEffect(() => {
    if (scene?.contextCallback) {
      const timer = setTimeout(() => setShowContextCallback(true), 1000);
      const hideTimer = setTimeout(() => setShowContextCallback(false), 6000);
      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    }
    setShowContextCallback(false);
  }, [scene?.contextCallback]);

  // Reset error visibility when error changes
  useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error]);

  // Handle element click - zoom if possible, otherwise pass to parent
  const handleElementClick = useCallback(
    async (element: SceneElement) => {
      if (element.canZoomInto) {
        play('zoom');
        // Pass full element data for dynamically generated scene elements
        await zoomInto(element.id, element);
      }
      // Always notify parent of click (for combine/other functionality)
      onElementClick?.(element);
    },
    [zoomInto, onElementClick, play]
  );

  // Handle breadcrumb navigation
  const handleBreadcrumbNavigate = useCallback(
    (index: number) => {
      if (index === -1) {
        // Go back to surface - navigate to scene 0 then pop once more
        // This clears all scenes from the zoom path
        if (breadcrumbs.length > 0) {
          zoomToScene(0);
          // After navigating to scene 0, we need to pop that scene too
          // Schedule the final pop for next tick to ensure state updates
          setTimeout(() => zoomOut(), 0);
        }
      } else {
        zoomToScene(index);
      }
    },
    [zoomToScene, zoomOut, breadcrumbs.length]
  );

  const handleElementDragStart = useCallback(
    (element: SceneElement) => (e: React.DragEvent<HTMLDivElement>) => {
      if (element.canCombine) {
        e.dataTransfer.setData('text/plain', element.id);
        e.dataTransfer.effectAllowed = 'move';
      }
    },
    []
  );

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-2xl border border-border',
        'aspect-video bg-gradient-to-b from-white to-surface',
        'shadow-card',
        className
      )}
    >
      {/* Breadcrumb navigation */}
      {breadcrumbs.length > 0 && (
        <ZoomBreadcrumbs
          breadcrumbs={breadcrumbs}
          onNavigate={handleBreadcrumbNavigate}
        />
      )}

      {/* Error notification */}
      <AnimatePresence>
        {error && showError && (
          <ErrorNotification
            message={error}
            onDismiss={() => setShowError(false)}
          />
        )}
      </AnimatePresence>

      {/* Loading state */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 z-30 flex items-center justify-center bg-white/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingSpinner />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!scene && !isLoading && <EmptyState />}

      {/* Scene content */}
      <AnimatePresence mode="wait">
        {scene && !isLoading && (
          <motion.div
            key={scene.id}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.4,
              ease: 'easeOut',
            }}
          >
            {/* Scene description at top center (offset if breadcrumbs present) */}
            <div className={cn(
              "absolute left-4 right-4 z-10",
              breadcrumbs.length > 0 ? "top-14" : "top-4"
            )}>
              <motion.div
                className="px-4 py-3 rounded-lg bg-white/90 backdrop-blur-sm border border-border shadow-card max-w-lg mx-auto"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="font-whisper text-sm text-text-primary italic text-center">
                  {displayText}
                  {!isComplete && (
                    <motion.span
                      className="inline-block w-0.5 h-4 bg-text-primary ml-1 align-middle"
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  )}
                </p>
              </motion.div>
            </div>

            {/* Memory fragment - subtle display */}
            {scene.memoryFragment && (
              <motion.div
                className={cn(
                  "absolute right-4 z-10 max-w-[200px]",
                  breadcrumbs.length > 0 ? "top-28" : "top-20"
                )}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="px-3 py-2 rounded-lg bg-gold/5 border border-gold/20 shadow-card">
                  <p className="text-[10px] font-whisper text-gold italic">
                    &#x1F4DC; {scene.memoryFragment}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Scene elements */}
            <div className={cn(
              "absolute inset-0 pb-16",
              breadcrumbs.length > 0 ? "pt-28" : "pt-20"
            )}>
              {scene.elements.map((element, index) => (
                <SceneElementButton
                  key={element.id}
                  element={element}
                  index={index}
                  onClick={() => handleElementClick(element)}
                  onNativeDragStart={handleElementDragStart(element)}
                  onCombine={onCombine}
                />
              ))}
            </div>

            {/* Depth indicator */}
            <motion.div
              className="absolute bottom-4 left-4 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm border border-border shadow-card flex items-center gap-2">
                <span className="text-xs text-text-secondary">&#x2693;</span>
                <span
                  className={cn(
                    'text-sm font-display font-semibold',
                    depthDisplay[scene.depth].color
                  )}
                >
                  {depthDisplay[scene.depth].label}
                </span>
              </div>
            </motion.div>

            {/* Ascend button - only show when we can zoom out */}
            {canZoomOut && (
              <motion.button
                className={cn(
                  'absolute bottom-4 right-4 z-10',
                  'px-4 py-2 rounded-lg',
                  'bg-white border border-border',
                  'text-sm font-display text-text-primary',
                  'hover:bg-surface hover:border-accent-blue/40',
                  'transition-colors duration-200',
                  'flex items-center gap-2',
                  'shadow-card'
                )}
                onClick={zoomOut}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>&#x2191;</span>
                <span>Ascend</span>
              </motion.button>
            )}

            {/* Context callback notification */}
            <AnimatePresence>
              {showContextCallback && scene.contextCallback && (
                <ContextNotification callback={scene.contextCallback} />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ZoomViewport;
