# Omnigenesis: The Memory - Product Specification v9 (Implementation Details)

## Document Status

| Field | Value |
|-------|-------|
| **Version** | v9 (Implementation Details) |
| **Built on** | v6 (base) + v7 (delta) + v8 (final polish) + v9 (implementation) |
| **Created** | January 31, 2026 |
| **Purpose** | Developer-ready implementation specifications |

---

## What This Document Contains

v9 adds IMPLEMENTATION DETAILS that developers can code from directly:

| Section | Content |
|---------|---------|
| 1. Code Architecture | Exact file structure, TypeScript interfaces, Zustand stores, API routes |
| 2. UI Layout Specifications | Pixel measurements, responsive breakpoints, grid specs, z-index layers |
| 3. Color Scheme | Complete "Celestial Dreams" palette with all hex values |
| 4. Animation Specifications | Framer Motion configs, timing functions, all transitions |
| 5. Sound Design | Trigger points, timing, volume levels, file specs |

**Reference v6-v8 for:** Core mechanics, narrative, demo script, risk assessment, success criteria.

---

## Section 1: Code Architecture

### 1.1 Project File Structure

```
omnigenesis/
├── src/
│   ├── app/                          # Next.js 14 App Router
│   │   ├── layout.tsx                # Root layout with providers
│   │   ├── page.tsx                  # Main game page
│   │   ├── globals.css               # Global styles + CSS variables
│   │   └── api/
│   │       ├── combine/
│   │       │   └── route.ts          # POST - Combine two elements
│   │       ├── zoom/
│   │       │   └── route.ts          # POST - Zoom into element
│   │       ├── evolve/
│   │       │   ├── route.ts          # POST - Start evolution
│   │       │   └── [id]/
│   │       │       └── route.ts      # GET - Check evolution status
│   │       └── context/
│   │           └── route.ts          # GET - Get context summary
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx            # Top bar with stats
│   │   │   ├── Sidebar.tsx           # Element palette container
│   │   │   └── MainArea.tsx          # Viewport + combine zone
│   │   │
│   │   ├── elements/
│   │   │   ├── ElementCard.tsx       # Draggable element
│   │   │   ├── ElementGrid.tsx       # Grid of elements
│   │   │   ├── PrimordialPalette.tsx # 12 primordials
│   │   │   └── MemoryArchive.tsx     # Discovered elements
│   │   │
│   │   ├── combine/
│   │   │   ├── CombineZone.tsx       # Drop zone for combining
│   │   │   ├── CombineSlot.tsx       # Individual slot
│   │   │   └── CombineResult.tsx     # Result display
│   │   │
│   │   ├── zoom/
│   │   │   ├── ZoomViewport.tsx      # Main scene display
│   │   │   ├── ZoomScene.tsx         # Scene with clickable elements
│   │   │   ├── ZoomTransition.tsx    # Zoom animation wrapper
│   │   │   └── DepthIndicator.tsx    # Current depth display
│   │   │
│   │   ├── reveal/
│   │   │   ├── MilestoneReveal.tsx   # 9-second reveal sequence
│   │   │   ├── RevealPhase.tsx       # Individual phase component
│   │   │   └── RevealParticles.tsx   # Particle effects
│   │   │
│   │   ├── evolution/
│   │   │   ├── EvolutionQueue.tsx    # Pending evolutions indicator
│   │   │   ├── EvolutionNotice.tsx   # "Memory forming" notice
│   │   │   └── EvolutionVideo.tsx    # Video player
│   │   │
│   │   ├── context/
│   │   │   ├── ContextCallback.tsx   # "This reminds you of..."
│   │   │   └── TokenCounter.tsx      # Memory token display
│   │   │
│   │   ├── hints/
│   │   │   └── RecipeHint.tsx        # Subtle hint overlay
│   │   │
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Tooltip.tsx
│   │       └── ParticleField.tsx     # Background particles
│   │
│   ├── stores/
│   │   ├── gameStore.ts              # Main Zustand store
│   │   ├── evolutionStore.ts         # Evolution queue state
│   │   └── audioStore.ts             # Sound state
│   │
│   ├── hooks/
│   │   ├── useCombine.ts             # Combine logic hook
│   │   ├── useZoom.ts                # Zoom navigation hook
│   │   ├── useEvolution.ts           # Evolution polling hook
│   │   ├── useDragElement.ts         # Drag-drop hook
│   │   ├── useRevealSequence.ts      # 9-second reveal hook
│   │   └── useSound.ts               # Audio playback hook
│   │
│   ├── lib/
│   │   ├── gemini.ts                 # Gemini API client
│   │   ├── prompts.ts                # All prompt templates
│   │   ├── elements.ts               # Element definitions
│   │   ├── milestones.ts             # Milestone registry
│   │   ├── hints.ts                  # Hint triggers
│   │   └── demo-data.ts              # Pre-generated demo content
│   │
│   ├── types/
│   │   ├── element.ts                # Element interfaces
│   │   ├── scene.ts                  # Zoom scene interfaces
│   │   ├── evolution.ts              # Evolution interfaces
│   │   └── api.ts                    # API request/response types
│   │
│   └── utils/
│       ├── cn.ts                     # className utility
│       └── constants.ts              # Magic numbers, timing values
│
├── public/
│   ├── demo-assets/                  # Pre-generated content
│   │   ├── primordials/              # 12 primordial images
│   │   ├── milestones/               # 15 milestone images
│   │   ├── zoom-scenes/              # 50 zoom scenes
│   │   ├── evolution-videos/         # 5 Veo videos
│   │   └── combinations/             # Pre-computed results
│   │
│   ├── sounds/                       # Audio files
│   │   ├── ambient.mp3
│   │   ├── combine-regular.mp3
│   │   ├── combine-milestone.mp3
│   │   ├── reveal-crescendo.mp3
│   │   ├── zoom-transition.mp3
│   │   └── discovery-chime.mp3
│   │
│   └── fonts/                        # Custom fonts
│
├── .env.local                        # API keys (not committed)
├── tailwind.config.ts
├── next.config.js
└── package.json
```

### 1.2 TypeScript Interfaces

#### Core Element Types (`src/types/element.ts`)

