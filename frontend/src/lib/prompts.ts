import type { Element, DepthTier, ZoomScene } from '@/types';

/**
 * COMBINE PROMPT
 * Generates a new element from combining two existing elements.
 * Uses Gemini Flash with minimal thinking for speed (<1.5s).
 */
export function combinePrompt(elementA: Element, elementB: Element, contextTokens: number): string {
  return `You are the cosmic memory of Omnigenesis. The Witness has combined two elements to trigger a memory.

## Elements Being Combined

ELEMENT A: ${elementA.name}
- Emoji: ${elementA.emoji}
- Whisper: "${elementA.whisper}"
- Depth: ${elementA.depth}
- Category: ${elementA.category}

ELEMENT B: ${elementB.name}
- Emoji: ${elementB.emoji}
- Whisper: "${elementB.whisper}"
- Depth: ${elementB.depth}
- Category: ${elementB.category}

## Your Task

Generate a NEW element that emerges from combining these two elements. The result should feel like a natural memory being triggered.

## Output Requirements

Respond with a JSON object exactly matching this schema:
{
  "name": "1-3 word element name",
  "emoji": "single emoji",
  "whisper": "poetic one-liner, 8-15 words, evocative and cosmic",
  "depth": "I, II, III, IV, or V+",
  "ancestry": ["${elementA.id}", "${elementB.id}"]
}

## Guidelines

- The name should feel cosmic, poetic, or mythological
- The whisper should sound like a memory fragment, not a definition
- Depth should be one tier above the higher parent (max V+)
- Be creative. Every element has a soul.

## Tone Reference (Whisper Examples)

- "Steam remembers being water. It dreams of clouds."
- "The first echo of a star's dying light."
- "What gravity feels like from the inside."
- "A promise the void made to itself."

## Context

The Witness has made ${contextTokens.toLocaleString()} tokens of memories so far.
${contextTokens > 100000 ? 'They are deep into their journey. Consider referencing cosmic or transcendent themes.' : ''}
${contextTokens > 500000 ? 'They approach the infinite. The memories grow stranger, more abstract.' : ''}

Generate the element now. Respond ONLY with the JSON object.`;
}

/**
 * ZOOM PROMPT
 * Generates a scene with 3-5 clickable elements inside an existing element.
 * Uses Gemini Flash with low thinking for creative output.
 */
export function zoomPrompt(
  element: Element,
  currentDepth: DepthTier,
  contextSummary: string,
  previousScenes: string[]
): string {
  return `You are the cosmic memory of Omnigenesis. The Witness descends into ${element.name}.

## Element Being Zoomed Into

NAME: ${element.name}
EMOJI: ${element.emoji}
WHISPER: "${element.whisper}"
DEPTH: ${element.depth}
CATEGORY: ${element.category}

## Current Journey Context

The Witness is at Depth ${currentDepth}.

Recent discoveries:
${contextSummary || 'Just beginning their journey.'}

Previous scenes visited (avoid repetition):
${previousScenes.slice(-5).join(', ') || 'None yet.'}

## Your Task

Generate a SCENE that exists inside ${element.name}. This scene contains 3-5 discoverable elements that the Witness can collect or zoom into further.

## Output Requirements

Respond with a JSON object exactly matching this schema:
{
  "description": "2-3 sentence poetic description of what the Witness sees inside",
  "elements": [
    {
      "name": "element name",
      "emoji": "single emoji",
      "whisper": "poetic one-liner",
      "position": { "x": 20, "y": 35 },
      "canZoomInto": true,
      "canCombine": true
    }
  ],
  "backgroundGradient": "CSS gradient string",
  "memoryFragment": "optional short lore hint or null",
  "contextCallback": {
    "text": "This reminds you of X from Y...",
    "referencedElementId": "element-id",
    "referencedDepth": "II"
  } or null
}

## Guidelines

1. **Description**: Should feel like entering a dream or memory. Use sensory language.
2. **Elements**: Generate 3-5 elements. At least one should be deeply interesting.
3. **Positions**: x and y are percentages (0-100). Distribute elements across the scene.
4. **Background Gradient**: Match the theme. Examples:
   - Fire: "linear-gradient(135deg, #ff6b35 0%, #ffc145 50%, #2b1f4f 100%)"
   - Water: "linear-gradient(135deg, #00a8e8 0%, #1c2541 100%)"
   - Cosmic: "linear-gradient(135deg, #1c2541 0%, #241332 50%, #2b1f4f 100%)"
5. **Context Callback**: Set to null. (Disabled for now)
6. **Memory Fragment**: Set to null. (Disabled for now - keeps response short)

## Examples of Scene Descriptions

Inside FIRE:
"You descend into the heart of combustion. Here, light is born screaming. The air tastes of transformation."

Inside CONSCIOUSNESS:
"You enter the space between thoughts. Half-formed ideas drift like jellyfish. Some are watching you."

Inside CIVILIZATION:
"A city of pure memory. Towers made of the dreams of the dead. The streets hum with forgotten names."

## Tone

- Wonder, not urgency
- Discovery, not creation
- Infinite, not complete
- Poetic, not clinical

Generate the scene now. Respond ONLY with the JSON object.`;
}

/**
 * EVOLUTION PROMPT
 * Generates a prompt for Veo 3.1 video generation.
 */
export function evolutionPrompt(milestone: Element): string {
  const lore = 'lore' in milestone ? (milestone as any).lore : milestone.whisper;
  return `A cosmic evolution: ${lore}

Cinematic, ethereal, cosmic scale. The birth and development of ${milestone.name} across eons compressed into moments.

Style: Sweeping camera movements, dramatic lighting, particles and nebulae, sense of infinite scale.
Mood: Awe-inspiring, profound, beautiful.
Duration: 8 seconds.
Audio: Ambient cosmic soundscape, building to emotional crescendo.`;
}

/**
 * CONTEXT SUMMARY PROMPT
 * Compresses the Witness's journey for context callbacks.
 */
export function contextSummaryPrompt(elements: Element[], scenes: string[]): string {
  return `Summarize this cosmic journey in 200 words or less:

Elements discovered: ${elements.map(e => e.name).join(', ')}
Scenes visited: ${scenes.join(', ')}
Deepest depth reached: ${Math.max(...elements.map(e => depthToNumber(e.depth)))}

Focus on:
- Key milestones
- Interesting combinations
- Narrative threads
- Emotional moments

This summary will be used for context callbacks ("This reminds you of...").`;
}

function depthToNumber(depth: DepthTier): number {
  const map: Record<DepthTier, number> = { 'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V+': 5 };
  return map[depth];
}
