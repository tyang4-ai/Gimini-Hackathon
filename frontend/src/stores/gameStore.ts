import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import type {
  Element,
  ZoomPath,
  ZoomScene,
  DepthTier,
} from '@/types';
import { PRIMORDIALS } from '@/lib/elements';

// === STATE INTERFACE ===

interface GameState {
  // Core collections
  primordials: Element[];
  discoveredElements: Map<string, Element>;
  milestones: Map<string, Element>;

  // Zoom state
  zoomPath: ZoomPath;
  currentScene: ZoomScene | null;

  // Combine state
  combineSlots: [Element | null, Element | null];
  lastCombineResult: Element | null;

  // Stats
  totalDiscoveries: number;
  deepestDepth: DepthTier;
  contextTokens: number;

  // UI state
  isRevealing: boolean;
  revealElement: Element | null;
  showHint: string | null;
}

interface GameActions {
  // Combine actions
  addToSlot: (element: Element, slotIndex: 0 | 1) => void;
  clearSlots: () => void;

  // Discovery actions
  discoverElement: (element: Element) => void;

  // Zoom actions
  setCurrentScene: (scene: ZoomScene | null) => void;
  pushZoomPath: (scene: ZoomScene) => void;
  popZoomPath: () => ZoomScene | null;

  // Reveal actions
  startReveal: (element: Element) => void;
  endReveal: () => void;

  // UI actions
  setHint: (hint: string | null) => void;

  // Stats actions
  incrementTokens: (amount: number) => void;

  // Reset
  reset: () => void;
}

type GameStore = GameState & GameActions;

// === INITIAL STATE ===

const createInitialState = (): GameState => ({
  primordials: PRIMORDIALS,
  discoveredElements: new Map(),
  milestones: new Map(),

  zoomPath: {
    scenes: [],
    currentIndex: -1,
    maxDepthReached: 'I' as DepthTier,
  },
  currentScene: null,

  combineSlots: [null, null],
  lastCombineResult: null,

  totalDiscoveries: 0,
  deepestDepth: 'I' as DepthTier,
  contextTokens: 0,

  isRevealing: false,
  revealElement: null,
  showHint: null,
});

// === DEPTH COMPARISON HELPER ===

const DEPTH_ORDER: DepthTier[] = ['I', 'II', 'III', 'IV', 'V+'];

const compareDepth = (a: DepthTier, b: DepthTier): number => {
  return DEPTH_ORDER.indexOf(a) - DEPTH_ORDER.indexOf(b);
};

const maxDepth = (a: DepthTier, b: DepthTier): DepthTier => {
  return compareDepth(a, b) >= 0 ? a : b;
};

// === SERIALIZATION HELPERS ===

interface SerializedState {
  primordials: Element[];
  discoveredElements: [string, Element][];
  milestones: [string, Element][];
  zoomPath: ZoomPath;
  currentScene: ZoomScene | null;
  combineSlots: [Element | null, Element | null];
  lastCombineResult: Element | null;
  totalDiscoveries: number;
  deepestDepth: DepthTier;
  contextTokens: number;
  isRevealing: boolean;
  revealElement: Element | null;
  showHint: string | null;
}

const serializeState = (state: GameState): SerializedState => ({
  ...state,
  discoveredElements: Array.from(state.discoveredElements.entries()),
  milestones: Array.from(state.milestones.entries()),
});

const deserializeState = (serialized: SerializedState): GameState => ({
  ...serialized,
  discoveredElements: new Map(serialized.discoveredElements),
  milestones: new Map(serialized.milestones),
});

// === CUSTOM STORAGE ===

const customStorage: StateStorage = {
  getItem: (name: string): string | null => {
    const str = localStorage.getItem(name);
    if (!str) return null;

    try {
      const parsed = JSON.parse(str);
      if (parsed.state) {
        parsed.state = deserializeState(parsed.state as SerializedState);
      }
      return JSON.stringify(parsed);
    } catch {
      return str;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      const parsed = JSON.parse(value);
      if (parsed.state) {
        parsed.state = serializeState(parsed.state as GameState);
      }
      localStorage.setItem(name, JSON.stringify(parsed));
    } catch {
      localStorage.setItem(name, value);
    }
  },
  removeItem: (name: string): void => {
    localStorage.removeItem(name);
  },
};