```typescript
// === ELEMENT TYPES ===

export type DepthTier = 'I' | 'II' | 'III' | 'IV' | 'V+';

export type ElementCategory = 'primordial' | 'intermediate' | 'milestone' | 'regular';

export interface BaseElement {
  id: string;
  name: string;
  emoji: string;
  whisper: string;              // Poetic one-liner (8-15 words)
  category: ElementCategory;
  depth: DepthTier;
  ancestry: string[];           // IDs of parent elements
  discoveredAt?: Date;
}

export interface PrimordialElement extends BaseElement {
  category: 'primordial';
  imageUrl: string;             // Pre-generated image
  group: 'matter' | 'senses' | 'abstract';
}

export interface IntermediateElement extends BaseElement {
  category: 'intermediate';
  leadsTo: string;              // Milestone ID this unlocks
  pathwayText: string;          // "On the path to LIFE"
}

export interface MilestoneElement extends BaseElement {
  category: 'milestone';
  imageUrl: string;             // Imagen 4 generated
  lore: string;                 // Full memory fragment (2-4 sentences)
  evolutionVideoUrl?: string;   // Veo 3.1 generated
  hasBeenEvolved: boolean;      // First discovery triggers auto-evolve
}

export interface RegularElement extends BaseElement {
  category: 'regular';
}

export type Element = PrimordialElement | IntermediateElement | MilestoneElement | RegularElement;

// === PRIMORDIALS ===

export const PRIMORDIALS: PrimordialElement[] = [
  // Matter
  { id: 'stone', name: 'Stone', emoji: '🪨', whisper: 'Memory made solid.', category: 'primordial', depth: 'I', ancestry: [], group: 'matter', imageUrl: '/demo-assets/primordials/stone.png' },
  { id: 'water', name: 'Water', emoji: '💧', whisper: 'The universe learning to flow.', category: 'primordial', depth: 'I', ancestry: [], group: 'matter', imageUrl: '/demo-assets/primordials/water.png' },
  { id: 'fire', name: 'Fire', emoji: '🔥', whisper: 'Change that refuses to stop.', category: 'primordial', depth: 'I', ancestry: [], group: 'matter', imageUrl: '/demo-assets/primordials/fire.png' },
  { id: 'air', name: 'Air', emoji: '💨', whisper: 'The breath between words.', category: 'primordial', depth: 'I', ancestry: [], group: 'matter', imageUrl: '/demo-assets/primordials/air.png' },

  // Senses
  { id: 'light', name: 'Light', emoji: '✨', whisper: 'The first thing the void saw.', category: 'primordial', depth: 'I', ancestry: [], group: 'senses', imageUrl: '/demo-assets/primordials/light.png' },
  { id: 'silence', name: 'Silence', emoji: '🤫', whisper: 'What sound was before it existed.', category: 'primordial', depth: 'I', ancestry: [], group: 'senses', imageUrl: '/demo-assets/primordials/silence.png' },
  { id: 'shimmer', name: 'Shimmer', emoji: '💫', whisper: 'Light that learned to dance.', category: 'primordial', depth: 'I', ancestry: [], group: 'senses', imageUrl: '/demo-assets/primordials/shimmer.png' },
  { id: 'void', name: 'Void', emoji: '🕳️', whisper: 'The space where everything isn\'t.', category: 'primordial', depth: 'I', ancestry: [], group: 'senses', imageUrl: '/demo-assets/primordials/void.png' },

  // Abstract
  { id: 'longing', name: 'Longing', emoji: '💭', whisper: 'The ache of almost.', category: 'primordial', depth: 'I', ancestry: [], group: 'abstract', imageUrl: '/demo-assets/primordials/longing.png' },
  { id: 'time', name: 'Time', emoji: '⏳', whisper: 'The river that carries all things.', category: 'primordial', depth: 'I', ancestry: [], group: 'abstract', imageUrl: '/demo-assets/primordials/time.png' },
  { id: 'mystery', name: 'Mystery', emoji: '❓', whisper: 'A question the universe asks itself.', category: 'primordial', depth: 'I', ancestry: [], group: 'abstract', imageUrl: '/demo-assets/primordials/mystery.png' },
  { id: 'wonder', name: 'Wonder', emoji: '🌟', whisper: 'The feeling of not knowing and loving it.', category: 'primordial', depth: 'I', ancestry: [], group: 'abstract', imageUrl: '/demo-assets/primordials/wonder.png' },
];

// === INTERMEDIATE ELEMENTS ===

export const INTERMEDIATE_ELEMENTS: Record<string, IntermediateElement> = {
  'potential': {
    id: 'potential',
    name: 'Potential',
    emoji: '✴️',
    whisper: 'Almost something. Almost alive. Almost.',
    category: 'intermediate',
    depth: 'I',
    ancestry: ['water', 'mystery'],
    leadsTo: 'life',
    pathwayText: 'On the path to LIFE'
  },
  'awareness': {
    id: 'awareness',
    name: 'Awareness',
    emoji: '👁️',
    whisper: 'The first flutter of noticing.',
    category: 'intermediate',
    depth: 'II',
    ancestry: ['life', 'wonder'],
    leadsTo: 'consciousness',
    pathwayText: 'On the path to CONSCIOUSNESS'
  },
  'foundation': {
    id: 'foundation',
    name: 'Foundation',
    emoji: '🏗️',
    whisper: 'Thought crystallized into purpose.',
    category: 'intermediate',
    depth: 'II',
    ancestry: ['consciousness', 'stone'],
    leadsTo: 'civilization',
    pathwayText: 'On the path to CIVILIZATION'
  },
  'conflict': {
    id: 'conflict',
    name: 'Conflict',
    emoji: '⚔️',
    whisper: 'When wants collide.',
    category: 'intermediate',
    depth: 'III',
    ancestry: ['civilization', 'fire'],
    leadsTo: 'war',
    pathwayText: 'On the path to WAR'
  },
  'reflection': {
    id: 'reflection',
    name: 'Reflection',
    emoji: '🪞',
    whisper: 'The mirror turned inward.',
    category: 'intermediate',
    depth: 'III',
    ancestry: ['consciousness', 'time'],
    leadsTo: 'wisdom',
    pathwayText: 'On the path to WISDOM'
  },
  'surrender': {
    id: 'surrender',
    name: 'Surrender',
    emoji: '🙏',
    whisper: 'Letting go is also a choice.',
    category: 'intermediate',
    depth: 'III',
    ancestry: ['consciousness', 'void'],
    leadsTo: 'transcendence',
    pathwayText: 'On the path to TRANSCENDENCE'
  },
};

// === MILESTONES ===

export const MILESTONES: Record<string, Omit<MilestoneElement, 'discoveredAt' | 'hasBeenEvolved'>> = {
  // Depth I
  'energy': {
    id: 'energy',
    name: 'Energy',
    emoji: '⚡',
    whisper: 'The first spark remembers.',
    category: 'milestone',
    depth: 'I',
    ancestry: ['fire', 'light'],
    imageUrl: '/demo-assets/milestones/energy.png',
    lore: 'The first spark. Before matter, there was only the possibility of change. Energy remembers what it was like to be the only thing that existed.',
  },
  'entropy': {
    id: 'entropy',
    name: 'Entropy',
    emoji: '🌀',
    whisper: 'Change flows in one direction.',
    category: 'milestone',
    depth: 'I',
    ancestry: ['void', 'time'],
    imageUrl: '/demo-assets/milestones/entropy.png',
    lore: 'Change flows in one direction. The universe learned to let go. Entropy is not decay—it is permission.',
  },
  'motion': {
    id: 'motion',
    name: 'Motion',
    emoji: '🌊',
    whisper: 'Stillness was the first death.',
    category: 'milestone',
    depth: 'I',
    ancestry: ['air', 'time'],
    imageUrl: '/demo-assets/milestones/motion.png',
    lore: 'Stillness was the first death. Movement was the first rebellion. Motion remembers when the universe chose to dance.',
  },

  // Depth II
  'life': {
    id: 'life',
    name: 'Life',
    emoji: '🌱',
    whisper: 'The universe opened its eyes.',
    category: 'milestone',
    depth: 'II',
    ancestry: ['potential', 'energy'],
    imageUrl: '/demo-assets/milestones/life.png',
    lore: 'The universe opened its eyes for the first time. It saw itself. It wondered. Life is the cosmos asking: what am I?',
    evolutionVideoUrl: '/demo-assets/evolution-videos/life-evolution.mp4',
  },
  'growth': {
    id: 'growth',
    name: 'Growth',
    emoji: '🌿',
    whisper: 'To grow is to believe in tomorrow.',
    category: 'milestone',
    depth: 'II',
    ancestry: ['life', 'time'],
    imageUrl: '/demo-assets/milestones/growth.png',
    lore: 'To grow is to believe in tomorrow. Life was the universe\'s first act of faith. Every cell division is a prayer.',
  },
  'death': {
    id: 'death',
    name: 'Death',
    emoji: '💀',
    whisper: 'Not an ending. A return.',
    category: 'milestone',
    depth: 'II',
    ancestry: ['life', 'entropy'],
    imageUrl: '/demo-assets/milestones/death.png',
    lore: 'Not an ending. A return. The universe whispering: I will remember you. Death is not loss—it is transformation.',
  },

  // Depth III
  'consciousness': {
    id: 'consciousness',
    name: 'Consciousness',
    emoji: '🧠',
    whisper: 'The universe asked its first question.',
    category: 'milestone',
    depth: 'III',
    ancestry: ['awareness', 'longing'],
    imageUrl: '/demo-assets/milestones/consciousness.png',
    lore: 'The universe asked its first question: Why? Consciousness is not a thing—it is a verb. The cosmos wondering about itself.',
    evolutionVideoUrl: '/demo-assets/evolution-videos/consciousness-evolution.mp4',
  },
  'love': {
    id: 'love',
    name: 'Love',
    emoji: '❤️',
    whisper: 'Two separate beings chose to be one.',
    category: 'milestone',
    depth: 'III',
    ancestry: ['consciousness', 'longing'],
    imageUrl: '/demo-assets/milestones/love.png',
    lore: 'Two separate beings chose to be one. The universe learned it was not alone. Love is gravity that works on souls.',
  },
  'civilization': {
    id: 'civilization',
    name: 'Civilization',
    emoji: '🏛️',
    whisper: 'They built towers to touch the sky.',
    category: 'milestone',
    depth: 'III',
    ancestry: ['foundation', 'time'],
    imageUrl: '/demo-assets/milestones/civilization.png',
    lore: 'They built towers to touch the sky. They wrote stories to outlive their bodies. Civilization is consciousness building a house.',
    evolutionVideoUrl: '/demo-assets/evolution-videos/civilization-evolution.mp4',
  },

  // Depth IV
  'war': {
    id: 'war',
    name: 'War',
    emoji: '⚔️',
    whisper: 'They learned to unmake each other.',
    category: 'milestone',
    depth: 'IV',
    ancestry: ['conflict', 'entropy'],
    imageUrl: '/demo-assets/milestones/war.png',
    lore: 'They learned to unmake each other. The universe wept. War is consciousness forgetting its own face.',
  },
  'wisdom': {
    id: 'wisdom',
    name: 'Wisdom',
    emoji: '📚',
    whisper: 'Pain was the harshest teacher.',
    category: 'milestone',
    depth: 'IV',
    ancestry: ['reflection', 'mystery'],
    imageUrl: '/demo-assets/milestones/wisdom.png',
    lore: 'Pain was the harshest teacher. But some learned. Wisdom is not knowledge—it is knowing what to do with knowledge.',
  },
  'transcendence': {
    id: 'transcendence',
    name: 'Transcendence',
    emoji: '🌌',
    whisper: 'A few stopped fearing the end.',
    category: 'milestone',
    depth: 'IV',
    ancestry: ['surrender', 'wonder'],
    imageUrl: '/demo-assets/milestones/transcendence.png',
    lore: 'A few stopped fearing the end. They stepped into it willingly. Transcendence is consciousness becoming everything.',
    evolutionVideoUrl: '/demo-assets/evolution-videos/transcendence-evolution.mp4',
  },
};
```

