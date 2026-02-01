/**
 * Demo Mode Data System
 *
 * Pre-cached data for demo recording to avoid live API calls.
 * Ensures smooth, predictable demo experiences.
 */

import type {
  Element,
  RegularElement,
  MilestoneElement,
  IntermediateElement,
  ZoomScene,
  SceneElement,
  DepthTier,
} from '@/types';
import { MILESTONES, INTERMEDIATE_ELEMENTS } from './elements';

// === DEMO MODE FLAG ===

export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

// === COMBINE RESULT TYPE ===

export interface CombineResult {
  element: Element;
  isMilestone: boolean;
  isIntermediate: boolean;
  isFirstDiscovery: boolean;
  hint?: string;
}

// === PRE-CACHED COMBINE RESULTS ===

/**
 * Creates a canonical key for element combinations (order-independent)
 */
function combineKey(a: string, b: string): string {
  return [a, b].sort().join('+');
}

// Regular elements discovered through combinations
const DEMO_REGULAR_ELEMENTS: Record<string, RegularElement> = {
  steam: {
    id: 'steam',
    name: 'Steam',
    emoji: '♨️',
    whisper: 'Water dreaming of becoming sky.',
    category: 'regular',
    depth: 'II',
    ancestry: ['water', 'fire'],
  },
  mud: {
    id: 'mud',
    name: 'Mud',
    emoji: '🟤',
    whisper: 'Where solid learns to flow.',
    category: 'regular',
    depth: 'II',
    ancestry: ['stone', 'water'],
  },
  dust: {
    id: 'dust',
    name: 'Dust',
    emoji: '🌫️',
    whisper: 'What remains when giants fall.',
    category: 'regular',
    depth: 'II',
    ancestry: ['stone', 'air'],
  },
  lava: {
    id: 'lava',
    name: 'Lava',
    emoji: '🌋',
    whisper: 'The earth bleeding light.',
    category: 'regular',
    depth: 'II',
    ancestry: ['stone', 'fire'],
  },
  ice: {
    id: 'ice',
    name: 'Ice',
    emoji: '🧊',
    whisper: 'Water remembering stillness.',
    category: 'regular',
    depth: 'II',
    ancestry: ['water', 'silence'],
  },
  lightning: {
    id: 'lightning',
    name: 'Lightning',
    emoji: '⚡',
    whisper: 'Sky splitting with urgency.',
    category: 'regular',
    depth: 'II',
    ancestry: ['fire', 'air'],
  },
  cloud: {
    id: 'cloud',
    name: 'Cloud',
    emoji: '☁️',
    whisper: 'Water learning to wander.',
    category: 'regular',
    depth: 'II',
    ancestry: ['water', 'air'],
  },
  shadow: {
    id: 'shadow',
    name: 'Shadow',
    emoji: '🌑',
    whisper: 'Light remembering darkness.',
    category: 'regular',
    depth: 'II',
    ancestry: ['light', 'void'],
  },
  echo: {
    id: 'echo',
    name: 'Echo',
    emoji: '🔊',
    whisper: 'Sound searching for itself.',
    category: 'regular',
    depth: 'II',
    ancestry: ['silence', 'air'],
  },
  dawn: {
    id: 'dawn',
    name: 'Dawn',
    emoji: '🌅',
    whisper: 'Night surrendering to possibility.',
    category: 'regular',
    depth: 'II',
    ancestry: ['light', 'time'],
  },
  dusk: {
    id: 'dusk',
    name: 'Dusk',
    emoji: '🌆',
    whisper: 'Day folding into dreams.',
    category: 'regular',
    depth: 'II',
    ancestry: ['void', 'time'],
  },
  rain: {
    id: 'rain',
    name: 'Rain',
    emoji: '🌧️',
    whisper: 'Sky weeping with joy.',
    category: 'regular',
    depth: 'III',
    ancestry: ['cloud', 'water'],
  },
  crystal: {
    id: 'crystal',
    name: 'Crystal',
    emoji: '💎',
    whisper: 'Light trapped in geometry.',
    category: 'regular',
    depth: 'III',
    ancestry: ['stone', 'light'],
  },
  dream: {
    id: 'dream',
    name: 'Dream',
    emoji: '💭',
    whisper: 'Mind wandering without feet.',
    category: 'regular',
    depth: 'III',
    ancestry: ['mystery', 'silence'],
  },
  hope: {
    id: 'hope',
    name: 'Hope',
    emoji: '🌈',
    whisper: 'Tomorrow whispering to today.',
    category: 'regular',
    depth: 'III',
    ancestry: ['longing', 'light'],
  },
  fear: {
    id: 'fear',
    name: 'Fear',
    emoji: '😨',
    whisper: 'Shadow of things unseen.',
    category: 'regular',
    depth: 'III',
    ancestry: ['mystery', 'void'],
  },
};