// === STORE IMPLEMENTATION ===

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      ...createInitialState(),

      // === COMBINE ACTIONS ===

      addToSlot: (element: Element, slotIndex: 0 | 1) => {
        set((state) => {
          const newSlots: [Element | null, Element | null] = [...state.combineSlots];
          newSlots[slotIndex] = element;
          return { combineSlots: newSlots };
        });
      },

      clearSlots: () => {
        set({ combineSlots: [null, null], lastCombineResult: null });
      },

      // === DISCOVERY ACTIONS ===

      discoverElement: (element: Element) => {
        set((state) => {
          // Check if already discovered
          if (state.discoveredElements.has(element.id)) {
            return state;
          }

          const newDiscovered = new Map(state.discoveredElements);
          newDiscovered.set(element.id, {
            ...element,
            discoveredAt: new Date(),
          });

          // Track milestones separately
          const newMilestones = new Map(state.milestones);
          if (element.category === 'milestone') {
            newMilestones.set(element.id, element);
          }

          // Update deepest depth
          const newDeepest = maxDepth(state.deepestDepth, element.depth);

          return {
            discoveredElements: newDiscovered,
            milestones: newMilestones,
            totalDiscoveries: state.totalDiscoveries + 1,
            deepestDepth: newDeepest,
            lastCombineResult: element,
          };
        });
      },

      // === ZOOM ACTIONS ===

      setCurrentScene: (scene: ZoomScene | null) => {
        set({ currentScene: scene });
      },

      pushZoomPath: (scene: ZoomScene) => {
        set((state) => {
          const newScenes = [...state.zoomPath.scenes, scene];
          const newMaxDepth = maxDepth(state.zoomPath.maxDepthReached, scene.depth);

          return {
            zoomPath: {
              scenes: newScenes,
              currentIndex: newScenes.length - 1,
              maxDepthReached: newMaxDepth,
            },
            currentScene: scene,
            deepestDepth: maxDepth(state.deepestDepth, scene.depth),
          };
        });
      },

      popZoomPath: () => {
        const state = get();
        if (state.zoomPath.scenes.length === 0) {
          return null;
        }

        const newScenes = state.zoomPath.scenes.slice(0, -1);
        const previousScene = newScenes.length > 0
          ? newScenes[newScenes.length - 1]
          : null;

        set({
          zoomPath: {
            ...state.zoomPath,
            scenes: newScenes,
            currentIndex: newScenes.length - 1,
          },
          currentScene: previousScene,
        });

        return previousScene;
      },

      // === REVEAL ACTIONS ===

      startReveal: (element: Element) => {
        set({
          isRevealing: true,
          revealElement: element,
        });
      },

      endReveal: () => {
        set({
          isRevealing: false,
          revealElement: null,
        });
      },

      // === UI ACTIONS ===

      setHint: (hint: string | null) => {
        set({ showHint: hint });
      },

      // === STATS ACTIONS ===

      incrementTokens: (amount: number) => {
        set((state) => ({
          contextTokens: state.contextTokens + amount,
        }));
      },

      // === RESET ===

      reset: () => {
        set(createInitialState());
      },
    }),
    {
      name: 'omnigenesis-game-storage',
      storage: createJSONStorage(() => customStorage),
      partialize: (state) => ({
        // Only persist these fields
        discoveredElements: state.discoveredElements,
        milestones: state.milestones,
        totalDiscoveries: state.totalDiscoveries,
        deepestDepth: state.deepestDepth,
        contextTokens: state.contextTokens,
        // Zoom path is not persisted - always start fresh
        // Combine slots are not persisted - always start fresh
        // UI state is not persisted - always start fresh
      }),
    }
  )
);

// === SELECTORS ===

export const selectDiscoveredCount = (state: GameStore) => {
  if (state.discoveredElements instanceof Map) return state.discoveredElements.size;
  if (Array.isArray(state.discoveredElements)) return state.discoveredElements.length;
  return 0;
};
export const selectMilestoneCount = (state: GameStore) => {
  if (state.milestones instanceof Map) return state.milestones.size;
  if (Array.isArray(state.milestones)) return state.milestones.length;
  return 0;
};
export const selectZoomDepth = (state: GameStore) => state.zoomPath.scenes.length;
export const selectCanCombine = (state: GameStore) =>
  state.combineSlots[0] !== null && state.combineSlots[1] !== null;
export const selectHasDiscovered = (state: GameStore, elementId: string) => {
  if (state.discoveredElements instanceof Map) return state.discoveredElements.has(elementId);
  if (Array.isArray(state.discoveredElements)) return state.discoveredElements.some(([id]) => id === elementId);
  return false;
};

// === DERIVED DATA ===

// These hooks access derived data from the store
// We access the Map directly and convert to array in the component to avoid
// creating new arrays on every selector call

// Get the discovered elements Map directly - components should convert to array as needed
export const useDiscoveredElementsMap = () =>
  useGameStore((state) => state.discoveredElements);

// Get the milestones Map directly
export const useMilestonesMap = () =>
  useGameStore((state) => state.milestones);

// Get zoom scenes array directly (already an array, no conversion needed)
export const useZoomScenes = () =>
  useGameStore((state) => state.zoomPath.scenes);

// Helper hooks that return arrays - use with caution, may cause re-renders
// Only use when you need the array form and understand the re-render implications
export const useDiscoveredElements = () => {
  const map = useGameStore((state) => state.discoveredElements);
  // Handle case where data might not be a proper Map (e.g., from corrupted localStorage)
  if (map instanceof Map) {
    return Array.from(map.values());
  }
  // If it's an array of entries, convert to values
  if (Array.isArray(map)) {
    return map.map(([, value]) => value);
  }
  return [];
};

export const useMilestones = () => {
  const map = useGameStore((state) => state.milestones);
  // Handle case where data might not be a proper Map
  if (map instanceof Map) {
    return Array.from(map.values());
  }
  if (Array.isArray(map)) {
    return map.map(([, value]) => value);
  }
  return [];
};

export const useZoomBreadcrumbs = () => {
  const scenes = useGameStore((state) => state.zoomPath.scenes);
  return scenes.map((scene) => ({
    id: scene.id,
    name: scene.description.split(' ').slice(0, 3).join(' ') + '...',
    depth: scene.depth,
  }));
};