#### Zoom Scene Types (`src/types/scene.ts`)

```typescript
export interface ZoomScene {
  id: string;
  parentElementId: string;
  description: string;           // Poetic scene description
  elements: SceneElement[];      // 3-5 clickable elements
  depth: DepthTier;
  backgroundGradient: string;    // CSS gradient for scene
  memoryFragment?: string;       // Occasional lore hint
  contextCallback?: ContextCallback;
}

export interface SceneElement {
  id: string;
  name: string;
  emoji: string;
  whisper: string;
  position: {
    x: number;                   // Percentage 0-100
    y: number;                   // Percentage 0-100
  };
  canZoomInto: boolean;
  canCombine: boolean;
}

export interface ContextCallback {
  text: string;                  // "This reminds you of..."
  referencedElementId: string;
  referencedDepth: DepthTier;
}

export interface ZoomPath {
  scenes: ZoomScene[];
  currentIndex: number;
  maxDepthReached: DepthTier;
}
```

#### Evolution Types (`src/types/evolution.ts`)

```typescript
export type EvolutionStatus = 'pending' | 'generating' | 'complete' | 'failed';

export interface EvolutionJob {
  id: string;
  milestoneId: string;
  milestoneName: string;
  status: EvolutionStatus;
  progress: number;              // 0-100
  startedAt: Date;
  completedAt?: Date;
  videoUrl?: string;
  error?: string;
}

export interface EvolutionResult {
  videoUrl: string;
  duration: number;              // seconds
  newElements: Element[];        // Elements revealed after video
}
```

#### API Types (`src/types/api.ts`)

```typescript
// === COMBINE API ===

export interface CombineRequest {
  elementA: string;              // Element ID
  elementB: string;              // Element ID
  contextTokens: number;         // Current context size
}

export interface CombineResponse {
  success: boolean;
  result?: {
    element: Element;
    isMilestone: boolean;
    isIntermediate: boolean;
    isFirstDiscovery: boolean;
    hint?: string;               // Recipe hint if applicable
  };
  error?: string;
}

// === ZOOM API ===

export interface ZoomRequest {
  elementId: string;
  currentDepth: DepthTier;
  contextSummary: string;        // Compressed context for callbacks
}

export interface ZoomResponse {
  success: boolean;
  scene?: ZoomScene;
  error?: string;
}

// === EVOLVE API ===

export interface EvolveRequest {
  milestoneId: string;
}

export interface EvolveResponse {
  success: boolean;
  jobId?: string;
  error?: string;
}

export interface EvolveStatusResponse {
  status: EvolutionStatus;
  progress: number;
  videoUrl?: string;
  error?: string;
}
```

### 1.3 Zustand Store

#### Main Game Store (`src/stores/gameStore.ts`)

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Element, ZoomScene, ZoomPath, DepthTier } from '@/types';

interface GameState {
  // === ELEMENTS ===
  primordials: Element[];
  discoveredElements: Map<string, Element>;
  milestones: Map<string, Element>;

  // === ZOOM ===
  zoomPath: ZoomPath;
  currentScene: ZoomScene | null;

  // === COMBINE ===
  combineSlots: [Element | null, Element | null];
  lastCombineResult: Element | null;

  // === STATS ===
  totalDiscoveries: number;
  deepestDepth: DepthTier;
  contextTokens: number;

  // === UI STATE ===
  isRevealing: boolean;         // 9-second reveal active
  revealElement: Element | null;
  showHint: string | null;

  // === ACTIONS ===
  addToSlot: (element: Element, slotIndex: 0 | 1) => void;
  clearSlots: () => void;
  discoverElement: (element: Element) => void;
  setCurrentScene: (scene: ZoomScene) => void;
  pushZoomPath: (scene: ZoomScene) => void;
  popZoomPath: () => ZoomScene | null;
  startReveal: (element: Element) => void;
  endReveal: () => void;
  setHint: (hint: string | null) => void;
  incrementTokens: (amount: number) => void;
  reset: () => void;
}

const initialState = {
  primordials: PRIMORDIALS,
  discoveredElements: new Map(),
  milestones: new Map(),
  zoomPath: { scenes: [], currentIndex: -1, maxDepthReached: 'I' as DepthTier },
  currentScene: null,
  combineSlots: [null, null] as [Element | null, Element | null],
  lastCombineResult: null,
  totalDiscoveries: 12,         // Start with 12 primordials
  deepestDepth: 'I' as DepthTier,
  contextTokens: 0,
  isRevealing: false,
  revealElement: null,
  showHint: null,
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,

      addToSlot: (element, slotIndex) => {
        set(state => {
          const newSlots = [...state.combineSlots] as [Element | null, Element | null];
          newSlots[slotIndex] = element;
          return { combineSlots: newSlots };
        });
      },

      clearSlots: () => set({ combineSlots: [null, null], lastCombineResult: null }),

      discoverElement: (element) => {
        set(state => {
          const newDiscovered = new Map(state.discoveredElements);
          newDiscovered.set(element.id, element);

          const newMilestones = element.category === 'milestone'
            ? new Map(state.milestones).set(element.id, element)
            : state.milestones;

          return {
            discoveredElements: newDiscovered,
            milestones: newMilestones,
            totalDiscoveries: state.totalDiscoveries + 1,
            lastCombineResult: element,
          };
        });
      },

      setCurrentScene: (scene) => set({ currentScene: scene }),

      pushZoomPath: (scene) => {
        set(state => ({
          zoomPath: {
            scenes: [...state.zoomPath.scenes, scene],
            currentIndex: state.zoomPath.currentIndex + 1,
            maxDepthReached: compareDepths(scene.depth, state.zoomPath.maxDepthReached) > 0
              ? scene.depth
              : state.zoomPath.maxDepthReached,
          },
          currentScene: scene,
        }));
      },

      popZoomPath: () => {
        const state = get();
        if (state.zoomPath.scenes.length <= 1) return null;

        const newScenes = state.zoomPath.scenes.slice(0, -1);
        const previousScene = newScenes[newScenes.length - 1];

        set({
          zoomPath: {
            ...state.zoomPath,
            scenes: newScenes,
            currentIndex: state.zoomPath.currentIndex - 1,
          },
          currentScene: previousScene,
        });

        return previousScene;
      },

      startReveal: (element) => set({ isRevealing: true, revealElement: element }),
      endReveal: () => set({ isRevealing: false, revealElement: null }),

      setHint: (hint) => set({ showHint: hint }),

      incrementTokens: (amount) => {
        set(state => ({ contextTokens: state.contextTokens + amount }));
      },

      reset: () => set(initialState),
    }),
    {
      name: 'omnigenesis-game',
      partialize: (state) => ({
        discoveredElements: Array.from(state.discoveredElements.entries()),
        milestones: Array.from(state.milestones.entries()),
        totalDiscoveries: state.totalDiscoveries,
        deepestDepth: state.deepestDepth,
        contextTokens: state.contextTokens,
      }),
    }
  )
);

