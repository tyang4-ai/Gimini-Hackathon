import { useState, useCallback, useMemo } from 'react';
import { useGameStore, useZoomBreadcrumbs } from '@/stores/gameStore';
import { DEMO_MODE, getDemoScene } from '@/lib/demoData';
import type { ZoomScene, ZoomResponse, DepthTier, SceneElement } from '@/types';

// === RESULT INTERFACE ===

export interface UseZoomResult {
  zoomInto: (elementId: string, sceneElement?: SceneElement) => Promise<ZoomScene | null>;
  zoomOut: () => void;
  zoomToScene: (sceneIndex: number) => void;
  isLoading: boolean;
  error: string | null;
  currentScene: ZoomScene | null;
  sceneHistory: ZoomScene[];
  breadcrumbs: Array<{ id: string; name: string; depth: DepthTier }>;
  canZoomOut: boolean;
}

// === DEPTH HELPER ===

const DEPTH_ORDER: DepthTier[] = ['I', 'II', 'III', 'IV', 'V+'];

const getNextDepth = (current: DepthTier): DepthTier => {
  const currentIndex = DEPTH_ORDER.indexOf(current);
  if (currentIndex === -1 || currentIndex >= DEPTH_ORDER.length - 1) {
    return 'V+';
  }
  return DEPTH_ORDER[currentIndex + 1];
};

// === HOOK IMPLEMENTATION ===

export function useZoom(): UseZoomResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get store state and actions
  const currentScene = useGameStore((state) => state.currentScene);
  const zoomPath = useGameStore((state) => state.zoomPath);
  const deepestDepth = useGameStore((state) => state.deepestDepth);
  const discoveredElements = useGameStore((state) => state.discoveredElements);

  const setCurrentScene = useGameStore((state) => state.setCurrentScene);
  const pushZoomPath = useGameStore((state) => state.pushZoomPath);
  const popZoomPath = useGameStore((state) => state.popZoomPath);
  const setHint = useGameStore((state) => state.setHint);

  // Get breadcrumbs from derived selector
  const breadcrumbs = useZoomBreadcrumbs();

  // Build context summary from discovered elements for API calls
  const contextSummary = useMemo(() => {
    // Handle case where discoveredElements might not be a proper Map
    let elements: any[];
    if (discoveredElements instanceof Map) {
      elements = Array.from(discoveredElements.values());
    } else if (Array.isArray(discoveredElements)) {
      elements = discoveredElements.map(([, value]) => value);
    } else {
      elements = [];
    }
    if (elements.length === 0) return '';

    // Create a brief summary of discovered elements for context callbacks
    const milestones = elements.filter((e) => e.category === 'milestone');
    const recent = elements.slice(-10);

    const milestoneNames = milestones.map((m) => m.name).join(', ');
    const recentNames = recent.map((r) => r.name).join(', ');

    return `Milestones: ${milestoneNames || 'none'}. Recent: ${recentNames || 'none'}.`;
  }, [discoveredElements]);

  // Zoom into an element
  const zoomInto = useCallback(
    async (elementId: string, sceneElement?: SceneElement): Promise<ZoomScene | null> => {
      setIsLoading(true);
      setError(null);

      try {
        // Check for demo mode first
        if (DEMO_MODE) {
          const cachedScene = getDemoScene(elementId);
          if (cachedScene) {
            console.log('[DEMO] Using cached scene for:', elementId);

            // Push the scene to the zoom path (this also sets currentScene)
            pushZoomPath(cachedScene);

            // If there's a memory fragment, show it as a hint
            if (cachedScene.memoryFragment) {
              setHint(cachedScene.memoryFragment);
            }

            // If there's a context callback, show it as a hint
            if (cachedScene.contextCallback) {
              setHint(cachedScene.contextCallback.text);
            }

            setIsLoading(false);
            return cachedScene;
          }
          // If no cached data in demo mode, log and continue to API call
          console.log('[DEMO] No cached scene for:', elementId, '- falling back to API');
        }

        // Determine current depth based on zoom path
        const currentDepth: DepthTier =
          zoomPath.scenes.length > 0
            ? getNextDepth(zoomPath.scenes[zoomPath.scenes.length - 1].depth)
            : 'I';

        // Call the zoom API
        const response = await fetch('/api/zoom', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            elementId,
            currentDepth,
            contextSummary,
            // Pass scene element data for dynamically generated elements
            sceneElementData: sceneElement ? {
              name: sceneElement.name,
              emoji: sceneElement.emoji,
              whisper: sceneElement.whisper,
            } : undefined,
          }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const data: ZoomResponse = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Zoom failed');
        }

        if (!data.scene) {
          throw new Error('No scene returned from API');
        }

        const scene = data.scene;

        // Push the scene to the zoom path (this also sets currentScene)
        pushZoomPath(scene);

        // If there's a memory fragment, show it as a hint
        if (scene.memoryFragment) {
          setHint(scene.memoryFragment);
        }

        // If there's a context callback, show it as a hint
        if (scene.contextCallback) {
          setHint(scene.contextCallback.text);
        }

        setIsLoading(false);
        return scene;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(errorMessage);
        setIsLoading(false);
        return null;
      }
    },
    [zoomPath.scenes, contextSummary, pushZoomPath, setHint]
  );

  // Zoom out one level (go back)
  const zoomOut = useCallback(() => {
    setError(null);
    popZoomPath();
  }, [popZoomPath]);

  // Zoom to a specific scene in history (breadcrumb navigation)
  const zoomToScene = useCallback(
    (sceneIndex: number) => {
      setError(null);

      if (sceneIndex < 0 || sceneIndex >= zoomPath.scenes.length) {
        return;
      }

      // Pop scenes until we reach the desired index
      const scenesToPop = zoomPath.scenes.length - sceneIndex - 1;
      for (let i = 0; i < scenesToPop; i++) {
        popZoomPath();
      }
    },
    [zoomPath.scenes.length, popZoomPath]
  );

  // Can zoom out if there are scenes in the path
  const canZoomOut = zoomPath.scenes.length > 0;

  return {
    zoomInto,
    zoomOut,
    zoomToScene,
    isLoading,
    error,
    currentScene,
    sceneHistory: zoomPath.scenes,
    breadcrumbs,
    canZoomOut,
  };
}

export default useZoom;
