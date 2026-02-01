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

// === ZOOM TYPES ===

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

// === EVOLUTION TYPES ===

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

// === API TYPES ===

export interface CombineRequest {
  elementA: string;              // Element ID
  elementB: string;              // Element ID
  contextTokens: number;         // Current context window usage
}

export interface CombineResponse {
  success: boolean;
  result?: {
    element: Element;
    isMilestone: boolean;
    isIntermediate: boolean;
    isFirstDiscovery: boolean;
    hint?: string;
  };
  error?: string;
}

export interface ZoomRequest {
  elementId: string;
  currentDepth: DepthTier;
  contextSummary: string;        // Compressed context for callbacks
  // Optional: scene element data for dynamically generated elements
  sceneElementData?: {
    name: string;
    emoji: string;
    whisper: string;
  };
}

export interface ZoomResponse {
  success: boolean;
  scene?: ZoomScene;
  error?: string;
}

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