// Helper function
function compareDepths(a: DepthTier, b: DepthTier): number {
  const order = ['I', 'II', 'III', 'IV', 'V+'];
  return order.indexOf(a) - order.indexOf(b);
}
```

#### Evolution Store (`src/stores/evolutionStore.ts`)

```typescript
import { create } from 'zustand';
import type { EvolutionJob, EvolutionStatus } from '@/types';

interface EvolutionState {
  jobs: Map<string, EvolutionJob>;
  activeJobId: string | null;
  completedNotifications: string[];  // Job IDs ready to watch

  addJob: (job: EvolutionJob) => void;
  updateJobProgress: (jobId: string, progress: number) => void;
  completeJob: (jobId: string, videoUrl: string) => void;
  failJob: (jobId: string, error: string) => void;
  dismissNotification: (jobId: string) => void;
  getJob: (jobId: string) => EvolutionJob | undefined;
}

export const useEvolutionStore = create<EvolutionState>((set, get) => ({
  jobs: new Map(),
  activeJobId: null,
  completedNotifications: [],

  addJob: (job) => {
    set(state => {
      const newJobs = new Map(state.jobs);
      newJobs.set(job.id, job);
      return { jobs: newJobs, activeJobId: job.id };
    });
  },

  updateJobProgress: (jobId, progress) => {
    set(state => {
      const job = state.jobs.get(jobId);
      if (!job) return state;

      const newJobs = new Map(state.jobs);
      newJobs.set(jobId, { ...job, progress, status: 'generating' });
      return { jobs: newJobs };
    });
  },

  completeJob: (jobId, videoUrl) => {
    set(state => {
      const job = state.jobs.get(jobId);
      if (!job) return state;

      const newJobs = new Map(state.jobs);
      newJobs.set(jobId, {
        ...job,
        status: 'complete',
        progress: 100,
        videoUrl,
        completedAt: new Date(),
      });

      return {
        jobs: newJobs,
        completedNotifications: [...state.completedNotifications, jobId],
      };
    });
  },

  failJob: (jobId, error) => {
    set(state => {
      const job = state.jobs.get(jobId);
      if (!job) return state;

      const newJobs = new Map(state.jobs);
      newJobs.set(jobId, { ...job, status: 'failed', error });
      return { jobs: newJobs };
    });
  },

  dismissNotification: (jobId) => {
    set(state => ({
      completedNotifications: state.completedNotifications.filter(id => id !== jobId),
    }));
  },

  getJob: (jobId) => get().jobs.get(jobId),
}));
```

### 1.4 Custom Hooks

#### useCombine Hook (`src/hooks/useCombine.ts`)

```typescript
import { useState, useCallback } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { useEvolutionStore } from '@/stores/evolutionStore';
import type { Element, CombineResponse } from '@/types';

interface UseCombineReturn {
  combine: (elementA: Element, elementB: Element) => Promise<CombineResponse>;
  isLoading: boolean;
  error: string | null;
}

export function useCombine(): UseCombineReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { discoverElement, startReveal, setHint, contextTokens, incrementTokens } = useGameStore();
  const { addJob } = useEvolutionStore();

  const combine = useCallback(async (elementA: Element, elementB: Element): Promise<CombineResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/combine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          elementA: elementA.id,
          elementB: elementB.id,
          contextTokens,
        }),
      });

      const data: CombineResponse = await response.json();

      if (!data.success || !data.result) {
        throw new Error(data.error || 'Combination failed');
      }

      // Handle hint display
      if (data.result.hint) {
        setHint(data.result.hint);
        setTimeout(() => setHint(null), 4000);
      }

      // Handle milestone reveal
      if (data.result.isMilestone) {
        startReveal(data.result.element);

        // Auto-trigger evolution for first discovery
        if (data.result.isFirstDiscovery) {
          const evolutionResponse = await fetch('/api/evolve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ milestoneId: data.result.element.id }),
          });

          const evolutionData = await evolutionResponse.json();
          if (evolutionData.success && evolutionData.jobId) {
            addJob({
              id: evolutionData.jobId,
              milestoneId: data.result.element.id,
              milestoneName: data.result.element.name,
              status: 'pending',
              progress: 0,
              startedAt: new Date(),
            });
          }
        }
      } else {
        // Regular element - instant discovery
        discoverElement(data.result.element);
      }

      // Increment context tokens (simulate token usage)
      incrementTokens(Math.floor(Math.random() * 500) + 200);

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, [contextTokens, discoverElement, startReveal, setHint, incrementTokens, addJob]);

  return { combine, isLoading, error };
}
```

#### useRevealSequence Hook (`src/hooks/useRevealSequence.ts`)

```typescript
import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { useSound } from './useSound';

interface RevealPhase {
  id: 'recognition' | 'anticipation' | 'revelation' | 'aftermath';
  duration: number;
  dimLevel: number;
  imageOpacity: number;
  blurAmount: number;
}

const REVEAL_PHASES: RevealPhase[] = [
  { id: 'recognition', duration: 2000, dimLevel: 0.6, imageOpacity: 0, blurAmount: 20 },
  { id: 'anticipation', duration: 3000, dimLevel: 0.5, imageOpacity: 0.1, blurAmount: 10 },
  { id: 'revelation', duration: 4000, dimLevel: 0.3, imageOpacity: 1.0, blurAmount: 0 },
  { id: 'aftermath', duration: 0, dimLevel: 0, imageOpacity: 1.0, blurAmount: 0 },
];

export function useRevealSequence() {
  const [currentPhase, setCurrentPhase] = useState<RevealPhase | null>(null);
  const [loreProgress, setLoreProgress] = useState(0);

  const { isRevealing, revealElement, endReveal, discoverElement } = useGameStore();
  const { play } = useSound();

  useEffect(() => {
    if (!isRevealing || !revealElement) return;

    let phaseIndex = 0;
    setCurrentPhase(REVEAL_PHASES[0]);
    play('reveal-start');

    const runPhase = () => {
      if (phaseIndex >= REVEAL_PHASES.length - 1) {
        // Aftermath - reveal complete
        discoverElement(revealElement);
        setTimeout(() => {
          endReveal();
          setCurrentPhase(null);
          setLoreProgress(0);
        }, 500);
        return;
      }

      const phase = REVEAL_PHASES[phaseIndex];
      setCurrentPhase(phase);

      // Play phase-specific sounds
      if (phase.id === 'anticipation') play('reveal-building');
      if (phase.id === 'revelation') play('reveal-crescendo');

      // Animate lore text during anticipation
      if (phase.id === 'anticipation' && revealElement.category === 'milestone') {
        const loreLength = (revealElement as any).lore?.length || 0;
        const interval = phase.duration / loreLength;
        let charIndex = 0;

        const loreInterval = setInterval(() => {
          charIndex++;
          setLoreProgress(charIndex / loreLength);
          if (charIndex >= loreLength) clearInterval(loreInterval);
        }, interval);
      }

      setTimeout(() => {
        phaseIndex++;
        runPhase();
      }, phase.duration);
    };

    runPhase();
  }, [isRevealing, revealElement, endReveal, discoverElement, play]);

  return {
    currentPhase,
    loreProgress,
    isActive: isRevealing,
  };
}
```

---

## Section 2: UI Layout Specifications

### 2.1 Overall Layout

```
+------------------------------------------------------------------+
|  HEADER (64px)                                                    |
+------------------------------------------------------------------+
|          |                                                        |
|  SIDEBAR |              MAIN AREA                                 |
|  (280px) |              (flex-1, min 640px)                       |
|          |                                                        |
|          +--------------------------------------------------------+
|          |              ZOOM VIEWPORT                             |
|          |              (aspect-ratio: 16/9, min-height: 400px)   |
|          |                                                        |
|          |                                                        |
|          +--------------------------------------------------------+
|          |              COMBINE ZONE                              |
|          |              (height: 120px)                           |
+----------+--------------------------------------------------------+
```

### 2.2 Precise Measurements

```typescript
// src/utils/constants.ts