// Build the combines map
export const DEMO_COMBINES: Record<string, CombineResult> = {};

// Helper to add a combine result
function addCombine(
  a: string,
  b: string,
  element: Element,
  isMilestone: boolean,
  isIntermediate: boolean,
  hint?: string
): void {
  DEMO_COMBINES[combineKey(a, b)] = {
    element,
    isMilestone,
    isIntermediate,
    isFirstDiscovery: true, // In demo, all discoveries feel fresh
    hint,
  };
}

// --- Milestone Combinations (5 key milestones) ---

addCombine(
  'fire',
  'air',
  MILESTONES.energy,
  true,
  false,
  'The first motion stirs...'
);

addCombine(
  'fire',
  'void',
  MILESTONES.chaos,
  true,
  false,
  'Order shatters into infinite potential...'
);

addCombine(
  'fire',
  'water',
  INTERMEDIATE_ELEMENTS.conflict,
  false,
  true,
  'Opposites recognize each other...'
);

// Life pathway: growth + light = life (simplified for demo)
addCombine('growth', 'light', MILESTONES.life, true, false, 'Something stirs...');

// Consciousness: awareness + curiosity = consciousness (simplified)
addCombine(
  'awareness',
  'curiosity',
  MILESTONES.consciousness,
  true,
  false,
  'The universe opens its eye...'
);

// --- Intermediate Combinations ---

addCombine(
  'void',
  'longing',
  INTERMEDIATE_ELEMENTS.potential,
  false,
  true,
  'On the path to LIFE...'
);

addCombine(
  'light',
  'silence',
  INTERMEDIATE_ELEMENTS.awareness,
  false,
  true,
  'On the path to CONSCIOUSNESS...'
);

addCombine(
  'stone',
  'time',
  INTERMEDIATE_ELEMENTS.foundation,
  false,
  true,
  'On the path to CIVILIZATION...'
);

addCombine(
  'water',
  'light',
  INTERMEDIATE_ELEMENTS.reflection,
  false,
  true,
  'On the path to WISDOM...'
);

addCombine(
  'silence',
  'void',
  INTERMEDIATE_ELEMENTS.surrender,
  false,
  true,
  'On the path to TRANSCENDENCE...'
);

addCombine(
  'fire',
  'shimmer',
  INTERMEDIATE_ELEMENTS.spark,
  false,
  true,
  'On the path to ENERGY...'
);

addCombine(
  'air',
  'water',
  INTERMEDIATE_ELEMENTS.turbulence,
  false,
  true,
  'On the path to CHAOS...'
);

addCombine(
  'time',
  'void',
  INTERMEDIATE_ELEMENTS.infinity,
  false,
  true,
  'On the path to COSMOS...'
);

addCombine(
  'water',
  'time',
  INTERMEDIATE_ELEMENTS.growth,
  false,
  true,
  'On the path to LIFE...'
);

