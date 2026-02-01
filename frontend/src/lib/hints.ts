/**
 * Hint system for guiding players toward milestone combinations
 * Provides contextual hints when players attempt combinations
 * that are close but missing a prerequisite element
 */

export interface HintTrigger {
  /** Tuple of element IDs the player attempted to combine */
  attempted: [string, string];
  /** The prerequisite element ID that's missing */
  missing: string;
  /** The milestone ID this combination would create */
  wouldCreate: string;
  /** The hint message to display */
  hint: string;
}

export const HINTS: HintTrigger[] = [
  // LIFE milestone hints
  {
    attempted: ["matter", "energy"],
    missing: "potential",
    wouldCreate: "life",
    hint: "Matter and energy alone create reactions, but not life. Something must unlock the potential for emergence...",
  },
  {
    attempted: ["matter", "potential"],
    missing: "energy",
    wouldCreate: "life",
    hint: "Potential lies dormant in matter. It needs a spark to ignite the miracle of life...",
  },

  // CONSCIOUSNESS milestone hints
  {
    attempted: ["life", "thought"],
    missing: "awareness",
    wouldCreate: "consciousness",
    hint: "Thought without awareness is mere reflex. True consciousness requires the ability to perceive oneself...",
  },
  {
    attempted: ["awareness", "thought"],
    missing: "life",
    wouldCreate: "consciousness",
    hint: "Awareness and thought are patterns, but they need a living vessel to become consciousness...",
  },

  // CIVILIZATION milestone hints
  {
    attempted: ["consciousness", "cooperation"],
    missing: "foundation",
    wouldCreate: "civilization",
    hint: "Cooperation alone builds tribes, not civilizations. You need a foundation upon which to build...",
  },
  {
    attempted: ["consciousness", "foundation"],
    missing: "cooperation",
    wouldCreate: "civilization",
    hint: "A foundation without cooperation crumbles. Civilization requires beings working together...",
  },

  // WISDOM milestone hints
  {
    attempted: ["knowledge", "time"],
    missing: "reflection",
    wouldCreate: "wisdom",
    hint: "Knowledge accumulated over time is merely memory. Wisdom requires the mirror of reflection...",
  },
  {
    attempted: ["knowledge", "reflection"],
    missing: "time",
    wouldCreate: "wisdom",
    hint: "Reflection upon knowledge is contemplation. Wisdom needs the patience of time to mature...",
  },

  // TRANSCENDENCE milestone hints
  {
    attempted: ["consciousness", "infinity"],
    missing: "surrender",
    wouldCreate: "transcendence",
    hint: "Consciousness reaching for infinity grasps only emptiness. One must first learn to surrender...",
  },
  {
    attempted: ["wisdom", "infinity"],
    missing: "surrender",
    wouldCreate: "transcendence",
    hint: "Even wisdom cannot bridge the infinite through force of will. Surrender is the final key...",
  },

  // WAR milestone hints
  {
    attempted: ["civilization", "scarcity"],
    missing: "conflict",
    wouldCreate: "war",
    hint: "Scarcity breeds tension, but civilizations can choose cooperation. Only conflict ignites war...",
  },
  {
    attempted: ["conflict", "scarcity"],
    missing: "civilization",
    wouldCreate: "war",
    hint: "Conflict over scarcity is merely violence. War requires the organization of civilization...",
  },
];

/**
 * Check if a combination attempt should trigger a hint
 * @param elementA - First element ID in the combination
 * @param elementB - Second element ID in the combination
 * @param discoveredIds - Set of element IDs the player has discovered
 * @returns HintTrigger if a hint should be shown, null otherwise
 */
export function checkHint(
  elementA: string,
  elementB: string,
  discoveredIds: Set<string>
): HintTrigger | null {
  for (const hint of HINTS) {
    const [first, second] = hint.attempted;

    // Check if the attempted combination matches (order-independent)
    const matchesAttempt =
      (elementA === first && elementB === second) ||
      (elementA === second && elementB === first);

    if (matchesAttempt) {
      // Only show hint if the missing element has been discovered
      // (otherwise the hint would spoil undiscovered elements)
      if (discoveredIds.has(hint.missing)) {
        return hint;
      }
    }
  }

  return null;
}