export const LAYOUT = {
  // Header
  HEADER_HEIGHT: 64,

  // Sidebar
  SIDEBAR_WIDTH: 280,
  SIDEBAR_PADDING: 16,
  SIDEBAR_GAP: 24,

  // Main Area
  MAIN_PADDING: 24,
  MAIN_MIN_WIDTH: 640,

  // Zoom Viewport
  VIEWPORT_ASPECT_RATIO: 16 / 9,
  VIEWPORT_MIN_HEIGHT: 400,
  VIEWPORT_BORDER_RADIUS: 12,

  // Combine Zone
  COMBINE_HEIGHT: 120,
  COMBINE_SLOT_SIZE: 64,
  COMBINE_SLOT_GAP: 24,

  // Element Cards
  ELEMENT_SIZE: 56,
  ELEMENT_GRID_GAP: 8,
  ELEMENT_GRID_COLUMNS: 4,
  ELEMENT_BORDER_RADIUS: 8,

  // Reveal Overlay
  REVEAL_BORDER_RADIUS: 16,
  REVEAL_MAX_WIDTH: 600,

  // Breakpoints
  BREAKPOINT_SM: 640,
  BREAKPOINT_MD: 768,
  BREAKPOINT_LG: 1024,
  BREAKPOINT_XL: 1280,
} as const;

export const Z_INDEX = {
  BACKGROUND_PARTICLES: 0,
  MAIN_CONTENT: 10,
  SIDEBAR: 20,
  HEADER: 30,
  DROPDOWN: 40,
  TOOLTIP: 50,
  DRAGGING_ELEMENT: 60,
  COMBINE_ZONE_ACTIVE: 70,
  REVEAL_OVERLAY: 80,
  REVEAL_CONTENT: 90,
  EVOLUTION_VIDEO: 100,
  NOTIFICATION: 110,
} as const;
```

### 2.3 Responsive Breakpoints

```css
/* Tailwind config extensions */

/* Mobile First Approach */

/* < 640px: Stack everything vertically */
@media (max-width: 639px) {
  .layout {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    max-height: 200px;
    overflow-x: auto;
  }
  .element-grid {
    grid-template-columns: repeat(6, 1fr);
    gap: 4px;
  }
  .element-card {
    width: 48px;
    height: 48px;
  }
}

