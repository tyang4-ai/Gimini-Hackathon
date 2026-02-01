import type {
  PrimordialElement,
  IntermediateElement,
  MilestoneElement,
  Element,
} from '@/types';

// === PRIMORDIAL ELEMENTS ===
// The 12 fundamental building blocks of creation

export const PRIMORDIALS: PrimordialElement[] = [
  // Matter Group
  {
    id: 'stone',
    name: 'Stone',
    emoji: '🪨',
    whisper: 'The first silence made solid.',
    category: 'primordial',
    depth: 'I',
    ancestry: [],
    group: 'matter',
    imageUrl: '/primordials/stone.png',
  },
  {
    id: 'water',
    name: 'Water',
    emoji: '💧',
    whisper: 'Memory in liquid form.',
    category: 'primordial',
    depth: 'I',
    ancestry: [],
    group: 'matter',
    imageUrl: '/primordials/water.png',
  },
  {
    id: 'fire',
    name: 'Fire',
    emoji: '🔥',
    whisper: 'Change that consumes.',
    category: 'primordial',
    depth: 'I',
    ancestry: [],
    group: 'matter',
    imageUrl: '/primordials/fire.png',
  },
  {
    id: 'air',
    name: 'Air',
    emoji: '💨',
    whisper: 'The breath between thoughts.',
    category: 'primordial',
    depth: 'I',
    ancestry: [],
    group: 'matter',
    imageUrl: '/primordials/air.png',
  },

  // Senses Group
  {
    id: 'light',
    name: 'Light',
    emoji: '✨',
    whisper: 'The universe seeing itself.',
    category: 'primordial',
    depth: 'I',
    ancestry: [],
    group: 'senses',
    imageUrl: '/primordials/light.png',
  },
  {
    id: 'silence',
    name: 'Silence',
    emoji: '🤫',
    whisper: 'What remains when all else fades.',
    category: 'primordial',
    depth: 'I',
    ancestry: [],
    group: 'senses',
    imageUrl: '/primordials/silence.png',
  },
  {
    id: 'shimmer',
    name: 'Shimmer',
    emoji: '🌟',
    whisper: 'Light that learned to dance.',
    category: 'primordial',
    depth: 'I',
    ancestry: [],
    group: 'senses',
    imageUrl: '/primordials/shimmer.png',
  },
  {
    id: 'void',
    name: 'Void',
    emoji: '🕳️',
    whisper: 'The space between everything.',
    category: 'primordial',
    depth: 'I',
    ancestry: [],
    group: 'senses',
    imageUrl: '/primordials/void.png',
  },

  // Abstract Group
  {
    id: 'longing',
    name: 'Longing',
    emoji: '💫',
    whisper: 'Reaching for what isn\'t there.',
    category: 'primordial',
    depth: 'I',
    ancestry: [],
    group: 'abstract',
    imageUrl: '/primordials/longing.png',
  },
  {
    id: 'time',
    name: 'Time',
    emoji: '⏳',
    whisper: 'The river that flows one way.',
    category: 'primordial',
    depth: 'I',
    ancestry: [],
    group: 'abstract',
    imageUrl: '/primordials/time.png',
  },
  {
    id: 'mystery',
    name: 'Mystery',
    emoji: '❓',
    whisper: 'Questions older than answers.',
    category: 'primordial',
    depth: 'I',
    ancestry: [],
    group: 'abstract',
    imageUrl: '/primordials/mystery.png',
  },
  {
    id: 'wonder',
    name: 'Wonder',
    emoji: '🌌',
    whisper: 'The first feeling.',
    category: 'primordial',
    depth: 'I',
    ancestry: [],
    group: 'abstract',
    imageUrl: '/primordials/wonder.png',
  },
];

// === MILESTONE ELEMENTS ===
// Key achievements that unlock evolution sequences