addCombine(
  'wonder',
  'mystery',
  INTERMEDIATE_ELEMENTS.curiosity,
  false,
  true,
  'On the path to CONSCIOUSNESS...'
);

addCombine(
  'time',
  'longing',
  INTERMEDIATE_ELEMENTS.memory,
  false,
  true,
  'On the path to CIVILIZATION...'
);

// --- Regular Element Combinations (15+) ---

addCombine('water', 'fire', DEMO_REGULAR_ELEMENTS.steam, false, false);
addCombine('stone', 'water', DEMO_REGULAR_ELEMENTS.mud, false, false);
addCombine('stone', 'air', DEMO_REGULAR_ELEMENTS.dust, false, false);
addCombine('stone', 'fire', DEMO_REGULAR_ELEMENTS.lava, false, false);
addCombine('water', 'silence', DEMO_REGULAR_ELEMENTS.ice, false, false);
addCombine('water', 'air', DEMO_REGULAR_ELEMENTS.cloud, false, false);
addCombine('light', 'void', DEMO_REGULAR_ELEMENTS.shadow, false, false);
addCombine('silence', 'air', DEMO_REGULAR_ELEMENTS.echo, false, false);
addCombine('light', 'time', DEMO_REGULAR_ELEMENTS.dawn, false, false);
addCombine('void', 'time', DEMO_REGULAR_ELEMENTS.dusk, false, false);
addCombine('cloud', 'water', DEMO_REGULAR_ELEMENTS.rain, false, false);
addCombine('stone', 'light', DEMO_REGULAR_ELEMENTS.crystal, false, false);
addCombine('mystery', 'silence', DEMO_REGULAR_ELEMENTS.dream, false, false);
addCombine('longing', 'light', DEMO_REGULAR_ELEMENTS.hope, false, false);
addCombine('mystery', 'void', DEMO_REGULAR_ELEMENTS.fear, false, false);

// === PRE-CACHED ZOOM SCENES ===