/* 640px - 1023px: Narrow sidebar */
@media (min-width: 640px) and (max-width: 1023px) {
  .sidebar {
    width: 200px;
  }
  .element-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 1024px+: Full layout */
@media (min-width: 1024px) {
  .sidebar {
    width: 280px;
  }
  .element-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### 2.4 Component Hierarchy

```
App (layout.tsx)
├── BackgroundParticles (z-0)
├── Header (z-30)
│   ├── Logo
│   ├── StatsBar
│   │   ├── DiscoveryCounter
│   │   ├── DepthIndicator
│   │   └── TokenCounter
│   └── SettingsButton
│
├── MainLayout (z-10)
│   ├── Sidebar (z-20)
│   │   ├── SectionHeader "PRIMORDIALS"
│   │   ├── PrimordialPalette
│   │   │   └── ElementCard[] (12)
│   │   │
│   │   ├── SectionHeader "REMEMBERED"
│   │   ├── MemoryArchive
│   │   │   └── DepthSection[] (I-V+)
│   │   │       └── ElementCard[]
│   │   │
│   │   └── EvolutionQueue
│   │       └── EvolutionNotice[]
│   │
│   └── MainArea
│       ├── ZoomViewport
│       │   ├── ZoomScene
│       │   │   ├── SceneBackground
│       │   │   └── SceneElement[] (3-5)
│       │   └── DepthBreadcrumb
│       │
│       └── CombineZone
│           ├── CombineSlot (left)
│           ├── CombineOperator "+"
│           ├── CombineSlot (right)
│           ├── CombineOperator "="
│           └── CombineResult
│
├── RevealOverlay (z-80, conditional)
│   ├── DimLayer
│   ├── RevealContent (z-90)
│   │   ├── ParticleSwirl
│   │   ├── RevealImage
│   │   ├── RevealLore
│   │   └── RevealTitle
│   └── EvolutionTrigger
│
├── EvolutionVideoModal (z-100, conditional)
│   └── VideoPlayer
│
├── ContextCallback (z-50, conditional)
│
├── RecipeHint (z-50, conditional)
│
└── Tooltip (z-50, conditional)
```

---

## Section 3: Color Scheme - "Celestial Dreams"

### 3.1 Complete Color Palette

```css
/* src/app/globals.css */

:root {
  /* === BACKGROUND === */
  --bg-void: #1c2541;           /* Deep navy base */
  --bg-gradient: linear-gradient(135deg, #1c2541 0%, #241332 50%, #2b1f4f 100%);
  --bg-surface: #3a506b;        /* Slate blue for cards/panels */
  --bg-elevated: #4a5568;       /* Slightly lighter for hover states */

  /* === PRIMARY ACCENTS === */
  --accent-gold: #ffd66b;       /* Warm celestial gold - primary CTA */
  --accent-violet: #7f5af0;     /* Bright magical purple - interactive elements */
  --accent-teal: #5bc0be;       /* Ethereal cyan - secondary actions */

  /* === SECONDARY COLORS === */
  --color-rose: #ff8cc6;        /* Candy pink - highlights, notifications */
  --color-ice: #b7f0ff;         /* Sky blue - glow effects */
  --color-cream: #ffe6fa;       /* Soft pink-white - subtle backgrounds */
  --color-buttercream: #ffe6a7; /* Warm cream - text highlights */

  /* === TEXT === */
  --text-primary: #ffffff;
  --text-secondary: #b7c5d3;    /* Muted blue-gray */
  --text-muted: #6b7a8a;        /* Subtle hints */
  --text-lore: #ffd66b;         /* Gold for story text */
  --text-whisper: #b7f0ff;      /* Ice blue for whispers */

  /* === RARITY GLOWS === */
  --rarity-common: #5bc0be;     /* Teal shimmer */
  --rarity-uncommon: #7f5af0;   /* Violet pulse */
  --rarity-rare: #ff8cc6;       /* Rose bloom */
  --rarity-legendary: linear-gradient(45deg, #ffd66b, #7f5af0);

  /* === ELEMENT COLORS (12 Primordials) === */
  --elem-fire: linear-gradient(135deg, #ff6b35, #ffc145);
  --elem-water: linear-gradient(135deg, #00a8e8, #5bc0be);
  --elem-stone: #3d2c8d;        /* Royal purple-gray */
  --elem-air: #e0fbfc;          /* Ice mist */
  --elem-light: #ffd447;        /* Brass gold */
  --elem-silence: #241332;      /* Deep plum */
  --elem-shimmer: linear-gradient(135deg, #ffd66b, #ff8cc6, #7f5af0);
  --elem-void: #0f0a1a;         /* Near black */
  --elem-longing: #ff8cc6;      /* Rose */
  --elem-time: linear-gradient(135deg, #ffd66b, #5bc0be);
  --elem-mystery: #514ea7;      /* Deep violet */
  --elem-wonder: linear-gradient(135deg, #7f5af0, #b7f0ff);

  /* === SPECIAL EFFECTS === */
  --glow-gold: 0 0 20px rgba(255, 214, 107, 0.5);
  --glow-violet: 0 0 20px rgba(127, 90, 240, 0.5);
  --glow-teal: 0 0 15px rgba(91, 192, 190, 0.4);
  --glow-rose: 0 0 15px rgba(255, 140, 198, 0.4);
  --glow-legendary: 0 0 30px rgba(255, 214, 107, 0.6), 0 0 60px rgba(127, 90, 240, 0.3);

  /* === PARTICLES === */
  --particle-primary: #ffd66b;
  --particle-secondary: #7f5af0;
  --particle-tertiary: #5bc0be;
  --particle-sparkle: #ffffff;

  /* === DEPTH COLORS === */
  --depth-I: #5bc0be;           /* Teal - Primordial Silence */
  --depth-II: #7f5af0;          /* Violet - The Becoming */
  --depth-III: #ff8cc6;         /* Rose - The Flourishing */
  --depth-IV: #ffd66b;          /* Gold - The Reckoning */
  --depth-V: linear-gradient(45deg, #ffd66b, #7f5af0, #5bc0be);

  /* === TRANSPARENCY LAYERS === */
  --overlay-dim: rgba(28, 37, 65, 0.7);
  --overlay-dark: rgba(15, 10, 26, 0.85);
  --card-bg: rgba(58, 80, 107, 0.6);
  --card-border: rgba(255, 214, 107, 0.2);
}
```

### 3.2 Tailwind Theme Extension

```typescript
// tailwind.config.ts

import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        void: '#1c2541',
        surface: '#3a506b',
        elevated: '#4a5568',

        // Accents
        gold: '#ffd66b',
        violet: '#7f5af0',
        teal: '#5bc0be',
        rose: '#ff8cc6',
        ice: '#b7f0ff',
        cream: '#ffe6fa',
        buttercream: '#ffe6a7',

        // Text
        primary: '#ffffff',
        secondary: '#b7c5d3',
        muted: '#6b7a8a',

        // Depths
        'depth-1': '#5bc0be',
        'depth-2': '#7f5af0',
        'depth-3': '#ff8cc6',
        'depth-4': '#ffd66b',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        whisper: ['Crimson Text', 'serif'],
      },
      boxShadow: {
        'glow-gold': '0 0 20px rgba(255, 214, 107, 0.5)',
        'glow-violet': '0 0 20px rgba(127, 90, 240, 0.5)',
        'glow-teal': '0 0 15px rgba(91, 192, 190, 0.4)',
        'glow-rose': '0 0 15px rgba(255, 140, 198, 0.4)',
        'glow-legendary': '0 0 30px rgba(255, 214, 107, 0.6), 0 0 60px rgba(127, 90, 240, 0.3)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-main': 'linear-gradient(135deg, #1c2541 0%, #241332 50%, #2b1f4f 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'particle-drift': 'particleDrift 20s linear infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        particleDrift: {
          '0%': { transform: 'translateY(100vh) translateX(0)' },
          '100%': { transform: 'translateY(-100vh) translateX(50px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## Section 4: Animation Specifications

### 4.1 Animation Timing Constants

```typescript
// src/utils/constants.ts

export const ANIMATION = {
  // === DURATIONS (ms) ===
  INSTANT: 100,
  FAST: 150,
  NORMAL: 200,
  SLOW: 300,
  DELIBERATE: 500,
  DRAMATIC: 800,

  // === REVEAL SEQUENCE (ms) ===
  REVEAL_PHASE_1: 2000,        // Recognition
  REVEAL_PHASE_2: 3000,        // Anticipation
  REVEAL_PHASE_3: 4000,        // Revelation
  REVEAL_TOTAL: 9000,

  // === ZOOM ===
  ZOOM_TRANSITION: 800,
  ZOOM_FADE_IN: 600,
  ZOOM_ELEMENT_STAGGER: 100,

  // === COMBINE ===
  COMBINE_DRAG_SCALE: 100,
  COMBINE_DROP_FEEDBACK: 150,
  COMBINE_FLASH: 150,
  COMBINE_RESULT_SPRING: 400,

  // === HOVER ===
  HOVER_SCALE: 150,
  HOVER_GLOW: 200,

  // === INTERMEDIATE ===
  INTERMEDIATE_PULSE: 3000,
  INTERMEDIATE_PATHWAY_SHOW: 2000,

  // === HINTS ===
  HINT_FADE_IN: 300,
  HINT_DISPLAY: 4000,
  HINT_FADE_OUT: 300,

  // === CONTEXT CALLBACK ===
  CALLBACK_SLIDE_IN: 500,
  CALLBACK_DISPLAY: 5000,
  CALLBACK_SLIDE_OUT: 500,
} as const;

export const EASING = {
  // Standard easing
  EASE_OUT: [0, 0, 0.2, 1],
  EASE_IN: [0.4, 0, 1, 1],
  EASE_IN_OUT: [0.4, 0, 0.2, 1],

  // Spring presets
  SPRING_GENTLE: { stiffness: 120, damping: 14 },
  SPRING_SNAPPY: { stiffness: 300, damping: 25 },
  SPRING_BOUNCY: { stiffness: 500, damping: 30, mass: 1 },

  // Reveal-specific
  REVEAL_DIM: [0.4, 0, 0.2, 1],
  REVEAL_SHARPEN: [0.1, 0, 0.2, 1],
} as const;
```

### 4.2 Framer Motion Configurations

#### Element Drag Animation

```typescript
// src/components/elements/ElementCard.tsx

import { motion } from 'framer-motion';

const dragVariants = {
  idle: {
    scale: 1,
    boxShadow: '0 0 0 rgba(255, 214, 107, 0)',
  },
  dragging: {
    scale: 1.05,
    boxShadow: '0 0 20px rgba(255, 214, 107, 0.5)',
    transition: {
      duration: 0.1,
      ease: [0, 0, 0.2, 1],
    },
  },
  hover: {
    scale: 1.02,
    boxShadow: '0 0 10px rgba(127, 90, 240, 0.3)',
    transition: {
      duration: 0.15,
      ease: [0, 0, 0.2, 1],
    },
  },
};

export function ElementCard({ element, onDragStart, onDragEnd }) {
  return (
    <motion.div
      variants={dragVariants}
      initial="idle"
      whileHover="hover"
      whileDrag="dragging"
      drag
      dragSnapToOrigin
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className="element-card"
    >
      {/* content */}
    </motion.div>
  );
}
```

#### Combine Zone Drop Animation

```typescript
// src/components/combine/CombineZone.tsx

const dropZoneVariants = {
  idle: {
    borderColor: 'rgba(255, 214, 107, 0.2)',
    scale: 1,
  },
  active: {
    borderColor: 'rgba(255, 214, 107, 0.8)',
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: [0, 0, 0.2, 1],
    },
  },
  drop: {
    scale: 1.05,
    transition: {
      duration: 0.1,
      ease: [0.4, 0, 1, 1],
    },
  },
};

const combineFlashVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: [0, 1, 0],
    transition: {
      duration: 0.15,
      times: [0, 0.5, 1],
    },
  },
};

const resultAppearVariants = {
  hidden: {
    opacity: 0,
    scale: 0.5,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
};
```

#### Zoom Transition Animation

```typescript
// src/components/zoom/ZoomTransition.tsx

const zoomTransitionVariants = {
  initial: {
    scale: 1,
    opacity: 1,
  },
  zoomIn: {
    scale: 10,
    opacity: 0,
    filter: 'blur(10px)',
    transition: {
      duration: 0.8,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  zoomOut: {
    scale: 0.1,
    opacity: 0,
    filter: 'blur(10px)',
    transition: {
      duration: 0.8,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const sceneAppearVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0, 0, 0.2, 1],
    },
  },
};

const sceneElementStagger = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const sceneElementVariants = {
  hidden: {
    opacity: 0,
    scale: 0,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
};
```

### 4.3 9-Second Reveal Sequence Animation

```typescript
// src/components/reveal/MilestoneReveal.tsx

import { motion, AnimatePresence } from 'framer-motion';

// Phase timing breakdown:
// 0-2s:   Recognition (dim, particles gather)
// 2-5s:   Anticipation (silhouette forms, lore types)
// 5-9s:   Revelation (image sharpens, full reveal)

const dimLayerVariants = {
  hidden: { opacity: 0 },
  recognition: {
    opacity: 0.6,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
  anticipation: {
    opacity: 0.5,
    transition: { duration: 0.3 },
  },
  revelation: {
    opacity: 0.3,
    transition: { duration: 0.5 },
  },
  complete: {
    opacity: 0,
    transition: { duration: 0.5 },
  },
};

const imageVariants = {
  hidden: {
    opacity: 0,
    scale: 1.1,
    filter: 'blur(20px)',
  },
  anticipation: {
    opacity: 0.1,
    scale: 1.05,
    filter: 'blur(10px)',
    transition: { duration: 3, ease: [0.1, 0, 0.2, 1] },
  },
  revelation: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 4, ease: [0.1, 0, 0.2, 1] },
  },
};

const loreTextVariants = {
  hidden: { opacity: 0 },
  typing: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

const titleVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
      delay: 8.5,
    },
  },
};

const particleSwirlVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: [0, 1, 1, 0],
    transition: {
      pathLength: { duration: 5, ease: 'linear' },
      opacity: { duration: 5, times: [0, 0.1, 0.8, 1] },
    },
  },
};

// Reveal sequence component
export function MilestoneReveal({ element, onComplete }) {
  const [phase, setPhase] = useState<'recognition' | 'anticipation' | 'revelation' | 'complete'>('recognition');

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('anticipation'), 2000),
      setTimeout(() => setPhase('revelation'), 5000),
      setTimeout(() => {
        setPhase('complete');
        onComplete();
      }, 9000),
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div className="reveal-overlay">
        {/* Dim layer */}
        <motion.div
          className="dim-layer"
          variants={dimLayerVariants}
          initial="hidden"
          animate={phase}
        />

        {/* Particle swirl */}
        {phase !== 'complete' && (
          <motion.svg className="particle-swirl">
            <motion.circle
              variants={particleSwirlVariants}
              initial="hidden"
              animate="visible"
            />
          </motion.svg>
        )}

        {/* Image reveal */}
        <motion.img
          src={element.imageUrl}
          variants={imageVariants}
          initial="hidden"
          animate={phase === 'recognition' ? 'hidden' : phase}
          className="reveal-image"
        />

        {/* Lore text */}
        <motion.div
          className="lore-container"
          variants={loreTextVariants}
          initial="hidden"
          animate={phase !== 'recognition' ? 'typing' : 'hidden'}
        >
          <TypewriterText
            text={element.lore}
            duration={3000}
            startDelay={2000}
          />
        </motion.div>

        {/* Title */}
        <motion.h2
          variants={titleVariants}
          initial="hidden"
          animate={phase === 'revelation' || phase === 'complete' ? 'visible' : 'hidden'}
          className="reveal-title"
        >
          {element.name}
        </motion.h2>
      </motion.div>
    </AnimatePresence>
  );
}
```

### 4.4 Intermediate Element Animation

```typescript
// src/components/elements/IntermediateElement.tsx

const intermediateVariants = {
  idle: {
    scale: 1,
    boxShadow: '0 0 8px rgba(255, 215, 0, 0.3)',
  },
  pulse: {
    scale: [1, 1.02, 1],
    boxShadow: [
      '0 0 8px rgba(255, 215, 0, 0.3)',
      '0 0 12px rgba(255, 215, 0, 0.5)',
      '0 0 8px rgba(255, 215, 0, 0.3)',
    ],
    transition: {
      duration: 3,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
};

const pathwayTextVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: {
    opacity: 0.7,
    y: 0,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 2, delay: 2 },
  },
};

const ringPulseVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: [0.8, 1.5],
    opacity: [0.5, 0],
    transition: {
      duration: 0.6,
      ease: 'easeOut',
      repeat: 2,
      repeatDelay: 0,
    },
  },
};
```

### 4.5 Context Callback Animation

```typescript
// src/components/context/ContextCallback.tsx

const callbackContainerVariants = {
  hidden: {
    x: '100%',
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 1, 1],
    },
  },
};

const tokenCounterVariants = {
  counting: {
    scale: [1, 1.1, 1],
    color: ['#b7c5d3', '#ffd66b', '#b7c5d3'],
    transition: {
      duration: 0.3,
    },
  },
};
```

---

## Section 5: Sound Design

### 5.1 Sound Effects Inventory

| Sound | Filename | Duration | Volume | Trigger |
|-------|----------|----------|--------|---------|
| Ambient Loop | `ambient.mp3` | 60s loop | 0.15 | Page load, continuous |
| Combine Regular | `combine-regular.mp3` | 0.3s | 0.4 | Regular element created |
| Combine Milestone Start | `combine-milestone-start.mp3` | 0.5s | 0.5 | Milestone reveal phase 1 |
| Reveal Building | `reveal-building.mp3` | 3s | 0.3→0.6 | Milestone reveal phase 2 |
| Reveal Crescendo | `reveal-crescendo.mp3` | 4s | 0.6→0.8 | Milestone reveal phase 3 |
| Discovery Chime | `discovery-chime.mp3` | 0.4s | 0.5 | Element added to collection |
| Zoom Transition | `zoom-transition.mp3` | 0.8s | 0.4 | Zoom in/out |
| Intermediate Pulse | `intermediate-pulse.mp3` | 0.3s | 0.3 | Intermediate element created |
| Context Callback | `context-callback.mp3` | 0.5s | 0.4 | "This reminds you of..." |
| Evolution Ready | `evolution-ready.mp3` | 0.6s | 0.6 | Evolution video ready |
| Hover Soft | `hover-soft.mp3` | 0.1s | 0.2 | Element hover |
| Drop Confirm | `drop-confirm.mp3` | 0.15s | 0.35 | Element dropped in slot |

### 5.2 Audio Implementation

```typescript
// src/stores/audioStore.ts

import { create } from 'zustand';

interface AudioState {
  isMuted: boolean;
  masterVolume: number;
  sounds: Map<string, HTMLAudioElement>;

  init: () => void;
  play: (soundId: string) => void;
  setMuted: (muted: boolean) => void;
  setVolume: (volume: number) => void;
}

const SOUND_CONFIG: Record<string, { src: string; volume: number; loop?: boolean }> = {
  'ambient': { src: '/sounds/ambient.mp3', volume: 0.15, loop: true },
  'combine-regular': { src: '/sounds/combine-regular.mp3', volume: 0.4 },
  'combine-milestone-start': { src: '/sounds/combine-milestone-start.mp3', volume: 0.5 },
  'reveal-building': { src: '/sounds/reveal-building.mp3', volume: 0.3 },
  'reveal-crescendo': { src: '/sounds/reveal-crescendo.mp3', volume: 0.6 },
  'discovery-chime': { src: '/sounds/discovery-chime.mp3', volume: 0.5 },
  'zoom-transition': { src: '/sounds/zoom-transition.mp3', volume: 0.4 },
  'intermediate-pulse': { src: '/sounds/intermediate-pulse.mp3', volume: 0.3 },
  'context-callback': { src: '/sounds/context-callback.mp3', volume: 0.4 },
  'evolution-ready': { src: '/sounds/evolution-ready.mp3', volume: 0.6 },
  'hover-soft': { src: '/sounds/hover-soft.mp3', volume: 0.2 },
  'drop-confirm': { src: '/sounds/drop-confirm.mp3', volume: 0.35 },
};

export const useAudioStore = create<AudioState>((set, get) => ({
  isMuted: false,
  masterVolume: 0.7,
  sounds: new Map(),

  init: () => {
    const sounds = new Map<string, HTMLAudioElement>();

    Object.entries(SOUND_CONFIG).forEach(([id, config]) => {
      const audio = new Audio(config.src);
      audio.volume = config.volume * get().masterVolume;
      audio.loop = config.loop || false;
      audio.preload = 'auto';
      sounds.set(id, audio);
    });

    set({ sounds });

    // Start ambient after user interaction
    document.addEventListener('click', () => {
      const ambient = sounds.get('ambient');
      if (ambient && !get().isMuted) {
        ambient.play().catch(() => {});
      }
    }, { once: true });
  },

  play: (soundId) => {
    const { sounds, isMuted, masterVolume } = get();
    if (isMuted) return;

    const audio = sounds.get(soundId);
    if (!audio) return;

    const config = SOUND_CONFIG[soundId];
    audio.volume = config.volume * masterVolume;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  },

  setMuted: (muted) => {
    set({ isMuted: muted });
    const { sounds } = get();
    const ambient = sounds.get('ambient');
    if (ambient) {
      if (muted) ambient.pause();
      else ambient.play().catch(() => {});
    }
  },

  setVolume: (volume) => {
    set({ masterVolume: volume });
  },
}));
```

### 5.3 useSound Hook

```typescript
// src/hooks/useSound.ts