export const MILESTONES: Record<string, MilestoneElement> = {
  energy: {
    id: 'energy',
    name: 'Energy',
    emoji: '⚡',
    whisper: 'The first motion in the stillness.',
    category: 'milestone',
    depth: 'II',
    ancestry: ['fire', 'air'],
    imageUrl: '/milestones/energy.png',
    lore: 'When fire met wind, they forgot their names. What remained was neither, yet both. The universe felt its first heartbeat.',
    hasBeenEvolved: false,
  },
  life: {
    id: 'life',
    name: 'Life',
    emoji: '🌱',
    whisper: 'Complexity that remembers itself.',
    category: 'milestone',
    depth: 'III',
    ancestry: ['water', 'light', 'time'],
    imageUrl: '/milestones/life.png',
    lore: 'In the patient dance of light through water, time carved a pattern that refused to forget. It called itself alive.',
    hasBeenEvolved: false,
  },
  consciousness: {
    id: 'consciousness',
    name: 'Consciousness',
    emoji: '👁️',
    whisper: 'The universe looking back at itself.',
    category: 'milestone',
    depth: 'IV',
    ancestry: ['life', 'wonder', 'mystery'],
    imageUrl: '/milestones/consciousness.png',
    lore: 'Life grew curious about its own existence. In that moment of self-recognition, something new emerged\u2014an observer within the observed.',
    hasBeenEvolved: false,
  },
  civilization: {
    id: 'civilization',
    name: 'Civilization',
    emoji: '🏛️',
    whisper: 'Stories built in stone and time.',
    category: 'milestone',
    depth: 'IV',
    ancestry: ['consciousness', 'stone', 'longing'],
    imageUrl: '/milestones/civilization.png',
    lore: 'When consciousness learned to share its dreams, it built monuments to memory. Cities rose like prayers, each brick a promise to tomorrow.',
    hasBeenEvolved: false,
  },
  wisdom: {
    id: 'wisdom',
    name: 'Wisdom',
    emoji: '🦉',
    whisper: 'Knowledge that knows its limits.',
    category: 'milestone',
    depth: 'IV',
    ancestry: ['consciousness', 'time', 'silence'],
    imageUrl: '/milestones/wisdom.png',
    lore: 'After learning everything it could, consciousness learned to sit with what it couldn\'t. That humility became its greatest teacher.',
    hasBeenEvolved: false,
  },
  transcendence: {
    id: 'transcendence',
    name: 'Transcendence',
    emoji: '🕊️',
    whisper: 'Becoming more by letting go.',
    category: 'milestone',
    depth: 'V+',
    ancestry: ['wisdom', 'void', 'wonder'],
    imageUrl: '/milestones/transcendence.png',
    lore: 'In the end, wisdom surrendered all it knew to wonder. The void opened like a door. What passed through was neither lost nor found\u2014simply transformed.',
    hasBeenEvolved: false,
  },
  chaos: {
    id: 'chaos',
    name: 'Chaos',
    emoji: '🌀',
    whisper: 'Order waiting to be born.',
    category: 'milestone',
    depth: 'II',
    ancestry: ['fire', 'void'],
    imageUrl: '/milestones/chaos.png',
    lore: 'Fire consumed the void, or perhaps the void consumed fire. In their mutual destruction, infinite possibility was born.',
    hasBeenEvolved: false,
  },
  harmony: {
    id: 'harmony',
    name: 'Harmony',
    emoji: '☯️',
    whisper: 'Opposition dancing in balance.',
    category: 'milestone',
    depth: 'III',
    ancestry: ['chaos', 'silence', 'time'],
    imageUrl: '/milestones/harmony.png',
    lore: 'Chaos grew tired of its own noise. In silence, it found rhythm. In time, it found pattern. From opposition came unity.',
    hasBeenEvolved: false,
  },
  cosmos: {
    id: 'cosmos',
    name: 'Cosmos',
    emoji: '🌌',
    whisper: 'Infinite stories written in starlight.',
    category: 'milestone',
    depth: 'V+',
    ancestry: ['harmony', 'wonder', 'light'],
    imageUrl: '/milestones/cosmos.png',
    lore: 'When harmony gazed into light with wonder, it saw itself reflected infinitely. Each reflection held a universe. Each universe held more reflections.',
    hasBeenEvolved: false,
  },
};

// === INTERMEDIATE ELEMENTS ===
// Building blocks on the path to milestones

