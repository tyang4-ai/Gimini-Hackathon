'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ZoomScene, SceneElement, DepthTier } from '@/types';
import { cn } from '@/utils/cn';

interface ZoomViewportProps {
  scene: ZoomScene | null;
  onElementClick?: (element: SceneElement) => void;
  onZoomOut?: () => void;
  isLoading?: boolean;
  className?: string;
}

// Depth tier display mapping
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

// Particle animation for loading state
function LoadingParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-teal/60"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// Scene element component
function SceneElementButton({
  element,
  index,
  onClick,
  onNativeDragStart,
}: {
  element: SceneElement;
  index: number;
  onClick: () => void;
  onNativeDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (element.canCombine && onNativeDragStart) {
      onNativeDragStart(e);
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
    >
      <motion.div
        initial={{ opacity: 0, scale: 0, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
          delay: index * 0.1,
        }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Element container */}
        <div
          className={cn(
            'relative flex flex-col items-center justify-center',
            'w-16 h-16 rounded-xl border-2 select-none',
            'transition-all duration-200',
            'bg-void/60 backdrop-blur-sm',
            element.canZoomInto
              ? 'border-violet/60 shadow-glow-violet'
              : 'border-surface/50',
            element.canCombine && 'border-teal/60'
          )}
        >
          {/* Emoji */}
          <span className="text-3xl leading-none drop-shadow-md">
            {element.emoji}
          </span>

          {/* Name */}
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-display text-text-primary/90">
            {element.name}
          </span>

          {/* Zoom indicator */}
          {element.canZoomInto && (
            <motion.div
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-violet flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-[8px] text-white font-bold">+</span>
            </motion.div>
          )}

          {/* Combine indicator */}
          {element.canCombine && (
            <motion.div
              className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-teal flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <span className="text-[8px] text-void font-bold">*</span>
            </motion.div>
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
              <div className="px-3 py-2 rounded-lg bg-void/90 backdrop-blur-sm border border-surface/40 max-w-[200px]">
                <p className="text-xs font-whisper italic text-text-whisper/90 text-center">
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
      <div className="px-4 py-3 rounded-xl bg-void/90 backdrop-blur-md border border-gold/40 shadow-glow-gold">
        <p className="text-sm font-whisper italic text-text-lore">
          {callback.text}
        </p>
        <p className="text-xs text-text-muted mt-1">
          From {depthDisplay[callback.referencedDepth].label}
        </p>
      </div>
    </motion.div>
  );
}

// Empty state - cosmic void
function CosmicVoid() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      {/* Starfield background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              delay: Math.random() * 2,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      {/* Central prompt */}
      <motion.div
        className="text-center z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="text-6xl mb-6"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <span className="opacity-60">&#x1F30C;</span>
        </motion.div>
        <p className="font-whisper text-lg text-text-whisper/70 italic max-w-xs">
          Click an element to descend into its memories...
        </p>
      </motion.div>
    </div>
  );
}

export function ZoomViewport({
  scene,
  onElementClick,
  onZoomOut,
  isLoading = false,
  className,
}: ZoomViewportProps) {
  const [showContextCallback, setShowContextCallback] = useState(false);
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

  const handleElementDragStart = useCallback(
    (element: SceneElement) => (e: React.DragEvent<HTMLDivElement>) => {
      if (element.canCombine) {
        e.dataTransfer.setData('text/plain', element.id);
        e.dataTransfer.effectAllowed = 'move';
      }
    },
    []
  );

  // Determine background style
  const backgroundStyle = scene?.backgroundGradient
    ? { background: scene.backgroundGradient }
    : {
        background:
          'radial-gradient(ellipse at center, #1c2541 0%, #0d1321 100%)',
      };

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-2xl border border-surface/30',
        'aspect-video', // 16:9 aspect ratio
        className
      )}
      style={backgroundStyle}
    >
      {/* Loading state */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 z-30 flex items-center justify-center bg-void/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingParticles />
            <motion.div
              className="text-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-4xl mb-4 block">&#x1F52D;</span>
              <p className="font-display text-text-primary">Descending...</p>
              <p className="font-whisper text-sm text-text-whisper/70 italic mt-1">
                Exploring deeper memories
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!scene && !isLoading && <CosmicVoid />}

      {/* Scene content */}
      <AnimatePresence mode="wait">
        {scene && !isLoading && (
          <motion.div
            key={scene.id}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
              duration: 0.5,
              ease: 'easeOut',
            }}
          >
            {/* Scene description at top */}
            <div className="absolute top-4 left-4 right-4 z-10">
              <motion.div
                className="px-4 py-3 rounded-lg bg-void/70 backdrop-blur-sm border border-surface/30 max-w-lg mx-auto"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="font-whisper text-sm text-text-primary/90 italic text-center">
                  {displayText}
                  {!isComplete && (
                    <motion.span
                      className="inline-block w-0.5 h-4 bg-text-primary/70 ml-1 align-middle"
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
                className="absolute top-20 right-4 z-10 max-w-[200px]"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="px-3 py-2 rounded-lg bg-gold/10 border border-gold/30">
                  <p className="text-[10px] font-whisper text-text-lore/80 italic">
                    &#x1F4DC; {scene.memoryFragment}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Scene elements */}
            <div className="absolute inset-0 pt-20 pb-16">
              {scene.elements.map((element, index) => (
                <SceneElementButton
                  key={element.id}
                  element={element}
                  index={index}
                  onClick={() => onElementClick?.(element)}
                  onNativeDragStart={handleElementDragStart(element)}
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
              <div className="px-3 py-1.5 rounded-lg bg-void/70 backdrop-blur-sm border border-surface/30 flex items-center gap-2">
                <span className="text-xs text-text-muted">&#x2693;</span>
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

            {/* Ascend button */}
            {onZoomOut && (
              <motion.button
                className={cn(
                  'absolute bottom-4 right-4 z-10',
                  'px-4 py-2 rounded-lg',
                  'bg-surface/50 backdrop-blur-sm border border-surface/40',
                  'text-sm font-display text-text-primary/90',
                  'hover:bg-surface/70 hover:border-violet/40',
                  'transition-colors duration-200',
                  'flex items-center gap-2'
                )}
                onClick={onZoomOut}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
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