export const DEMO_SCENES: Record<string, ZoomScene> = {
  // Primordial Scenes
  fire: {
    id: 'zoom-fire-1',
    parentElementId: 'fire',
    description:
      'A realm of eternal combustion. Flames dance in impossible patterns, each spark a tiny universe igniting into being. The heat here is not destructive—it is transformative.',
    depth: 'II',
    backgroundGradient: 'linear-gradient(135deg, #ff4500 0%, #ff8c00 50%, #ffd700 100%)',
    memoryFragment: 'Fire was the first artist, painting change across eternity.',
    elements: [
      {
        id: 'ember',
        name: 'Ember',
        emoji: '🔶',
        whisper: 'Patience burning slowly.',
        position: { x: 25, y: 35 },
        canZoomInto: true,
        canCombine: true,
      },
      {
        id: 'inferno-core',
        name: 'Inferno Core',
        emoji: '🌟',
        whisper: 'The heart of heat itself.',
        position: { x: 60, y: 45 },
        canZoomInto: true,
        canCombine: true,
      },
      {
        id: 'smoke-wisp',
        name: 'Smoke Wisp',
        emoji: '💨',
        whisper: "Fire's departing breath.",
        position: { x: 80, y: 25 },
        canZoomInto: false,
        canCombine: true,
      },
      {
        id: 'phoenix-feather',
        name: 'Phoenix Feather',
        emoji: '🪶',
        whisper: 'Death refusing to stay.',
        position: { x: 40, y: 70 },
        canZoomInto: true,
        canCombine: true,
      },
    ],
  },

  water: {
    id: 'zoom-water-1',
    parentElementId: 'water',
    description:
      'An infinite ocean suspended in space. Currents flow in all directions, carrying memories of every shore they have ever touched. Here, depth is not measured—it is felt.',
    depth: 'II',
    backgroundGradient: 'linear-gradient(180deg, #0077be 0%, #00509d 50%, #003566 100%)',
    memoryFragment: 'Every drop of water remembers being cloud, being rain, being sea.',
    elements: [
      {
        id: 'deep-current',
        name: 'Deep Current',
        emoji: '🌊',
        whisper: 'Strength moving in silence.',
        position: { x: 50, y: 60 },
        canZoomInto: true,
        canCombine: true,
      },
      {
        id: 'tide-memory',
        name: 'Tide Memory',
        emoji: '🌙',
        whisper: 'The pull of distant moons.',
        position: { x: 20, y: 40 },
        canZoomInto: true,
        canCombine: true,
      },
      {
        id: 'bubble-thought',
        name: 'Bubble Thought',
        emoji: '💭',
        whisper: 'Ideas rising to surface.',
        position: { x: 75, y: 30 },
        canZoomInto: false,
        canCombine: true,
      },
      {
        id: 'pearl-wisdom',
        name: 'Pearl of Patience',
        emoji: '🦪',
        whisper: 'Irritation becoming beauty.',
        position: { x: 40, y: 80 },
        canZoomInto: true,
        canCombine: true,
      },
    ],
  },

  stone: {
    id: 'zoom-stone-1',
    parentElementId: 'stone',
    description:
      'The bedrock of existence. Layers of compressed time stretch endlessly downward. Each stratum tells a story older than words, written in mineral and pressure.',
    depth: 'II',
    backgroundGradient: 'linear-gradient(180deg, #5d5d5d 0%, #3d3d3d 50%, #1a1a1a 100%)',
    memoryFragment: 'Mountains are just stones that refused to stop dreaming.',
    elements: [
      {
        id: 'ancient-fossil',
        name: 'Ancient Fossil',
        emoji: '🦴',
        whisper: 'Life refusing to be forgotten.',
        position: { x: 30, y: 55 },
        canZoomInto: true,
        canCombine: true,
      },
      {
        id: 'crystal-vein',
        name: 'Crystal Vein',
        emoji: '💎',
        whisper: 'Light learning geometry.',
        position: { x: 65, y: 35 },
        canZoomInto: true,
        canCombine: true,
      },
      {
        id: 'mineral-dream',
        name: 'Mineral Dream',
        emoji: '✨',
        whisper: 'Slow thoughts in slow time.',
        position: { x: 50, y: 75 },
        canZoomInto: true,
        canCombine: true,
      },
      {
        id: 'fault-line',
        name: 'Fault Line',
        emoji: '⚡',
        whisper: 'Tension waiting to release.',
        position: { x: 80, y: 60 },
        canZoomInto: false,
        canCombine: true,
      },
    ],
  },

  void: {
    id: 'zoom-void-1',
    parentElementId: 'void',
    description:
      'The space between spaces. Here, absence takes form. What seems like nothing reveals itself as everything potential, everything possible, everything yet to be.',
    depth: 'II',
    backgroundGradient: 'linear-gradient(180deg, #0a0a0a 0%, #000000 50%, #0f0f23 100%)',
    memoryFragment: "The void is not empty. It is full of everything that hasn't happened yet.",
    elements: [
      {
        id: 'null-point',
        name: 'Null Point',
        emoji: '⬛',
        whisper: 'Where nothing becomes something.',
        position: { x: 50, y: 50 },
        canZoomInto: true,
        canCombine: true,
      },
      {
        id: 'unborn-star',
        name: 'Unborn Star',
        emoji: '🌑',
        whisper: 'Light waiting for permission.',
        position: { x: 25, y: 30 },
        canZoomInto: true,
        canCombine: true,
      },
      {
        id: 'potential-wave',
        name: 'Potential Wave',
        emoji: '〰️',
        whisper: 'Probability before collapse.',
        position: { x: 70, y: 65 },
        canZoomInto: true,
        canCombine: true,
      },
      {
        id: 'forgotten-name',
        name: 'Forgotten Name',
        emoji: '❓',
        whisper: 'Identity that slipped away.',
        position: { x: 40, y: 80 },
        canZoomInto: false,
        canCombine: true,
      },
    ],
  },

  life: {
    id: 'zoom-life-1',
    parentElementId: 'life',
    description:
      'A garden of emergence. Cells divide in fractal symphonies. Every heartbeat echoes the first pulse. Life here does not merely exist—it celebrates its own improbability.',
    depth: 'III',
    backgroundGradient: 'linear-gradient(135deg, #228b22 0%, #32cd32 50%, #90ee90 100%)',
    memoryFragment:
      'Life is the universe falling in love with its own complexity.',
    elements: [
      {
        id: 'first-cell',
        name: 'First Cell',
        emoji: '🦠',
        whisper: 'The original ancestor.',
        position: { x: 35, y: 45 },
        canZoomInto: true,
        canCombine: true,
      },
      {
        id: 'dna-spiral',
        name: 'DNA Spiral',
        emoji: '🧬',
        whisper: 'Memory written in chemistry.',
        position: { x: 65, y: 35 },
        canZoomInto: true,
        canCombine: true,
      },
      {
        id: 'heartbeat',
        name: 'Heartbeat',
        emoji: '💓',
        whisper: 'Rhythm older than thought.',
        position: { x: 50, y: 65 },
        canZoomInto: true,
        canCombine: true,
      },
      {
        id: 'breath',
        name: 'Breath',
        emoji: '🌬️',
        whisper: 'Exchange with the cosmos.',
        position: { x: 20, y: 70 },
        canZoomInto: false,
        canCombine: true,
      },
      {
        id: 'evolution-branch',
        name: 'Evolution Branch',
        emoji: '🌿',
        whisper: 'Paths not yet chosen.',
        position: { x: 80, y: 55 },
        canZoomInto: true,
        canCombine: true,
      },
    ],
  },

  consciousness: {
    id: 'zoom-consciousness-1',
    parentElementId: 'consciousness',
    description:
      'The inner cosmos. Thoughts orbit like planets around an unseen sun. Here, the observer and observed are one. Every question contains its answer, waiting to be recognized.',
    depth: 'IV',
    backgroundGradient:
      'linear-gradient(135deg, #4b0082 0%, #9400d3 50%, #da70d6 100%)',
    memoryFragment: 'Consciousness is the universe writing poetry about itself.',
    elements: [
      {
        id: 'thought-crystal',
        name: 'Thought Crystal',
        emoji: '💎',
        whisper: 'Ideas in solid form.',
        position: { x: 50, y: 40 },
        canZoomInto: true,
        canCombine: true,
      },
      {
        id: 'emotion-storm',
        name: 'Emotion Storm',
        emoji: '🌀',
        whisper: 'Feeling seeking expression.',
        position: { x: 25, y: 55 },
        canZoomInto: true,
        canCombine: true,
      },
      {
        id: 'memory-palace',
        name: 'Memory Palace',
        emoji: '🏛️',
        whisper: 'Past preserved in architecture.',
        position: { x: 75, y: 30 },
        canZoomInto: true,
        canCombine: true,
      },
      {
        id: 'dream-gate',
        name: 'Dream Gate',
        emoji: '🚪',
        whisper: 'Portal to the unconscious.',
        position: { x: 60, y: 70 },
        canZoomInto: true,
        canCombine: true,
      },
      {
        id: 'self-mirror',
        name: 'Self Mirror',
        emoji: '🪞',
        whisper: 'Seeing the seer.',
        position: { x: 35, y: 80 },
        canZoomInto: false,
        canCombine: true,
      },
    ],
  },

  energy: {
    id: 'zoom-energy-1',
    parentElementId: 'energy',
    description:
      'Pure motion made visible. Lightning dances with itself in endless patterns. Here, stillness is an illusion—everything vibrates, everything hums with the frequency of existence.',
    depth: 'II',
    backgroundGradient: 'linear-gradient(135deg, #ffd700 0%, #ff8c00 50%, #ff4500 100%)',
    memoryFragment: 'Energy is neither created nor destroyed—only transformed and remembered.',
    elements: [
      {
        id: 'kinetic-spiral',
        name: 'Kinetic Spiral',
        emoji: '🌀',
        whisper: 'Motion discovering form.',
        position: { x: 45, y: 35 },
        canZoomInto: true,
        canCombine: true,
      },
      {
        id: 'power-node',
        name: 'Power Node',
        emoji: '⚡',
        whisper: 'Potential waiting to strike.',
        position: { x: 70, y: 50 },
        canZoomInto: true,
        canCombine: true,
      },
      {
        id: 'wave-form',
        name: 'Wave Form',
        emoji: '〰️',
        whisper: 'Frequency finding harmony.',
        position: { x: 25, y: 60 },
        canZoomInto: true,
        canCombine: true,
      },
      {
        id: 'heat-death',
        name: 'Heat Death',
        emoji: '❄️',
        whisper: 'The silence at the end of motion.',
        position: { x: 55, y: 75 },
        canZoomInto: false,
        canCombine: true,
      },
    ],
  },

  chaos: {
    id: 'zoom-chaos-1',
    parentElementId: 'chaos',
    description:
      'The birthplace of novelty. Patterns collapse into themselves only to emerge transformed. Order and disorder trade places like dancers switching partners.',
    depth: 'II',
    backgroundGradient: 'linear-gradient(135deg, #ff1493 0%, #8b008b 50%, #4b0082 100%)',
    memoryFragment: 'In chaos, every ending is a beginning wearing a different mask.',
    elements: [
      {
        id: 'butterfly-effect',
        name: 'Butterfly Effect',
        emoji: '🦋',
        whisper: 'Small causes, vast echoes.',
        position: { x: 30, y: 40 },
        canZoomInto: true,
        canCombine: true,
      },
      {
        id: 'strange-attractor',
        name: 'Strange Attractor',
        emoji: '🎭',
        whisper: 'Order hiding in randomness.',
        position: { x: 65, y: 55 },
        canZoomInto: true,
        canCombine: true,
      },
      {
        id: 'entropy-river',
        name: 'Entropy River',
        emoji: '🌊',
        whisper: 'Flowing toward uncertainty.',
        position: { x: 50, y: 70 },
        canZoomInto: true,
        canCombine: true,
      },
      {
        id: 'random-seed',
        name: 'Random Seed',
        emoji: '🎲',
        whisper: 'Chance pregnant with fate.',
        position: { x: 80, y: 35 },
        canZoomInto: false,
        canCombine: true,
      },
    ],
  },

  wonder: {
    id: 'zoom-wonder-1',
    parentElementId: 'wonder',
    description:
      'A cathedral of amazement. Stars are born from gasps of delight. Every corner holds a mystery that wants to be appreciated, not solved.',
    depth: 'II',
    backgroundGradient: 'linear-gradient(135deg, #191970 0%, #4169e1 50%, #87ceeb 100%)',
    memoryFragment: 'Wonder is the first prayer, spoken before language existed.',
    elements: [
      {
        id: 'first-question',
        name: 'First Question',
        emoji: '❓',
        whisper: 'Why? The eternal beginning.',
        position: { x: 40, y: 35 },
        canZoomInto: true,
        canCombine: true,
      },
      {
        id: 'awe-crystal',
        name: 'Awe Crystal',
        emoji: '💫',
        whisper: 'Amazement made solid.',
        position: { x: 70, y: 45 },
        canZoomInto: true,
        canCombine: true,
      },
      {
        id: 'childlike-eye',
        name: 'Childlike Eye',
        emoji: '👁️',
        whisper: 'Seeing everything for the first time.',
        position: { x: 25, y: 65 },
        canZoomInto: true,
        canCombine: true,
      },
      {
        id: 'stargazer',
        name: 'Stargazer',
        emoji: '🔭',
        whisper: 'Looking up to look within.',
        position: { x: 55, y: 80 },
        canZoomInto: false,
        canCombine: true,
      },
    ],
  },

  time: {
    id: 'zoom-time-1',
    parentElementId: 'time',
    description:
      'The river that carries all rivers. Past and future meet here, trading secrets. Moments stack like transparent pages, each containing every other.',
    depth: 'II',
    backgroundGradient: 'linear-gradient(135deg, #2f4f4f 0%, #556b2f 50%, #8b4513 100%)',
    memoryFragment: 'Time is the story the universe tells itself to stay awake.',
    elements: [
      {
        id: 'moment',
        name: 'Moment',
        emoji: '⏰',
        whisper: 'Now, and now, and now.',
        position: { x: 50, y: 50 },
        canZoomInto: true,
        canCombine: true,
      },
      {
        id: 'memory-thread',
        name: 'Memory Thread',
        emoji: '🧵',
        whisper: 'Past pulling at present.',
        position: { x: 25, y: 35 },
        canZoomInto: true,
        canCombine: true,
      },
      {
        id: 'future-seed',
        name: 'Future Seed',
        emoji: '🌱',
        whisper: 'Tomorrow already growing.',
        position: { x: 75, y: 40 },
        canZoomInto: true,
        canCombine: true,
      },
      {
        id: 'eternal-return',
        name: 'Eternal Return',
        emoji: '♾️',
        whisper: 'Circles within circles.',
        position: { x: 60, y: 70 },
        canZoomInto: true,
        canCombine: true,
      },
    ],
  },
};

