'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, useDiscoveredElements } from '@/stores/gameStore';
import { ElementCard } from '@/components/ElementCard';
import { ZoomViewport } from '@/components/ZoomViewport';
import { MilestoneReveal } from '@/components/MilestoneReveal';
import { EvolutionPlayer } from '@/components/EvolutionPlayer';
import { ParticleField } from '@/components/ui/ParticleField';
import { useCombine } from '@/hooks/useCombine';
import { cn } from '@/utils/cn';
import type { Element, SceneElement, ZoomResponse, DepthTier } from '@/types';

// Group primordials by their category for display
const PRIMORDIAL_GROUPS = ['matter', 'senses', 'abstract'] as const;

// Evolution state interface
interface EvolutionState {
  milestoneId: string;
  milestoneName: string;
  isGenerating: boolean;
  videoUrl?: string;
  isPlayerOpen: boolean;
}

export default function GamePage() {
  const {
    primordials,
    discoveredElements,
    currentScene,
    zoomPath,
    deepestDepth,
    contextTokens,
    totalDiscoveries,
    setCurrentScene,
    pushZoomPath,
    popZoomPath,
    isRevealing,
    revealElement,
    startReveal,
    endReveal,
  } = useGameStore();

  const discovered = useDiscoveredElements();

  const [isZoomLoading, setIsZoomLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Evolution tracking state
  const [evolution, setEvolution] = useState<EvolutionState | null>(null);
  const evolutionPollingRef = useRef<NodeJS.Timeout | null>(null);

  // Combine hook for element-to-element combining
  const { combine, isLoading: isCombining, error: combineError } = useCombine();

  // State to control error toast visibility
  const [showCombineError, setShowCombineError] = useState(false);

  // Show error toast when combine error occurs
  useEffect(() => {
    if (combineError) {
      setShowCombineError(true);
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => setShowCombineError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [combineError]);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle zoom into element from viewport
  const handleZoomIntoElement = useCallback(async (element: SceneElement) => {
    if (!element.canZoomInto) return;

    setIsZoomLoading(true);

    try {
      const response = await fetch('/api/zoom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          elementId: element.id,
          currentDepth: currentScene?.depth || 'I',
          contextSummary: `Zooming into ${element.name} from depth ${currentScene?.depth || 'I'}`,
          // Pass scene element data for dynamically generated elements
          sceneElementData: {
            name: element.name,
            emoji: element.emoji,
            whisper: element.whisper,
          },
        }),
      });

      const data: ZoomResponse = await response.json();

      if (data.success && data.scene) {
        pushZoomPath(data.scene);
      } else {
        console.error('Zoom failed:', data.error);
      }
    } catch (error) {
      console.error('Zoom API error:', error);
    } finally {
      setIsZoomLoading(false);
    }
  }, [currentScene, pushZoomPath]);

  // Handle zoom into element from sidebar (primordials or discovered)
  const handleElementZoom = useCallback(async (element: Element) => {
    setIsZoomLoading(true);

    try {
      const response = await fetch('/api/zoom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          elementId: element.id,
          currentDepth: 'I' as DepthTier,
          contextSummary: `Initial zoom into ${element.name}`,
        }),
      });

      const data: ZoomResponse = await response.json();

      if (data.success && data.scene) {
        pushZoomPath(data.scene);
      } else {
        console.error('Zoom failed:', data.error);
      }
    } catch (error) {
      console.error('Zoom API error:', error);
    } finally {
      setIsZoomLoading(false);
    }
  }, [pushZoomPath]);

  // Handle zoom out / ascend
  const handleZoomOut = useCallback(() => {
    popZoomPath();
  }, [popZoomPath]);

  // Handle element-to-element combine (Infinite Craft style)
  const handleElementCombine = useCallback(async (draggedId: string, targetId: string) => {
    if (isCombining) return;

    const result = await combine(draggedId, targetId);

    if (result) {
      const { element, isMilestone, isFirstDiscovery } = result;
      console.log('Combined:', element.name, { isMilestone, isFirstDiscovery });

      // If it's a milestone and first discovery, trigger the reveal animation
      if (isMilestone && isFirstDiscovery && element.category === 'milestone') {
        startReveal(element);
      }
    }
  }, [combine, isCombining, startReveal]);

  // Cleanup evolution polling on unmount
  useEffect(() => {
    return () => {
      if (evolutionPollingRef.current) {
        clearInterval(evolutionPollingRef.current);
      }
    };
  }, []);

  // Start evolution generation for a milestone
  const startEvolution = useCallback(async (milestone: Element) => {
    if (milestone.category !== 'milestone') return;

    setEvolution({
      milestoneId: milestone.id,
      milestoneName: milestone.name,
      isGenerating: true,
      isPlayerOpen: false,
    });

    try {
      // Start the evolution job via /api/evolution
      const response = await fetch('/api/evolution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestoneId: milestone.id }),
      });

      const data = await response.json();

      if (!data.success || !data.operationName) {
        console.error('Failed to start evolution:', data.error);
        setEvolution(null);
        return;
      }

      // Poll for evolution status using operationName
      const operationName = data.operationName;
      evolutionPollingRef.current = setInterval(async () => {
        try {
          const statusResponse = await fetch(`/api/evolution?operationName=${encodeURIComponent(operationName)}`);
          const statusData = await statusResponse.json();

          if (statusData.status === 'complete' && statusData.videoUrl) {
            // Evolution complete - update state with video URL
            setEvolution((prev) =>
              prev
                ? {
                    ...prev,
                    isGenerating: false,
                    videoUrl: statusData.videoUrl,
                  }
                : null
            );

            // Stop polling
            if (evolutionPollingRef.current) {
              clearInterval(evolutionPollingRef.current);
              evolutionPollingRef.current = null;
            }
          } else if (statusData.status === 'failed') {
            console.error('Evolution failed:', statusData.error);
            setEvolution(null);

            if (evolutionPollingRef.current) {
              clearInterval(evolutionPollingRef.current);
              evolutionPollingRef.current = null;
            }
          }
          // Keep polling if still 'generating'
        } catch (error) {
          console.error('Error polling evolution status:', error);
        }
      }, 5000); // Poll every 5 seconds (Veo takes 45-60 seconds)
    } catch (error) {
      console.error('Error starting evolution:', error);
      setEvolution(null);
    }
  }, []);

  // Handle milestone reveal completion
  const handleRevealComplete = useCallback(() => {
    const element = revealElement;
    endReveal();

    // After reveal animation completes, start evolution for milestones
    if (element && element.category === 'milestone') {
      startEvolution(element);
    }
  }, [revealElement, endReveal, startEvolution]);

  // Handle evolution player close
  const handleEvolutionClose = useCallback(() => {
    setEvolution((prev) =>
      prev ? { ...prev, isPlayerOpen: false } : null
    );
  }, []);

  // Handle clicking on the evolution ready badge
  const handleEvolutionOpen = useCallback(() => {
    setEvolution((prev) =>
      prev ? { ...prev, isPlayerOpen: true } : null
    );
  }, []);

  // Group discovered elements by depth for display
  const discoveredByDepth = discovered.reduce((acc: Record<DepthTier, Element[]>, el: Element) => {
    const depth = el.depth || 'I';
    if (!acc[depth]) acc[depth] = [];
    acc[depth].push(el);
    return acc;
  }, {} as Record<DepthTier, Element[]>);

  // Format token count for display
  const formatTokens = (tokens: number): string => {
    if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(1)}M`;
    if (tokens >= 1000) return `${(tokens / 1000).toFixed(0)}K`;
    return tokens.toString();
  };

  return (
    <div className="min-h-screen bg-white bg-dot-pattern flex flex-col relative">
      {/* Subtle background particle effect */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
        <ParticleField particleCount={30} speed={0.3} />
      </div>

      {/* Header - Apple-style frosted glass */}
      <header className="h-14 border-b border-border bg-white/80 backdrop-blur-xl px-4 flex items-center justify-between shrink-0 relative z-10">
        {/* Logo and title */}
        <div className="flex items-center gap-3">
          {/* Mobile sidebar toggle */}
          {isMobile && (
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg bg-surface hover:bg-surface/80 transition-colors"
            >
              <span className="text-lg text-text-primary">{isSidebarOpen ? '✕' : '☰'}</span>
            </button>
          )}

          <motion.h1
            className="font-display text-xl font-bold text-text-primary tracking-wider"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-accent-orange">THE</span>{' '}
            <span className="text-accent-violet">MEMORY</span>
          </motion.h1>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6">
          {/* Discovery count */}
          <div className="flex items-center gap-2">
            <span className="text-text-secondary text-sm">Remembered:</span>
            <motion.span
              className="font-display font-semibold text-teal"
              key={totalDiscoveries}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
            >
              {totalDiscoveries}
            </motion.span>
          </div>

          {/* Depth indicator */}
          <div className="flex items-center gap-2">
            <span className="text-text-secondary text-sm">Depth:</span>
            <span className={cn(
              'font-display font-semibold',
              deepestDepth === 'I' && 'text-teal',
              deepestDepth === 'II' && 'text-violet',
              deepestDepth === 'III' && 'text-rose',
              deepestDepth === 'IV' && 'text-gold',
              deepestDepth === 'V+' && 'text-ice',
            )}>
              {deepestDepth}
            </span>
          </div>

          {/* Token usage - hidden on very small screens */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-text-secondary text-sm">Memory:</span>
            <span className="font-display font-semibold text-teal">
              {formatTokens(contextTokens)}
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Sidebar - Apple-style light gray */}
        <AnimatePresence>
          {(isSidebarOpen || !isMobile) && (
            <motion.aside
              className={cn(
                'w-[280px] shrink-0 border-r border-border',
                'bg-surface overflow-y-auto',
                'flex flex-col',
                isMobile && 'absolute inset-y-14 left-0 z-40'
              )}
              initial={{ x: isMobile ? -280 : 0, opacity: isMobile ? 0 : 1 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* Primordials section */}
              <div className="p-4 border-b border-border">
                <h2 className="font-display text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
                  Primordials
                </h2>
                <div className="grid grid-cols-4 gap-3">
                  {primordials.map((element, index) => (
                    <motion.div
                      key={element.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <ElementCard
                        element={element}
                        size="sm"
                        draggable={true}
                        onClick={() => handleElementZoom(element)}
                        onCombine={handleElementCombine}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Remembered (discovered) section */}
              <div className="p-4 flex-1 overflow-y-auto">
                <h2 className="font-display text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
                  Remembered
                </h2>

                {discovered.length === 0 ? (
                  <p className="text-text-muted text-sm font-whisper italic">
                    Combine elements to discover new memories...
                  </p>
                ) : (
                  <div className="space-y-4">
                    {(['II', 'III', 'IV', 'V+'] as DepthTier[]).map((depth) => {
                      const elementsAtDepth = discoveredByDepth[depth];
                      if (!elementsAtDepth?.length) return null;

                      return (
                        <div key={depth}>
                          <h3 className={cn(
                            'text-xs font-display font-medium mb-4',
                            depth === 'II' && 'text-violet',
                            depth === 'III' && 'text-rose',
                            depth === 'IV' && 'text-gold',
                            depth === 'V+' && 'text-ice',
                          )}>
                            Depth {depth}
                          </h3>
                          <div className="grid grid-cols-4 gap-x-2 gap-y-8 pb-6">
                            {elementsAtDepth.map((element: Element) => (
                              <ElementCard
                                key={element.id}
                                element={element}
                                size="sm"
                                draggable={true}
                                onClick={() => handleElementZoom(element)}
                                onCombine={handleElementCombine}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Evolution status - placeholder for future implementation */}
              <div className="p-4 border-t border-border">
                <div className="text-xs text-text-muted font-whisper italic text-center">
                  {zoomPath.scenes.length > 0
                    ? `Currently at depth ${zoomPath.scenes.length}`
                    : 'Click an element to begin exploring...'}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Mobile overlay */}
        {isMobile && isSidebarOpen && (
          <motion.div
            className="absolute inset-0 bg-black/20 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main viewport area */}
        <main className="flex-1 flex flex-col p-4 overflow-hidden bg-white">
          {/* Zoom Viewport - now takes full height since CombineZone is removed */}
          <div className="flex-1 min-h-0">
            <ZoomViewport
              onElementClick={handleZoomIntoElement}
              onCombine={handleElementCombine}
              className="h-full"
            />
          </div>
        </main>
      </div>

      {/* Combining indicator */}
      <AnimatePresence>
        {isCombining && (
          <motion.div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-accent-blue/30 shadow-elevated flex items-center gap-3">
              <motion.div
                className="w-4 h-4 border-2 border-accent-blue/30 border-t-accent-blue rounded-full"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
              />
              <span className="text-sm font-display text-text-primary">Combining...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Combine error toast */}
      <AnimatePresence>
        {showCombineError && combineError && (
          <motion.div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="px-4 py-3 rounded-xl bg-white/95 backdrop-blur-md border border-rose/30 shadow-elevated flex items-center gap-3 max-w-md">
              <span className="text-rose text-lg">⚠</span>
              <div className="flex-1">
                <p className="text-sm font-display text-rose">Combine Failed</p>
                <p className="text-xs text-text-secondary mt-0.5">{combineError}</p>
              </div>
              <button
                onClick={() => setShowCombineError(false)}
                className="text-text-secondary hover:text-text-primary transition-colors p-1"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Milestone Reveal Overlay */}
      {revealElement && (
        <MilestoneReveal
          element={revealElement}
          isVisible={isRevealing}
          onComplete={handleRevealComplete}
        />
      )}

      {/* Evolution Player - handles generating indicator, ready badge, and video modal */}
      {evolution && (
        <div onClick={evolution.videoUrl && !evolution.isPlayerOpen ? handleEvolutionOpen : undefined}>
          <EvolutionPlayer
            milestoneId={evolution.milestoneId}
            milestoneName={evolution.milestoneName}
            videoUrl={evolution.videoUrl}
            isGenerating={evolution.isGenerating}
            isOpen={evolution.isPlayerOpen}
            onClose={handleEvolutionClose}
          />
        </div>
      )}
    </div>
  );
}