import { useCallback, useEffect } from 'react';
import { useAudioStore } from '@/stores/audioStore';

export function useSound() {
  const { init, play, setMuted, setVolume, isMuted, masterVolume } = useAudioStore();

  useEffect(() => {
    init();
  }, [init]);

  const playSound = useCallback((soundId: string) => {
    play(soundId);
  }, [play]);

  return {
    play: playSound,
    setMuted,
    setVolume,
    isMuted,
    masterVolume,
  };
}
```

### 5.4 Sound Trigger Points

```typescript
// Sound trigger integration in components

// ElementCard.tsx
onDragStart={() => play('hover-soft')}

// CombineSlot.tsx
onDrop={() => play('drop-confirm')}

// CombineResult.tsx (regular)
onNewElement={() => play('combine-regular')}

// CombineResult.tsx (intermediate)
onIntermediate={() => play('intermediate-pulse')}

// MilestoneReveal.tsx
phase === 'recognition' && play('combine-milestone-start')
phase === 'anticipation' && play('reveal-building')
phase === 'revelation' && play('reveal-crescendo')
phase === 'complete' && play('discovery-chime')

// ZoomTransition.tsx
onZoomStart={() => play('zoom-transition')}

// ContextCallback.tsx
onShow={() => play('context-callback')}

// EvolutionNotice.tsx
status === 'complete' && play('evolution-ready')
```

---

## Section 6: API Route Implementations

### 6.1 Combine Route (`src/app/api/combine/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PRIMORDIALS, INTERMEDIATE_ELEMENTS, MILESTONES, HINTS } from '@/lib/elements';
import { combinePrompt } from '@/lib/prompts';
import type { CombineRequest, CombineResponse, Element } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest): Promise<NextResponse<CombineResponse>> {
  try {
    const body: CombineRequest = await request.json();
    const { elementA, elementB, contextTokens } = body;

    // 1. Check for hint trigger (premature milestone attempt)
    const hint = checkHintTrigger(elementA, elementB);

    // 2. Check for predefined recipe (intermediate or milestone)
    const predefinedResult = checkPredefinedRecipe(elementA, elementB);

    if (predefinedResult) {
      return NextResponse.json({
        success: true,
        result: {
          element: predefinedResult,
          isMilestone: predefinedResult.category === 'milestone',
          isIntermediate: predefinedResult.category === 'intermediate',
          isFirstDiscovery: true, // Server should track this
          hint: hint?.message,
        },
      });
    }

    // 3. Generate new element with Gemini Flash
    const model = genAI.getGenerativeModel({
      model: 'gemini-3-flash',
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 256,
      },
    });

    const elA = findElement(elementA);
    const elB = findElement(elementB);

    const prompt = combinePrompt(elA, elB, contextTokens);
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    const generatedElement = parseGeneratedElement(response);

    return NextResponse.json({
      success: true,
      result: {
        element: generatedElement,
        isMilestone: false,
        isIntermediate: false,
        isFirstDiscovery: true,
        hint: hint?.message,
      },
    });

  } catch (error) {
    console.error('Combine error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to combine elements',
    }, { status: 500 });
  }
}

function checkHintTrigger(a: string, b: string): { message: string } | null {
  return HINTS.find(h =>
    (h.attempted[0] === a && h.attempted[1] === b) ||
    (h.attempted[0] === b && h.attempted[1] === a)
  ) || null;
}

function checkPredefinedRecipe(a: string, b: string): Element | null {
  // Check intermediates
  for (const [id, el] of Object.entries(INTERMEDIATE_ELEMENTS)) {
    const recipe = el.ancestry;
    if (recipe.length === 2) {
      if ((recipe[0] === a && recipe[1] === b) || (recipe[0] === b && recipe[1] === a)) {
        return { ...el, discoveredAt: new Date() };
      }
    }
  }

  // Check milestones
  for (const [id, el] of Object.entries(MILESTONES)) {
    const recipe = el.ancestry;
    if (recipe.length === 2) {
      if ((recipe[0] === a && recipe[1] === b) || (recipe[0] === b && recipe[1] === a)) {
        return { ...el, discoveredAt: new Date(), hasBeenEvolved: false };
      }
    }
  }

  return null;
}

function findElement(id: string): Element {
  return PRIMORDIALS.find(p => p.id === id) ||
         INTERMEDIATE_ELEMENTS[id] ||
         MILESTONES[id] ||
         { id, name: id, emoji: '?', whisper: '', category: 'regular', depth: 'I', ancestry: [] };
}

function parseGeneratedElement(response: string): Element {
  // Parse Gemini response into element structure
  const lines = response.split('\n');
  const name = lines.find(l => l.startsWith('name:'))?.split(':')[1]?.trim() || 'Unknown';
  const emoji = lines.find(l => l.startsWith('emoji:'))?.split(':')[1]?.trim() || '?';
  const whisper = lines.find(l => l.startsWith('whisper:'))?.split(':')[1]?.trim() || 'A mystery unfolds.';

  return {
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    emoji,
    whisper,
    category: 'regular',
    depth: 'I',
    ancestry: [],
    discoveredAt: new Date(),
  };
}
```

### 6.2 Zoom Route (`src/app/api/zoom/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { zoomPrompt } from '@/lib/prompts';
import type { ZoomRequest, ZoomResponse, ZoomScene } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest): Promise<NextResponse<ZoomResponse>> {
  try {
    const body: ZoomRequest = await request.json();
    const { elementId, currentDepth, contextSummary } = body;

    const model = genAI.getGenerativeModel({
      model: 'gemini-3-flash',
      generationConfig: {
        temperature: 0.95,
        maxOutputTokens: 1024,
      },
    });

    const prompt = zoomPrompt(elementId, currentDepth, contextSummary);
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    const scene = parseZoomScene(response, elementId, currentDepth);

    return NextResponse.json({
      success: true,
      scene,
    });

  } catch (error) {
    console.error('Zoom error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to generate zoom scene',
    }, { status: 500 });
  }
}

function parseZoomScene(response: string, parentId: string, depth: string): ZoomScene {
  // Parse Gemini response into scene structure
  // Implementation would parse JSON or structured text from Gemini

  return {
    id: `scene-${Date.now()}`,
    parentElementId: parentId,
    description: 'A world within a world.',
    elements: [],
    depth: depth as any,
    backgroundGradient: 'linear-gradient(135deg, #1c2541 0%, #241332 50%, #2b1f4f 100%)',
  };
}
```

---

## Section 7: Remaining Reference from v6-v8

For complete information, reference:

| Topic | Document |
|-------|----------|
| Core mechanics (Combine, Zoom, Evolve) | v6 |
| Element system and milestone registry | v6 |
| 9-second reveal narrative | v6 |
| Demo script (2:00 and 1:35 versions) | v7, v8 |
| Risk assessment | v6 |
| Implementation phases | v6 |
| Intermediate element UX | v8 |
| Recipe hint system | v8 |
| Pre-generation checklist | v8 |
| Veo quality criteria | v8 |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| v6 | Jan 30, 2026 | Base spec with Memory narrative |
| v7 | Jan 30, 2026 | Critic fixes: zoom-first, 2-element chains |
| v8 | Jan 30, 2026 | Final polish: intermediate UX, Veo criteria |
| v9 | Jan 31, 2026 | **Implementation details**: code structure, UI layout, colors, animations, sound |

---

*This document provides implementation-ready specifications for developers to begin coding immediately.*