export const INTERMEDIATE_ELEMENTS: Record<string, IntermediateElement> = {
  potential: {
    id: 'potential',
    name: 'Potential',
    emoji: '💠',
    whisper: 'What could be, waiting.',
    category: 'intermediate',
    depth: 'I',
    ancestry: ['void', 'longing'],
    leadsTo: 'life',
    pathwayText: 'On the path to LIFE',
  },
  awareness: {
    id: 'awareness',
    name: 'Awareness',
    emoji: '👀',
    whisper: 'Noticing the noticing.',
    category: 'intermediate',
    depth: 'II',
    ancestry: ['light', 'silence'],
    leadsTo: 'consciousness',
    pathwayText: 'On the path to CONSCIOUSNESS',
  },
  foundation: {
    id: 'foundation',
    name: 'Foundation',
    emoji: '🧱',
    whisper: 'The ground beneath becoming.',
    category: 'intermediate',
    depth: 'II',
    ancestry: ['stone', 'time'],
    leadsTo: 'civilization',
    pathwayText: 'On the path to CIVILIZATION',
  },
  reflection: {
    id: 'reflection',
    name: 'Reflection',
    emoji: '🪞',
    whisper: 'Seeing the self in stillness.',
    category: 'intermediate',
    depth: 'II',
    ancestry: ['water', 'light'],
    leadsTo: 'wisdom',
    pathwayText: 'On the path to WISDOM',
  },
  surrender: {
    id: 'surrender',
    name: 'Surrender',
    emoji: '🙏',
    whisper: 'Strength found in release.',
    category: 'intermediate',
    depth: 'III',
    ancestry: ['silence', 'void'],
    leadsTo: 'transcendence',
    pathwayText: 'On the path to TRANSCENDENCE',
  },
  conflict: {
    id: 'conflict',
    name: 'Conflict',
    emoji: '⚔️',
    whisper: 'Tension seeking resolution.',
    category: 'intermediate',
    depth: 'II',
    ancestry: ['fire', 'water'],
    leadsTo: 'harmony',
    pathwayText: 'On the path to HARMONY',
  },
  spark: {
    id: 'spark',
    name: 'Spark',
    emoji: '✴️',
    whisper: 'The smallest beginning.',
    category: 'intermediate',
    depth: 'I',
    ancestry: ['fire', 'shimmer'],
    leadsTo: 'energy',
    pathwayText: 'On the path to ENERGY',
  },
  turbulence: {
    id: 'turbulence',
    name: 'Turbulence',
    emoji: '🌊',
    whisper: 'Order losing its grip.',
    category: 'intermediate',
    depth: 'I',
    ancestry: ['air', 'water'],
    leadsTo: 'chaos',
    pathwayText: 'On the path to CHAOS',
  },
  infinity: {
    id: 'infinity',
    name: 'Infinity',
    emoji: '♾️',
    whisper: 'Numbers that never end.',
    category: 'intermediate',
    depth: 'III',
    ancestry: ['time', 'void'],
    leadsTo: 'cosmos',
    pathwayText: 'On the path to COSMOS',
  },
  growth: {
    id: 'growth',
    name: 'Growth',
    emoji: '🌿',
    whisper: 'Reaching toward the light.',
    category: 'intermediate',
    depth: 'II',
    ancestry: ['water', 'time'],
    leadsTo: 'life',
    pathwayText: 'On the path to LIFE',
  },
  curiosity: {
    id: 'curiosity',
    name: 'Curiosity',
    emoji: '🔍',
    whisper: 'The itch to know more.',
    category: 'intermediate',
    depth: 'II',
    ancestry: ['wonder', 'mystery'],
    leadsTo: 'consciousness',
    pathwayText: 'On the path to CONSCIOUSNESS',
  },
  memory: {
    id: 'memory',
    name: 'Memory',
    emoji: '📜',
    whisper: 'Yesterday held in today.',
    category: 'intermediate',
    depth: 'II',
    ancestry: ['time', 'longing'],
    leadsTo: 'civilization',
    pathwayText: 'On the path to CIVILIZATION',
  },
};

// === HELPER FUNCTIONS ===

/**
 * Find an element by ID across all collections
 */
export function findElementById(id: string): Element | undefined {
  // Check primordials
  const primordial = PRIMORDIALS.find((el) => el.id === id);
  if (primordial) return primordial;

  // Check milestones
  const milestone = MILESTONES[id];
  if (milestone) return milestone;

  // Check intermediate elements
  const intermediate = INTERMEDIATE_ELEMENTS[id];
  if (intermediate) return intermediate;

  return undefined;
}

/**
 * Get all primordials in a specific group
 */
export function getPrimordialsByGroup(
  group: 'matter' | 'senses' | 'abstract'
): PrimordialElement[] {
  return PRIMORDIALS.filter((el) => el.group === group);
}

/**
 * Get all milestone IDs
 */
export function getMilestoneIds(): string[] {
  return Object.keys(MILESTONES);
}

/**
 * Get all intermediate elements that lead to a specific milestone
 */
export function getIntermediatesForMilestone(
  milestoneId: string
): IntermediateElement[] {
  return Object.values(INTERMEDIATE_ELEMENTS).filter(
    (el) => el.leadsTo === milestoneId
  );
}

/**
 * Check if a combination matches a known recipe
 */
export function findRecipeMatch(
  elementIds: string[]
): MilestoneElement | IntermediateElement | undefined {
  const sortedIds = [...elementIds].sort();

  // Check milestones
  for (const milestone of Object.values(MILESTONES)) {
    const sortedAncestry = [...milestone.ancestry].sort();
    if (
      sortedIds.length === sortedAncestry.length &&
      sortedIds.every((id, idx) => id === sortedAncestry[idx])
    ) {
      return milestone;
    }
  }

  // Check intermediate elements
  for (const intermediate of Object.values(INTERMEDIATE_ELEMENTS)) {
    const sortedAncestry = [...intermediate.ancestry].sort();
    if (
      sortedIds.length === sortedAncestry.length &&
      sortedIds.every((id, idx) => id === sortedAncestry[idx])
    ) {
      return intermediate;
    }
  }

  return undefined;
}

/**
 * Get the total count of discoverable elements
 */
export function getTotalElementCount(): number {
  return (
    PRIMORDIALS.length +
    Object.keys(MILESTONES).length +
    Object.keys(INTERMEDIATE_ELEMENTS).length
  );
}

/**
 * Check if an element ID is a primordial
 */
export function isPrimordial(id: string): boolean {
  return PRIMORDIALS.some((el) => el.id === id);
}

/**
 * Check if an element ID is a milestone
 */
export function isMilestone(id: string): boolean {
  return id in MILESTONES;
}

/**
 * Check if an element ID is an intermediate
 */
export function isIntermediate(id: string): boolean {
  return id in INTERMEDIATE_ELEMENTS;
}