// === HELPER FUNCTIONS ===

/**
 * Get cached combine result if in demo mode and combination exists
 */
export function getDemoCombine(
  elementAId: string,
  elementBId: string
): CombineResult | null {
  if (!DEMO_MODE) return null;

  const key = combineKey(elementAId, elementBId);
  return DEMO_COMBINES[key] || null;
}

/**
 * Get cached zoom scene if in demo mode and scene exists
 */
export function getDemoScene(elementId: string): ZoomScene | null {
  if (!DEMO_MODE) return null;

  return DEMO_SCENES[elementId] || null;
}

/**
 * Check if a specific combination has cached demo data
 */
export function hasDemoCombine(elementAId: string, elementBId: string): boolean {
  const key = combineKey(elementAId, elementBId);
  return key in DEMO_COMBINES;
}

/**
 * Check if a specific element has a cached demo scene
 */
export function hasDemoScene(elementId: string): boolean {
  return elementId in DEMO_SCENES;
}

/**
 * Get all available demo combinations (for debugging)
 */
export function getAllDemoCombines(): string[] {
  return Object.keys(DEMO_COMBINES);
}

/**
 * Get all available demo scenes (for debugging)
 */
export function getAllDemoScenes(): string[] {
  return Object.keys(DEMO_SCENES);
}

/**
 * Get a random demo scene for fallback purposes
 */
export function getRandomDemoScene(): ZoomScene {
  const sceneIds = Object.keys(DEMO_SCENES);
  const randomId = sceneIds[Math.floor(Math.random() * sceneIds.length)];
  return DEMO_SCENES[randomId];
}

/**
 * Log demo mode status (for debugging)
 */
export function logDemoStatus(): void {
  console.log('=== DEMO MODE STATUS ===');
  console.log(`Demo Mode: ${DEMO_MODE ? 'ENABLED' : 'DISABLED'}`);
  console.log(`Cached Combines: ${Object.keys(DEMO_COMBINES).length}`);
  console.log(`Cached Scenes: ${Object.keys(DEMO_SCENES).length}`);
  if (DEMO_MODE) {
    console.log('Available Combines:', getAllDemoCombines());
    console.log('Available Scenes:', getAllDemoScenes());
  }
}
