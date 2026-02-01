'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

interface EvolutionPlayerProps {
  milestoneId: string;
  milestoneName: string;
  videoUrl?: string; // URL when ready, undefined when generating
  isGenerating: boolean;
  onClose: () => void;
  isOpen: boolean;
}

// Animated spinner for loading state
function EvolutionSpinner() {
  const orbitParticles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    angle: (i * 360) / 8,
    delay: i * 0.1,
    size: Math.random() * 3 + 2,
  }));

  return (
    <div className="relative w-24 h-24">
      {/* Central pulsing core */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-violet" />
      </motion.div>

      {/* Orbiting particles */}
      {orbitParticles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
            delay: particle.delay,
          }}
        >
          <motion.div
            className="absolute w-2 h-2 rounded-full bg-teal"
            style={{
              top: '10%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              opacity: [0.4, 1, 0.4],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        </motion.div>
      ))}

      {/* Expanding rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={`ring-${i}`}
          className="absolute inset-0 rounded-full border border-gold/30"
          animate={{
            scale: [1, 2],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.6,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

// Notification badge for when video is ready
function ReadyBadge({ milestoneName }: { milestoneName: string }) {
  return (
    <motion.div
      className={cn(
        'fixed bottom-6 right-6 z-50',
        'px-4 py-3 rounded-xl',
        'bg-void/95 backdrop-blur-md',
        'border border-gold/50 shadow-glow-gold',
        'cursor-pointer'
      )}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-3">
        {/* Pulsing icon */}
        <motion.div
          className="text-2xl"
          animate={{
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          &#x1F3AC;
        </motion.div>

        <div>
          <p className="font-display text-sm text-gold font-semibold">
            Evolution Ready!
          </p>
          <p className="font-whisper text-xs text-text-secondary italic">
            {milestoneName} has evolved
          </p>
        </div>

        {/* Play indicator */}
        <motion.div
          className="ml-2 w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center"
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(255, 214, 107, 0.4)',
              '0 0 0 8px rgba(255, 214, 107, 0)',
            ],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        >
          <span className="text-gold text-xs ml-0.5">&#9658;</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Video modal player
function VideoModal({
  videoUrl,
  milestoneName,
  onClose,
}: {
  videoUrl: string;
  milestoneName: string;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Dark overlay */}
      <motion.div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal content */}
      <motion.div
        className={cn(
          'relative z-10 w-full max-w-4xl mx-4',
          'rounded-2xl overflow-hidden',
          'bg-void border border-gold/30 shadow-glow-gold'
        )}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 25,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface/30">
          <div className="flex items-center gap-3">
            <motion.span
              className="text-2xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              &#x1F30C;
            </motion.span>
            <div>
              <h3 className="font-display text-lg text-gold font-semibold">
                {milestoneName}
              </h3>
              <p className="font-whisper text-sm text-text-secondary italic">
                Witness the evolution unfold...
              </p>
            </div>
          </div>

          {/* Close button */}
          <motion.button
            className={cn(
              'w-10 h-10 rounded-full',
              'bg-surface/40 hover:bg-surface/60',
              'flex items-center justify-center',
              'text-text-primary/80 hover:text-text-primary',
              'transition-colors duration-200'
            )}
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Close"
          >
            <span className="text-xl font-light">&times;</span>
          </motion.button>
        </div>

        {/* Video container */}
        <div className="relative aspect-video bg-black">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain"
            playsInline
          />

          {/* Play/Pause overlay button */}
          <motion.button
            className={cn(
              'absolute inset-0 flex items-center justify-center',
              'bg-black/20 hover:bg-black/30 transition-colors'
            )}
            onClick={togglePlayPause}
            whileTap={{ scale: 0.98 }}
          >
            <AnimatePresence mode="wait">
              {!isPlaying && (
                <motion.div
                  className={cn(
                    'w-20 h-20 rounded-full',
                    'bg-gold/80 hover:bg-gold',
                    'flex items-center justify-center',
                    'shadow-glow-gold'
                  )}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <span className="text-void text-3xl ml-1">&#9658;</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-surface/30">
          <motion.div
            className="h-full bg-gradient-to-r from-gold to-violet"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Controls footer */}
        <div className="flex items-center justify-between px-6 py-3 bg-surface/20">
          <div className="flex items-center gap-2">
            <motion.button
              className={cn(
                'w-10 h-10 rounded-full',
                'bg-gold/20 hover:bg-gold/30',
                'flex items-center justify-center',
                'text-gold',
                'transition-colors duration-200'
              )}
              onClick={togglePlayPause}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className={isPlaying ? 'text-lg' : 'text-lg ml-0.5'}>
                {isPlaying ? '\u275A\u275A' : '▶'}
              </span>
            </motion.button>
          </div>

          <p className="font-whisper text-xs text-text-muted italic">
            Press Escape to close
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Generating state overlay (small, non-intrusive)
function GeneratingIndicator({ milestoneName }: { milestoneName: string }) {
  return (
    <motion.div
      className={cn(
        'fixed bottom-6 right-6 z-40',
        'px-4 py-3 rounded-xl',
        'bg-void/90 backdrop-blur-md',
        'border border-violet/40'
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
    >
      <div className="flex items-center gap-3">
        {/* Mini spinner */}
        <div className="relative w-6 h-6">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-violet/30 border-t-violet"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>

        <div>
          <p className="font-display text-sm text-text-primary">
            Evolution generating...
          </p>
          <p className="font-whisper text-xs text-text-muted italic">
            {milestoneName} is transforming
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Main component
export function EvolutionPlayer({
  milestoneId,
  milestoneName,
  videoUrl,
  isGenerating,
  onClose,
  isOpen,
}: EvolutionPlayerProps) {
  // Track if we've notified about the video being ready
  const [hasNotified, setHasNotified] = useState(false);

  // Reset notification when milestone changes
  useEffect(() => {
    setHasNotified(false);
  }, [milestoneId]);

  // Mark as notified when video becomes available
  useEffect(() => {
    if (videoUrl && !isGenerating && !hasNotified) {
      setHasNotified(true);
    }
  }, [videoUrl, isGenerating, hasNotified]);

  return (
    <>
      {/* State 1: Generating indicator (non-intrusive) */}
      <AnimatePresence>
        {isGenerating && !videoUrl && (
          <GeneratingIndicator milestoneName={milestoneName} />
        )}
      </AnimatePresence>

      {/* State 2: Ready notification badge */}
      <AnimatePresence>
        {!isGenerating && videoUrl && !isOpen && (
          <ReadyBadge milestoneName={milestoneName} />
        )}
      </AnimatePresence>

      {/* State 3: Video modal */}
      <AnimatePresence>
        {isOpen && videoUrl && (
          <VideoModal
            videoUrl={videoUrl}
            milestoneName={milestoneName}
            onClose={onClose}
          />
        )}
      </AnimatePresence>

      {/* Loading modal (when opened but video not ready yet) */}
      <AnimatePresence>
        {isOpen && !videoUrl && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Dark overlay */}
            <motion.div
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Loading content */}
            <motion.div
              className={cn(
                'relative z-10 p-8 rounded-2xl',
                'bg-void/95 border border-violet/40',
                'flex flex-col items-center gap-6'
              )}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              {/* Close button */}
              <motion.button
                className={cn(
                  'absolute top-4 right-4',
                  'w-8 h-8 rounded-full',
                  'bg-surface/40 hover:bg-surface/60',
                  'flex items-center justify-center',
                  'text-text-primary/80 hover:text-text-primary',
                  'transition-colors duration-200'
                )}
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-lg font-light">&times;</span>
              </motion.button>

              <EvolutionSpinner />

              <div className="text-center">
                <h3 className="font-display text-lg text-gold mb-2">
                  Evolution in Progress
                </h3>
                <p className="font-whisper text-sm text-text-secondary italic max-w-xs">
                  {milestoneName} is undergoing transformation...
                </p>
                <p className="font-body text-xs text-text-muted mt-3">
                  This may take 45-60 seconds
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default EvolutionPlayer;
